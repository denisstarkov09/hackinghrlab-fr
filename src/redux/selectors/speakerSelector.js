import { createSelector } from "reselect";

const speakerSelector = (state) => state.speakers;

const resultSelector = createSelector(speakerSelector, (payload) => {
  return {
    allPanelSpeakers: payload.get("allPanelSpeakers"),
    allPanelSpeakersFormat: payload.get("allPanelSpeakersFormat"),
    allUserSpeakers: payload.get("allUserSpeakers"),
    allPanelsOfOneUser: payload.get("allPanelsOfOneUser"),
    allPanelsOfOneUserFormat: payload.get("allPanelsOfOneUserFormat"),
    bulRegister: payload.get("bulRegister"),
    allSponsors: payload.get("allSponsors"),
    activeButton: payload.get("activeButton"), 
    allParrafs: payload.get("allParrafs"),
    allMember: payload.get("allMember"),
    allMyPanels: payload.get("allMyPanels")
  };
});

export const speakerAllPanelSpeakerSelector = (state) => ({
  ...resultSelector(state),
});