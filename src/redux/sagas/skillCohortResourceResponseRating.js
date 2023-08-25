import { call, put, takeLatest, fork } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as responseRatingConstants,
  actions as responseRatingActions,
} from "redux/actions/skillCohortResourceResponseRating-actions";
import { actions as homeActions } from "../actions/home-actions";

import { getAllResponseRating, upsertResponseRating } from "../../api";

function* getAllResourceResponseRatingSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllResponseRating, payload);

    if (response.status === 200) {
      yield put(
        responseRatingActions.setAllResponseRating(
          response.data.allSkillCohortResourceResponseRatings
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* upsertResourceResponseRatingSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(upsertResponseRating, payload);

    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Successfully rated this response.",
      });

      yield put(
        responseRatingActions.setAllResponseRating(
          response.data.allSkillCohortResourceResponseRatings
        )
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchResponseSaga() {
  yield takeLatest(
    responseRatingConstants.GET_ALL_RESPONSE_RATING,
    getAllResourceResponseRatingSaga
  );
  yield takeLatest(
    responseRatingConstants.UPSERT_RESPONSE_RATING,
    upsertResourceResponseRatingSaga
  );
}

export const SkillCohortResourceResponseRatingSaga = [fork(watchResponseSaga)];
