import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as businessPartnerCommentConstants,
  actions as businessPartnerCommentActions,
} from "../actions/business-partner-comments-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";
import {
  getAllBusinessPartnerCommentsFromAPI,
  postBusinessPartnerCommentFromAPI,
  removeBusinessPartnerCommentFromAPI,
} from "../../api/module/businessPartner-comments";

export function* getAllBusinessPartnerCommentsSaga({ payload }) {
  if (payload.page === 1) {
    yield put(homeActions.setLoading(true));
  } else {
    yield put(businessPartnerCommentActions.setLoading(true));
  }
  try {
    const response = yield call(getAllBusinessPartnerCommentsFromAPI, payload);
    if (response.status === 200) {
      yield put(
        businessPartnerCommentActions.setAllBusinessPartnerComments(
          response.data.comments.count,
          payload.page || 1,
          response.data.comments.rows
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(businessPartnerCommentActions.setLoading(false));
    yield put(homeActions.setLoading(false));
  }
}

export function* addBusinessPartnerCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      postBusinessPartnerCommentFromAPI,
      payload.comment
      );
      if (response.status === 200) {
      yield put(
        businessPartnerCommentActions.getAllBusinessPartnerComments({
          businessPartnerId: payload.comment.BusinessPartnerId,
        })
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

export function* removeBusinessPartnerCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      removeBusinessPartnerCommentFromAPI,
      payload.comment
    );
    if (response.status === 200) {
      yield put(
        businessPartnerCommentActions.getAllBusinessPartnerComments({
          businessPartnerId: payload.comment.BusinessPartnerId,
        })
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

function* watchLogin() {
  yield takeLatest(
    businessPartnerCommentConstants.GET_ALL_BUSINESS_PARTNER_COMMENTS,
    getAllBusinessPartnerCommentsSaga
  );
  yield takeLatest(
    businessPartnerCommentConstants.ADD_BUSINESS_PARTNER_COMMENT,
    addBusinessPartnerCommentSaga
  );
  yield takeLatest(
    businessPartnerCommentConstants.DELETE_BUSINESS_PARTNER_COMMENT,
    removeBusinessPartnerCommentSaga
  );
}

export const businessPartnerCommentSaga = [fork(watchLogin)];
