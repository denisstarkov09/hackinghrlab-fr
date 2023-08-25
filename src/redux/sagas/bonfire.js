import { put, fork, takeLatest, call } from "redux-saga/effects";
import omit from "lodash/omit";

import {
  constants as bonfireConstants,
  actions as bonfireActions,
} from "../actions/bonfire-actions";
import { actions as homeActions } from "../actions/home-actions";
import {
  createBonfire,
  getAllBonfires,
  getUserFromId,
  updateBonfire,
  deleteBonfire,
  inviteUser,
} from "../../api";

export function* createBonfireSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(createBonfire, { ...payload.bonfire });
    if (response.status === 200) {
      if (payload.callback) {
        payload.callback();
      }

      const response = yield call(getUserFromId);
      const { user } = response.data;
      yield put(
        homeActions.updateUserInformation({
          ...user,
        })
      );
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

export function* getAllBonfiresSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(getAllBonfires, { ...payload });
    if (response.status === 200) {
      const bonfiresData = response.data.bonfires.map((bonfire) => {
        return {
          ...omit(bonfire, [
            "firstName",
            "lastName",
            "img",
            "company",
            "titleProfessions",
            "personalLinks",
          ]),
          bonfireOrganizer: {
            firstName: bonfire.firstName,
            lastName: bonfire.lastName,
            img: bonfire.img,
            company: bonfire.company,
            titleProfessions: bonfire.titleProfessions,
            link: bonfire.personalLinks.linkedin,
          },
        };
      });

      yield put(bonfireActions.setBonfires(bonfiresData));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateBonfireSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(updateBonfire, { ...payload });

    if (response.status === 200) {
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

export function* deleteBonfireSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(deleteBonfire, { ...payload });

    if (response.status === 200) {
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

export function* inviteUserSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(inviteUser, { ...payload });

    if (response.status === 200) {
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

function* watchSession() {
  yield takeLatest(bonfireConstants.CREATE_BONFIRE, createBonfireSaga);
  yield takeLatest(bonfireConstants.GET_BONFIRES, getAllBonfiresSaga);
  yield takeLatest(bonfireConstants.UPDATE_BONFIRE, updateBonfireSaga);
  yield takeLatest(bonfireConstants.DELETE_BONFIRE, deleteBonfireSaga);
  yield takeLatest(bonfireConstants.INVITE_USER, inviteUserSaga);
}

export const bonfireSaga = [fork(watchSession)];
