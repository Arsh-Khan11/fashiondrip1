import { SIZE_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

const SizeSelector = ({ selectedSize, onSizeChange }: SizeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {SIZE_OPTIONS.map((size) => (
        <Button
          key={size}
          variant={selectedSize === size ? "default" : "outline"}
          className={`
            h-10 w-10 rounded-sm font-medium 
            ${selectedSize === size 
              ? 'bg-[#C8A96A] hover:bg-[#B08D4C] text-white' 
              : 'bg-white text-black hover:bg-gray-100'}
          `}
          onClick={() => onSizeChange(size)}
        >
          {size}
        </Button>
      ))}
    </div>
  );
};

export default SizeSelector;
