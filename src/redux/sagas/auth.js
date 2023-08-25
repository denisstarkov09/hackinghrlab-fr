import axios from "axios";
import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as authConstants,
  actions as authActions,
} from "../actions/auth-actions";
import moment from "moment";
import { actions as homeActions } from "../actions/home-actions";
import { actions as eventActions } from "../actions/event-actions";
import { actions as conversationActions } from "../actions/conversation-actions";
import { signIn, signUp } from "../../api";

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

export function* login({ payload }) {
  yield put(
    authActions.setAuth({
      isAuthenticated: false,
      loading: true,
      error: null,
      accessToken: null,
      id: 0,
    })
  );
  yield put(homeActions.updateUserInformation({}));

  try {
    const response = yield call(signIn, {
      email: payload.email,
      password: payload.password,
    });

    if (response.status === 200) {
      const { token, user } = response.data;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      if(payload.callback){
        payload.callback()
      }

      yield put(
        authActions.setAuth({
          isAuthenticated: true,
          loading: false,
          error: null,
          accessToken: token,
          id: user.id,
        })
      );

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );
    } else {
      yield put(
        authActions.setAuth({
          isAuthenticated: false,
          loading: false,
          error: response.data.msg,
          accessToken: null,
          id: 0,
        })
      );
      yield put(homeActions.updateUserInformation({}));
    }
  } catch (error) {
    yield put(
      authActions.setAuth({
        isAuthenticated: false,
        loading: false,
        error: error.response.data.msg,
        accessToken: null,
        id: 0,
      })
    );
    yield put(homeActions.updateUserInformation({}));
  }
}

export function* logout() {

  yield put(homeActions.updateUserPopUp({
    bul: true, 
    lastDateSignOut: moment.utc().format(),
  }));

  axios.defaults.headers.common.Authorization = "";

  yield put(
    authActions.setAuth({
      isAuthenticated: false,
      loading: false,
      error: null,
      accessToken: null,
      id: 0,
    })
  );

  yield put(homeActions.updateUserInformation({}));
  yield put(eventActions.setMyEvents([]));
  // yield put(eventActions.setAllEvents([]));
  yield put(conversationActions.setConversations([]));
  yield put(conversationActions.setCurrentConversations([]));
}

export function* signUpUser({ payload }) {
  yield put(
    authActions.setAuth({
      isAuthenticated: false,
      loading: true,
      error: null,
      accessToken: null,
      id: 0,
    })
  );
  yield put(homeActions.updateUserInformation({}));

  try {
    const response = yield call(signUp, { ...payload });

    if (response.status === 200) {
      const { token, user } = response.data;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      yield put(
        authActions.setAuth({
          isAuthenticated: true,
          loading: false,
          error: null,
          accessToken: token,
          id: user.id,
        })
      );

      yield put(
        homeActions.updateUserInformation({
          ...defaultUserInfo,
          ...user,
        })
      );

      if (payload.hostUserId) {
        yield put(homeActions.acceptInvitation(user.id, payload.hostUserId));
      }
    } else {
      yield put(
        authActions.setAuth({
          isAuthenticated: false,
          loading: false,
          error: "Signup Failed!",
          accessToken: null,
          id: 0,
        })
      );
      yield put(homeActions.updateUserInformation({}));
    }
  } catch (error) {
    yield put(
      authActions.setAuth({
        isAuthenticated: false,
        loading: false,
        error: error.response.data.msg,
        accessToken: null,
        id: 0,
      })
    );
    yield put(homeActions.updateUserInformation({}));
  }
}

function* watchLogin() {
  yield takeLatest(authConstants.LOGIN, login);
  yield takeLatest(authConstants.LOGOUT, logout);
  yield takeLatest(authConstants.SIGNUP, signUpUser);
}

export const authSaga = [fork(watchLogin)];
