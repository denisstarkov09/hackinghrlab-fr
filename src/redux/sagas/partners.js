import { put, fork, takeLatest, call } from "redux-saga/effects";
import groupBy from "lodash/groupBy";
import omit from "lodash/omit";

import {
  constants as partnerConstants,
  actions as partnerActions,
} from "../actions/partner-actions";
import { actions as homeActions } from "../actions/home-actions";
import { getPartners, getPartner } from "../../api";

export function* getPartnersSaga() {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(getPartners);

    if (response.status === 200) {
      const partnerData = Object.values(
        groupBy(response.data.partners || [], "id")
      ).map((partner) => {
        return partner.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, ["updatedAt", "createdAt"]),
          }),
          {}
        );
      });
      yield put(partnerActions.setPartners(partnerData));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getPartnerSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(getPartner, { ...payload });

    if (response.status === 200) {
      yield put(partnerActions.setPartner(response.data.partner));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchSession() {
  yield takeLatest(partnerConstants.GET_PARTNERS, getPartnersSaga);
  yield takeLatest(partnerConstants.GET_PARTNER, getPartnerSaga);
}

export const partnersSaga = [fork(watchSession)];
