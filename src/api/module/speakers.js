import httpClient from "./httpClient";

export const addUserSpeakerToPanelEndPoint = (payload) => {
  return httpClient.post("private/speakers/add-speaker-to-panel", {
    ...payload,
  });
}

export const allPanelSpeakersEndPonit = (payload) => {
  return httpClient.get(`public/speakers/all-panel/${payload.type}`)
}

export const getAllUserSpeakerEndPoint = (payload) => {
  return httpClient.get(`public/speakers/all-users-speakers/${payload.UserId}`)
}

export const getAllParrafsEndPoint = (payload) => {
  return httpClient.get(`public/speakers/get-all-parrafs/${payload.type}`)
}

export const removeUserSpeakerToPanelEndPoint = (payload) => {
  return httpClient.post("private/speakers/remove-user-panel", {
    ...payload,
  })
}

export const registerUserIfNotAreRegisterConference2023EndPoint = () => {
  return httpClient.post("private/speakers/send-email-register-conference")
}

export const getAllPanelsOfOneUserEndPoint = (UserId) => {
  return httpClient.get(`public/speakers/all-panel-of-user`, {
    params: {
      id: UserId.UserId.id,
      type: UserId.UserId.type
    }
  })
}

export const getAllMyPanels = () => {
  return httpClient.get(`private/speakers/all-my-panel-of-user`)
}

export const getAllMemberSpeakerPanelEndPoint = () => {
  return httpClient.get(`private/speakers/get-member-speakers-of-one-user`)
}

export const getAllSponsors2023EndPoint = () => {
  return httpClient.get(`public/speakers/get-all-sponsor`)  
}

export const addedToPersonalAgendaEndPoint = (payload) => {
  return httpClient.post("private/speakers/added-to-agenda", {
    ...payload,
  })
}