import { createSelector } from "reselect";

const skillCohortResourceResponseAssessmentData = (state) =>
  state.skillCohortResourceResponseAssessment;

const resultSelector = createSelector(
  skillCohortResourceResponseAssessmentData,
  (payload) => {
    return {
      allSkillCohortResourceResponseAssessments: payload.get(
        "allSkillCohortResourceResponseAssessments"
      ),
    };
  }
);

export const skillCohortResourceResponseAssessmentSelector = (state) => ({
  ...resultSelector(state),
});
