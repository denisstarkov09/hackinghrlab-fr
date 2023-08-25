import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

import { constants as channelConstants } from "../actions/channel-actions";

export const reducers = {
  [channelConstants.SET_CHANNEL]: (state, { payload }) => {

    if(payload.channel.channel){
      return state.merge({ 
        selectedChannel: payload.channel.channel, 
        followers: payload.channel.followers
      });
    }else{
      return state.merge({ 
        selectedChannel: payload.channel, 
      });
    }
  },
  [channelConstants.SET_CHANNEL_INVITATIONS]: (state, {payload}) => {
    const {invitations} = payload
    const selectChannel = state.get("selectedChannel");

    selectChannel['invitationsSends'] = invitations

    return state.merge({
      selectedChannel: selectChannel,
    })

  },
  [channelConstants.UPDATE_ALL_EMAIL_DRAFTS]: (state, {payload}) => {
    const {draftEmailResponse,bul} = payload.draftEmailResponse
    const emailDraft = state.get("emailDraftChannel");

    if(bul === true){
      return state.merge({
        emailDraftChannel: [draftEmailResponse, ...emailDraft],
      })
    }else{
      return state.merge({
        emailDraftChannel: draftEmailResponse,
      })
    }
  },
  [channelConstants.UPDATE_ALL_EMAIL_SENDS]: (state, {payload}) => {
    const {draftEmailResponse,bul} = payload.draftEmailResponse
    const emailDraft = state.get("emailSendChannel");

    if(bul === true){
      return state.merge({
        emailSendChannel: [draftEmailResponse, ...emailDraft],
      })
    }else{
      return state.merge({
        emailSendChannel: draftEmailResponse,
      })
    }
  },
  [channelConstants.SET_CHANNEL_EDITOR]: (state, { payload }) => {
    return state.merge({
      userChannelEditor: payload.channelEditor
    });
  },
  [channelConstants.SET_FIRST_CHANNEL_LIST]: (state, { payload }) => {
    return state.merge({
      allChannels: cloneDeep([...payload.data]),
      currentPage: payload.page,
      countOfResults: payload.num,
    });
  },
  [channelConstants.SET_MORE_CHANNEL_LIST]: (state, { payload }) => {
    const allChannels = state.get("allChannels");
    return state.merge({
      allChannels: cloneDeep([...allChannels, ...payload.data]),
      currentPage: payload.page,
      countOfResults: payload.num,
    });
  },
  [channelConstants.SET_CHANNEL_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [channelConstants.SET_BUL_CHANNEL_PAGE]: (state, { payload }) => {
    return state.merge({ bulChannelPage: payload.type });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    error: null,
    allChannels: [],
    selectedChannel: [],
    countOfResults: 0,
    currentPage: 1,
    bulChannelPage: 'nada',
    followers: [],
    userChannelEditor: [],
    emailDraftChannel: [],
    emailSendChannel: []
  });

export default handleActions(reducers, initialState());
