import { put, fork, call, takeLatest } from "redux-saga/effects";

import { createSimulationSprintParticipant } from "../../api";

import { constants as simulationSprintParticipantsConstants } from "redux/actions/simulationSprintParticipant-action";
import { actions as authActions } from "../actions/auth-actions";

import { actions as homeActions } from "redux/actions/home-actions";

export function* createSimulationSprintParticipantSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createSimulationSprintParticipant, {
      ...payload,
    });

    if (response.status === 200 && payload.callback) {
      yield put(
        homeActions.updateUserInformation(response.data.userUpdated[0][0][0])
      );
      payload.callback();
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(authActions.logout());
    } else if (payload.callback) {
      payload.callback(error.response.data.msg || error.message);
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchParticipant() {
  yield takeLatest(
    simulationSprintParticipantsConstants.CREATE_SIMULATION_SPRINT_PARTICIPANT,
    createSimulationSprintParticipantSaga
  );
}

export const simulationSprintParticipantSaga = [fork(watchParticipant)];
