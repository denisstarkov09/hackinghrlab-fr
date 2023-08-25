import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as simulationSprintsConstants,
  actions as simulationSprintsActions,
} from "../actions/simulationSprint-actions";
import { actions as homeActions } from "../actions/home-actions";

import {
  getAllSimulationSprints,
  getSimulationSprint,
  getAllSimulationSprintOfUser,
} from "../../api";

export function* getAllSimulationSprintsSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(getAllSimulationSprints, { ...payload });

    if (response.status === 200) {
      yield put(
        simulationSprintsActions.setAllSimulationSprints(
          response.data.simulationSprints
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getSimulationSprintsSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(getSimulationSprint, { ...payload });

    if (response.status === 200) {
      yield put(
        simulationSprintsActions.setSimulationSprint(
          response.data.simulationSprint
        )
      );

      if (payload.callback) {
        payload.callback();
      }
    }
  } catch (error) {
    console.log(error);

    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllMySimulationSprintsSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(getAllSimulationSprintOfUser, { ...payload });
    if (response.status === 200) {
      yield put(
        simulationSprintsActions.setAllMySimulationSprints(
          response.data.simulationSprintofUser
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchSimulationSprints() {
  yield takeLatest(
    simulationSprintsConstants.GET_ALL_SIMULATION_SPRINTS,
    getAllSimulationSprintsSaga
  );

  yield takeLatest(
    simulationSprintsConstants.GET_SIMULATION_SPRINT,
    getSimulationSprintsSaga
  );

  yield takeLatest(
    simulationSprintsConstants.GET_ALL_MY_SIMULATION_SPRINTS,
    getAllMySimulationSprintsSaga
  );
}

export const simulationSprintsSaga = [fork(watchSimulationSprints)];
