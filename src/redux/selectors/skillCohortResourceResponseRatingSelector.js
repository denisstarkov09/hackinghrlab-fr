import { createSelector } from "reselect";

const skillCohortResourceResponseRatingData = (state) =>
  state.skillCohortResourceResponseRating;

const resultSelector = createSelector(
  skillCohortResourceResponseRatingData,
  (payload) => {
    return {
      allSkillCohortResourceResponseRatings: payload.get(
        "allSkillCohortResourceResponseRatings"
      ),
    };
  }
);

export const skillCohortResourceResponseRatingSelector = (state) => ({
  ...resultSelector(state),
});
