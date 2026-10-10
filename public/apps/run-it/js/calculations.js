// Conversion helpers
const M_TO_MILES = 0.000621371;
const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

/**
 * Balke 15-Minute Run Test VO2 Max Formula:
 * VO2max = (((Distance in meters / 15) - 133) * 0.172) + 33.3
 */
function calculateBalkeVO2(distanceMeters) {
  if (distanceMeters < 1200) distanceMeters = 1200;
  const speedMperMin = distanceMeters / 15.0;
  let vo2 = ((speedMperMin - 133) * 0.172) + 33.3;
  if (vo2 < 20) vo2 = 20;
  return vo2;
}

// Categorize VO2 Max based on population standards
function getFitnessTier(vo2) {
  if (vo2 >= 58) return { label: 'Superior / Elite', badgeClass: 'text-pink-400 bg-pink-500/20 border-pink-500/40', pct: 95 };
  if (vo2 >= 50) return { label: 'Excellent', badgeClass: 'text-magenta-400 bg-magenta-500/20 border-magenta-500/40', pct: 85 };
  if (vo2 >= 42) return { label: 'Good', badgeClass: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40', pct: 65 };
  if (vo2 >= 35) return { label: 'Fair / Average', badgeClass: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40', pct: 45 };
  return { label: 'Novice Foundation', badgeClass: 'text-gray-300 bg-gray-500/20 border-gray-500/40', pct: 25 };
}

/**
 * Calculate Recommended Baseline Weekly Mileage
 * Factors: VO2 Max (aerobic engine), Experience Level (orthopedic durability), Target Race (fuel demands)
 */
function calculateWeeklyMileage(vo2, level, event, modifier) {
  // Base volume derived from aerobic fitness (VO2)
  // Higher aerobic fitness permits more volume without metabolic exhaustion
  let baseVolumeKm = (vo2 - 25) * 1.35; // e.g. VO2 50 -> 25 * 1.35 = ~33.7 km base

  // Experience multiplier
  const levelMultipliers = {
    'beginner': 0.75,
    'intermediate': 1.0,
    'advanced': 1.30,
    'elite': 1.65
  };
  const levelMult = levelMultipliers[level] || 1.0;

  // Event modifier
  const eventMultipliers = {
    '5k': 0.85,
    'half': 1.15,
    'marathon': 1.45,
    'base': 1.00
  };
  const eventMult = eventMultipliers[event] || 1.0;

  let targetKm = (baseVolumeKm * levelMult * eventMult) * modifier;

  // Safe minimum clamping
  if (targetKm < 20) targetKm = 20;

  const safeMinKm = Math.round(targetKm * 0.82);
  const safeMaxKm = Math.round(targetKm * 1.18);
  const recommendedKm = Math.round(targetKm);

  return {
    target: recommendedKm,
    min: safeMinKm,
    max: safeMaxKm
  };
}

/**
 * Calculate training paces (sec per km or sec per mile) from 15-minute speed
 */
function calculatePaces(distanceMeters) {
  // 15-min pace = distance in meters / 15 minutes
  // Velocity in km/h:
  const vKmh = (distanceMeters / 1000) / (15 / 60);
  // Velocity in meters/sec:
  const vMs = distanceMeters / (15 * 60);

  // Pace for 100% vVO2 (sec per km)
  const secPerKmVO2 = 1000 / vMs;

  // Training zones as fraction of vVO2 velocity:
  // Interval: 95% - 100%
  // Threshold: 85% - 90%
  // Marathon: 75% - 84%
  // Easy: 65% - 75%
  const paceIntervalLow = secPerKmVO2 / 1.00;
  const paceIntervalHigh = secPerKmVO2 / 0.95;

  const paceThresholdLow = secPerKmVO2 / 0.90;
  const paceThresholdHigh = secPerKmVO2 / 0.85;

  const paceMarathonLow = secPerKmVO2 / 0.84;
  const paceMarathonHigh = secPerKmVO2 / 0.75;

  const paceEasyLow = secPerKmVO2 / 0.74;
  const paceEasyHigh = secPerKmVO2 / 0.65;

  return {
    vKmh,
    easy: [paceEasyLow, paceEasyHigh],
    marathon: [paceMarathonLow, paceMarathonHigh],
    threshold: [paceThresholdLow, paceThresholdHigh],
    interval: [paceIntervalLow, paceIntervalHigh]
  };
}

function formatPace(seconds, toMiles = false) {
  if (toMiles) {
    seconds = seconds * MILES_TO_KM;
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Generate 7-day schedule distribution according to number of running days
 */
function generateWeeklySchedule(totalVol, days, unit) {
  // Proportions for day assignments based on running days (3 to 7 days)
  const templates = {
    3: [
      { day: 'Monday', name: 'Rest / Active Mobility', type: 'Rest', share: 0, desc: 'Full recovery or light stretching' },
      { day: 'Tuesday', name: 'Aerobic Base Run', type: 'Easy', share: 0.28, desc: 'Conversational rhythm + 4x 20s strides' },
      { day: 'Wednesday', name: 'Rest / Cross-Training', type: 'Rest', share: 0, desc: 'Rest or low impact cycle/swim' },
      { day: 'Thursday', name: 'Lactate Threshold Tempo', type: 'Quality', share: 0.28, desc: 'Warmup + 20-30 min sustained threshold tempo' },
      { day: 'Friday', name: 'Rest / Core Work', type: 'Rest', share: 0, desc: 'Rest & restorative nutrition' },
      { day: 'Saturday', name: 'Long Aerobic Run', type: 'Long', share: 0.44, desc: 'Steady endurance run in Zone 1/2' },
      { day: 'Sunday', name: 'Rest / Recovery Walk', type: 'Rest', share: 0, desc: 'Full restoration before new week' }
    ],
    4: [
      { day: 'Monday', name: 'Rest / Cross-Training', type: 'Rest', share: 0, desc: 'Rest or mobility yoga' },
      { day: 'Tuesday', name: 'Aerobic Foundation Run', type: 'Easy', share: 0.22, desc: 'Zone 2 aerobic running' },
      { day: 'Wednesday', name: 'VO₂ Max Interval Session', type: 'Interval', share: 0.20, desc: 'Warmup + 5x 800m intervals w/ 2m jog' },
      { day: 'Thursday', name: 'Rest / Core Strength', type: 'Rest', share: 0, desc: 'Strength training & recovery' },
      { day: 'Friday', name: 'Recovery Flush Run', type: 'Recovery', share: 0.18, desc: 'Ultra-easy flush run' },
      { day: 'Saturday', name: 'Progression Long Run', type: 'Long', share: 0.40, desc: 'Endurance volume finishing at marathon pace' },
      { day: 'Sunday', name: 'Rest / Complete Restoration', type: 'Rest', share: 0, desc: 'Rest' }
    ],
    5: [
      { day: 'Monday', name: 'Rest or Mobility Work', type: 'Rest', share: 0, desc: 'Complete recovery day' },
      { day: 'Tuesday', name: 'Easy Aerobic + Strides', type: 'Easy', share: 0.18, desc: 'Aerobic base + 5x 100m neuromuscular strides' },
      { day: 'Wednesday', name: 'Lactate Threshold Cruise Intervals', type: 'Quality', share: 0.20, desc: 'Warmup + 3x 2km @ Threshold pace' },
      { day: 'Thursday', name: 'Recovery Base Run', type: 'Recovery', share: 0.14, desc: 'Relaxed aerobic run' },
      { day: 'Friday', name: 'Rest / Dynamic Mobility', type: 'Rest', share: 0, desc: 'Rest before weekend sessions' },
      { day: 'Saturday', name: 'Long Aerobic Run', type: 'Long', share: 0.33, desc: 'Cornerstone aerobic endurance session' },
      { day: 'Sunday', name: 'Easy Aerobic Flush', type: 'Easy', share: 0.15, desc: 'Light conversational run to clear fatigue' }
    ],
    6: [
      { day: 'Monday', name: 'Recovery Flush Run', type: 'Recovery', share: 0.12, desc: 'Easy recovery effort' },
      { day: 'Tuesday', name: 'Threshold / Tempo Session', type: 'Quality', share: 0.20, desc: 'Warmup + continuous tempo at Zone 3' },
      { day: 'Wednesday', name: 'Aerobic Foundation Run', type: 'Easy', share: 0.15, desc: 'Standard Zone 2 aerobic mileage' },
      { day: 'Thursday', name: 'VO₂ Max Interval Day', type: 'Interval', share: 0.15, desc: 'Warmup + 6x 600m hard w/ equal jog' },
      { day: 'Friday', name: 'Rest or Light Shakeout', type: 'Rest', share: 0, desc: 'Full rest day' },
      { day: 'Saturday', name: 'Signature Long Run', type: 'Long', share: 0.26, desc: 'Long endurance block' },
      { day: 'Sunday', name: 'Aerobic Recovery Run', type: 'Easy', share: 0.12, desc: 'Conversational aerobic recovery' }
    ],
    7: [
      { day: 'Monday', name: 'Recovery Flush Jog', type: 'Recovery', share: 0.10, desc: 'Gentle recovery shakeout' },
      { day: 'Tuesday', name: 'Lactate Threshold Workout', type: 'Quality', share: 0.18, desc: 'Structured tempo intervals' },
      { day: 'Wednesday', name: 'Aerobic Base Run', type: 'Easy', share: 0.15, desc: 'Pure aerobic mileage' },
      { day: 'Thursday', name: 'VO₂ Max Speed Repeats', type: 'Interval', share: 0.14, desc: 'Fast intervals with full recovery' },
      { day: 'Friday', name: 'Recovery Run + Form Drill', type: 'Recovery', share: 0.11, desc: 'Easy aerobic + running mechanics' },
      { day: 'Saturday', name: 'Long Endurance Run', type: 'Long', share: 0.22, desc: 'Overload volume session' },
      { day: 'Sunday', name: 'Aerobic Base Maintenance', type: 'Easy', share: 0.10, desc: 'Light aerobic maintenance run' }
    ]
  };

  const plan = templates[days] || templates[5];
  return plan.map(item => {
    const itemDist = item.share > 0 ? (totalVol * item.share) : 0;
    return {
      ...item,
      distanceFormatted: itemDist > 0 ? `${itemDist.toFixed(1)} ${unit}` : 'Rest'
    };
  });
}

