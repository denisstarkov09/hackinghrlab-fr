import httpClient from "./httpClient";

export const getAllSkillCohorts = async (filter) => {
  let newFilter = {};

  if (filter) {
    newFilter = { ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(`private/skill-cohort?${parsedFilter}`);
};

export const getSkillCohort = async (id) => {
  return await httpClient.get(`private/skill-cohort/${id}`);
};

export const getAllOfMyCohort = async (data) => {
  const { UserId } = data;

  return await httpClient.get(`private/skill-cohort/my-cohort/${UserId}`);
};
