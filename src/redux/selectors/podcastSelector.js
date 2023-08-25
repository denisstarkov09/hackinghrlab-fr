import { createSelector } from "reselect";

const podcastDataSelector = (state) => state.podcast;

const resultSelector = createSelector(podcastDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allEpisodes: payload.get("allEpisodes"),
    allPodcastSeries: payload.get("allPodcastSeries"),
    podcastSeries: payload.get("podcastSeries"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
    podcast: payload.get("podcast"),
  };
});

export const podcastSelector = (state) => ({
  ...resultSelector(state),
});
