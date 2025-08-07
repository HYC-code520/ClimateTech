import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSectorColor, getAllSectorColors } from "@/lib/color-schemes";

interface SectorSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function SectorSelect({ value, onValueChange, placeholder = "Any sector" }: SectorSelectProps) {
  const sectorOptions = getAllSectorColors();

  return (
    <Select value={value || "all"} onValueChange={(val) => onValueChange(val === "all" ? "" : val)}>
      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-600">
        <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-300 shadow-sm" />
            <span>Any Sector</span>
          </div>
        </SelectItem>
        {sectorOptions.map(({ sector, color }) => (
          <SelectItem key={sector} value={sector} className="text-white hover:bg-gray-700 focus:bg-gray-700">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                }}
              />
              <span>{sector}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 