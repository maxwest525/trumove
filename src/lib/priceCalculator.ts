// Price calculation utilities for moving estimates

export interface InventoryItem {
  id: string;
  name: string;
  room: string;
  quantity: number;
  weightEach: number;
}

export interface MoveDetails {
  fromLocation: string;
  toLocation: string;
  distance: number;
  moveType: 'local' | 'long-distance' | 'auto';
  moveDate: string;
}

export function calculateTotalWeight(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * item.weightEach), 0);
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

export function determineMoveType(distance: number): 'local' | 'long-distance' {
  return distance >= 150 ? 'long-distance' : 'local';
}

export function calculateEstimate(weight: number, distance: number, moveType: 'local' | 'long-distance'): { min: number; max: number } {
  if (weight === 0) return { min: 0, max: 0 };
  
  let baseRate: number;
  let perMileRate: number;
  
  if (moveType === 'local') {
    // Local moves: hourly-based, roughly $100-150/hour, estimate 2-8 hours based on weight
    const hours = Math.max(2, Math.ceil(weight / 1000));
    const minHourly = 100;
    const maxHourly = 150;
    return {
      min: Math.round(hours * minHourly),
      max: Math.round(hours * maxHourly * 1.2)
    };
  } else {
    // Long distance: weight-based with distance factor
    baseRate = 0.50; // Base per pound
    perMileRate = 0.10; // Per pound per 100 miles
    
    const distanceFactor = Math.ceil(distance / 100);
    const minPerLb = baseRate + (perMileRate * distanceFactor * 0.8);
    const maxPerLb = baseRate + (perMileRate * distanceFactor * 1.2);
    
    return {
      min: Math.round(weight * minPerLb),
      max: Math.round(weight * maxPerLb)
    };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Default room-based item suggestions
export const ROOM_SUGGESTIONS: Record<string, Array<{ name: string; defaultWeight: number }>> = {
  'Living Room': [
    { name: 'Sofa', defaultWeight: 150 },
    { name: 'Coffee Table', defaultWeight: 50 },
    { name: 'TV Stand', defaultWeight: 75 },
    { name: 'Television', defaultWeight: 40 },
    { name: 'Bookshelf', defaultWeight: 80 },
    { name: 'Armchair', defaultWeight: 75 },
    { name: 'End Table', defaultWeight: 30 },
    { name: 'Floor Lamp', defaultWeight: 15 },
    { name: 'Area Rug', defaultWeight: 25 },
  ],
  'Bedroom': [
    { name: 'Bed Frame (Queen)', defaultWeight: 100 },
    { name: 'Mattress (Queen)', defaultWeight: 80 },
    { name: 'Dresser', defaultWeight: 150 },
    { name: 'Nightstand', defaultWeight: 40 },
    { name: 'Wardrobe', defaultWeight: 200 },
    { name: 'Desk', defaultWeight: 60 },
    { name: 'Mirror', defaultWeight: 25 },
    { name: 'Bed Frame (King)', defaultWeight: 150 },
    { name: 'Mattress (King)', defaultWeight: 100 },
  ],
  'Kitchen': [
    { name: 'Dining Table', defaultWeight: 100 },
    { name: 'Dining Chair', defaultWeight: 20 },
    { name: 'Refrigerator', defaultWeight: 250 },
    { name: 'Microwave', defaultWeight: 35 },
    { name: 'Kitchen Island', defaultWeight: 100 },
    { name: 'Bar Stool', defaultWeight: 25 },
    { name: 'Dish Boxes (each)', defaultWeight: 50 },
  ],
  'Garage': [
    { name: 'Workbench', defaultWeight: 100 },
    { name: 'Tool Chest', defaultWeight: 80 },
    { name: 'Lawn Mower', defaultWeight: 70 },
    { name: 'Bicycle', defaultWeight: 30 },
    { name: 'Storage Shelf', defaultWeight: 50 },
    { name: 'Outdoor Grill', defaultWeight: 75 },
    { name: 'Patio Set', defaultWeight: 100 },
  ],
  'Office': [
    { name: 'Office Desk', defaultWeight: 80 },
    { name: 'Office Chair', defaultWeight: 40 },
    { name: 'Filing Cabinet', defaultWeight: 60 },
    { name: 'Bookcase', defaultWeight: 75 },
    { name: 'Computer Setup', defaultWeight: 30 },
    { name: 'Printer', defaultWeight: 25 },
  ],
  'Other': [
    { name: 'Moving Boxes (small)', defaultWeight: 30 },
    { name: 'Moving Boxes (medium)', defaultWeight: 45 },
    { name: 'Moving Boxes (large)', defaultWeight: 60 },
    { name: 'Wardrobe Box', defaultWeight: 35 },
    { name: 'Piano (upright)', defaultWeight: 500 },
    { name: 'Piano (grand)', defaultWeight: 900 },
    { name: 'Safe', defaultWeight: 200 },
    { name: 'Treadmill', defaultWeight: 200 },
    { name: 'Washer', defaultWeight: 175 },
    { name: 'Dryer', defaultWeight: 125 },
  ],
};
