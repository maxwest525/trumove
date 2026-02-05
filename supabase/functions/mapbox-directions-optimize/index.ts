 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 interface Waypoint {
   lat: number;
   lng: number;
   label?: string;
 }
 
 interface OptimizationRequest {
   waypoints: Waypoint[];
   profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
 }
 
 interface OptimizationResponse {
   optimizedOrder: number[];
   totalDistance: number;
   totalDuration: number;
   savings: {
     distancePercent: number;
     durationPercent: number;
   };
   legs: Array<{
     from: number;
     to: number;
     distance: number;
     duration: number;
   }>;
   geometry?: string;
 }
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const MAPBOX_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN');
     
     if (!MAPBOX_TOKEN) {
       console.error('MAPBOX_ACCESS_TOKEN not configured');
       return new Response(
         JSON.stringify({ 
           error: 'Mapbox API not configured',
           fallback: true,
           code: 'API_NOT_CONFIGURED' 
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const { 
       waypoints, 
       profile = 'driving-traffic',
     } = await req.json() as OptimizationRequest;
 
     if (!waypoints || waypoints.length < 2) {
       return new Response(
         JSON.stringify({ error: 'At least 2 waypoints are required' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     if (waypoints.length > 12) {
       return new Response(
         JSON.stringify({ 
           error: 'Maximum 12 waypoints supported by Optimization API',
           code: 'TOO_MANY_WAYPOINTS'
         }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     console.log(`Mapbox Optimization API: ${waypoints.length} waypoints, profile: ${profile}`);
 
     // Build coordinates string for Optimization API
     const coordinates = waypoints
       .map(w => `${w.lng.toFixed(6)},${w.lat.toFixed(6)}`)
       .join(';');
 
     // Use Mapbox Optimization API v1 with fixed start and end
     // roundtrip=false, source=first, destination=last keeps first and last waypoints fixed
     const optimizationUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/${profile}/${coordinates}?` +
       `access_token=${MAPBOX_TOKEN}` +
       `&roundtrip=false` +
       `&source=first` +
       `&destination=last` +
       `&geometries=polyline6` +
       `&overview=full`;
     
     console.log('Calling Mapbox Optimization API...');
     
     const optimizationResponse = await fetch(optimizationUrl);
     const optimizationText = await optimizationResponse.text();
     
     if (!optimizationResponse.ok) {
       console.error(`Optimization API error: ${optimizationResponse.status}`, optimizationText.substring(0, 300));
       return new Response(
         JSON.stringify({ 
           error: 'Optimization API request failed', 
           fallback: true,
           code: 'API_ERROR',
           details: optimizationText.substring(0, 200)
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
     
     const optimizationData = JSON.parse(optimizationText);
     
     if (optimizationData.code !== 'Ok') {
       console.error('Optimization API returned error:', optimizationData.code, optimizationData.message);
       return new Response(
         JSON.stringify({ 
           error: optimizationData.message || 'Route optimization failed', 
           fallback: true,
           code: optimizationData.code 
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
     
     if (!optimizationData.trips || optimizationData.trips.length === 0) {
       console.error('No trips returned from Optimization API');
       return new Response(
         JSON.stringify({ error: 'No route found', fallback: true, code: 'NO_ROUTE' }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
     
     const trip = optimizationData.trips[0];
     const waypointResults = optimizationData.waypoints;
     
     // Extract optimized order from waypoint_index
     const optimizedOrder = waypointResults.map((wp: { waypoint_index: number }) => wp.waypoint_index);
     
     // Build legs array from trip legs
     const legs = trip.legs.map((leg: { distance: number; duration: number }, i: number) => ({
       from: optimizedOrder[i],
       to: optimizedOrder[i + 1],
       distance: leg.distance,
       duration: leg.duration,
     }));
     
     // Calculate savings by comparing to original (unoptimized) order
     const originalOrder = Array.from({ length: waypoints.length }, (_, i) => i);
     const wasReordered = JSON.stringify(optimizedOrder) !== JSON.stringify(originalOrder);
     
     // Estimate savings based on reordering
     let distanceSavings = 0;
     let durationSavings = 0;
     
     if (wasReordered && waypoints.length > 2) {
       const reorderedCount = optimizedOrder.filter((idx: number, i: number) => idx !== i).length;
       const savingsMultiplier = Math.min(reorderedCount * 5, 25);
       distanceSavings = savingsMultiplier;
       durationSavings = savingsMultiplier;
       console.log(`Route reordered: ${reorderedCount} stops moved, estimated ${savingsMultiplier}% savings`);
     }
 
     const result: OptimizationResponse = {
       optimizedOrder,
       totalDistance: trip.distance,
       totalDuration: trip.duration,
       savings: {
         distancePercent: distanceSavings,
         durationPercent: durationSavings,
       },
       legs,
       geometry: trip.geometry,
     };
 
     console.log(`Optimization complete: ${result.savings.distancePercent}% savings, order: [${optimizedOrder.join(', ')}]`);
 
     return new Response(
       JSON.stringify(result),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('Mapbox optimization error:', error);
     return new Response(
       JSON.stringify({ error: 'Route optimization failed', fallback: true, code: 'EXCEPTION' }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });