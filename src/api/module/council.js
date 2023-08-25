import httpClient from "./httpClient";

export const getCouncilMembersFromAPI = () => {
  return httpClient.get(`public/council/members`);
};

export const getCouncilResourcesFromAPI = (filter, order) => {
  return httpClient.get(`private/council/resources`);
};

export const getCouncilResourceByIdFromAPI = (payload) => {
  return httpClient.get(`private/council/resource/${payload.id}`);
};

export const createCouncilResourceFromAPI = (data) => {
  return httpClient.post(`private/council/add-resources`, data);
};

export const sendEmailsForPartOfCouncilEndPoint = (data) => {
  return httpClient.post(`public/council/sendEmails`, data);
}

export const exportsMembersCouncil = ({ idEvent }) => {
  return httpClient({
    method: 'GET',
    url: `private/council/downloadExcel/${idEvent}`,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/json' },
  })
}


export const sendEmailAttendeeEventOwnerEndPoint = (data) => {
  return httpClient.post(`private/email/attendee/council`, data)
}

export const addDraftEmailEventEndPoint = (payload) => {
  const { draftEmail } = payload
  return httpClient.post(`private/council/add-email-draft`, {
    draftEmail
  })
}

export const getAllDraftEmailEventEndPoint = (payload) => {
  return httpClient.get(`private/council/get-all-email-draft/${payload.id}`)
}

export const searchUsersEventsEndPoint = (payload) => {
  return httpClient.get(`private/council/searh-user/${payload.idEvent}`)
}

export const deleteDraftEmailEventEndPoint = (payload) => {
  return httpClient.delete(`private/council/delete-email-draft/${payload.draftEmailId}`)
}

export const getAllSendEmailEventEndPoint = () => {
  return httpClient.get(`private/council/get-all-email-send`)
}