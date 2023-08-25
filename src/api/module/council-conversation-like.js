import httpClient from "./httpClient";

export const createCouncilConversationLike = (data) => {
  return httpClient.post(`private/council-conversation/like`, {
    CouncilConversationId: data,
  });
};

export const deleteCouncilConversationLike = (data) => {

  return httpClient.delete(
    `private/council-conversation/like/${data}`
  );
};
