export const API_BASE_URL = 'https://rickandmortyapi.com/api';
export const CHARACTERS_ENDPOINT = `${API_BASE_URL}/character`;
export const PAGE_SIZE = 20; // API returns 20 per page by default
export const SEARCH_DEBOUNCE_MS = 400;

export const STATUS_OPTIONS = ['All', 'Alive', 'Dead', 'Unknown'] as const;
export type StatusFilter = (typeof STATUS_OPTIONS)[number];
