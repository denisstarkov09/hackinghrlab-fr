import { createAction } from "redux-actions";

const GET_ALL_RESPONSE_RATING = "GET_ALL_RESPONSE_RATING";
const SET_ALL_RESPONSE_RATING = "SET_ALL_RESPONSE_RATING";
const UPSERT_RESPONSE_RATING = "UPSERT_RESPONSE_RATING";

export const constants = {
  GET_ALL_RESPONSE_RATING,
  SET_ALL_RESPONSE_RATING,
  UPSERT_RESPONSE_RATING,
};

const getAllResponseRating = createAction(
  GET_ALL_RESPONSE_RATING,
  (SkillCohortResourceId, SkillCohortParticipantId) => ({
    SkillCohortResourceId,
    SkillCohortParticipantId,
  })
);
const setAllResponseRating = createAction(
  SET_ALL_RESPONSE_RATING,
  (allSkillCohortResourceResponseRatings) => ({
    allSkillCohortResourceResponseRatings,
  })
);
const upsertResponseRating = createAction(
  UPSERT_RESPONSE_RATING,
  (skillCohortResourceResponseRating) => ({
    skillCohortResourceResponseRating,
  })
);

export const actions = {
  getAllResponseRating,
  setAllResponseRating,
  upsertResponseRating,
};
