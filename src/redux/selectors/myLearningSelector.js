import { createSelector } from "reselect";

const myLearningDataSelector = (state) => state.myLearning;

const resultSelector = createSelector(myLearningDataSelector, (payload) => {
  return {
    allSaved: payload.get("allSaved"),
    allCompleted: payload.get("allCompleted"),
    allItemsWithHRCredits: payload.get("allItemsWithHRCredits"),
    allItemsWithHRCreditsCurrentPage: payload.get(
      "allItemsWithHRCreditsCurrentPage"
    ),
    allLibraries: payload.get('allLibraries'),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
    loading: payload.get("loading"),
    allEventVideos: payload.get("allEventVideos"),
    allEventVideosCurrentPage: payload.get("allEventVideosCurrentPage"),
    allCompletedCurrentPage: payload.get("allCompletedCurrentPage"),
    allSavedCurrentPage: payload.get("allSavedCurrentPage")
  };
});

export const myLearningSelector = (state) => ({
  ...resultSelector(state),
});
