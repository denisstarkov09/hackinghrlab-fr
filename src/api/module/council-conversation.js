import qs from "query-string";
import httpClient from "./httpClient";

export const upsertCouncilConversation = (data) => {
  return httpClient.post(`private/council-conversation`, { ...data });
};

export const getCouncilConversation = (data) => {
  return httpClient.get(
    `private/council-conversation/${data.CouncilConversationId}`
  );
};

export const getCouncilConversations = (data) => {
  const filters = qs.stringify(data, {arrayFormat: 'comma'});

  return httpClient.get(
    `private/council-conversations?filters=${filters}`
  );
};

export const deleteCouncilConversation = (data) => {
  return httpClient.delete(
    `private/council-conversation/${data.CouncilConversationId}`
  );
};
