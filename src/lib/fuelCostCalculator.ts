/**
 * Fuel Cost Calculator for Moving Trucks
 * Estimates fuel expenses based on distance and current gas prices
 */

// Average fuel efficiency for different truck types (miles per gallon)
const TRUCK_MPG = {
  small: 12,      // Small box truck (10-12 ft)
  medium: 10,     // Medium moving truck (16-22 ft)
  large: 8,       // Large moving truck (24-26 ft)
  semi: 6.5,      // Semi-truck for long distance moves
};

// Current average diesel prices by region ($ per gallon)
// These would ideally come from an API like GasBuddy or AAA
const REGIONAL_DIESEL_PRICES: Record<string, number> = {
  northeast: 4.15,
  southeast: 3.75,
  midwest: 3.65,
  southwest: 3.85,
  west: 4.45,
  national: 3.89,
};

export type TruckSize = keyof typeof TRUCK_MPG;

export interface FuelCostEstimate {
  estimatedCost: number;
  gallonsNeeded: number;
  fuelPrice: number;
  mpg: number;
  distanceMiles: number;
  truckSize: TruckSize;
}

/**
 * Calculate estimated fuel cost for a moving truck
 * @param distanceMiles - Total route distance in miles
 * @param truckSize - Size of the moving truck
 * @param region - Geographic region for pricing (optional)
 * @returns Fuel cost estimate details
 */
export function calculateFuelCost(
  distanceMiles: number,
  truckSize: TruckSize = 'medium',
  region: string = 'national'
): FuelCostEstimate {
  const mpg = TRUCK_MPG[truckSize];
  const fuelPrice = REGIONAL_DIESEL_PRICES[region.toLowerCase()] || REGIONAL_DIESEL_PRICES.national;
  
  const gallonsNeeded = distanceMiles / mpg;
  const estimatedCost = gallonsNeeded * fuelPrice;
  
  return {
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    gallonsNeeded: Math.round(gallonsNeeded * 10) / 10,
    fuelPrice,
    mpg,
    distanceMiles,
    truckSize,
  };
}

/**
 * Get a quick fuel cost estimate (just the dollar amount)
 * Uses medium truck size and national average price
 */
export function getQuickFuelEstimate(distanceMiles: number): number {
  if (!distanceMiles || distanceMiles <= 0) return 0;
  const { estimatedCost } = calculateFuelCost(distanceMiles, 'medium', 'national');
  return estimatedCost;
}

/**
 * Determine region based on state abbreviation
 */
export function getRegionFromState(state: string): string {
  const stateToRegion: Record<string, string> = {
    // Northeast
    CT: 'northeast', DC: 'northeast', DE: 'northeast', MA: 'northeast',
    MD: 'northeast', ME: 'northeast', NH: 'northeast', NJ: 'northeast',
    NY: 'northeast', PA: 'northeast', RI: 'northeast', VT: 'northeast',
    // Southeast
    AL: 'southeast', AR: 'southeast', FL: 'southeast', GA: 'southeast',
    KY: 'southeast', LA: 'southeast', MS: 'southeast', NC: 'southeast',
    SC: 'southeast', TN: 'southeast', VA: 'southeast', WV: 'southeast',
    // Midwest
    IA: 'midwest', IL: 'midwest', IN: 'midwest', KS: 'midwest',
    MI: 'midwest', MN: 'midwest', MO: 'midwest', ND: 'midwest',
    NE: 'midwest', OH: 'midwest', SD: 'midwest', WI: 'midwest',
    // Southwest
    AZ: 'southwest', NM: 'southwest', OK: 'southwest', TX: 'southwest',
    // West
    AK: 'west', CA: 'west', CO: 'west', HI: 'west', ID: 'west',
    MT: 'west', NV: 'west', OR: 'west', UT: 'west', WA: 'west', WY: 'west',
  };
  
  return stateToRegion[state.toUpperCase()] || 'national';
}

/**
 * Format fuel cost for display
 */
export function formatFuelCost(cost: number): string {
  return `$${cost.toFixed(0)}`;
}
