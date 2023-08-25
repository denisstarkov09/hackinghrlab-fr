import httpClient from "./httpClient";
export const createBlogPost = ({ blogpost }) => {
  return httpClient.post(`private/blogpost`, { ...blogpost });
};

export const searchBlogPost = ({ filters = {}, page }) => {
  let params = {
    ...filters,
    page: page || 1,
  };

  const parsedFilter = Object.keys(params)
    .map((item) => `${item}=${params[item]}`)
    .join("&");

  return httpClient.get(`public/blogpost?${parsedFilter}`);
};

export const getBlogPostByChannelId = ({ ChannelId }) => {
  return httpClient.get(`public/blogpost/${ChannelId}`);
};

export const getBlogPost = (blogPostId) => {
  return httpClient.get(`private/blogpost/blog/${blogPostId}`);
};

export const updateBlogPost = ({ blogPostId, data }) => {
  return httpClient.put(`private/blogpost/${blogPostId}`, {
    ...data,
  });
};

export const deleteBlogPost = ({ blogPostId }) => {
  return httpClient.delete(`private/blogpost/${blogPostId}`);
};
