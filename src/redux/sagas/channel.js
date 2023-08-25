import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as channelConstants,
  actions as channelActions,
} from "../actions/channel-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";

import {
  createChannel,
  searchChannels,
  getChannel,
  setFollowChannel,
  unsetFollowChannel,
  updateChannel,
  notifyNewEmailChannelsEndPoint,
  getChannelForNameEndPoint,
  exportsFollowersChannel,
  addNewContentEditorChannel,
  removeContentEditorChannel,
  getContentEditorChannelEndPoint,
  sendEmailAttendeeChannelOwnerEndPoint,
  addDraftEmailChannelEndPoint,
  getAllDraftEmailChannelEndPoint,
  deleteDraftEmailChannelEndPoint,
  editDraftEmailChannelEndPoint,
  copySendEmailChannelEndPoint,
  getAllSendEmailChannelEndPoint
} from "../../api";

export function* createChannelSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createChannel, { ...payload });

    if (response.status === 200 && payload.callback) {
      payload.callback("");
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      const { msg } = error.response.data || {};
      payload.callback(msg || "Something went wrong, please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getChannelSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getChannel, { ...payload });

    if (response.status === 200) {
      yield put(channelActions.setChannel(response.data.channel));

      if (payload.callback) {
        payload.callback(false);
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback(true);
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getChannelForNameSagas({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getChannelForNameEndPoint, { ...payload });
    if (response.status === 200) {
      yield put(channelActions.setChannel({
        channel:response.data.channel,
        followers:response.data.followers
      }));

      if (payload.callback) {
        payload.callback(false);
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback(true);
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateChannelSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateChannel, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (err) {
    console.log(err);

    if (err && err.response && err.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wrong. Please try again!");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* deleteChannelSaga({ payload }) {}

export function* getFirstChannelListSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(searchChannels, { ...payload });

    if (response.status === 200) {
      yield put(
        channelActions.setFirstChannelList(
          response.data.channels.rows,
          1,
          response.data.channels.count
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getMoreChannelListSaga({ payload }) {
  yield put(channelActions.setChannelLoading(true));

  try {
    const response = yield call(searchChannels, { ...payload });

    if (response.status === 200) {
      yield put(
        channelActions.setMoreChannelList(
          response.data.channels.rows,
          payload.page,
          response.data.channels.count
        )
      );
    }
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(channelActions.setChannelLoading(false));
  }
}

export function* setFollowChannelSaga({ payload }) {
  yield put(channelActions.setChannelLoading(true));

  try {
    const response = yield call(setFollowChannel, { ...payload });

    if (response.status === 200) {
      yield put(channelActions.setChannel(response.data.channel));
      yield put(homeActions.updateUserInformation(response.data.user));

      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  } finally {
    yield put(channelActions.setChannelLoading(false));
  }
}

export function* unsetFollowChannelSaga({ payload }) {
  yield put(channelActions.setChannelLoading(true));

  try {
    const response = yield call(unsetFollowChannel, { ...payload });

    if (response.status === 200) {
      yield put(channelActions.setChannel(response.data.channel));
      yield put(homeActions.updateUserInformation(response.data.user));

      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  } finally {
    yield put(channelActions.setChannelLoading(false));
  }
}

export function* notifyNewEmailChannelsSagas({ payload }) {

  try {
    const response = yield call(notifyNewEmailChannelsEndPoint, payload.chanelContent);

    if (response.status === 200) {

      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  } 
}

export function* exportFollowersChannelsSagas({ payload }) {

  const {idChannel} = payload

  try {
    const response = yield call(exportsFollowersChannel, {idChannel});

    if (response.status === 200) {
      var fileURL = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.ms-excel'}));
      var fileLink = document.createElement('a');
  
      fileLink.href = fileURL;
      fileLink.setAttribute('download', `followers.xlsx`);
      document.body.appendChild(fileLink);
  
      fileLink.click();
      document.body.removeChild (fileLink);
      window.URL.revokeObjectURL (fileURL);
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  } finally {
    yield put(channelActions.setChannelLoading(false));
  }
}

export function* newChannelEditor({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addNewContentEditorChannel, {...payload.data});

    if (response.status === 200 && payload.callback) {

      payload.callback();
  
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      const { msg } = error.response.data || {};
      payload.callback(msg || "Something went wrong, please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getChannelEditor({ payload }) {
  yield put(homeActions.setLoading(true));
  const {id} = payload

  try {

    const response = yield call(getContentEditorChannelEndPoint, id);

    if (response.status === 200) {
      yield put(channelActions.setChannelEditors(response.data.contentEditors));

      if(payload.callback){
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      const { msg } = error.response.data || {};
      payload.callback(msg || "Something went wrong, please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* deleteChannelEditor({ payload }) {
  yield put(homeActions.setLoading(true));
  const {id} = payload

  try {
    const response = yield call(removeContentEditorChannel, id);

    if (response.status === 200) {

      if(payload.callback){
        payload.callback();
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      const { msg } = error.response.data || {};
      payload.callback(msg || "Something went wrong, please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* sendEmailAttendeeChannelOwnerSagas({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call( sendEmailAttendeeChannelOwnerEndPoint, payload.data);

    if (response.status === 200) {

      yield put(homeActions.setLoading(false));

      if(payload.data.invitePeople === true){
        yield put(channelActions.setOnlyInvitationsChannel(response.data))
        if (payload.callback) {
          payload.callback();
          notification.info({
            description: 'Your invitations have been sent',
          });
        }
      }else{
        if (payload.callback) {
          payload.callback();
          notification.info({
            description: 'Your email has been sent!',
          });
        }
      }

      
    }
  } catch (error) {
    console.log(error);
    yield put(homeActions.setLoading(false));

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (error.response.status === 400) {
      notification.error({
        description: error?.response?.data?.message,
      });
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  } 
}

export function* addDraftEmailChannelSagas({payload}) {
  const {draftEmail} = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addDraftEmailChannelEndPoint, {draftEmail });
    
    if (response.status === 200) {

      const { draftEmailResponse } = response.data;

      if(draftEmailResponse !== undefined){
        yield put(
          channelActions.updateAllEmailChannel({
            draftEmailResponse, 
            bul:true
          })
        );
      }

      if (payload.callback) {
        payload.callback();
      }
    }
  } catch (error) {
    console.log(error)
    notification.error({
      message: "there are a error",
      description: error.response.data.msg,
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllDraftEmailChannelSagas({payload}) {
  const {id} = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllDraftEmailChannelEndPoint, {id});
    if (response.status === 200) {
      const { draftEmailResponse } = response.data;

      yield put(
        channelActions.updateAllEmailChannel({
          draftEmailResponse, 
          bul:false
        })
      );
    }
  } catch (error) {
      notification.error({
        message: "there are a error",
        description: error.response.data.msg,
      });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllSendEmailChannelSagas({payload}) {
  const {id} = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllSendEmailChannelEndPoint, {id});
    if (response.status === 200) {
      const { draftEmailResponse } = response.data;

      yield put(
        channelActions.updateAllEmailChannel2({
          draftEmailResponse, 
          bul:false
        })
      );
    }
  } catch (error) {
      notification.error({
        message: "there are a error",
        description: error.response.data.msg,
      });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* deleteDraftEmailChannelSagas({payload}) {
  const {draftEmailId} = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(deleteDraftEmailChannelEndPoint,  {draftEmailId} );
    
    if (response.status === 200) {

      yield put(homeActions.setLoading(false));

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Email draft delete successflly",
      });

    }
  } catch (error) {
    console.log(error)
      notification.error({
        message: "there are a error",
        description: error.response.data.msg,
      });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* editDraftEmailChannelSagas({payload}) {
  const {draftEmail} = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(editDraftEmailChannelEndPoint,  {draftEmail} );

    
    if (response.status === 200) {

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Email draft edit successflly",
      });
    }
  } catch (error) {
    console.log(error)
      notification.error({
        message: "there are a error",
        description: error.response.data.msg,
      });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* copySendEmailChannelSagas({payload}) {
  const {draftEmail} = payload
  yield put(homeActions.setLoading(true));
  
  try {
    const response = yield call(copySendEmailChannelEndPoint,  {draftEmail} );

    
    if (response.status === 200) {

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Email send copy successfully",
      });
    }
  } catch (error) {
    console.log(error)
      notification.error({
        message: "there are a error",
        description: error.response.data.msg,
      });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchChannel() {
  yield takeLatest(channelConstants.CREATE_CHANNEL, createChannelSaga);
  yield takeLatest(channelConstants.GET_CHANNEL, getChannelSaga);
  yield takeLatest(channelConstants.GET_CHANNEL_FOR_NAME, getChannelForNameSagas)
  yield takeLatest(channelConstants.UPDATE_CHANNEL, updateChannelSaga);
  yield takeLatest(channelConstants.DELETE_CHANNEL, deleteChannelSaga);
  yield takeLatest(
    channelConstants.GET_FIRST_CHANNEL_LIST,
    getFirstChannelListSaga
  );
  yield takeLatest(
    channelConstants.GET_MORE_CHANNEL_LIST,
    getMoreChannelListSaga
  );
  yield takeLatest(channelConstants.SET_FOLLOW_CHANNEL, setFollowChannelSaga);
  yield takeLatest(
    channelConstants.UNSET_FOLLOW_CHANNEL,
    unsetFollowChannelSaga
  );
  yield takeLatest(
    channelConstants.NOTIFY_NEW_INFORMATION_CREATOR,
    notifyNewEmailChannelsSagas
  )
  yield takeLatest(channelConstants.EXPORT_FOLLOWERS_CHANNELS, exportFollowersChannelsSagas)
  yield takeLatest(channelConstants.SET_NEWS_CHANNEL_EDITOR, newChannelEditor)
  yield takeLatest(channelConstants.DELETE_CHANNEL_EDITOR, deleteChannelEditor)
  yield takeLatest(channelConstants.GET_CHANNEL_EDITOR, getChannelEditor)
  yield takeLatest(channelConstants.SEND_EMAIL_ATTENDEE, sendEmailAttendeeChannelOwnerSagas)
  yield takeLatest(channelConstants.ADD_EMAIL_DRAFT ,addDraftEmailChannelSagas);
  yield takeLatest(channelConstants.GET_ALL_EMAIL_DRAFT ,getAllDraftEmailChannelSagas);
  yield takeLatest(channelConstants.DELETE_EMAIL_DRAFT ,deleteDraftEmailChannelSagas);
  yield takeLatest(channelConstants.EDIT_EMAIL_DRAFT ,editDraftEmailChannelSagas);
  yield takeLatest(channelConstants.COPY_EMAIL_SEND_CHANNEL, copySendEmailChannelSagas)
  yield takeLatest(channelConstants.GET_ALL_EMAIL_SEND, getAllSendEmailChannelSagas)
}

export const channelSaga = [fork(watchChannel)];
