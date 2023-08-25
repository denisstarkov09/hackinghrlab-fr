import { fork, call, put, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as assessmentConstants,
  actions as assessmentActions,
} from "../actions/skillCohortResourceResponseAssessment-actions";
import { actions as homeActions } from "../actions/home-actions";

import {
  upsertSkillCohortResourceResponseAssessment,
  getAllSkillCohortResourceResponseAssessment,
} from "../../api";

function* upsertResourceAssessmentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      upsertSkillCohortResourceResponseAssessment,
      payload
    );

    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Successfully submitted your response.",
      });

      yield put(
        assessmentActions.setAllSkillCohortResourceResponseAssessment(
          response.data.allSkillCohortResourceResponseAssessments
        )
      );
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: "Error",
      description: "Something went wrong",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* getAllResourceAssessmentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      getAllSkillCohortResourceResponseAssessment,
      payload
    );

    if (response.status === 200) {
      yield put(
        assessmentActions.setAllSkillCohortResourceResponseAssessment(
          response.data.allSkillCohortResourceResponseAssessments
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchAssessmentSaga() {
  yield takeLatest(
    assessmentConstants.GET_ALL_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
    getAllResourceAssessmentSaga
  );
  yield takeLatest(
    assessmentConstants.UPSERT_SKILL_COHORT_RESOURCE_RESPONSE_ASSESSMENT,
    upsertResourceAssessmentSaga
  );
}

export const SkillCohortResourceResponseAssessmentSaga = [
  fork(watchAssessmentSaga),
];
