import type { FoodType, TransportMode } from '../types';

export interface FactorRecord {
  factor: number;
  unit: string;
  label: string;
  source: string;
  sourceYear: number;
  notes: string;
}

export const ELECTRICITY_FACTOR: FactorRecord = {
  factor: 0.710,
  unit: 'kg CO₂e / kWh',
  label: 'Indian grid average',
  source: 'Central Electricity Authority, CO₂ Baseline Database v21.0',
  sourceYear: 2025,
  notes: 'Weighted-average Indian grid emission factor for FY 2024–25. Used as an educational national estimate.'
};

export const TRANSPORT_FACTORS: Record<TransportMode, FactorRecord> = {
  walk: {
    factor: 0,
    unit: 'kg CO₂e / passenger-km',
    label: 'Walking',
    source: 'Operational-emissions convention',
    sourceYear: 2025,
    notes: 'Direct operational emissions only; food and infrastructure lifecycle effects are excluded.'
  },
  bicycle: {
    factor: 0,
    unit: 'kg CO₂e / passenger-km',
    label: 'Bicycle',
    source: 'Operational-emissions convention',
    sourceYear: 2025,
    notes: 'Direct operational emissions only; manufacturing and food-energy effects are excluded.'
  },
  bus: {
    factor: 0.10385,
    unit: 'kg CO₂e / passenger-km',
    label: 'Average local bus',
    source: 'UK Government GHG Conversion Factors 2025',
    sourceYear: 2025,
    notes: 'International proxy. Actual Indian fleet performance and occupancy can differ.'
  },
  metro: {
    factor: 0.0286,
    unit: 'kg CO₂e / passenger-km',
    label: 'Light rail and tram proxy',
    source: 'UK Government GHG Conversion Factors 2025',
    sourceYear: 2025,
    notes: 'Proxy for urban metro travel. Local electricity mix and occupancy can materially change the result.'
  },
  motorbike: {
    factor: 0.11367,
    unit: 'kg CO₂e / vehicle-km',
    label: 'Average motorbike',
    source: 'UK Government GHG Conversion Factors 2025',
    sourceYear: 2025,
    notes: 'Vehicle-kilometre factor divided by the entered passenger count.'
  },
  car: {
    factor: 0.17304,
    unit: 'kg CO₂e / vehicle-km',
    label: 'Average car',
    source: 'UK Government GHG Conversion Factors 2025',
    sourceYear: 2025,
    notes: 'Vehicle-kilometre factor divided by the entered passenger count.'
  },
  taxi: {
    factor: 0.14861,
    unit: 'kg CO₂e / passenger-km',
    label: 'Regular taxi',
    source: 'UK Government GHG Conversion Factors 2025',
    sourceYear: 2025,
    notes: 'International proxy; excludes vehicle travel while empty.'
  }
};

export const FOOD_FACTORS: Record<FoodType, FactorRecord> = {
  'plant-based': {
    factor: 0.65,
    unit: 'kg CO₂e / meal',
    label: 'Plant-based meal estimate',
    source: 'Educational estimate informed by Poore & Nemecek (2018)',
    sourceYear: 2018,
    notes: 'Broad meal-level estimate; ingredients, portions, sourcing and waste can cause large variation.'
  },
  vegetarian: {
    factor: 1.2,
    unit: 'kg CO₂e / meal',
    label: 'Vegetarian meal estimate',
    source: 'Educational estimate informed by Poore & Nemecek (2018)',
    sourceYear: 2018,
    notes: 'Includes a broad allowance for dairy; not a dietary certification or exact accounting value.'
  },
  chicken: {
    factor: 2.0,
    unit: 'kg CO₂e / meal',
    label: 'Chicken meal estimate',
    source: 'Educational estimate informed by Poore & Nemecek (2018)',
    sourceYear: 2018,
    notes: 'Broad meal-level estimate with substantial supply-chain variation.'
  },
  'red-meat': {
    factor: 5.5,
    unit: 'kg CO₂e / meal',
    label: 'Red-meat meal estimate',
    source: 'Educational estimate informed by Poore & Nemecek (2018)',
    sourceYear: 2018,
    notes: 'A conservative broad estimate; beef and lamb can be materially higher.'
  },
  packaged: {
    factor: 1.7,
    unit: 'kg CO₂e / meal',
    label: 'Packaged or takeaway meal estimate',
    source: 'CarbonCue educational estimate',
    sourceYear: 2026,
    notes: 'Low-confidence placeholder covering food, processing and packaging. Actual values vary widely.'
  }
};
