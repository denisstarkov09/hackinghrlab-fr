import httpClient from "./httpClient";

export const upsertCouncilConversationReply = (data) => {
  return httpClient.post(`private/council-conversation/reply`, data);
};

export const deleteCouncilConversationReply = (data) => {
  return httpClient.put(
    `private/council-conversation/reply/${data.CouncilConversationReplyId}`,
    { ...data }
  );
};
