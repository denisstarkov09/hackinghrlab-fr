import { put, fork, takeLatest, call } from "redux-saga/effects";

import { actions as journeyActions } from "../actions/journey-actions";
import {
  constants as journeyItemConstants,
  actions as journeyItemActions,
} from "../actions/journeyItem-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";
import {
  itemsByJourney,
  put as updateJourneyItem,
} from "../../api/module/journeyItems";

export function* getItemsByJourneySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(itemsByJourney, payload.data);

    if (response.status === 200) {
      yield put(
        journeyItemActions.setAllJourneyItems(response.data.journeyItems)
      );
      yield put(journeyItemActions.setJourneyId(payload.id));
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

export function* updateJourneyItemSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateJourneyItem, payload.data);
    if (response.status === 200) {
      yield put(
        journeyItemActions.getAllJourneyItems({
          id: payload.data.journeyId,
          removed: payload.data.loadRemovedItems,
        })
      );
      yield put(journeyActions.getJourney(payload.data.journeyId));
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

function* watchLogin() {
  yield takeLatest(
    journeyItemConstants.GET_ALL_JOURNEY_ITEMS,
    getItemsByJourneySaga
  );
  yield takeLatest(
    journeyItemConstants.UPDATE_JOURNEY_ITEM,
    updateJourneyItemSaga
  );
}

export const journeyItemSaga = [fork(watchLogin)];
