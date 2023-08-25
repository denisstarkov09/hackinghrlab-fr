import httpClient from "./httpClient";

export const getParticipated = async (data) => {
  const { UserId } = data;
  if (UserId)
    return await httpClient.get(`private/skill-cohort/participant/${UserId}`);
};

export const getAllSkillCohortParticipants = async (data) => {
  const { SkillCohortId } = data;

  return await httpClient.get(
    `private/skill-cohort/${SkillCohortId}/participants`
  );
};

export const getSkillCohortParticipant = async (data) => {
  const { UserId, SkillCohortId } = data;

  return await httpClient.get(
    `private/skill-cohort/${SkillCohortId}/participant/${UserId}`
  );
};

export const createSkillCohortParticipant = async (data) => {
  return await httpClient.post(`private/skill-cohort/participant`, { ...data });
};

export const withdrawParticipation = async (data) => {
  const { SkillCohortParticipantId } = data;

  return await httpClient.delete(
    `private/skill-cohort/participant/${SkillCohortParticipantId}`
  );
};
