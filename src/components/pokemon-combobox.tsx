import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { usePokemonSearch } from "@/hooks/use-pokemon";

interface PokemonComboboxProps {
  value: number;
  onChange: (id: number) => void;
  onNameChange?: (name: string) => void;
}

export function PokemonCombobox({ value, onChange, onNameChange }: PokemonComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: results } = usePokemonSearch(search);

  const selectedName = results?.find((p) => p.id === value)?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          />
        }
      >
        {value > 0
          ? selectedName
            ? `${selectedName} (#${value})`
            : `#${value}`
          : "Search Pokémon..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Type a name..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>
              {search.length === 0 ? "Type to search..." : "No Pokémon found."}
            </CommandEmpty>
            {results?.map((pokemon) => (
              <CommandItem
                key={pokemon.id}
                value={String(pokemon.id)}
                onSelect={() => {
                  onChange(pokemon.id);
                  onNameChange?.(pokemon.name);
                  setOpen(false);
                }}
              >
                <span className="font-medium">{pokemon.name}</span>
                <span className="ml-auto text-muted-foreground text-xs">
                  #{pokemon.id} &middot; {pokemon.type1}
                  {pokemon.type2 ? ` / ${pokemon.type2}` : ""}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
