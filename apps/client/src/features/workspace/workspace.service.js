
import api from "../../services/api";

export const getMyWorkspaces = async () => {
  const { data } = await api.get("/workspaces");
  return data;
};

export const createWorkspace = async (workspaceData) => {
  const { data } = await api.post("/workspaces", workspaceData);
  return data;
};

export const getWorkspaceById = async (workspaceId) => {
  const { data } = await api.get(`/workspaces/${workspaceId}`);
  return data;
};