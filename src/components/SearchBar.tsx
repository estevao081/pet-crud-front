import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { PetFormData } from "@/lib/api";

interface SearchBarProps {
  onSearch: (filter: Partial<PetFormData>) => void;
  onClear: () => void;
  isPending?: boolean;
}

export function SearchBar({ onSearch, onClear, isPending }: SearchBarProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    const filter: Partial<PetFormData> = {};
    if (name.trim()) filter.name = name.trim();
    if (type && type !== "ALL") filter.type = type;
    onSearch(filter);
  };

  const handleClear = () => {
    setName("");
    setType("");
    onClear();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, raça..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="CÃO">Cão</SelectItem>
          <SelectItem value="GATO">Gato</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button onClick={handleSearch} disabled={isPending}>
          <Search className="h-4 w-4 mr-1" /> Buscar
        </Button>
        <Button variant="outline" onClick={handleClear}>
          <X className="h-4 w-4 mr-1" /> Limpar
        </Button>
      </div>
    </div>
  );
}
