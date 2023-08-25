import { createSelector } from "reselect";

const skillCohortParticipantData = (state) => state.skillCohortParticipant;

const resultSelector = createSelector(skillCohortParticipantData, (payload) => {
  return {
    allSkillCohortParticipants: payload.get("allSkillCohortParticipants"),
    skillCohortParticipant: payload.get("skillCohortParticipant"),
    allParticipated: payload.get("allParticipated"),
  };
});

export const skillCohortParticipantSelector = (state) => ({
  ...resultSelector(state),
});
