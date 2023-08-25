import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as simulationSprintsConstants } from "../actions/simulationSprint-actions";

export const reducers = {
  [simulationSprintsConstants.SET_ALL_SIMULATION_SPRINTS]: (
    state,
    { payload }
  ) => {
    return state.merge({ allSimulationSprints: payload.allSimulationSprints });
  },
  [simulationSprintsConstants.SET_SIMULATION_SPRINT]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [simulationSprintsConstants.SET_ALL_MY_SIMULATION_SPRINTS]: (
    state,
    { payload }
  ) => {
    return state.merge({
      mySimulationsSprints: payload.simulationSprintOfUser,
    });
  },
};

export const initialState = () => {
  return Map({
    allSimulationSprints: [],
    mySimulationsSprints: [],
    simulationSprint: {},
  });
};

export default handleActions(reducers, initialState());
