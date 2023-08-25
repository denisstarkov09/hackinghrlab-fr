import { combineReducers } from "redux";

import homeReducer from "./homeReducer";
import certificateReducer from './certificateReducer'
import envReducer from "./envReducer";
import authReducer from "./authReducer";
import eventReducer from "./eventReducer";
import libraryReducer from "./libraryReducer";
import mentoringReducer from "./mentoringReducer";
import podcastReducer from "./podcastReducer";
import marketplaceReducer from "./marketplaceReducer";
import councilReducer from "./councilReducer";
import councilCommentsReducer from "./councilCommentsReducer";
import marketplaceCategoriesReducer from "./marketplaceCategoriesReducer";
import categoryReducer from "./categoryReducer";
import conferenceReducer from "./conferenceReducer";
import journeyReducer from "./journeyReducer";
import journeyItemReducer from "./journeyItemReducer";
import channelReducer from "./channelReducer";
import channelCategoryReducer from "./channelCategoryReducer";
import courseReducer from "./courseReducer";
import courseClassUser from "./courseClassUserReducer";
import notificationReducer from "./notificationReducer";
import sessionReducer from "./sessionReducer";
import liveReducer from "./liveReducer";
import postReducer from "./postReducer";
import postCommentReducer from "./postCommentReducer";
import bonfireReducer from "./bonfireReducer";
import skillCohortReducer from "./skillCohortReducer";
import skillCohortParticipantReducer from "./skillCohortParticipantReducer";
import skillCohortResourceReducer from "./skillCohortResourceReducer";
import skillCohortResourceResponseReducer from "./skillCohortResourceResponseReducer";
import skillCohortResourceResponseAssessmentReducer from "./skillCohortResourceResponseAssessmentReducer";
import skillCohortResourceResponseRating from "./skillCohortResourceResponseRatingReducer";
import myLearningReducer from "./myLearningReducer";
import partnerReducer from "./partnersReducer";
import jobBoardReducer from "./jobBoardReducer";
import sessionClassUserReducer from "./sessionClassUserReducer";
import marketplaceProfileReducer from "./marketplaceProfileReducer";
import conversationReducer from "./conversationReducer";
import businessPartnerReducer from "./businessPartnerReducer";
import businessPartnerCommentsReducer from "./businessPartnerCommentsReducer";
import advertisementReducer from "./advertisementsReducer";
import matchmakingReducer from "./matchmakingReducer";
import councilEventReducer from "./councilEventReducer";
import councilConversationReducer from "./councilConversationReducer";
import speakersReducer from "./speakersReducer";
import blogPostReducer from "./blogPostReducer";
import simulationSprintReducer from "./simulationSprintReducer";

export default combineReducers({
  certificate: certificateReducer,
  speakers: speakersReducer,
  home: homeReducer,
  council: councilReducer,
  councilComment: councilCommentsReducer,
  businessPartner: businessPartnerReducer,
  businessPartnerComment: businessPartnerCommentsReducer,
  env: envReducer,
  auth: authReducer,
  event: eventReducer,
  library: libraryReducer,
  mentoring: mentoringReducer,
  podcast: podcastReducer,
  marketplace: marketplaceReducer,
  marketplaceCategories: marketplaceCategoriesReducer,
  category: categoryReducer,
  conference: conferenceReducer,
  journey: journeyReducer,
  journeyItem: journeyItemReducer,
  channel: channelReducer,
  channelCategory: channelCategoryReducer,
  course: courseReducer,
  courseClassUser: courseClassUser,
  notification: notificationReducer,
  session: sessionReducer,
  live: liveReducer,
  post: postReducer,
  postComment: postCommentReducer,
  bonfires: bonfireReducer,
  skillCohort: skillCohortReducer,
  skillCohortParticipant: skillCohortParticipantReducer,
  skillCohortResource: skillCohortResourceReducer,
  skillCohortResourceResponse: skillCohortResourceResponseReducer,
  skillCohortResourceResponseAssessment:
    skillCohortResourceResponseAssessmentReducer,
  skillCohortResourceResponseRating: skillCohortResourceResponseRating,
  myLearning: myLearningReducer,
  partner: partnerReducer,
  jobBoard: jobBoardReducer,
  sessionClassUser: sessionClassUserReducer,
  marketplaceProfile: marketplaceProfileReducer,
  conversation: conversationReducer,
  advertisement: advertisementReducer,
  matchmaking: matchmakingReducer,
  councilEvent: councilEventReducer,
  councilConversation: councilConversationReducer,
  blogPost: blogPostReducer,
  simulationSprint: simulationSprintReducer,
});
