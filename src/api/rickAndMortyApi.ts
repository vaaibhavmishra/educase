import {CHARACTERS_ENDPOINT} from '../utils/constants';
import type {Character, CharacterApiResponse} from '../features/characters/types';

/**
 * Fetches a paginated list of characters, optionally filtered by name and status.
 */
export async function fetchCharactersApi(
  page: number,
  name?: string,
  status?: string,
): Promise<CharacterApiResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));

  if (name && name.trim().length > 0) {
    params.append('name', name.trim());
  }

  if (status && status.toLowerCase() !== 'all') {
    params.append('status', status.toLowerCase());
  }

  const url = `${CHARACTERS_ENDPOINT}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      // API returns 404 when no results match the filter
      return {
        info: {count: 0, pages: 0, next: null, prev: null},
        results: [],
      };
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: CharacterApiResponse = await response.json();
  return data;
}

/**
 * Fetches a single character by ID.
 */
export async function fetchCharacterByIdApi(
  id: number,
): Promise<Character> {
  const url = `${CHARACTERS_ENDPOINT}/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: Character = await response.json();
  return data;
}
