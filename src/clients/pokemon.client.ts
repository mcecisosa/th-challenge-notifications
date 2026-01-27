import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

interface PokemonApiResponse {
  id: number;
  name: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
}

@Injectable()
export class PokemonClient {
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>(
      'POKEMON_API_URL',
      'https://pokeapi.co/api/v2',
    );
  }

  async getPokemonById(id: number): Promise<PokemonDetails | null> {
    try {
      const response: AxiosResponse<PokemonApiResponse> = await axios.get(
        `${this.apiUrl}/pokemon/${id}`,
      );

      return {
        id: response.data.id,
        name: response.data.name,
      };
    } catch (error) {
      console.log(`Error fetching Pokemon with ID ${id}:`, error);
      return null;
    }
  }

  async getPokemonDetailsByIds(ids: number[]): Promise<PokemonDetails[]> {
    const pokemonPromises = ids.map((id) => this.getPokemonById(id));
    const pokemonResults = await Promise.all(pokemonPromises);

    //filter out any null results
    return pokemonResults.filter((pokemon) => pokemon !== null);
  }
}
