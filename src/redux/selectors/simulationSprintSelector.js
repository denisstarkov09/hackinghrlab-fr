import { createSelector } from "reselect";

const simulationSprintDataSelector = (state) => state.simulationSprint;

const resultSelector = createSelector(
  simulationSprintDataSelector,
  (payload) => {
    return {
      allSimulationSprints: payload.get("allSimulationSprints"),
      simulationSprint: payload.get("simulationSprint"),
      mySimulationsSprints: payload.get("mySimulationsSprints"),
    };
  }
);

export const simulationSprintSelector = (state) => ({
  ...resultSelector(state),
});
