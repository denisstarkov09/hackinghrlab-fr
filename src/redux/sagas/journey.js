import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as journeyConstants,
  actions as journeyActions,
} from "../actions/journey-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";
import {
  getAllJourneys,
  get,
  post,
  put as updateJourney,
} from "../../api/module/journey";

export function* getAllJourneysSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllJourneys);

    if (response.status === 200) {
      yield put(journeyActions.setAllJourneys(response.data.journeys));
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

export function* getJourneySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(get, payload.id);

    if (response.status === 200) {
      yield put(journeyActions.setJourney(response.data.journey));
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

export function* addJourneySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(post, payload.journey);

    if (response.status === 200) {
      yield put(journeyActions.setShowForm(false));
      yield put(journeyActions.getAllJourneys());
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

export function* updateJourneySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateJourney, payload);

    if (response.status === 200) {
      yield put(journeyActions.setShowForm(false));
      yield put(journeyActions.unsetJourney());
      yield put(journeyActions.getAllJourneys());
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

export function* unSetJourneySaga() {
  yield put(journeyActions.getAllJourneys());
}

function* watchLogin() {
  yield takeLatest(journeyConstants.GET_ALL_JOURNEYS, getAllJourneysSaga);
  yield takeLatest(journeyConstants.ADD_JOURNEY, addJourneySaga);
  yield takeLatest(journeyConstants.UPDATE_JOURNEY, updateJourneySaga);
  yield takeLatest(journeyConstants.GET_JOURNEY, getJourneySaga);
  yield takeLatest(journeyConstants.UNSET_JOURNEY, unSetJourneySaga);
}

export const journeySaga = [fork(watchLogin)];
