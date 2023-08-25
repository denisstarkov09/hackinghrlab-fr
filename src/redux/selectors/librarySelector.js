import { createSelector } from "reselect";

const libraryDataSelector = (state) => state.library;

const resultSelector = createSelector(libraryDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allLibraries: payload.get("allLibraries"),
    error: payload.get("error"),
    selectedLibrary: payload.get("selectedLibrary"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
    recommendations: payload.get("recommendations"),
    allCompletedLibraries: payload.get("allCompletedLibraries"),
    allSaveForLaterLibraries: payload.get("allSaveForLaterLibraries"),
    allLibrariesArticle: payload.get("allLibrariesArticle"),
    currentPagueArticle: payload.get("currentPagueArticle"),
    countOfResultsArticle: payload.get("countOfResultsArticle")
  };
});

export const librarySelector = (state) => ({
  ...resultSelector(state),
});
