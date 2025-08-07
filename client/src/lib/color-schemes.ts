// Funding stage colors - lighter to darker green for progression
export const stageColors = {
  'Pre-Seed': '#86efac', // Very light green
  'Seed': '#4ade80',     // Light green
  'Series A': '#22c55e', // Medium green
  'Series B': '#16a34a', // Darker green
  'Series C': '#15803d', // Dark green
  'Series D': '#166534', // Very dark green
  'Series E': '#14532d', // Darkest green
  'Series F+': '#052e16', // Almost black green
  'IPO': '#1f2937',      // Dark gray for IPO
  'Acquisition': '#374151', // Gray for acquisition
  'Unknown': '#6b7280'   // Gray for unknown stages
};

// Sector colors - distinct colors for different climate tech sectors
export const sectorColors = {
  'Energy': '#3b82f6',           // Blue
  'Transportation': '#8b5cf6',   // Purple
  'Food & Agriculture': '#f59e0b', // Orange
  'Industry': '#ef4444',         // Red
  'Buildings': '#06b6d4',        // Cyan
  'Carbon Management': '#10b981', // Emerald
  'Waste & Recycling': '#84cc16', // Lime
  'Water': '#0ea5e9',            // Sky blue
  'Materials': '#f97316',        // Orange
  'Finance': '#ec4899',          // Pink
  'Software': '#6366f1',         // Indigo
  'Hardware': '#78716c',         // Stone
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