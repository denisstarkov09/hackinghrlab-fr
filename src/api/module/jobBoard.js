import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllJobPosts = async (data) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (data.filter) {
    newFilter = {
      ...newFilter,
      ...data.filter,
    };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(`private/job-board/job-posts?${parsedFilter}`);
};

export const getJobPost = async (data) => {
  const { JobPostId } = data;

  return await httpClient.get(`private/job-board/job-post/${JobPostId}`);
};

export const upsertJobPost = async (data) => {
  const { jobPost } = data;

  return await httpClient.post(`private/job-board/job-post`, jobPost);
};

export const getMyJobPosts = async (data) => {
  const parsedFilter = Object.keys(data.filter)
    .map((item) => `${item}=${data.filter[item]}`)
    .join("&");

  return await httpClient.get(`private/job-board/my-job-posts?${parsedFilter}`);
};

export const invitationToApply = async (data) => {
  return await httpClient.post(`private/job-board/invitation-to-apply`, {
    ...data,
  });
};