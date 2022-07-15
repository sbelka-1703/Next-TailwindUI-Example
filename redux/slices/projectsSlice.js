import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../pages/api/axios";
import findProjects from "./graphql/project/queries/findProjects";
import {arrayToString} from "../tools/transformations";


const initialState = {
  isDataAvailable: false,
  loading: true,
  numberOfProjects: 0,
  projectsInfo: [],
};



export const findProjects_red = createAsyncThunk("findProjects_red", async (params) => {

  if (params._id) {
      params = {
          ...params,
          _id: arrayToString(params._id),
      };
  }
  
  const response = await apiClient(findProjects(params));

  return response.data.data.findProjects;
});

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: {
    [findProjects_red.pending]: (state) => {
      state.loading = true;
    },
    [findProjects_red.fulfilled]: (state, { payload }) => {
      state.isDataAvailable = true;
      state.loading = false;
      
      state.numberOfProjects = payload.length;
      state.projectsInfo = payload;
    },
  },
});

export default projectsSlice.reducer;
