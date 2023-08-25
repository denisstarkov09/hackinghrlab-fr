import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as homeConstants,
  actions as homeActions,
} from "../actions/home-actions";
import { actions as authActions } from "../actions/auth-actions";
import {
  getUserFromId,
  updateUser,
  upgradePlan,
  inviteFriend,
  attendToGlobalConference,
  addSession,
  removeSession,
  joinedASession,
  addBonfire,
  removeBonfire,
  uploadResume,
  deleteResume,
  changePassword,
  createInvitation,
  acceptInvitationJoin,
  sendEmailAuthorizationSpeakersEndPoint,
  confirmAccessibilityRequirements,
  getAllUsers,
  acceptTermsAndConditions,
  viewRulesConference,
  countAllUsers,
  searchUser,
  sendActiveOrDenyAuthorizationEndPoint,
  handleReceiveCommunityNotification,
  updateUserPopUpEndPoint,
  removeUserEndPoint
} from "../../api";
import {
  acceptInvitationApplyBusinnesPartner,
  confirmInvitationApplyBusiness,
} from "api/module/user";

const defaultUserInfo = {
  firstName: "",
  lastName: "",
  company: "",
  abbrName: "",
  img: null,
  about: "",
  titleProfessions: "",
  topicsOfInterest: [],
  personalLinks: {},
  language: "",
  timezone: "",
  completed: false,
  percentOfCompletion: 0,
};

export function* getUser({ payload }) {
  yield put(homeActions.updateUserInformation(defaultUserInfo));
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getUserFromId);
    const { user } = response.data;

    if(response.status === 200){
      if(payload.callback){
        payload.callback()
      }

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* putUser({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateUser, { ...payload });

    if (response.status === 200) {
      const { affectedRows: user } = response.data;

      if(payload.callback){
        payload.callback()
      }

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else {
      notification.error({
        message: "User profile was not updated",
        description: error.response.data.msg,
      });
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* upgradeUserPlan({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(upgradePlan, { ...payload });

    if (response.status === 200) {
      const { affectedRows: user } = response.data;

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* sendInvitationEmail({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(inviteFriend, payload.email);

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback(false);
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else if (payload.callback) {
      payload.callback(true);
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* attendToGlobalConferenceSaga() {
  try {
    const response = yield call(attendToGlobalConference);

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  }
}

export function* addSessionSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addSession, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else {
      notification.error({
        message: "The session was not added",
        description: error.response.data.msg,
      });
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* removeSessionSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeSession, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* joinedASessionSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(joinedASession, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
    if (payload.callback) payload.callback();
  }
}

export function* addBonfireSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addBonfire, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else {
      notification.error({
        message: "You can't join this bonfire",
        description: error.response.data.msg,
      });
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* removeBonfireSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeBonfire, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* uploadResumeSaga({ payload }) {
  try {
    const response = yield call(uploadResume, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else if (payload.callback) {
      payload.callback(error);
    }
  }
}

export function* deleteResumeSaga({ payload }) {
  try {
    const response = yield call(deleteResume, { ...payload });

    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else if (payload.callback) {
      payload.callback(error);
    }
  }
}

export function* changePasswordSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(changePassword, { ...payload });

    if (response.status === 200) {
      yield put(authActions.logout());
      notification.success({
        title: "Success",
        description: "Password changed.",
      });
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: "Changing password failed.",
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* createInvitationSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createInvitation, { ...payload });

    if (response.status === 200) {
      notification.success({
        title: "Success",
        description: response.data.msg,
      });
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* acceptInvitationSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(acceptInvitationJoin, { ...payload });

    if (response.status === 200) {
      notification.success({
        title: "Success",
        description: response.data.msg,
      });
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* acceptInvitationApplySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(acceptInvitationApplyBusinnesPartner, {
      ...payload,
    });

    if (response.status === 200) {
      notification.success({
        title: "Success",
        description: response.data.msg,
      });
      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...response.data.userUpdated[0],
        })
      );
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* sendEmailAuthorizationSpeakersSaga({ payload }) {
  const {userId} = payload.payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(sendEmailAuthorizationSpeakersEndPoint, {
      userId,
    });

    if (response.status === 200) {
      notification.success({
        title: "Success",
        description: response.data.msg,
      });
      yield put(homeActions.updateUserInformation(response.data.userUpdated[0]));
      yield put(homeActions.setLoading(false));
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* sendActiveOrDenyAuthorizationEndPointSaga({ payload }) {
  const {userId , typeAuthorization} = payload.payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(sendActiveOrDenyAuthorizationEndPoint, {
      userId,
      typeAuthorization
    });

    if (response.status === 200) {
      yield put(homeActions.setLoading(false));
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* confirmAccessibilityRequirementsSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(confirmAccessibilityRequirements, payload);

    if (response.status === 200) {
      notification.success({
        title: "Success",
        description: response.data.msg,
      });
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* confirmInvitationApply({ payload }) {
  try {
    const response = yield call(confirmInvitationApplyBusiness, {
      ...payload,
    });

    if (response.status === 200) {
      notification.success({
        title: "Success",
        description: response.data.msg,
      });
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  }
}

export function* getAllUsersSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllUsers);

    if (response.status === 200) {
      yield put(homeActions.setAllUsers(response.data.users));
    }
  } catch (error) {
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* acceptTermsAndConditionsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(acceptTermsAndConditions, { ...payload });

    if (response.status === 200) {
      const { user } = response.data;

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* viewRulesGConferenceSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(viewRulesConference, { ...payload });

    if (response.status === 200) {
      const { user } = response.data;

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* countAllUsersSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(countAllUsers);

    if (response.status === 200) {
      yield put(homeActions.setCountUsers(response.data.userCount));
    }
  } catch (error) {
    console.log(error);

    notification.error({
      title: "Error",
      description: error.response.data.msg,
    });

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* handleOnlineSaga({ payload }) {
  try {
    if (payload) {
      yield put(homeActions.updateUserInformation(payload.user));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* searchUserSaga({ payload }) {
  yield put(homeActions.setLoadingSearchUsers(true));
  try {
    const response = yield call(searchUser, { ...payload });

    if (response.status === 200) {
      const { users, count } = response.data;

      yield put(homeActions.setSearchedUsers(users));
      yield put(homeActions.setPagesSearchedUsers(count));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoadingSearchUsers(false));
  }
}

export function* handleReceiveCommunityNotificationSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(handleReceiveCommunityNotification, {
      ...payload,
    });
    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateUserPopUpSagas({ payload }){
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateUserPopUpEndPoint, {
      ...payload,
    });
    if (response.status === 200) {
      yield put(homeActions.updateUserInformation(response.data.user));

      yield put(homeActions.setLoading(false));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* removeUserSagas({ payload }){
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeUserEndPoint);
    if (response.status === 200) {
      if(payload.callback){
        payload.callback()
      }

      yield put(homeActions.setLoading(false));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchLogin() {
  yield takeLatest(homeConstants.UPDATE_USER_POPUP, updateUserPopUpSagas)
  yield takeLatest(homeConstants.GET_USER, getUser);
  yield takeLatest(homeConstants.UPDATE_USER, putUser);
  yield takeLatest(homeConstants.UPGRADE_PLAN, upgradeUserPlan);
  yield takeLatest(homeConstants.INVITE_FRIEND, sendInvitationEmail);
  yield takeLatest(
    homeConstants.ATTEND_TO_GLOBAL_CONFERENCE,
    attendToGlobalConferenceSaga
  );
  yield takeLatest(homeConstants.ADD_SESSION, addSessionSaga);
  yield takeLatest(homeConstants.REMOVE_SESSION, removeSessionSaga);
  yield takeLatest(homeConstants.JOINED_SESSION, joinedASessionSaga);
  yield takeLatest(homeConstants.ADD_BONFIRE, addBonfireSaga);
  yield takeLatest(homeConstants.REMOVE_BONFIRE, removeBonfireSaga);
  yield takeLatest(homeConstants.UPLOAD_RESUME, uploadResumeSaga);
  yield takeLatest(homeConstants.DELETE_RESUME, deleteResumeSaga);
  yield takeLatest(homeConstants.CHANGE_PASSWORD, changePasswordSaga);
  yield takeLatest(homeConstants.CREATE_INVITATION, createInvitationSaga);
  yield takeLatest(homeConstants.ACCEPT_INVITATION, acceptInvitationSaga);
  yield takeLatest(
    homeConstants.ACCEPT_INVITATION_APPLY,
    acceptInvitationApplySaga
  );
  yield takeLatest(
    homeConstants.SEND_EMAIL_AUTHORIZATION_SPEAKERS,
    sendEmailAuthorizationSpeakersSaga
  );
  yield takeLatest(
    homeConstants.ACTIVE_DENY_AUTHORZATION,
    sendActiveOrDenyAuthorizationEndPointSaga
  );
  yield takeLatest(
    homeConstants.CONFIRM_INVITATION_APPLY,
    confirmInvitationApply
  );
  yield takeLatest(
    homeConstants.CONFIRM_ACCESSIBILITY_REQUIREMENTS,
    confirmAccessibilityRequirementsSaga
  );
  yield takeLatest(homeConstants.GET_USERS, getAllUsersSaga);
  yield takeLatest(
    homeConstants.ACCEPT_TERMS_CONDITIONS_GCONFERENCE,
    acceptTermsAndConditionsSaga
  );
  yield takeLatest(
    homeConstants.VIEW_RULES_G_CONFERENCE,
    viewRulesGConferenceSaga
  );
  yield takeLatest(homeConstants.COUNT_ALL_USERS, countAllUsersSaga);
  yield takeLatest(homeConstants.HANDLE_ONLINE, handleOnlineSaga);
  yield takeLatest(homeConstants.SEARCH_USER, searchUserSaga);
  yield takeLatest(
    homeConstants.UPDATE_RECIVE_COMMUNITY_NOTIFICATION,
    handleReceiveCommunityNotificationSaga
  );
  yield takeLatest(homeConstants.REMOVE_USER, removeUserSagas)
}

export const userSaga = [fork(watchLogin)];
