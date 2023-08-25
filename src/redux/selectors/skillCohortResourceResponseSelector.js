import { createSelector } from "reselect";

const skillCohortResourceResponseDataSelector = (state) =>
  state.skillCohortResourceResponse;

const resultSelector = createSelector(
  skillCohortResourceResponseDataSelector,
  (payload) => {
    return {
      allSkillCohortResourceResponses: payload.get(
        "allSkillCohortResourceResponses"
      ),
      skillCohortResourceResponse: payload.get("skillCohortResourceResponse"),
    };
  }
);

export const skillCohortResourceResponseSelector = (state) => ({
  ...resultSelector(state),
});
