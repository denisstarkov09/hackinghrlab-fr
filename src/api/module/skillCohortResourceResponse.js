import httpClient from "./httpClient";

export const getAllResourceResponses = async (data) => {
  const { SkillCohortResourceId, SkillCohortParticipantId } = data;

  return await httpClient.get(
    `private/skill-cohort/resource/${SkillCohortResourceId}/responses/${SkillCohortParticipantId}`
  );
};

export const getResourceResponse = async (data) => {
  const { SkillCohortResourceId, SkillCohortParticipantId } = data;

  return await httpClient.get(
    `private/skill-cohort/resource/${SkillCohortResourceId}/participant/${SkillCohortParticipantId}/response`
  );
};

export const createResourceResponse = async (data) => {
  const { SkillCohortResourceId } = data;

  return await httpClient.post(
    `private/skill-cohort/resource/${SkillCohortResourceId}/response`,
    { ...data }
  );
};

export const updateResourceResponse = async (data) => {
  const { SkillCohortResourceResponseId, response } = data;

  return await httpClient.put(
    `private/skill-cohort/response/${SkillCohortResourceResponseId}`,
    { ...response }
  );
};
