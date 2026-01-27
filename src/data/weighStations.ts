// US Interstate Weigh Stations - Major DOT Inspection Points
// Data covers primary corridors used by commercial trucking

export interface WeighStation {
  id: string;
  name: string;
  state: string;
  interstate: string;
  mile_marker: number;
  lat: number;
  lon: number;
  direction: 'NB' | 'SB' | 'EB' | 'WB' | 'Both';
  is_24_7: boolean;
  has_prepass: boolean;
  has_drivewyze: boolean;
}

// Major weigh stations across the US
export const WEIGH_STATIONS: WeighStation[] = [
  // I-95 Corridor (East Coast)
  { id: 'i95-fl-01', name: 'Yulee POE', state: 'FL', interstate: 'I-95', mile_marker: 373, lat: 30.6328, lon: -81.5417, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-fl-02', name: 'Wildwood Weigh Station', state: 'FL', interstate: 'I-75', mile_marker: 329, lat: 28.8500, lon: -82.0100, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-fl-03', name: 'West Palm Beach', state: 'FL', interstate: 'I-95', mile_marker: 76, lat: 26.7150, lon: -80.0890, direction: 'Both', is_24_7: false, has_prepass: true, has_drivewyze: false },
  { id: 'i95-ga-01', name: 'Kingsland POE', state: 'GA', interstate: 'I-95', mile_marker: 3, lat: 30.7997, lon: -81.6469, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-ga-02', name: 'Savannah Weigh Station', state: 'GA', interstate: 'I-95', mile_marker: 94, lat: 32.0361, lon: -81.0861, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-sc-01', name: 'Hardeeville POE', state: 'SC', interstate: 'I-95', mile_marker: 5, lat: 32.2870, lon: -81.0827, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-sc-02', name: 'Santee Weigh Station', state: 'SC', interstate: 'I-95', mile_marker: 98, lat: 33.4695, lon: -80.4367, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: false },
  { id: 'i95-nc-01', name: 'Rowland POE', state: 'NC', interstate: 'I-95', mile_marker: 1, lat: 34.4053, lon: -79.2672, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-nc-02', name: 'Rocky Mount Weigh Station', state: 'NC', interstate: 'I-95', mile_marker: 138, lat: 35.9385, lon: -77.8014, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-va-01', name: 'Emporia POE', state: 'VA', interstate: 'I-95', mile_marker: 8, lat: 36.7033, lon: -77.5364, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-va-02', name: 'Dumfries Weigh Station', state: 'VA', interstate: 'I-95', mile_marker: 152, lat: 38.5672, lon: -77.3281, direction: 'Both', is_24_7: false, has_prepass: true, has_drivewyze: true },
  { id: 'i95-md-01', name: 'Perryville Weigh Station', state: 'MD', interstate: 'I-95', mile_marker: 93, lat: 39.5600, lon: -76.0700, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i95-nj-01', name: 'Deepwater Weigh Station', state: 'NJ', interstate: 'I-295', mile_marker: 1, lat: 39.6919, lon: -75.5092, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  
  // I-10 Corridor (Southern US)
  { id: 'i10-fl-01', name: 'Pensacola POE', state: 'FL', interstate: 'I-10', mile_marker: 5, lat: 30.4400, lon: -87.2200, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-al-01', name: 'Mobile Weigh Station', state: 'AL', interstate: 'I-10', mile_marker: 17, lat: 30.6833, lon: -88.0625, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-ms-01', name: 'Gautier Weigh Station', state: 'MS', interstate: 'I-10', mile_marker: 61, lat: 30.3883, lon: -88.6119, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: false },
  { id: 'i10-la-01', name: 'Slidell POE', state: 'LA', interstate: 'I-10', mile_marker: 266, lat: 30.2755, lon: -89.7811, direction: 'EB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-la-02', name: 'Vinton POE', state: 'LA', interstate: 'I-10', mile_marker: 4, lat: 30.1961, lon: -93.5533, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-tx-01', name: 'Orange POE', state: 'TX', interstate: 'I-10', mile_marker: 877, lat: 30.0906, lon: -93.7358, direction: 'EB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-tx-02', name: 'Sierra Blanca POE', state: 'TX', interstate: 'I-10', mile_marker: 85, lat: 31.1800, lon: -105.3600, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-nm-01', name: 'Lordsburg POE', state: 'NM', interstate: 'I-10', mile_marker: 5, lat: 32.3500, lon: -108.7100, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-az-01', name: 'San Simon POE', state: 'AZ', interstate: 'I-10', mile_marker: 382, lat: 32.2650, lon: -109.2539, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i10-ca-01', name: 'Blythe POE', state: 'CA', interstate: 'I-10', mile_marker: 1, lat: 33.6186, lon: -114.5964, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  
  // I-75 Corridor (Midwest to Florida)
  { id: 'i75-fl-01', name: 'Lake City Weigh Station', state: 'FL', interstate: 'I-75', mile_marker: 427, lat: 30.1897, lon: -82.6392, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i75-ga-01', name: 'Valdosta POE', state: 'GA', interstate: 'I-75', mile_marker: 2, lat: 30.8508, lon: -83.2786, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i75-ga-02', name: 'Ringgold Weigh Station', state: 'GA', interstate: 'I-75', mile_marker: 348, lat: 34.9156, lon: -85.1097, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i75-tn-01', name: 'East Ridge Weigh Station', state: 'TN', interstate: 'I-75', mile_marker: 1, lat: 35.0217, lon: -85.2142, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i75-ky-01', name: 'Williamsburg Weigh Station', state: 'KY', interstate: 'I-75', mile_marker: 11, lat: 36.7336, lon: -84.1536, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i75-oh-01', name: 'Monroe Weigh Station', state: 'OH', interstate: 'I-75', mile_marker: 29, lat: 39.4433, lon: -84.3622, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i75-mi-01', name: 'Monroe POE', state: 'MI', interstate: 'I-75', mile_marker: 2, lat: 41.9103, lon: -83.4039, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  
  // I-80 Corridor (East-West)
  { id: 'i80-nj-01', name: 'Delaware Water Gap Weigh Station', state: 'NJ', interstate: 'I-80', mile_marker: 4, lat: 40.9753, lon: -75.1225, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-pa-01', name: 'Milesburg Weigh Station', state: 'PA', interstate: 'I-80', mile_marker: 158, lat: 40.9447, lon: -77.7928, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-oh-01', name: 'Hubbard Weigh Station', state: 'OH', interstate: 'I-80', mile_marker: 234, lat: 41.1617, lon: -80.5728, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-in-01', name: 'Lake Station Weigh Station', state: 'IN', interstate: 'I-80', mile_marker: 15, lat: 41.5772, lon: -87.2589, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-il-01', name: 'Hazel Crest Weigh Station', state: 'IL', interstate: 'I-80', mile_marker: 155, lat: 41.5539, lon: -87.6533, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-ia-01', name: 'Walcott Weigh Station', state: 'IA', interstate: 'I-80', mile_marker: 284, lat: 41.5814, lon: -90.7722, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-ne-01', name: 'North Platte Weigh Station', state: 'NE', interstate: 'I-80', mile_marker: 177, lat: 41.1250, lon: -100.7667, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-wy-01', name: 'Pine Bluffs POE', state: 'WY', interstate: 'I-80', mile_marker: 401, lat: 41.1819, lon: -104.0683, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-ut-01', name: 'Echo Weigh Station', state: 'UT', interstate: 'I-80', mile_marker: 169, lat: 40.9728, lon: -111.4372, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-nv-01', name: 'Wendover POE', state: 'NV', interstate: 'I-80', mile_marker: 410, lat: 40.7394, lon: -114.0378, direction: 'EB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i80-ca-01', name: 'Truckee Weigh Station', state: 'CA', interstate: 'I-80', mile_marker: 188, lat: 39.3272, lon: -120.1836, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  
  // I-40 Corridor
  { id: 'i40-nc-01', name: 'Wadesboro Weigh Station', state: 'NC', interstate: 'I-74', mile_marker: 73, lat: 35.0111, lon: -80.0819, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-tn-01', name: 'Memphis Weigh Station', state: 'TN', interstate: 'I-40', mile_marker: 1, lat: 35.0606, lon: -90.0506, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-ar-01', name: 'West Memphis POE', state: 'AR', interstate: 'I-40', mile_marker: 278, lat: 35.1500, lon: -90.1844, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-ok-01', name: 'Roland POE', state: 'OK', interstate: 'I-40', mile_marker: 325, lat: 35.4225, lon: -94.5136, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-tx-01', name: 'Amarillo Weigh Station', state: 'TX', interstate: 'I-40', mile_marker: 75, lat: 35.1819, lon: -101.8333, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-nm-01', name: 'Gallup POE', state: 'NM', interstate: 'I-40', mile_marker: 20, lat: 35.5300, lon: -108.7400, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-az-01', name: 'Sanders POE', state: 'AZ', interstate: 'I-40', mile_marker: 339, lat: 35.2150, lon: -109.3300, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i40-ca-01', name: 'Needles POE', state: 'CA', interstate: 'I-40', mile_marker: 1, lat: 34.8481, lon: -114.6133, direction: 'WB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  
  // I-5 Corridor (West Coast)
  { id: 'i5-ca-01', name: 'Otay Mesa POE', state: 'CA', interstate: 'I-5', mile_marker: 0, lat: 32.5569, lon: -117.0597, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i5-ca-02', name: 'Grapevine Weigh Station', state: 'CA', interstate: 'I-5', mile_marker: 221, lat: 34.9375, lon: -118.8500, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i5-ca-03', name: 'Cottonwood Weigh Station', state: 'CA', interstate: 'I-5', mile_marker: 660, lat: 40.3917, lon: -122.2417, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i5-or-01', name: 'Ashland POE', state: 'OR', interstate: 'I-5', mile_marker: 1, lat: 42.1947, lon: -122.7094, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i5-or-02', name: 'Woodburn Weigh Station', state: 'OR', interstate: 'I-5', mile_marker: 271, lat: 45.1456, lon: -122.8611, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i5-wa-01', name: 'Vancouver POE', state: 'WA', interstate: 'I-5', mile_marker: 1, lat: 45.6225, lon: -122.6533, direction: 'NB', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i5-wa-02', name: 'Bow Hill Weigh Station', state: 'WA', interstate: 'I-5', mile_marker: 232, lat: 48.5622, lon: -122.4283, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  
  // I-70 Corridor
  { id: 'i70-md-01', name: 'Hancock Weigh Station', state: 'MD', interstate: 'I-70', mile_marker: 3, lat: 39.6983, lon: -78.1744, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i70-oh-01', name: 'Cambridge Weigh Station', state: 'OH', interstate: 'I-70', mile_marker: 176, lat: 40.0311, lon: -81.5908, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i70-in-01', name: 'Indianapolis Weigh Station', state: 'IN', interstate: 'I-70', mile_marker: 83, lat: 39.7867, lon: -86.1581, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i70-mo-01', name: 'Kingdom City Weigh Station', state: 'MO', interstate: 'I-70', mile_marker: 148, lat: 38.9636, lon: -91.9447, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i70-ks-01', name: 'Topeka Weigh Station', state: 'KS', interstate: 'I-70', mile_marker: 358, lat: 39.0558, lon: -95.6894, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i70-co-01', name: 'Limon Weigh Station', state: 'CO', interstate: 'I-70', mile_marker: 361, lat: 39.2647, lon: -103.6917, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
  { id: 'i70-ut-01', name: 'Green River Weigh Station', state: 'UT', interstate: 'I-70', mile_marker: 162, lat: 38.9986, lon: -110.1567, direction: 'Both', is_24_7: true, has_prepass: true, has_drivewyze: true },
];

// Helper function to find weigh stations along a route
export function findWeighStationsOnRoute(
  routeCoordinates: [number, number][],
  toleranceMiles: number = 5
): { station: WeighStation; routeIndex: number; distanceFromRoute: number }[] {
  const results: { station: WeighStation; routeIndex: number; distanceFromRoute: number }[] = [];
  
  // Convert tolerance to approximate degrees (1 degree ≈ 69 miles)
  const toleranceDegrees = toleranceMiles / 69;
  
  for (const station of WEIGH_STATIONS) {
    let minDistance = Infinity;
    let closestIndex = -1;
    
    // Check each point on the route
    for (let i = 0; i < routeCoordinates.length; i++) {
      const [lon, lat] = routeCoordinates[i];
      const distance = Math.sqrt(
        Math.pow(lon - station.lon, 2) + Math.pow(lat - station.lat, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    // If within tolerance, add to results
    if (minDistance <= toleranceDegrees) {
      results.push({
        station,
        routeIndex: closestIndex,
        distanceFromRoute: minDistance * 69 // Convert back to miles
      });
    }
  }
  
  // Sort by route index (order they appear on the route)
  return results.sort((a, b) => a.routeIndex - b.routeIndex);
}

// Get station status based on progress
export function getStationStatus(
  stationRouteIndex: number,
  totalRoutePoints: number,
  currentProgress: number
): 'passed' | 'approaching' | 'upcoming' {
  const stationProgress = (stationRouteIndex / totalRoutePoints) * 100;
  
  if (currentProgress >= stationProgress + 2) {
    return 'passed';
  } else if (currentProgress >= stationProgress - 5) {
    return 'approaching';
  }
  return 'upcoming';
}
