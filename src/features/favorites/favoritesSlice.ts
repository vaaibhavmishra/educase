import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Character} from '../characters/types';

interface FavoritesState {
  /** Map of character ID → Character for O(1) lookup */
  byId: Record<number, Character>;
  /** Ordered list of favorite character IDs */
  ids: number[];
}

const initialState: FavoritesState = {
  byId: {},
  ids: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Character>) {
      const character = action.payload;
      const index = state.ids.indexOf(character.id);

      if (index >= 0) {
        // Remove from favorites
        state.ids.splice(index, 1);
        delete state.byId[character.id];
      } else {
        // Add to favorites
        state.ids.push(character.id);
        state.byId[character.id] = character;
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index >= 0) {
        state.ids.splice(index, 1);
        delete state.byId[id];
      }
    },
    clearAllFavorites(state) {
      state.byId = {};
      state.ids = [];
    },
  },
});

export const {toggleFavorite, removeFavorite, clearAllFavorites} =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
