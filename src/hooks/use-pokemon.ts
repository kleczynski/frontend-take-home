import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Pokemon, PokemonSearchResult } from "@/types/pokemon";

export function usePokemonList() {
  return useQuery({
    queryKey: ["pokedex"],
    queryFn: () => api.get<Pokemon[]>("/pokedex"),
    staleTime: Infinity,
  });
}

export function usePokemonSearch(name: string) {
  return useQuery({
    queryKey: ["pokedex", "search", name],
    queryFn: () =>
      api.get<PokemonSearchResult[]>(`/pokedex/search?name=${encodeURIComponent(name)}`),
    enabled: name.length >= 1,
    staleTime: 60_000,
  });
}
