import httpClient from "./httpClient";

export const getAll = async (data) => {
  let newFilter = {};

  if (data.filter) {
    newFilter = { ...data.filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(`private/courses?${parsedFilter}`);
};

export const get = async (id) => {
  return await httpClient.get(`private/course/${id}`);
};

export const getCourseClasses = async (course) => {
  return await httpClient.get(`private/course-classes/${course}`);
};

export const getCourseInstructors = async (course) => {
  return await httpClient.get(`private/course-instructors/${course}`);
};

export const getCourseSponsors = async (course) => {
  return await httpClient.get(`private/course-sponsors/${course}`);
};

export const claimCourse = ({ id, pdf }) => {
  return httpClient.post(`private/course/claim`, { id, pdf });
};
