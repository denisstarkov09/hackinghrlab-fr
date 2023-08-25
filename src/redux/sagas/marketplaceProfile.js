import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";
import {
  constants as marketlaceProfileConstants,
  actions as marketplaceProfileActions,
} from "../actions/marketplaceProfile-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";
import {
  createMarketplaceProfile,
  getMarketplaceProfiles,
  getMarketplaceProfile,
  updateMarketplaceProfile,
} from "../../api";

export function* createMarketplaceProfileSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createMarketplaceProfile, {
      ...payload,
    });

    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Changes have been saved",
      });
      const { marketPlaceProfile } = response.data;
      yield put(
        marketplaceProfileActions.setMarketPlaceProfile({
          ...marketPlaceProfile,
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

export function* getMarketplaceProfilesSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(getMarketplaceProfiles, { ...payload });

    if (response.status === 200) {
      const marketPlaceProfilesData = response.data.marketPlaceProfiles.map(
        (marketPlaceProfile) => {
          const { User } = marketPlaceProfile;

          delete marketPlaceProfile.User;

          const newMarketplaceProfile = Object.assign(marketPlaceProfile, User);

          return newMarketplaceProfile;
        }
      );
      yield put(
        marketplaceProfileActions.setMarketPlaceProfiles(
          marketPlaceProfilesData
        )
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

export function* getMarketplaceProfileSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(getMarketplaceProfile, { ...payload });

    if (response.status === 200) {
      const { User } = response.data.marketPlaceProfile;
      const newMarketplaceProfile = Object.assign(
        response.data.marketPlaceProfile,
        User
      );
      delete newMarketplaceProfile.User;

      yield put(
        marketplaceProfileActions.setMarketPlaceProfile(newMarketplaceProfile)
      );
    }
  } catch (error) {
    console.log(error);

    yield put(marketplaceProfileActions.setMarketPlaceProfile({}));

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateMarketplaceProfileSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(updateMarketplaceProfile, { ...payload });

    if (response.status === 200) {
      yield put(
        marketplaceProfileActions.setMarketPlaceProfile(
          response.data.affectedRows
        )
      );

      notification.success({
        message: "Success",
        description: "Changes have been saved",
      });
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
  yield takeLatest(
    marketlaceProfileConstants.CREATE_MARKETPLACE_PROFILE,
    createMarketplaceProfileSaga
  );
  yield takeLatest(
    marketlaceProfileConstants.GET_MARKETPLACE_PROFILES,
    getMarketplaceProfilesSaga
  );
  yield takeLatest(
    marketlaceProfileConstants.GET_MARKETPLACE_PROFILE,
    getMarketplaceProfileSaga
  );
  yield takeLatest(
    marketlaceProfileConstants.UPDATE_MARKETPLACE_PROFILE,
    updateMarketplaceProfileSaga
  );
}

export const marketplaceProfileSaga = [fork(watchSession)];
