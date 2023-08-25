import httpClient from "./httpClient";

export const createConversation = (data) => {
  return httpClient.post(`private/conversations`, data);
};

export const getConversations = ({ id }) => {
  return httpClient.get(`private/conversations/${id}`);
};

export const getConversation = ({ conversationId }) => {
  return httpClient.get(`private/conversation/${conversationId}`);
};

export const readMessages = ({ id, ConversationId }) => {
  return httpClient.put(`private/messages/${ConversationId}`, {
    userId: id,
  });
};

export const getMoreMessages = ({ offset, ConversationId }) => {
  return httpClient.get(`private/more-messages/${ConversationId}`, {
    params: {
      offset,
    },
  });
};

export const hideConversation = ({ conversationId }) => {
  return httpClient.put(`private/conversation/${conversationId}`);
};
