import { createAction } from "redux-actions";

const UPSERT_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT =
  "UPSERT_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT";
const SET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT =
  "SET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT";
const GET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT =
  "GET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT";

export const constants = {
  UPSERT_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
  SET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
  GET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
};

const upsertSkillCohortResourceResponseAssessment = createAction(
  UPSERT_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
  (payload) => ({ payload })
);
const getSkillCohortResourceResponseAssessment = createAction(
  GET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
  (SkillCohortResourceId, SkillCohortParticipantId, ids) => ({
    SkillCohortResourceId,
    SkillCohortParticipantId,
    ids,
  })
);
const setAllSkillCohortResourceResponseAssessment = createAction(
  SET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
  (allSkillCohortResourceResponseAssessments) => ({
    allSkillCohortResourceResponseAssessments,
  })
);

export const actions = {
  upsertSkillCohortResourceResponseAssessment,
  setAllSkillCohortResourceResponseAssessment,
  getSkillCohortResourceResponseAssessment,
};
