import httpClient from "./httpClient";

export const getBusinessPartnerMembersFromAPI = () => {
  return httpClient.get(`private/business-partner/members`);
};

export const getBusinessPartnerResourcesFromAPI = (filter, order) => {
  return httpClient.get(`private/business-partner/resources`);
};

export const getBusinessPartnerResourceByIdFromAPI = (payload) => {
  return httpClient.get(`private/business-partner/resource/${payload.id}`);
};

export const deleteBusinessPartnerResourceByIdFromAPI = (id) => {
  return httpClient.delete(`private/business-partner/resource/${id}`);
};

export const updateBusinessPartnerResourceFromAPI = (payload) => {
  return httpClient.put(`private/business-partner/resource/${payload.id}`, {
    payload,
  });
};

export const getBusinessPartnerDocumentsFromAPI = () => {
  return httpClient.get("private/business-partner/documents");
};

export const deleteBusinessPartnerDocumentFromAPI = (payload) => {
  return httpClient.delete(
    `private/business-partner/delete-document/${payload.documentId}`,
    { params: payload }
  );
};

export const uploadBusinessPartnerDocumentFileFromAPI = ({ documentFile }) => {
  return httpClient.put(
    "private/business-partner/upload-document",
    documentFile.formData,
    { params: documentFile }
  );
};

export const createBusinessPartnerDocumentFromAPI = (document) => {
  const file = document.file;
  return httpClient.post(`private/business-partner/create-document`, file, {
    params: document.values,
  });
};

export const createBusinessPartnerResourceFromAPI = (data) => {
  return httpClient.post(`private/business-partner/add-resources`, data);
};
