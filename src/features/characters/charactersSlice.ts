import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {fetchCharactersApi} from '../../api/rickAndMortyApi';
import type {Character, CharactersState} from './types';

const initialState: CharactersState = {
  characters: [],
  page: 1,
  totalPages: 0,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: '',
  statusFilter: 'All',
  refreshing: false,
};

/**
 * Async thunk: fetch characters with pagination, search, and status filter.
 * - page=1: initial load or filter change (replaces list)
 * - page>1: infinite scroll (appends to list)
 */
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (
    {
      page,
      name,
      status,
    }: {page: number; name?: string; status?: string},
    {rejectWithValue},
  ) => {
    try {
      const data = await fetchCharactersApi(page, name, status);
      return {
        characters: data.results,
        page,
        totalPages: data.info.pages,
        hasMore: data.info.next !== null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch characters');
    }
  },
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
    },
    resetCharacters(state) {
      state.characters = [];
      state.page = 1;
      state.totalPages = 0;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCharacters.pending, (state, action) => {
        const page = action.meta.arg.page;
        if (page === 1) {
          state.loading = true;
          state.refreshing = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        const {characters, page, totalPages, hasMore} = action.payload;
        if (page === 1) {
          state.characters = characters;
        } else {
          // Deduplicate when appending
          const existingIds = new Set(state.characters.map(c => c.id));
          const newCharacters = characters.filter(c => !existingIds.has(c.id));
          state.characters = [...state.characters, ...newCharacters];
        }
        state.page = page;
        state.totalPages = totalPages;
        state.hasMore = hasMore;
        state.loading = false;
        state.loadingMore = false;
        state.refreshing = false;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.refreshing = false;
        state.error = (action.payload as string) || 'An error occurred';
      });
  },
});

export const {setSearchQuery, setStatusFilter, resetCharacters} =
  charactersSlice.actions;
export default charactersSlice.reducer;
