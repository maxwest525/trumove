import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Home size inventory estimates - realistic counts based on actual moving data
const INVENTORY_ESTIMATES: Record<string, { items: { name: string; room: string; quantity: number }[] }> = {
  'studio': {
    items: [
      { name: 'Bed, Queen (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Dresser, Single', room: 'Bedroom', quantity: 1 },
      { name: 'Nightstand', room: 'Bedroom', quantity: 1 },
      { name: 'Sofa, Loveseat', room: 'Living Room', quantity: 1 },
      { name: 'Coffee Table', room: 'Living Room', quantity: 1 },
      { name: 'TV, Plasma/LCD', room: 'Living Room', quantity: 1 },
      { name: 'Desk', room: 'Office', quantity: 1 },
      { name: 'Office Chair', room: 'Office', quantity: 1 },
      { name: 'Lamp, Floor', room: 'Living Room', quantity: 2 },
      { name: 'Medium Box', room: 'Boxes & Cartons', quantity: 10 },
      { name: 'Small Box', room: 'Boxes & Cartons', quantity: 8 },
    ]
  },
  '1br': {
    items: [
      { name: 'Bed, Queen (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Dresser, Double', room: 'Bedroom', quantity: 1 },
      { name: 'Nightstand', room: 'Bedroom', quantity: 2 },
      { name: 'Sofa, 3 Cushion', room: 'Living Room', quantity: 1 },
      { name: 'Coffee Table', room: 'Living Room', quantity: 1 },
      { name: 'End Table', room: 'Living Room', quantity: 2 },
      { name: 'TV, Plasma/LCD', room: 'Living Room', quantity: 1 },
      { name: 'TV Stand', room: 'Living Room', quantity: 1 },
      { name: 'Bookcase, Small', room: 'Living Room', quantity: 1 },
      { name: 'Dinette Table', room: 'Dining Room', quantity: 1 },
      { name: 'Dining Chair', room: 'Dining Room', quantity: 4 },
      { name: 'Desk', room: 'Office', quantity: 1 },
      { name: 'Office Chair', room: 'Office', quantity: 1 },
      { name: 'Lamp, Floor', room: 'Living Room', quantity: 2 },
      { name: 'Medium Box', room: 'Boxes & Cartons', quantity: 15 },
      { name: 'Small Box', room: 'Boxes & Cartons', quantity: 12 },
      { name: 'Large Box', room: 'Boxes & Cartons', quantity: 5 },
    ]
  },
  '2br': {
    items: [
      { name: 'Bed, Queen (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Bed, Double (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Dresser, Triple', room: 'Bedroom', quantity: 1 },
      { name: 'Dresser, Double', room: 'Bedroom', quantity: 1 },
      { name: 'Nightstand', room: 'Bedroom', quantity: 4 },
      { name: 'Chest of Drawers', room: 'Bedroom', quantity: 1 },
      { name: 'Sofa, 3 Cushion', room: 'Living Room', quantity: 1 },
      { name: 'Chair, Occasional', room: 'Living Room', quantity: 2 },
      { name: 'Coffee Table', room: 'Living Room', quantity: 1 },
      { name: 'End Table', room: 'Living Room', quantity: 2 },
      { name: 'TV, Plasma/LCD', room: 'Living Room', quantity: 2 },
      { name: 'TV Stand', room: 'Living Room', quantity: 1 },
      { name: 'Entertainment Center', room: 'Living Room', quantity: 1 },
      { name: 'Bookcase, Medium', room: 'Living Room', quantity: 1 },
      { name: 'Dining Table, 6 chair', room: 'Dining Room', quantity: 1 },
      { name: 'Dining Chair', room: 'Dining Room', quantity: 6 },
      { name: 'Desk', room: 'Office', quantity: 1 },
      { name: 'Office Chair', room: 'Office', quantity: 1 },
      { name: 'File Cabinet, 2 Drawer', room: 'Office', quantity: 1 },
      { name: 'Refrigerator (22+ cu ft)', room: 'Appliances', quantity: 1 },
      { name: 'Washer, Front Load', room: 'Appliances', quantity: 1 },
      { name: 'Dryer', room: 'Appliances', quantity: 1 },
      { name: 'Medium Box', room: 'Boxes & Cartons', quantity: 25 },
      { name: 'Small Box', room: 'Boxes & Cartons', quantity: 18 },
      { name: 'Large Box', room: 'Boxes & Cartons', quantity: 10 },
      { name: 'Wardrobe Box', room: 'Boxes & Cartons', quantity: 3 },
    ]
  },
  '3br': {
    items: [
      { name: 'Bed, King (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Bed, Queen (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Bed, Double (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Dresser, Triple', room: 'Bedroom', quantity: 2 },
      { name: 'Dresser, Double', room: 'Bedroom', quantity: 1 },
      { name: 'Nightstand', room: 'Bedroom', quantity: 6 },
      { name: 'Chest of Drawers', room: 'Bedroom', quantity: 2 },
      { name: 'Wardrobe/Armoire', room: 'Bedroom', quantity: 1 },
      { name: 'Sofa, 4 Cushion', room: 'Living Room', quantity: 1 },
      { name: 'Sofa, Loveseat', room: 'Living Room', quantity: 1 },
      { name: 'Chair, Overstuffed', room: 'Living Room', quantity: 2 },
      { name: 'Coffee Table', room: 'Living Room', quantity: 1 },
      { name: 'End Table', room: 'Living Room', quantity: 3 },
      { name: 'TV, Big Screen', room: 'Living Room', quantity: 1 },
      { name: 'TV, Plasma/LCD', room: 'Living Room', quantity: 2 },
      { name: 'Entertainment Center', room: 'Living Room', quantity: 1 },
      { name: 'Bookcase, Large', room: 'Living Room', quantity: 1 },
      { name: 'Bookcase, Medium', room: 'Living Room', quantity: 1 },
      { name: 'Dining Table, 8 chair', room: 'Dining Room', quantity: 1 },
      { name: 'Dining Chair', room: 'Dining Room', quantity: 8 },
      { name: 'Buffet/Sideboard', room: 'Dining Room', quantity: 1 },
      { name: 'China Cabinet', room: 'Dining Room', quantity: 1 },
      { name: 'Desk, Computer', room: 'Office', quantity: 1 },
      { name: 'Office Chair', room: 'Office', quantity: 1 },
      { name: 'File Cabinet, 4 Drawer', room: 'Office', quantity: 1 },
      { name: 'Bookcase, Small', room: 'Office', quantity: 1 },
      { name: 'Refrigerator (22+ cu ft)', room: 'Appliances', quantity: 1 },
      { name: 'Washer, Front Load', room: 'Appliances', quantity: 1 },
      { name: 'Dryer', room: 'Appliances', quantity: 1 },
      { name: 'Microwave', room: 'Appliances', quantity: 1 },
      { name: 'BBQ Grill', room: 'Patio & Outdoor', quantity: 1 },
      { name: 'Patio Table', room: 'Patio & Outdoor', quantity: 1 },
      { name: 'Patio Chair', room: 'Patio & Outdoor', quantity: 4 },
      { name: 'Lawn Mower', room: 'Garage', quantity: 1 },
      { name: 'Medium Box', room: 'Boxes & Cartons', quantity: 40 },
      { name: 'Small Box', room: 'Boxes & Cartons', quantity: 25 },
      { name: 'Large Box', room: 'Boxes & Cartons', quantity: 15 },
      { name: 'Wardrobe Box', room: 'Boxes & Cartons', quantity: 5 },
      { name: 'Dish Pack', room: 'Boxes & Cartons', quantity: 4 },
    ]
  },
  '4br+': {
    items: [
      { name: 'Bed, King (complete)', room: 'Bedroom', quantity: 2 },
      { name: 'Bed, Queen (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Bed, Double (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Bed, Single (complete)', room: 'Bedroom', quantity: 1 },
      { name: 'Dresser, Triple', room: 'Bedroom', quantity: 2 },
      { name: 'Dresser, Double', room: 'Bedroom', quantity: 2 },
      { name: 'Nightstand', room: 'Bedroom', quantity: 8 },
      { name: 'Chest of Drawers', room: 'Bedroom', quantity: 3 },
      { name: 'Wardrobe/Armoire', room: 'Bedroom', quantity: 2 },
      { name: 'Vanity Dresser', room: 'Bedroom', quantity: 1 },
      { name: 'Sofa, Sectional (5 pc)', room: 'Living Room', quantity: 1 },
      { name: 'Sofa, 3 Cushion', room: 'Living Room', quantity: 1 },
      { name: 'Chair, Overstuffed', room: 'Living Room', quantity: 2 },
      { name: 'Ottoman', room: 'Living Room', quantity: 2 },
      { name: 'Coffee Table', room: 'Living Room', quantity: 2 },
      { name: 'End Table', room: 'Living Room', quantity: 4 },
      { name: 'TV, Big Screen', room: 'Living Room', quantity: 2 },
      { name: 'TV, Plasma/LCD', room: 'Living Room', quantity: 3 },
      { name: 'Entertainment Center', room: 'Living Room', quantity: 2 },
      { name: 'Bookcase, Large', room: 'Living Room', quantity: 2 },
      { name: 'Curio Cabinet', room: 'Living Room', quantity: 1 },
      { name: 'Piano, Upright', room: 'Living Room', quantity: 1 },
      { name: 'Dining Table, 10+ chair', room: 'Dining Room', quantity: 1 },
      { name: 'Dining Chair', room: 'Dining Room', quantity: 10 },
      { name: 'Buffet/Sideboard', room: 'Dining Room', quantity: 1 },
      { name: 'China Cabinet', room: 'Dining Room', quantity: 1 },
      { name: 'Hutch', room: 'Dining Room', quantity: 1 },
      { name: 'Desk, Executive', room: 'Office', quantity: 1 },
      { name: 'Office Chair', room: 'Office', quantity: 2 },
      { name: 'File Cabinet, 4 Drawer', room: 'Office', quantity: 2 },
      { name: 'Bookcase, Large', room: 'Office', quantity: 1 },
      { name: 'Credenza', room: 'Office', quantity: 1 },
      { name: 'Refrigerator (22+ cu ft)', room: 'Appliances', quantity: 2 },
      { name: 'Washer, Front Load', room: 'Appliances', quantity: 1 },
      { name: 'Dryer', room: 'Appliances', quantity: 1 },
      { name: 'Freezer, Upright', room: 'Appliances', quantity: 1 },
      { name: 'BBQ Grill', room: 'Patio & Outdoor', quantity: 1 },
      { name: 'Patio Table', room: 'Patio & Outdoor', quantity: 2 },
      { name: 'Patio Chair', room: 'Patio & Outdoor', quantity: 8 },
      { name: 'Umbrella & Stand', room: 'Patio & Outdoor', quantity: 2 },
      { name: 'Riding Mower', room: 'Garage', quantity: 1 },
      { name: 'Tool Chest', room: 'Garage', quantity: 1 },
      { name: 'Workbench', room: 'Garage', quantity: 1 },
      { name: 'Bicycle', room: 'Garage', quantity: 3 },
      { name: 'Treadmill', room: 'Exercise & Sports', quantity: 1 },
      { name: 'Weight Bench', room: 'Exercise & Sports', quantity: 1 },
      { name: 'Medium Box', room: 'Boxes & Cartons', quantity: 60 },
      { name: 'Small Box', room: 'Boxes & Cartons', quantity: 40 },
      { name: 'Large Box', room: 'Boxes & Cartons', quantity: 25 },
      { name: 'Wardrobe Box', room: 'Boxes & Cartons', quantity: 8 },
      { name: 'Dish Pack', room: 'Boxes & Cartons', quantity: 6 },
      { name: 'Book Box', room: 'Boxes & Cartons', quantity: 10 },
    ]
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { homeSize } = await req.json();
    console.log("AI Estimate request for home size:", homeSize);
    
    // Normalize home size
    const normalizedSize = homeSize?.toLowerCase()?.replace(/\s+/g, '') || 'studio';
    
    // Get estimate for the home size (default to 1br if unknown)
    const estimate = INVENTORY_ESTIMATES[normalizedSize] || INVENTORY_ESTIMATES['1br'];
    
    console.log(`Returning ${estimate.items.length} items for ${normalizedSize}`);
    
    return new Response(JSON.stringify({ 
      success: true,
      homeSize: normalizedSize,
      suggestions: estimate.items 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Estimate error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate estimate" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
