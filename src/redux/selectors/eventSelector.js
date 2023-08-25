import { createSelector } from "reselect";

const eventDataSelector = (state) => state.event;

const resultSelector = createSelector(eventDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allEvents: payload.get("allEvents"),
    metadata: payload.get("metadata"),
    allLiveEvents: payload.get("allLiveEvents"),
    liveEvent: payload.get("liveEvent"),
    updatedEvent: payload.get("updatedEvent"),
    error: payload.get("error"),
    myEvents: payload.get("myEvents"),
    channelEvents: payload.get("channelEvents"),
    allEventsChannels: payload.get("allEventsChannels"),
    eventSelected: payload.get('eventSelected'),
  };
});

export const eventSelector = (state) => ({
  ...resultSelector(state),
});
