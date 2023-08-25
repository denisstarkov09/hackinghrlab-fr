import { put, fork, call, takeLatest } from "redux-saga/effects";

import {
  constants as skillCohortConstants,
  actions as skillCohortActions,
} from "redux/actions/skillCohort-actions";

import { actions as homeActions } from "redux/actions/home-actions";

import {
  getAllSkillCohorts,
  getSkillCohort,
  getAllOfMyCohort,
} from "../../api";

export function* getAllSkillCohortSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllSkillCohorts, { ...payload });

    if (response.status === 200) {
      yield put(
        skillCohortActions.setAllSkillCohorts(response.data.skillCohorts)
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* getAllOfMyCohortSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllOfMyCohort, { ...payload });

    if (response.status === 200) {
      yield put(
        skillCohortActions.setAllOfMyCohort(response.data.allOfMySkillCohorts)
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getSkillCohortSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getSkillCohort, payload.id);

    if (response.status === 200) {
      yield put(skillCohortActions.setSkillCohort(response.data.skillCohort));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchSkillCohortSaga() {
  yield takeLatest(
    skillCohortConstants.GET_ALL_SKILL_COHORT,
    getAllSkillCohortSaga
  );
  yield takeLatest(skillCohortConstants.GET_SKILL_COHORT, getSkillCohortSaga);
  yield takeLatest(
    skillCohortConstants.GET_ALL_OF_MY_COHORT,
    getAllOfMyCohortSaga
  );
}

export const skillCohortSaga = [fork(watchSkillCohortSaga)];
