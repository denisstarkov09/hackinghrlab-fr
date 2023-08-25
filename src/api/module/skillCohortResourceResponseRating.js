import httpClient from "./httpClient";

export const getAllResponseRating = async (data) => {
  const { SkillCohortResourceId, SkillCohortParticipantId } = data;

  return await httpClient.get(
    `private/skill-cohort/resource/${SkillCohortResourceId}/participant/${SkillCohortParticipantId}/ratings`
  );
};

export const upsertResponseRating = async (data) => {
  const { skillCohortResourceResponseRating } = data;

  return await httpClient.post(`private/skill-cohort/response/rating`, {
    ...skillCohortResourceResponseRating,
  });
};
