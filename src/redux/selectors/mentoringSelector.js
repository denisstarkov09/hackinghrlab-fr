import { createSelector } from "reselect";

const mentoringDataSelector = (state) => state.mentoring;

const resultSelector = createSelector(mentoringDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    mentorInfo: payload.get("mentorInfo"),
    menteeInfo: payload.get("menteeInfo"),
    allMentors: payload.get("allMentors"),
    allMentees: payload.get("allMentees"),
    countOfResults1: payload.get("countOfResults1"),
    currentPage1: payload.get("currentPage1"),
    countOfResults2: payload.get("countOfResults2"),
    currentPage2: payload.get("currentPage2"),
    mentorLoading: payload.get("mentorLoading"),
    menteeLoading: payload.get("menteeLoading"),
  };
});

export const mentoringSelector = (state) => ({
  ...resultSelector(state),
});
