import httpClient from "./httpClient";

export const upsertSkillCohortResourceResponseAssessment = async (data) => {
  return await httpClient.post(
    `private/skill-cohort/resource/assessment/upsert`,
    data
  );
};

export const getAllSkillCohortResourceResponseAssessment = async (data) => {
  const { SkillCohortResourceId, SkillCohortParticipantId, ids } = data;

  const parsedIds = Object.keys(ids)
    .map((item) => `${item}=${ids[item]}`)
    .join("&");

  return await httpClient.get(
    `private/skill-cohort/resource/${SkillCohortResourceId}/participant/${SkillCohortParticipantId}/assessments?${parsedIds}`
  );
};
