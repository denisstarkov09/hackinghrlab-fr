import { call, fork, put, takeLatest } from "redux-saga/effects";

import {
  constants as councilConstants,
  actions as councilActions,
} from "../actions/council-actions";
// import { actions as authActions } from "../actions/auth-actions";

import {
  createCouncilResourceFromAPI,
  getCouncilMembersFromAPI,
  getCouncilResourceByIdFromAPI,
  getCouncilResourcesFromAPI,
} from "../../api";

export function* getCouncilMemberSagas() {
  try {
    const response = yield call(getCouncilMembersFromAPI);
    if (response.status === 200) {
      const { councilMembers } = response.data;

      yield put(councilActions.setCouncilMembers(councilMembers));
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(councilActions.logout());
    }
  }
}

export function* getCouncilResourcesSagas() {
  try {
    const response = yield call(getCouncilResourcesFromAPI);
    if (response.status === 200) {
      const { councilResources } = response.data;
      yield put(councilActions.setCouncilResources(councilResources));
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(councilActions.logout());
    }
  }
}

export function* getCouncilResounceByIdSagas({ payload }) {
  try {
    const response = yield call(getCouncilResourceByIdFromAPI, { ...payload });
    if (response.status === 200) {
      const { councilResource } = response.data;
      yield put(councilActions.setCouncilResource(councilResource));
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(councilActions.logout());
    }
  }
}

export function* updateCouncilResourcesSagas({ payload }) {
  try {
    let response = yield call(getCouncilResourcesFromAPI, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback();
      }
    }
  } catch (error) {
    console.log(error);
    if (payload.callback) {
      payload.callback(error);
    }
  }
}

export function* createCouncilResourceSagas({ payload }) {
  try {
    const response = yield call(createCouncilResourceFromAPI, {
      ...payload.council,
    });
    if (response.status === 200) {
      if (payload.callback) {
        payload.callback();
      }
      const response = yield call(getCouncilResourcesFromAPI);
      const { councilResources } = response.data;
      yield put(
        councilActions.updateCouncilResourcesInformation(councilResources)
      );
    }
  } catch (error) {
    console.log(error);
    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield getCouncilResourcesSagas();
  }
}

function* watchCouncil() {
  yield takeLatest(councilConstants.GET_COUNCIL_MEMBERS, getCouncilMemberSagas);
  yield takeLatest(
    councilConstants.UPDATE_COUNCIL_RESOURCES_INFORMATION,
    updateCouncilResourcesSagas
  );
  yield takeLatest(
    councilConstants.GET_COUNCIL_RESOURCES,
    getCouncilResourcesSagas
  );
  yield takeLatest(
    councilConstants.CREATE_COUNCIL_RESOURCE,
    createCouncilResourceSagas
  );
  yield takeLatest(
    councilConstants.GET_COUNCIL_RESOURCE,
    getCouncilResounceByIdSagas
  );
}

export const councilSaga = [fork(watchCouncil)];
