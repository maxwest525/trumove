// Price calculation utilities for moving estimates
// Data sourced from GSA CHAMP, FMCSA, DOT, and major carrier weight estimators

export interface InventoryItem {
  id: string;
  name: string;
  room: string;
  quantity: number;
  weightEach: number;
  cubicFeet?: number;
  specialHandling?: boolean;
}

export interface MoveDetails {
  fromLocation: string;
  toLocation: string;
  distance: number;
  moveType: 'local' | 'long-distance' | 'auto';
  moveDate: string;
  homeSize: 'studio' | '1br' | '2br' | '3br' | '4br+';
}

// Industry standard: 7 lbs per cubic foot (from DOT/carrier standards)
export const DENSITY_FACTOR = 7;

// Calculate weight from cubic feet using industry standard density
export function calculateWeightFromCubicFeet(cubicFeet: number): number {
  return Math.round(cubicFeet * DENSITY_FACTOR);
}

export function calculateTotalWeight(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * item.weightEach), 0);
}

export function calculateTotalCubicFeet(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * (item.cubicFeet || Math.ceil(item.weightEach / DENSITY_FACTOR))), 0);
}

export function getMoveSize(weight: number): string {
  if (weight === 0) return "Waiting on items…";
  if (weight < 2000) return "Studio / Small 1BR";
  if (weight < 4000) return "1-2 Bedroom";
  if (weight < 6000) return "2-3 Bedroom";
  if (weight < 8000) return "3-4 Bedroom";
  if (weight < 12000) return "Large 4BR+";
  return "Full household / Large move";
}

// Standard container capacities (from 1800 Pack Rat)
export const CONTAINER_CAPACITIES = {
  '8ft': { cubicFeet: 404, maxWeight: 4000 },
  '12ft': { cubicFeet: 620, maxWeight: 6000 },
  '16ft': { cubicFeet: 830, maxWeight: 6000 },
  'truck26ft': { cubicFeet: 1800, maxWeight: 10000 },
};

export function determineMoveType(distance: number): 'local' | 'long-distance' {
  // Industry standard: 50+ miles is long-distance per FMCSA
  return distance >= 50 ? 'long-distance' : 'local';
}

// GSA-aligned pricing structure
// Rates derived from federal household goods programs and carrier tariffs
export function calculateEstimate(
  weight: number, 
  distance: number, 
  moveType: 'local' | 'long-distance',
  options?: {
    hasPacking?: boolean;
    hasVehicle?: boolean;
    vehicleType?: 'sedan' | 'suv' | 'truck' | 'motorcycle';
  }
): { min: number; max: number } {
  if (weight === 0) return { min: 0, max: 0 };
  
  let baseMin: number;
  let baseMax: number;
  
  if (moveType === 'local') {
    // Local moves: hourly-based pricing
    // Industry average: 2-4 movers at $25-50/hour each plus truck
    // Approximate hours based on weight (industry standard: ~1000 lbs/hour for 3-man crew)
    const estimatedHours = Math.max(2, Math.ceil(weight / 800));
    const minHourlyRate = 120; // 3-man crew, off-peak
    const maxHourlyRate = 200; // 4-man crew, peak season
    
    baseMin = estimatedHours * minHourlyRate;
    baseMax = estimatedHours * maxHourlyRate;
    
    // Add travel time charge (typical: 1 hour)
    baseMin += minHourlyRate;
    baseMax += maxHourlyRate;
    
  } else {
    // Long-distance: weight and distance based
    // GSA/Carrier tariff structure: base rate per CWT (100 lbs) varies by distance
    const cwt = weight / 100; // Hundredweight
    
    // Rate per CWT based on distance bands (derived from GSA tariffs)
    let ratePerCWT: { min: number; max: number };
    
    if (distance < 100) {
      ratePerCWT = { min: 18, max: 28 };
    } else if (distance < 250) {
      ratePerCWT = { min: 22, max: 35 };
    } else if (distance < 500) {
      ratePerCWT = { min: 28, max: 45 };
    } else if (distance < 1000) {
      ratePerCWT = { min: 35, max: 55 };
    } else if (distance < 1500) {
      ratePerCWT = { min: 42, max: 65 };
    } else if (distance < 2000) {
      ratePerCWT = { min: 48, max: 75 };
    } else if (distance < 2500) {
      ratePerCWT = { min: 52, max: 82 };
    } else {
      ratePerCWT = { min: 58, max: 90 };
    }
    
    // Linehaul charge
    baseMin = cwt * ratePerCWT.min;
    baseMax = cwt * ratePerCWT.max;
    
    // Minimum shipment charge (industry standard: ~$1,500-2,500 for long-distance)
    const minimumCharge = 1500;
    baseMin = Math.max(baseMin, minimumCharge);
    baseMax = Math.max(baseMax, minimumCharge * 1.5);
    
    // Fuel surcharge (typically 8-15% of linehaul)
    const fuelSurchargeRate = 0.12;
    baseMin *= (1 + fuelSurchargeRate * 0.8);
    baseMax *= (1 + fuelSurchargeRate * 1.2);
  }
  
  // Add optional services
  if (options?.hasPacking) {
    // Full packing service: typically $3-8 per cubic foot
    const cubicFeet = weight / DENSITY_FACTOR;
    const packingMin = cubicFeet * 3;
    const packingMax = cubicFeet * 8;
    baseMin += packingMin;
    baseMax += packingMax;
  }
  
  if (options?.hasVehicle) {
    // Vehicle shipping costs (based on carrier data)
    const vehicleCosts: Record<string, { min: number; max: number }> = {
      'motorcycle': { min: 300, max: 700 },
      'sedan': { min: 800, max: 1500 },
      'suv': { min: 1000, max: 1800 },
      'truck': { min: 1200, max: 2200 },
    };
    const vehicleType = options.vehicleType || 'sedan';
    const vehicleCost = vehicleCosts[vehicleType] || vehicleCosts.sedan;
    
    // Adjust for distance
    const distanceMultiplier = Math.min(2, 1 + (distance / 2000));
    baseMin += vehicleCost.min * distanceMultiplier;
    baseMax += vehicleCost.max * distanceMultiplier;
  }
  
  // Seasonal adjustment (peak season: May-September typically 15-25% higher)
  // This would be adjusted based on actual move date
  
  return {
    min: Math.round(baseMin),
    max: Math.round(baseMax)
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Comprehensive item database with cubic feet and weights
// Sourced from: GSA, FMCSA, DOT, civilian weight estimators, and major carrier cube sheets
// Weight = Cubic Feet × 7 (industry standard density factor)
export interface ItemDefinition {
  name: string;
  cubicFeet: number;
  defaultWeight: number; // cubicFeet × 7
}

export const ROOM_SUGGESTIONS: Record<string, ItemDefinition[]> = {
  'Living Room': [
    // Seating
    { name: 'Sofa, 3 Cushion', cubicFeet: 50, defaultWeight: 350 },
    { name: 'Sofa, 4 Cushion/Hide-a-bed', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Sofa, Loveseat', cubicFeet: 35, defaultWeight: 245 },
    { name: 'Sofa, Sectional (per section)', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Armchair', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Chair, Overstuffed', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Chair, Occasional', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Chair, Rocker', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Chair, Straight', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Ottoman', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Footstool', cubicFeet: 2, defaultWeight: 14 },
    // Tables
    { name: 'Coffee Table', cubicFeet: 5, defaultWeight: 35 },
    { name: 'End Table', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Table, Drop Leaf/Occasional', cubicFeet: 12, defaultWeight: 84 },
    // Entertainment
    { name: 'Entertainment Center', cubicFeet: 35, defaultWeight: 245 },
    { name: 'TV Stand', cubicFeet: 3, defaultWeight: 21 },
    { name: 'TV, Big Screen (50"+)', cubicFeet: 40, defaultWeight: 280 },
    { name: 'TV, Plasma/LCD', cubicFeet: 15, defaultWeight: 105 },
    { name: 'TV, Table Model', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Stereo, Console', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Stereo, Component System', cubicFeet: 8, defaultWeight: 56 },
    // Storage & Decor
    { name: 'Bookcase, Large', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Bookcase, Medium', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Bookcase, Small', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Bookshelf, Sectional', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Cabinet, Curio', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Desk, Small/Winthrop', cubicFeet: 22, defaultWeight: 154 },
    { name: 'Desk, Secretary', cubicFeet: 35, defaultWeight: 245 },
    { name: 'Bar, Portable', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Magazine Rack', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Music Cabinet', cubicFeet: 10, defaultWeight: 70 },
    // Lighting & Rugs
    { name: 'Lamp, Floor/Pole', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Lamp, Table (Small)', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Lamp, Table (Medium)', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Lamp, Table (Large)', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Rug, Large (Roll/Pad)', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Rug, Medium', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Rug, Small', cubicFeet: 3, defaultWeight: 21 },
    // Special Items
    { name: 'Clock, Grandfather', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Clock, Grandmother', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Fireplace Equipment', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Piano, Baby Grand/Upright', cubicFeet: 70, defaultWeight: 490 },
    { name: 'Piano, Parlor Grand', cubicFeet: 80, defaultWeight: 560 },
    { name: 'Piano, Spinet/Console', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Piano Bench', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Organ, Console', cubicFeet: 60, defaultWeight: 420 },
    // Artwork
    { name: 'Picture/Mirror, Small', cubicFeet: 1, defaultWeight: 7 },
    { name: 'Picture/Mirror, Medium', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Picture/Mirror, Large', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Painting (framed)', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Statue, Floor', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Dining Room': [
    { name: 'Dining Table', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Dining Chair', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Table, Dinette', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Bench, Harvest', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Buffet, Base', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Buffet, Hutch Top', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Cabinet, China', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Cabinet, Corner', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Server', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Tea Cart', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Serving Cart', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Rug, Large', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Rug, Small', cubicFeet: 3, defaultWeight: 21 },
  ],
  
  'Bedroom': [
    // Beds (include box spring & mattress)
    { name: 'Bed, King (complete)', cubicFeet: 70, defaultWeight: 490 },
    { name: 'Bed, Queen (complete)', cubicFeet: 65, defaultWeight: 455 },
    { name: 'Bed, Double/Full (complete)', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Bed, Single/Twin (complete)', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Bed, Bunk (set of 2)', cubicFeet: 70, defaultWeight: 490 },
    { name: 'Bed, Rollaway', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Bed, Day', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Bed, Waterbed Base', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Headboard', cubicFeet: 10, defaultWeight: 70 },
    // Dressers & Storage
    { name: 'Dresser, Triple', cubicFeet: 50, defaultWeight: 350 },
    { name: 'Dresser, Double', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Dresser, Single', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Dresser, Vanity', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Chest of Drawers', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Chest, Bachelor', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Chest, Cedar', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Chest, Armoire', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Wardrobe, Large', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Wardrobe, Medium', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Wardrobe, Small', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Night Stand', cubicFeet: 5, defaultWeight: 35 },
    // Seating & Other
    { name: 'Chair, Boudoir', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Chair, Vanity', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Vanity Bench', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Chaise Lounge', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Chair, Rocker', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Bookcase', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Trunk', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Suitcase', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Fan', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Lamp, Floor', cubicFeet: 3, defaultWeight: 21 },
  ],
  
  'Kitchen': [
    { name: 'Breakfast Table', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Kitchen Table', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Kitchen Chair', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Bar Stool', cubicFeet: 5, defaultWeight: 35 },
    { name: 'High Chair', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Kitchen Cabinet', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Utility Cabinet', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Bakers Rack', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Microwave Stand/Cart', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Serving Cart', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Ironing Board', cubicFeet: 7, defaultWeight: 49 },
    { name: 'Trash Can', cubicFeet: 7, defaultWeight: 49 },
    { name: 'Stool, Step', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Wine Rack', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Dish Boxes (per box)', cubicFeet: 3, defaultWeight: 50 }, // Heavier due to contents
  ],
  
  'Appliances': [
    { name: 'Refrigerator (22+ cu ft)', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Refrigerator (16-21 cu ft)', cubicFeet: 52, defaultWeight: 364 },
    { name: 'Refrigerator (11-15 cu ft)', cubicFeet: 45, defaultWeight: 315 },
    { name: 'Refrigerator (6-10 cu ft)', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Freezer, Upright (16+ cu ft)', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Freezer, Upright (11-15 cu ft)', cubicFeet: 45, defaultWeight: 315 },
    { name: 'Freezer, Chest (16+ cu ft)', cubicFeet: 32, defaultWeight: 224 },
    { name: 'Freezer, Chest (10-15 cu ft)', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Washer, Front Load', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Washer, Top Load', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Dryer', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Washer/Dryer Stack', cubicFeet: 46, defaultWeight: 322 },
    { name: 'Range, Gas/Electric', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Dishwasher', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Microwave', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Air Conditioner, Window', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Air Conditioner, Large', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Dehumidifier', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Vacuum Cleaner', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Water Cooler', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Heater, Gas/Electric', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Office': [
    { name: 'Desk, Office', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Desk, Computer', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Desk, Hutch', cubicFeet: 28, defaultWeight: 196 },
    { name: 'Desk, Return', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Desk, Secretary', cubicFeet: 35, defaultWeight: 245 },
    { name: 'Chair, Office/Swivel', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Chair, Arm/Desk', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Credenza', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Bookcase, Large', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Bookcase, Medium', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Bookcase, Small', cubicFeet: 10, defaultWeight: 70 },
    { name: 'File Cabinet, 4 Drawer', cubicFeet: 10, defaultWeight: 70 },
    { name: 'File Cabinet, 3 Drawer', cubicFeet: 8, defaultWeight: 56 },
    { name: 'File Cabinet, 2 Drawer', cubicFeet: 6, defaultWeight: 42 },
    { name: 'File Cabinet, Lateral', cubicFeet: 15, defaultWeight: 105 },
    { name: 'File Cabinet, Cardboard', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Computer/Monitor Setup', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Printer', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Copier, Small', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Copier, Large', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Scanner', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Fax Machine', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Metal Shelves', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Nursery': [
    { name: 'Crib, Baby', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Bassinet & Stand', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Bed, Youth', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Play Pen', cubicFeet: 10, defaultWeight: 70 },
    { name: 'High Chair', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Changing Table', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Chest of Drawers', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Toy Chest', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Stroller', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Baby Carriage', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Chair, Child', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Table, Child', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Rocking Horse', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Little Tyke Toy', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Little Tyke Playhouse', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Glider/Rocker', cubicFeet: 20, defaultWeight: 140 },
  ],
  
  'Patio & Outdoor': [
    { name: 'BBQ Grill, Large', cubicFeet: 25, defaultWeight: 175 },
    { name: 'BBQ Grill, Medium', cubicFeet: 10, defaultWeight: 70 },
    { name: 'BBQ Grill, Small', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Patio Table', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Picnic Table', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Picnic Bench', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Chair, Lawn', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Chair, Aluminum Folding', cubicFeet: 1, defaultWeight: 7 },
    { name: 'Chair, Wicker/Metal', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Lounge Chair', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Glider/Settee', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Porch Swing', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Outdoor Swing', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Sofa, Rattan/Wicker', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Umbrella & Stand', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Outdoor Heater', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Lawn Mower, Power', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Lawn Mower, Riding', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Snow Blower', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Wheelbarrow', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Garden Hose & Tools', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Spreader', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Ladder, 6\' Step', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Ladder, 8\' Metal', cubicFeet: 6, defaultWeight: 42 },
    { name: 'Ladder, Extension', cubicFeet: 9, defaultWeight: 63 },
    { name: 'Hot Tub/Jacuzzi', cubicFeet: 300, defaultWeight: 2100 },
    { name: 'Sandbox', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Swing Set', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Bird Bath', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Plant Stand', cubicFeet: 10, defaultWeight: 70 },
  ],
  
  'Garage': [
    { name: 'Workbench', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Tool Chest, Large', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Tool Chest, Medium', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Tool Chest, Small', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Power Tool Stand', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Metal Shelves', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Storage Shelf Unit', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Utility Cabinet', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Garbage Cans', cubicFeet: 7, defaultWeight: 49 },
    { name: 'Ice Chest/Cooler', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Car Ramps', cubicFeet: 6, defaultWeight: 42 },
    { name: 'Bicycle', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Tricycle', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Child\'s Wagon', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Golf Bag', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Skis (pair)/Snowboard', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Surfboard', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Sled', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Motorcycle, Large', cubicFeet: 100, defaultWeight: 700 },
    { name: 'Motorcycle, Small', cubicFeet: 58, defaultWeight: 406 },
    { name: 'ATV/3-4 Wheeler', cubicFeet: 50, defaultWeight: 350 },
    { name: 'Golf Cart', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Snowmobile', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Canoe/Kayak', cubicFeet: 50, defaultWeight: 350 },
    { name: 'Utility Trailer', cubicFeet: 50, defaultWeight: 350 },
  ],
  
  'Exercise & Sports': [
    { name: 'Treadmill', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Elliptical', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Exercise Bike', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Rowing Machine', cubicFeet: 20, defaultWeight: 140 },
    { name: 'All-in-One Gym', cubicFeet: 50, defaultWeight: 350 },
    { name: 'Weight Bench', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Weights/Barbells (set)', cubicFeet: 5, defaultWeight: 100 }, // Heavier
    { name: 'Pool Table (with slate)', cubicFeet: 100, defaultWeight: 700 },
    { name: 'Pool Table (no slate)', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Ping Pong Table', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Foosball Table', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Game Table', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Tent', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Camp Stove', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Fishing/Tackle Box', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Guns (cased)', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Electronics': [
    { name: 'Computer Desktop', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Monitor', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Printer', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Scanner', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Speakers (pair)', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Home Theater System', cubicFeet: 10, defaultWeight: 70 },
    { name: 'VCR/DVD Player', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Gaming Console', cubicFeet: 3, defaultWeight: 21 },
    { name: 'UPS/Battery Backup', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Satellite Dish, Small', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Satellite Dish, Large', cubicFeet: 25, defaultWeight: 175 },
  ],
  
  'Boxes & Cartons': [
    { name: 'Dish Pack Box', cubicFeet: 6, defaultWeight: 60 },
    { name: 'Book Box (1.5 cu ft)', cubicFeet: 1.5, defaultWeight: 35 },
    { name: 'Small Box (3 cu ft)', cubicFeet: 3, defaultWeight: 30 },
    { name: 'Medium Box (4.5 cu ft)', cubicFeet: 4.5, defaultWeight: 40 },
    { name: 'Large Box (6 cu ft)', cubicFeet: 6, defaultWeight: 50 },
    { name: 'Wardrobe Box', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Mirror Carton', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Plastic Tote, Large', cubicFeet: 5, defaultWeight: 45 },
    { name: 'Plastic Tote, Small', cubicFeet: 3, defaultWeight: 30 },
    { name: 'Footlocker', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Crate', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Miscellaneous': [
    { name: 'Sewing Machine, Portable', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Sewing Machine, Console', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Sewing Cabinet', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Safe, Small', cubicFeet: 5, defaultWeight: 100 },
    { name: 'Safe, Large', cubicFeet: 10, defaultWeight: 300 },
    { name: 'Aquarium (per 10 gal)', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Bird Cage & Stand', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Plants, Artificial', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Figurines/Ornaments', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Guitar/Keyboard', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Clothes Hamper', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Folding Cot', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Card Table', cubicFeet: 1, defaultWeight: 7 },
    { name: 'Folding Chair', cubicFeet: 1, defaultWeight: 7 },
    { name: 'Step Ladder', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Christmas Tree/Decorations', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Cooler', cubicFeet: 2, defaultWeight: 14 },
  ],
};

// Helper to get all items flattened
export function getAllItems(): ItemDefinition[] {
  return Object.values(ROOM_SUGGESTIONS).flat();
}

// Search items across all rooms
export function searchItems(query: string): ItemDefinition[] {
  const lowerQuery = query.toLowerCase();
  return getAllItems().filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
}
