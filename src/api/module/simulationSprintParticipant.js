import httpClient from "./httpClient";

export const createSimulationSprintParticipant = async ({ data }) => {
  return await httpClient.post(`private/simulation-sprint/participant`, {
    ...data,
  });
};
