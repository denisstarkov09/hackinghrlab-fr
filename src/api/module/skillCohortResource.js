import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllResources = async (data) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (data.filter) {
    newFilter = { ...newFilter, ...data.filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(
    `private/skill-cohort/${data.SkillCohortId}/resources?${parsedFilter}`
  );
};

export const getEntireResources = async (data) => {

  return await httpClient.get(
    `private/skill-cohort/resources/${data.SkillCohortId}/entire`
  );
};

export const getResource = async (data) => {
  const { SkillCohortResourceId } = data;

  return await httpClient.get(
    `private/skill-cohort/resource/${SkillCohortResourceId}`
  );
};
