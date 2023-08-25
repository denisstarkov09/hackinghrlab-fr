import httpClient from "./httpClient";

export const upsertCouncilConversationComment = (data) => {
  return httpClient.post(`private/council-conversation/comment`, data);
};

export const deleteCouncilConversationComment = (data) => {
  return httpClient.put(
    `private/council-conversation/comment/${data.CouncilConversationCommentId}`,
    { ...data }
  );
};
