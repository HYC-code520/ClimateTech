// Funding stage colors - matching the funding event page colors
export const stageColors = {
  'Pre-Seed': '#ffffff',    // White
  'Seed': '#93c5fd',       // Light blue
  'Series A': '#3b82f6',   // Medium blue
  'Series B': '#2563eb',   // Blue
  'Series C': '#1d4ed8',   // Darker blue
  'Series D': '#1e40af',   // Dark blue
  'Series E': '#1e3a8a',   // Very dark blue
  'Series F+': '#0f172a',  // Almost black blue
  'Growth': '#7c3aed',     // Purple
  'IPO': '#6b7280',        // Grey
  'Acquisition': '#4b5563', // Dark grey
  'Unknown': '#9ca3af'     // Light grey
};

// Sector colors - only keeping sectors with actual data
export const sectorColors = {
  'Energy': '#fbbf24',           // Yellow
  'Industry': '#ef4444',         // Red
  'Water': '#0ea5e9',            // Sky blue
  'Other': '#6b7280'             // Gray
};

// Helper function to get stage color
export const getStageColor = (stage: string): string => {
  return stageColors[stage as keyof typeof stageColors] || stageColors['Unknown'];
};

// Helper function to get sector color
export const getSectorColor = (sector: string): string => {
  return sectorColors[sector as keyof typeof sectorColors] || sectorColors['Other'];
};

// Helper function to get all stage colors for legends
export const getAllStageColors = () => {
  return Object.entries(stageColors).map(([stage, color]) => ({ stage, color }));
};

// Helper function to get all sector colors for legends
export const getAllSectorColors = () => {
  return Object.entries(sectorColors).map(([sector, color]) => ({ sector, color }));
}; 