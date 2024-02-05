import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface EditorState {
  isBlockSelectionActive: boolean;
  isBlockSelected: boolean;
}

const initialState = {
  isBlockSelectionActive: false,
  isBlockSelected: false
} as EditorState;

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setBlockSelectionActive(state, action: PayloadAction<boolean>) {
      state.isBlockSelectionActive = action.payload;
    },
    setBlockSelected(state, action: PayloadAction<boolean>) {
      state.isBlockSelected = action.payload;
    },
  },
});

export const selectEditor = (state: RootState) => state.editor;

export const selectIsBlockSelectionActive = createSelector(
  [selectEditor],
  (editor) => editor.isBlockSelectionActive
);

export const selectIsBlockSelected = createSelector(
  [selectEditor],
  (editor) => editor.isBlockSelected
);

export const {
  setBlockSelectionActive,
  setBlockSelected,
} = editorSlice.actions;
export default editorSlice.reducer;
