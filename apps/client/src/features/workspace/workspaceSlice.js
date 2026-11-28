import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getMyWorkspaces,
  createWorkspace as createWorkspaceAPI,
} from "./workspace.service";

const initialState = {
  workspaces: [],
  isLoading: false,
  isCreating: false,
  error: null,
};

// Fetch user's workspaces
export const fetchMyWorkspaces = createAsyncThunk(
  "workspace/fetchMyWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyWorkspaces();
      return response.workspaces;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workspaces",
      );
    }
  },
);

// Create workspace
export const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  async (workspaceData, { rejectWithValue }) => {
    try {
      const response = await createWorkspaceAPI(workspaceData);
      return {
        workspace: response.workspace,
        role: response.role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create workspace",
      );
    }
  },
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,

  reducers: {
    clearWorkspaceError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch workspaces
      .addCase(fetchMyWorkspaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchMyWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create workspace
      .addCase(createWorkspace.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.isCreating = false;

        state.workspaces.unshift({
          workspace: action.payload.workspace,
          role: action.payload.role,
          joinedAt: action.payload.workspace.createdAt,
        });
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      });
  },
});

export const { clearWorkspaceError } = workspaceSlice.actions;

export default workspaceSlice.reducer;