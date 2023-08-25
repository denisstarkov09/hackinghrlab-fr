import { createSelector } from "reselect";

const matchmakingDataSelector = (state) => state.matchmaking;

const resultSelector = createSelector(matchmakingDataSelector, (payload) => {
  return {
    matchmakingUsers: payload.get("matchmakingUsers"),
  };
});

export const matchmakeSelector = (state) => ({
  ...resultSelector(state),
});
