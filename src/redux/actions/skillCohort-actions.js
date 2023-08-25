import { createAction } from "redux-actions";

const GET_ALL_SKILL_COHORT = "GET_ALL_SKILL_COHORT";
const GET_SKILL_COHORT = "GET_SKILL_COHORT";
const SET_ALL_SKILL_COHORT = "SET_ALL_SKILL_COHORT";
const SET_SKILL_COHORT = "SET_SKILL_COHORT";
const GET_ALL_OF_MY_COHORT = "GET_ALL_OF_MY_COHORT";
const SET_ALL_OF_MY_COHORT = "SET_ALL_OF_MY_COHORT";

export const constants = {
  GET_ALL_SKILL_COHORT,
  GET_SKILL_COHORT,
  SET_ALL_SKILL_COHORT,
  SET_SKILL_COHORT,
  GET_ALL_OF_MY_COHORT,
  SET_ALL_OF_MY_COHORT,
};

export const getAllSkillCohorts = createAction(
  GET_ALL_SKILL_COHORT,
  (filter) => ({ filter })
);
export const getSkillCohort = createAction(GET_SKILL_COHORT, (id) => ({ id }));
export const setAllSkillCohorts = createAction(
  SET_ALL_SKILL_COHORT,
  (allSkillCohorts) => ({ allSkillCohorts })
);
export const setSkillCohort = createAction(SET_SKILL_COHORT, (skillCohort) => ({
  skillCohort,
}));
export const getAllOfMyCohort = createAction(
  GET_ALL_OF_MY_COHORT,
  (UserId) => ({ UserId })
);
const setAllOfMyCohort = createAction(
  SET_ALL_OF_MY_COHORT,
  (allOfMySkillCohorts) => ({ allOfMySkillCohorts })
);

export const actions = {
  getAllSkillCohorts,
  getSkillCohort,
  setAllSkillCohorts,
  setSkillCohort,
  getAllOfMyCohort,
  setAllOfMyCohort,
};
