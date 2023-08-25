import { put, fork, call, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import {
  getSkillCohortParticipant,
  getAllSkillCohortParticipants,
  createSkillCohortParticipant,
  getParticipated,
  withdrawParticipation,
} from "../../api";

import {
  actions as skillCohortParticipantActions,
  constants as skillCohortParticipantsConstants,
} from "redux/actions/skillCohortParticipant-actions";

import { actions as homeActions } from "redux/actions/home-actions";

export function* getSkillCohortParticipantSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getSkillCohortParticipant, { ...payload });

    if (response.status === 200) {
      yield put(
        skillCohortParticipantActions.setSkillCohortParticipant(
          response.data.skillCohortParticipant
        )
      );
    }
  } catch (error) {
    console.log(error);
    yield put(skillCohortParticipantActions.setSkillCohortParticipant({}));
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getParticipatedSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getParticipated, { ...payload });
    if (response?.status === 200) {
      yield put(
        skillCohortParticipantActions.setParticipated(
          response.data.allSkillCohortParticipants
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllSkillCohortParticipantsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllSkillCohortParticipants, { ...payload });

    if (response.status === 200) {
      yield put(
        skillCohortParticipantActions.setAllSkillCohortParticipants(
          response.data.allSkillCohortParticipants
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* createSkillCohortParticipantSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createSkillCohortParticipant, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback.go(0);
      }

      notification.success({
        message: "You have joined this cohort.",
      });

      yield put(
        skillCohortParticipantActions.setSkillCohortParticipant(
          response.data.skillCohortParticipant
        )
      );
    }
  } catch (error) {
    console.log(error.response);

    let message = "Something went wrong.";

    if (error.response.status === 403) {
      message = error.response.data.msg;
    }

    notification.error({
      message,
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* withdrawParticipationSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(withdrawParticipation, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback.go(0);
      }

      notification.success({
        message: "You have withdrawn your participation in this cohort.",
      });

      yield put(skillCohortParticipantActions.setSkillCohortParticipant({}));
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: "Internal Error",
      description: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchParticipant() {
  yield takeLatest(
    skillCohortParticipantsConstants.GET_SKILL_COHORT_PARTICIPANT,
    getSkillCohortParticipantSaga
  );
  yield takeLatest(
    skillCohortParticipantsConstants.CREATE_SKILL_COHORT_PARTICIPANT,
    createSkillCohortParticipantSaga
  );
  yield takeLatest(
    skillCohortParticipantsConstants.GET_ALL_PARTICIPANT,
    getAllSkillCohortParticipantsSaga
  );
  yield takeLatest(
    skillCohortParticipantsConstants.GET_PARTICIPATED,
    getParticipatedSaga
  );
  yield takeLatest(
    skillCohortParticipantsConstants.WITHDRAW_PARTICIPATION,
    withdrawParticipationSaga
  );
}

export const skillCohortParticipantSaga = [fork(watchParticipant)];
