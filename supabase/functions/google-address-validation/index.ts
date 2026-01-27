import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AddressValidationRequest {
  address: string;
}

interface AddressComponent {
  componentName: {
    text: string;
    languageCode: string;
  };
  componentType: string;
  confirmationLevel: string;
}

interface ValidatedAddress {
  formattedAddress: string;
  addressComponents: AddressComponent[];
  location?: {
    latitude: number;
    longitude: number;
  };
  verdict: {
    addressComplete: boolean;
    hasInferredComponents: boolean;
    hasReplacedComponents: boolean;
    hasUnconfirmedComponents: boolean;
    validationGranularity: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Google Maps API not configured', code: 'API_NOT_CONFIGURED' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { address } = await req.json() as AddressValidationRequest;

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: 'Invalid address provided', code: 'INVALID_INPUT' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Validating address: ${address}`);

    // Call Google Address Validation API
    const response = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_MAPS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            addressLines: [address],
            regionCode: 'US',
            languageCode: 'en',
          },
          enableUspsCass: true, // Enable USPS CASS validation for US addresses
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google API error: ${response.status}`, errorText);
      
      // Check for specific error types
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ 
            error: 'Address Validation API not enabled or quota exceeded', 
            code: 'API_ERROR',
            details: 'Please enable the Address Validation API in Google Cloud Console'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to validate address', code: 'VALIDATION_FAILED' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const result = data.result;
    
    if (!result?.address) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Could not validate address',
          code: 'NO_RESULT'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract address components
    const components = result.address.addressComponents || [];
    const getComponent = (type: string): string => {
      const comp = components.find((c: AddressComponent) => c.componentType === type);
      return comp?.componentName?.text || '';
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const city = getComponent('locality') || getComponent('sublocality');
    const state = getComponent('administrative_area_level_1');
    const zip = getComponent('postal_code');
    const zipSuffix = getComponent('postal_code_suffix');

    // Build formatted components
    const streetAddress = [streetNumber, route].filter(Boolean).join(' ');
    const fullZip = zipSuffix ? `${zip}-${zipSuffix}` : zip;

    // Determine validation level from verdict
    const verdict = result.verdict || {};
    const granularity = verdict.validationGranularity || 'OTHER';
    
    let validationLevel: 'verified' | 'partial' | 'unverifiable';
    if (granularity === 'PREMISE' || granularity === 'SUB_PREMISE') {
      validationLevel = 'verified'; // Street-level or unit-level match
    } else if (granularity === 'ROUTE' || granularity === 'BLOCK') {
      validationLevel = 'partial'; // Street exists but number may be inferred
    } else {
      validationLevel = 'unverifiable';
    }

    // Check for issues
    const hasIssues = verdict.hasUnconfirmedComponents || verdict.hasReplacedComponents;
    
    // Get geocode location
    const geocode = result.geocode || {};
    const location = geocode.location || null;

    // USPS data if available
    const uspsData = result.uspsData || {};

    console.log(`Validation result: ${validationLevel} for "${result.address.formattedAddress}"`);

    return new Response(
      JSON.stringify({
        valid: validationLevel !== 'unverifiable',
        validationLevel,
        formattedAddress: result.address.formattedAddress,
        components: {
          streetNumber,
          route,
          streetAddress,
          city,
          state,
          zip,
          zipSuffix,
          fullZip,
        },
        location: location ? {
          lat: location.latitude,
          lng: location.longitude,
        } : null,
        verdict: {
          granularity,
          isComplete: verdict.addressComplete,
          hasInferred: verdict.hasInferredComponents,
          hasReplaced: verdict.hasReplacedComponents,
          hasUnconfirmed: verdict.hasUnconfirmedComponents,
        },
        usps: uspsData.standardizedAddress ? {
          deliveryPointCode: uspsData.dpvConfirmation,
          carrierRoute: uspsData.carrierRoute,
          deliverable: uspsData.dpvConfirmation === 'Y',
        } : null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Address validation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
