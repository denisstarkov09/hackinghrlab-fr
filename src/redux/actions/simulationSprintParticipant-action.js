import { createAction } from "redux-actions";

const CREATE_SIMULATION_SPRINT_PARTICIPANT =
  "CREATE_SIMULATION_SPRINT_PARTICIPANT";

export const constants = {
  CREATE_SIMULATION_SPRINT_PARTICIPANT,
};

export const createSimulationSprintParticipant = createAction(
  CREATE_SIMULATION_SPRINT_PARTICIPANT,
  (data, callback) => ({
    data,
    callback,
  })
);

export const actions = {
  createSimulationSprintParticipant,
};
