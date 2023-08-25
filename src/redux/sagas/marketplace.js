import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as marketplaceConstants,
  actions as marketplaceActions,
} from "../actions/marketplace-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";

import { getAllMarketplace } from "../../api";

export function* getAllMarketplaceSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllMarketplace, payload);

    if (response.status === 200) {
      yield put(marketplaceActions.setAllMarketplace(response.data));
    }
  } catch (error) {
    console.log(error.message);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchMarketplace() {
  yield takeLatest(
    marketplaceConstants.GET_ALL_MARKETPLACE,
    getAllMarketplaceSaga
  );
}

export const marketplaceSaga = [fork(watchMarketplace)];
