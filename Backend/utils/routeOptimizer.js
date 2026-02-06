const Bin = require("../models/Bin");
const User = require("../models/User");

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Find all bins with fill level >= threshold
 * @param {number} threshold - Fill level threshold (default 95)
 * @returns {Promise<Array>} Array of bin documents
 */
async function findFullBins(threshold = 95) {
  try {
    const bins = await Bin.find({ level: { $gte: threshold } });
    return bins;
  } catch (err) {
    console.error("Error finding full bins:", err);
    return [];
  }
}

/**
 * Find the nearest available worker to a set of bins
 * @param {Array} bins - Array of bin documents
 * @returns {Promise<Object|null>} Worker user document or null
 */
async function findNearestWorker(bins) {
  try {
    if (!bins || bins.length === 0) return null;

    // Get center point of all bins
    const centerLat = bins.reduce((sum, bin) => sum + bin.latitude, 0) / bins.length;
    const centerLon = bins.reduce((sum, bin) => sum + bin.longitude, 0) / bins.length;

    // Find all available workers
    const workers = await User.find({ role: "worker" });
    
    if (workers.length === 0) return null;

    // For now, return first worker (in production, check availability and location)
    // TODO: Add worker location tracking and availability status
    return workers[0];
  } catch (err) {
    console.error("Error finding nearest worker:", err);
    return null;
  }
}

/**
 * Optimize route using nearest neighbor algorithm
 * @param {Array} bins - Array of bin documents
 * @param {Object} startPoint - Starting location {latitude, longitude}
 * @returns {Object} Optimized route with bins array and total distance
 */
function optimizeRoute(bins, startPoint = null) {
  if (!bins || bins.length === 0) {
    return { bins: [], totalDistance: 0 };
  }

  if (bins.length === 1) {
    return { bins: bins, totalDistance: 0 };
  }

  const unvisited = [...bins];
  const route = [];
  let totalDistance = 0;
  
  // Start from the provided point or first bin
  let currentLat = startPoint?.latitude || bins[0].latitude;
  let currentLon = startPoint?.longitude || bins[0].longitude;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    // Find nearest unvisited bin
    unvisited.forEach((bin, index) => {
      const distance = calculateDistance(currentLat, currentLon, bin.latitude, bin.longitude);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    // Add nearest bin to route
    const nearestBin = unvisited.splice(nearestIndex, 1)[0];
    route.push(nearestBin);
    totalDistance += nearestDistance;

    // Update current position
    currentLat = nearestBin.latitude;
    currentLon = nearestBin.longitude;
  }

  return { bins: route, totalDistance: Math.round(totalDistance * 100) / 100 };
}

/**
 * Group bins by proximity (within radius)
 * @param {Array} bins - Array of bin documents
 * @param {number} radiusKm - Grouping radius in kilometers (default 5km)
 * @returns {Array} Array of bin groups
 */
function groupBinsByProximity(bins, radiusKm = 5) {
  if (!bins || bins.length === 0) return [];
  
  const groups = [];
  const processed = new Set();

  bins.forEach((bin, index) => {
    if (processed.has(index)) return;

    const group = [bin];
    processed.add(index);

    // Find all bins within radius
    bins.forEach((otherBin, otherIndex) => {
      if (processed.has(otherIndex)) return;
      
      const distance = calculateDistance(
        bin.latitude,
        bin.longitude,
        otherBin.latitude,
        otherBin.longitude
      );

      if (distance <= radiusKm) {
        group.push(otherBin);
        processed.add(otherIndex);
      }
    });

    groups.push(group);
  });

  return groups;
}

module.exports = {
  calculateDistance,
  findFullBins,
  findNearestWorker,
  optimizeRoute,
  groupBinsByProximity,
};
