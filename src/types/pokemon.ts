export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2: string | null;
  generation: number;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  capture_rate: number;
  evolution_chain_id: number | null;
}

export interface PokemonSearchResult {
  id: number;
  name: string;
  type1: string;
  type2: string | null;
  generation: number;
}
