import httpClient from "./httpClient";

export const getAllSimulationSprints = async ({ filters }) => {
  return await httpClient.get(`private/simulation-sprints`, {
    params: {
      ...filters,
    },
  });
};

export const getSimulationSprint = async ({ id }) => {
  return await httpClient.get(`private/simulation-sprints/${id}`);
};

export const getAllSimulationSprintOfUser = async () => {
  return await httpClient.get(`private/simulation-sprint-by-user`);
};
