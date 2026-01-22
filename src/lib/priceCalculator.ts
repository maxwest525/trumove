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
  imageUrl?: string; // Optional path to 3D render image
}

export const ROOM_SUGGESTIONS: Record<string, ItemDefinition[]> = {
  'Living Room': [
    // Seating
    { name: 'Sofa, 3 Cushion', cubicFeet: 50, defaultWeight: 350, imageUrl: '/inventory/living-room/sofa-3-cushion.png' },
    { name: 'Sofa, 4 Cushion/Hide-a-bed', cubicFeet: 60, defaultWeight: 420, imageUrl: '/inventory/living-room/sofa-4-cushion.png' },
    { name: 'Sofa, Loveseat', cubicFeet: 35, defaultWeight: 245, imageUrl: '/inventory/living-room/sofa-loveseat.png' },
    { name: 'Sofa, Sectional (per section)', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/living-room/sofa-sectional.png' },
    { name: 'Armchair', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/living-room/armchair.png' },
    { name: 'Chair, Overstuffed', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/living-room/chair-overstuffed.png' },
    { name: 'Chair, Occasional', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/living-room/chair-occasional.png' },
    { name: 'Chair, Rocker', cubicFeet: 12, defaultWeight: 84, imageUrl: '/inventory/living-room/chair-rocker.png' },
    { name: 'Chair, Straight', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/living-room/chair-straight.png' },
    { name: 'Ottoman', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/living-room/ottoman.png' },
    { name: 'Footstool', cubicFeet: 2, defaultWeight: 14, imageUrl: '/inventory/living-room/footstool.png' },
    // Tables
    { name: 'Coffee Table', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/living-room/coffee-table.png' },
    { name: 'End Table', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/living-room/end-table.png' },
    { name: 'Table, Drop Leaf/Occasional', cubicFeet: 12, defaultWeight: 84, imageUrl: '/inventory/living-room/table-drop-leaf.png' },
    // Entertainment
    { name: 'Entertainment Center', cubicFeet: 35, defaultWeight: 245, imageUrl: '/inventory/living-room/entertainment-center.png' },
    { name: 'TV Stand', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/living-room/tv-stand.png' },
    { name: 'TV, Big Screen (50"+)', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/living-room/tv-big-screen.png' },
    { name: 'TV, Plasma/LCD', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/living-room/tv-plasma.png' },
    { name: 'TV, Table Model', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Stereo, Console', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/living-room/stereo-console.png' },
    { name: 'Stereo, Component System', cubicFeet: 8, defaultWeight: 56, imageUrl: '/inventory/living-room/stereo-component.png' },
    // Storage & Decor
    { name: 'Bookcase, Large', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/living-room/bookcase-large.png' },
    { name: 'Bookcase, Medium', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/living-room/bookcase-medium.png' },
    { name: 'Bookcase, Small', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/living-room/bookcase-small.png' },
    { name: 'Bookshelf, Sectional', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/living-room/bookshelf-sectional.png' },
    { name: 'Cabinet, Curio', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/living-room/curio-cabinet.png' },
    { name: 'Desk, Small/Winthrop', cubicFeet: 22, defaultWeight: 154 },
    { name: 'Desk, Secretary', cubicFeet: 35, defaultWeight: 245, imageUrl: '/inventory/living-room/desk-secretary.png' },
    { name: 'Bar, Portable', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/living-room/bar-portable.png' },
    { name: 'Magazine Rack', cubicFeet: 2, defaultWeight: 14, imageUrl: '/inventory/living-room/magazine-rack.png' },
    { name: 'Music Cabinet', cubicFeet: 10, defaultWeight: 70 },
    // Lighting & Rugs
    { name: 'Lamp, Floor/Pole', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/living-room/lamp-floor.png' },
    { name: 'Lamp, Table (Small)', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/living-room/lamp-table.png' },
    { name: 'Lamp, Table (Medium)', cubicFeet: 4, defaultWeight: 28, imageUrl: '/inventory/living-room/lamp-table.png' },
    { name: 'Lamp, Table (Large)', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/living-room/lamp-table.png' },
    { name: 'Rug, Large (Roll/Pad)', cubicFeet: 12, defaultWeight: 84, imageUrl: '/inventory/living-room/rug-large.png' },
    { name: 'Rug, Medium', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Rug, Small', cubicFeet: 3, defaultWeight: 21 },
    // Special Items
    { name: 'Clock, Grandfather', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/living-room/grandfather-clock.png' },
    { name: 'Clock, Grandmother', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Fireplace Equipment', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Piano, Baby Grand/Upright', cubicFeet: 70, defaultWeight: 490, imageUrl: '/inventory/living-room/piano-upright.png' },
    { name: 'Piano, Parlor Grand', cubicFeet: 80, defaultWeight: 560, imageUrl: '/inventory/living-room/piano-grand.png' },
    { name: 'Piano, Spinet/Console', cubicFeet: 60, defaultWeight: 420 },
    { name: 'Piano Bench', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Organ, Console', cubicFeet: 60, defaultWeight: 420, imageUrl: '/inventory/living-room/organ-console.png' },
    // Artwork
    { name: 'Picture/Mirror, Small', cubicFeet: 1, defaultWeight: 7 },
    { name: 'Picture/Mirror, Medium', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Picture/Mirror, Large', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Painting (framed)', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Statue, Floor', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Dining Room': [
    { name: 'Dining Table', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/dining-room/dining-table.png' },
    { name: 'Dining Chair', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/dining-room/dining-chair.png' },
    { name: 'Table, Dinette', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/dining-room/dinette-table.png' },
    { name: 'Bench, Harvest', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/dining-room/harvest-bench.png' },
    { name: 'Buffet, Base', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/dining-room/buffet.png' },
    { name: 'Buffet, Hutch Top', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/dining-room/buffet-hutch.png' },
    { name: 'Cabinet, China', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/dining-room/china-cabinet.png' },
    { name: 'Cabinet, Corner', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/dining-room/corner-cabinet.png' },
    { name: 'Server', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/dining-room/server.png' },
    { name: 'Tea Cart', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/dining-room/tea-cart.png' },
    { name: 'Serving Cart', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/dining-room/serving-cart.png' },
    { name: 'Rug, Large', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/dining-room/rug-large.png' },
    { name: 'Rug, Small', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/dining-room/rug-small.png' },
  ],
  
  'Bedroom': [
    // Beds (include box spring & mattress)
    { name: 'Bed, King (complete)', cubicFeet: 70, defaultWeight: 490, imageUrl: '/inventory/bedroom/bed-king.png' },
    { name: 'Bed, Queen (complete)', cubicFeet: 65, defaultWeight: 455, imageUrl: '/inventory/bedroom/bed-queen.png' },
    { name: 'Bed, Double/Full (complete)', cubicFeet: 60, defaultWeight: 420, imageUrl: '/inventory/bedroom/bed-double.png' },
    { name: 'Bed, Single/Twin (complete)', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/bedroom/bed-single.png' },
    { name: 'Bed, Bunk (set of 2)', cubicFeet: 70, defaultWeight: 490, imageUrl: '/inventory/bedroom/bed-bunk.png' },
    { name: 'Bed, Rollaway', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/bedroom/bed-rollaway.png' },
    { name: 'Bed, Day', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/bedroom/bed-day.png' },
    { name: 'Bed, Waterbed Base', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Headboard', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/bedroom/headboard.png' },
    // Dressers & Storage
    { name: 'Dresser, Triple', cubicFeet: 50, defaultWeight: 350, imageUrl: '/inventory/bedroom/dresser.png' },
    { name: 'Dresser, Double', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Dresser, Single', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Dresser, Vanity', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/bedroom/dresser-vanity.png' },
    { name: 'Chest of Drawers', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/bedroom/chest-of-drawers.png' },
    { name: 'Chest, Bachelor', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Chest, Cedar', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/bedroom/cedar-chest.png' },
    { name: 'Chest, Armoire', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Wardrobe, Large', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/bedroom/wardrobe.png' },
    { name: 'Wardrobe, Medium', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Wardrobe, Small', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Night Stand', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/bedroom/nightstand.png' },
    // Seating & Other
    { name: 'Chair, Boudoir', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Chair, Vanity', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Vanity Bench', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Chaise Lounge', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/bedroom/chaise-lounge.png' },
    { name: 'Chair, Rocker', cubicFeet: 12, defaultWeight: 84 },
    { name: 'Bookcase', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Trunk', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/bedroom/trunk.png' },
    { name: 'Suitcase', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Fan', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Lamp, Floor', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/bedroom/lamp-floor.png' },
  ],
  
  'Kitchen': [
    { name: 'Breakfast Table', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Kitchen Table', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/kitchen/kitchen-table.png' },
    { name: 'Kitchen Chair', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/kitchen/kitchen-chair.png' },
    { name: 'Bar Stool', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/kitchen/bar-stool.png' },
    { name: 'High Chair', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/kitchen/high-chair.png' },
    { name: 'Kitchen Cabinet', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Utility Cabinet', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/kitchen/utility-cabinet.png' },
    { name: 'Bakers Rack', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/kitchen/bakers-rack.png' },
    { name: 'Microwave Stand/Cart', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/kitchen/microwave-cart.png' },
    { name: 'Serving Cart', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Ironing Board', cubicFeet: 7, defaultWeight: 49, imageUrl: '/inventory/kitchen/ironing-board.png' },
    { name: 'Trash Can', cubicFeet: 7, defaultWeight: 49 },
    { name: 'Stool, Step', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Wine Rack', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/kitchen/wine-rack.png' },
    { name: 'Dish Boxes (per box)', cubicFeet: 3, defaultWeight: 50 },
  ],
  
  'Appliances': [
    { name: 'Refrigerator (22+ cu ft)', cubicFeet: 60, defaultWeight: 420, imageUrl: '/inventory/appliances/refrigerator.png' },
    { name: 'Refrigerator (16-21 cu ft)', cubicFeet: 52, defaultWeight: 364 },
    { name: 'Refrigerator (11-15 cu ft)', cubicFeet: 45, defaultWeight: 315 },
    { name: 'Refrigerator (6-10 cu ft)', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Freezer, Upright (16+ cu ft)', cubicFeet: 60, defaultWeight: 420, imageUrl: '/inventory/appliances/freezer-upright.png' },
    { name: 'Freezer, Upright (11-15 cu ft)', cubicFeet: 45, defaultWeight: 315 },
    { name: 'Freezer, Chest (16+ cu ft)', cubicFeet: 32, defaultWeight: 224, imageUrl: '/inventory/appliances/freezer-chest.png' },
    { name: 'Freezer, Chest (10-15 cu ft)', cubicFeet: 25, defaultWeight: 175 },
    { name: 'Washer, Front Load', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/appliances/washer.png' },
    { name: 'Washer, Top Load', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/appliances/washer-top-load.png' },
    { name: 'Dryer', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/appliances/dryer.png' },
    { name: 'Washer/Dryer Stack', cubicFeet: 46, defaultWeight: 322, imageUrl: '/inventory/appliances/washer-dryer-stack.png' },
    { name: 'Range, Gas/Electric', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/appliances/range.png' },
    { name: 'Dishwasher', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/appliances/dishwasher.png' },
    { name: 'Microwave', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/appliances/microwave.png' },
    { name: 'Air Conditioner, Window', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/appliances/air-conditioner.png' },
    { name: 'Air Conditioner, Large', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/appliances/air-conditioner-large.png' },
    { name: 'Dehumidifier', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/appliances/dehumidifier.png' },
    { name: 'Vacuum Cleaner', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/appliances/vacuum.png' },
    { name: 'Water Cooler', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/appliances/water-cooler.png' },
    { name: 'Heater, Gas/Electric', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/appliances/heater.png' },
  ],
  
  'Office': [
    { name: 'Desk, Office', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/office/desk.png' },
    { name: 'Desk, Computer', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/office/desk-computer.png' },
    { name: 'Desk, Hutch', cubicFeet: 28, defaultWeight: 196, imageUrl: '/inventory/office/desk-hutch.png' },
    { name: 'Desk, Return', cubicFeet: 8, defaultWeight: 56, imageUrl: '/inventory/office/desk-return.png' },
    { name: 'Desk, Secretary', cubicFeet: 35, defaultWeight: 245, imageUrl: '/inventory/office/desk-secretary.png' },
    { name: 'Chair, Office/Swivel', cubicFeet: 8, defaultWeight: 56, imageUrl: '/inventory/office/office-chair.png' },
    { name: 'Chair, Arm/Desk', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/office/chair-side.png' },
    { name: 'Credenza', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/office/credenza.png' },
    { name: 'Bookcase, Large', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Bookcase, Medium', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Bookcase, Small', cubicFeet: 10, defaultWeight: 70 },
    { name: 'File Cabinet, 4 Drawer', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/office/file-cabinet.png' },
    { name: 'File Cabinet, 3 Drawer', cubicFeet: 8, defaultWeight: 56 },
    { name: 'File Cabinet, 2 Drawer', cubicFeet: 6, defaultWeight: 42 },
    { name: 'File Cabinet, Lateral', cubicFeet: 15, defaultWeight: 105 },
    { name: 'File Cabinet, Cardboard', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Computer/Monitor Setup', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/office/computer.png' },
    { name: 'Printer', cubicFeet: 8, defaultWeight: 56, imageUrl: '/inventory/office/printer.png' },
    { name: 'Copier, Small', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/office/copy-machine.png' },
    { name: 'Copier, Large', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/office/copy-machine.png' },
    { name: 'Scanner', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Fax Machine', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Metal Shelves', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Nursery': [
    { name: 'Crib, Baby', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/nursery/crib.png' },
    { name: 'Bassinet & Stand', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/nursery/bassinet.png' },
    { name: 'Bed, Youth', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/nursery/bed-youth.png' },
    { name: 'Play Pen', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/nursery/playpen.png' },
    { name: 'High Chair', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/kitchen/high-chair.png' },
    { name: 'Changing Table', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/nursery/changing-table.png' },
    { name: 'Chest of Drawers', cubicFeet: 12, defaultWeight: 84, imageUrl: '/inventory/bedroom/chest-of-drawers.png' },
    { name: 'Toy Chest', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/nursery/toy-chest.png' },
    { name: 'Stroller', cubicFeet: 8, defaultWeight: 56, imageUrl: '/inventory/nursery/stroller.png' },
    { name: 'Baby Carriage', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Chair, Child', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Table, Child', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Rocking Horse', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Little Tyke Toy', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Little Tyke Playhouse', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/nursery/playhouse.png' },
    { name: 'Glider/Rocker', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/nursery/glider.png' },
  ],
  
  'Patio & Outdoor': [
    { name: 'BBQ Grill, Large', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/patio/bbq-grill.png' },
    { name: 'BBQ Grill, Medium', cubicFeet: 10, defaultWeight: 70 },
    { name: 'BBQ Grill, Small', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Patio Table', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/patio/patio-table.png' },
    { name: 'Picnic Table', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Picnic Bench', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Chair, Lawn', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Chair, Aluminum Folding', cubicFeet: 1, defaultWeight: 7 },
    { name: 'Chair, Wicker/Metal', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Lounge Chair', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/patio/lounge-chair.png' },
    { name: 'Glider/Settee', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Porch Swing', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/patio/porch-swing.png' },
    { name: 'Outdoor Swing', cubicFeet: 30, defaultWeight: 210 },
    { name: 'Sofa, Rattan/Wicker', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Umbrella & Stand', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/patio/umbrella.png' },
    { name: 'Outdoor Heater', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/patio/outdoor-heater.png' },
    { name: 'Lawn Mower, Power', cubicFeet: 15, defaultWeight: 105, imageUrl: '/inventory/patio/lawn-mower.png' },
    { name: 'Lawn Mower, Riding', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/patio/riding-mower.png' },
    { name: 'Snow Blower', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/patio/snow-blower.png' },
    { name: 'Wheelbarrow', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/patio/wheelbarrow.png' },
    { name: 'Garden Hose & Tools', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Spreader', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Ladder, 6\' Step', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Ladder, 8\' Metal', cubicFeet: 6, defaultWeight: 42 },
    { name: 'Ladder, Extension', cubicFeet: 9, defaultWeight: 63 },
    { name: 'Hot Tub/Jacuzzi', cubicFeet: 300, defaultWeight: 2100 },
    { name: 'Sandbox', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Swing Set', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/patio/swing-set.png' },
    { name: 'Bird Bath', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Plant Stand', cubicFeet: 10, defaultWeight: 70 },
  ],
  
  'Garage': [
    { name: 'Workbench', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/garage/workbench.png' },
    { name: 'Tool Chest, Large', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/garage/tool-chest.png' },
    { name: 'Tool Chest, Medium', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Tool Chest, Small', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Power Tool Stand', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Metal Shelves', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Storage Shelf Unit', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Utility Cabinet', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Garbage Cans', cubicFeet: 7, defaultWeight: 49 },
    { name: 'Ice Chest/Cooler', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Car Ramps', cubicFeet: 6, defaultWeight: 42 },
    { name: 'Bicycle', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/garage/bicycle.png' },
    { name: 'Tricycle', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Child\'s Wagon', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Golf Bag', cubicFeet: 4, defaultWeight: 28 },
    { name: 'Skis (pair)/Snowboard', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Surfboard', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Sled', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Motorcycle, Large', cubicFeet: 100, defaultWeight: 700, imageUrl: '/inventory/garage/motorcycle.png' },
    { name: 'Motorcycle, Small', cubicFeet: 58, defaultWeight: 406 },
    { name: 'ATV/3-4 Wheeler', cubicFeet: 50, defaultWeight: 350, imageUrl: '/inventory/garage/atv.png' },
    { name: 'Golf Cart', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/garage/golf-cart.png' },
    { name: 'Snowmobile', cubicFeet: 60, defaultWeight: 420, imageUrl: '/inventory/garage/snowmobile.png' },
    { name: 'Canoe/Kayak', cubicFeet: 50, defaultWeight: 350, imageUrl: '/inventory/garage/canoe.png' },
    { name: 'Utility Trailer', cubicFeet: 50, defaultWeight: 350 },
  ],
  
  'Exercise & Sports': [
    { name: 'Treadmill', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/exercise/treadmill.png' },
    { name: 'Elliptical', cubicFeet: 25, defaultWeight: 175, imageUrl: '/inventory/exercise/elliptical.png' },
    { name: 'Exercise Bike', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/exercise/exercise-bike.png' },
    { name: 'Rowing Machine', cubicFeet: 20, defaultWeight: 140, imageUrl: '/inventory/exercise/rowing-machine.png' },
    { name: 'All-in-One Gym', cubicFeet: 50, defaultWeight: 350, imageUrl: '/inventory/exercise/home-gym.png' },
    { name: 'Weight Bench', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/exercise/weight-bench.png' },
    { name: 'Weights/Barbells (set)', cubicFeet: 5, defaultWeight: 100, imageUrl: '/inventory/exercise/weights.png' },
    { name: 'Pool Table (with slate)', cubicFeet: 100, defaultWeight: 700, imageUrl: '/inventory/exercise/pool-table.png' },
    { name: 'Pool Table (no slate)', cubicFeet: 40, defaultWeight: 280 },
    { name: 'Ping Pong Table', cubicFeet: 40, defaultWeight: 280, imageUrl: '/inventory/exercise/ping-pong-table.png' },
    { name: 'Foosball Table', cubicFeet: 30, defaultWeight: 210, imageUrl: '/inventory/exercise/foosball-table.png' },
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
    { name: 'Speakers (pair)', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/electronics/speakers.png' },
    { name: 'Home Theater System', cubicFeet: 10, defaultWeight: 70 },
    { name: 'VCR/DVD Player', cubicFeet: 3, defaultWeight: 21 },
    { name: 'Gaming Console', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/electronics/gaming-console.png' },
    { name: 'UPS/Battery Backup', cubicFeet: 8, defaultWeight: 56 },
    { name: 'Satellite Dish, Small', cubicFeet: 15, defaultWeight: 105 },
    { name: 'Satellite Dish, Large', cubicFeet: 25, defaultWeight: 175 },
  ],
  
  'Boxes & Cartons': [
    { name: 'Dish Pack Box', cubicFeet: 6, defaultWeight: 60, imageUrl: '/inventory/boxes/dish-pack.png' },
    { name: 'Book Box (1.5 cu ft)', cubicFeet: 1.5, defaultWeight: 35, imageUrl: '/inventory/boxes/book-box.png' },
    { name: 'Small Box (3 cu ft)', cubicFeet: 3, defaultWeight: 30, imageUrl: '/inventory/boxes/small-box.png' },
    { name: 'Medium Box (4.5 cu ft)', cubicFeet: 4.5, defaultWeight: 40, imageUrl: '/inventory/boxes/medium-box.png' },
    { name: 'Large Box (6 cu ft)', cubicFeet: 6, defaultWeight: 50, imageUrl: '/inventory/boxes/large-box.png' },
    { name: 'Wardrobe Box', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/boxes/wardrobe-box.png' },
    { name: 'Mirror Carton', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/boxes/mirror-carton.png' },
    { name: 'Plastic Tote, Large', cubicFeet: 5, defaultWeight: 45, imageUrl: '/inventory/boxes/plastic-tote.png' },
    { name: 'Plastic Tote, Small', cubicFeet: 3, defaultWeight: 30 },
    { name: 'Footlocker', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Crate', cubicFeet: 5, defaultWeight: 35 },
  ],
  
  'Miscellaneous': [
    { name: 'Sewing Machine, Portable', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/misc/sewing-machine.png' },
    { name: 'Sewing Machine, Console', cubicFeet: 10, defaultWeight: 70 },
    { name: 'Sewing Cabinet', cubicFeet: 20, defaultWeight: 140 },
    { name: 'Safe, Small', cubicFeet: 5, defaultWeight: 100, imageUrl: '/inventory/misc/safe.png' },
    { name: 'Safe, Large', cubicFeet: 10, defaultWeight: 300 },
    { name: 'Aquarium (per 10 gal)', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/misc/aquarium.png' },
    { name: 'Bird Cage & Stand', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/misc/bird-cage.png' },
    { name: 'Plants, Artificial', cubicFeet: 5, defaultWeight: 35 },
    { name: 'Figurines/Ornaments', cubicFeet: 2, defaultWeight: 14 },
    { name: 'Guitar/Keyboard', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/misc/guitar.png' },
    { name: 'Clothes Hamper', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/misc/clothes-hamper.png' },
    { name: 'Folding Cot', cubicFeet: 10, defaultWeight: 70, imageUrl: '/inventory/misc/folding-cot.png' },
    { name: 'Card Table', cubicFeet: 1, defaultWeight: 7, imageUrl: '/inventory/misc/card-table.png' },
    { name: 'Folding Chair', cubicFeet: 1, defaultWeight: 7, imageUrl: '/inventory/misc/folding-chair.png' },
    { name: 'Step Ladder', cubicFeet: 5, defaultWeight: 35, imageUrl: '/inventory/misc/step-ladder.png' },
    { name: 'Christmas Tree/Decorations', cubicFeet: 3, defaultWeight: 21, imageUrl: '/inventory/misc/christmas-tree.png' },
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
