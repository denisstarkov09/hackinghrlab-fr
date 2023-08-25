import { call, fork, put, takeLatest } from "redux-saga/effects";

import {
  constants as businessPartnerConstants,
  actions as businessPartnerActions,
} from "../actions/business-partner-actions";
// import { actions as authActions } from "../actions/auth-actions";

import {
  createBusinessPartnerResourceFromAPI,
  getBusinessPartnerMembersFromAPI,
  getBusinessPartnerResourceByIdFromAPI,
  deleteBusinessPartnerResourceByIdFromAPI,
  getBusinessPartnerResourcesFromAPI,
  uploadBusinessPartnerDocumentFileFromAPI,
  getBusinessPartnerDocumentsFromAPI,
  deleteBusinessPartnerDocumentFromAPI,
  updateBusinessPartnerResourceFromAPI,
} from "../../api";
import { createBusinessPartnerDocumentFromAPI } from "api/module/businessPartner";

import { actions as homeActions } from "../actions/home-actions";

export function* getBusinessPartnerMemberSagas() {
  try {
    const response = yield call(getBusinessPartnerMembersFromAPI);
    if (response.status === 200) {
      const { businessPartnerMembers } = response.data;

      yield put(
        businessPartnerActions.setBusinessPartnerMembers(businessPartnerMembers)
      );
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(businessPartnerActions.logout());
    }
  }
}

export function* getBusinessPartnerResourcesSagas() {
  try {
    const response = yield call(getBusinessPartnerResourcesFromAPI);
    if (response.status === 200) {
      const { businessResources } = response.data;
      yield put(
        businessPartnerActions.setBusinessPartnerResources(businessResources)
      );
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(businessPartnerActions.logout());
    }
  }
}

export function* getBusinessPartnerResounceByIdSagas({ payload }) {
  try {
    const response = yield call(getBusinessPartnerResourceByIdFromAPI, {
      ...payload,
    });
    if (response.status === 200) {
      const { businessResource } = response.data;
      yield put(
        businessPartnerActions.setBusinessPartnerResource(businessResource)
      );
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(businessPartnerActions.logout());
    }
  }
}

export function* updateBusinessPartnerResourcesSagas({ payload }) {
  try {
    let response = yield call(getBusinessPartnerResourcesFromAPI, {
      ...payload,
    });

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
  }
}
export function* updateBusinessPartnerResourceSagas({ payload }) {
  try {
    let response = yield call(updateBusinessPartnerResourceFromAPI, {
      ...payload,
    });
    // const { affectedRows } = response.data;
    if (response.status === 200) {
      yield getBusinessPartnerResourcesSagas();
      if (payload.callback) {
        payload.callback();
      }
    }
  } catch (error) {
    console.log(error);
    if (payload.callback) {
      payload.callback(error);
    }
  }
}

export function* removeBusinessPartnerResourceSaga({ payload }) {
  try {
    const response = yield call(
      deleteBusinessPartnerResourceByIdFromAPI,
      payload.id
    );
    if (response.status === 200) {
      yield getBusinessPartnerResourcesSagas();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* getBusinessPartnerDocumentsSagas() {
  try {
    const response = yield call(getBusinessPartnerDocumentsFromAPI);
    if (response.status === 200) {
      const { businessPartnerDocuments } = response.data;
      yield put(
        businessPartnerActions.setBusinessPartnerDocuments(
          businessPartnerDocuments
        )
      );
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(businessPartnerActions.logout());
    }
  }
}

export function* uploadBusinessPartnerDocumentSagas({ payload }) {
  try {
    const response = yield call(uploadBusinessPartnerDocumentFileFromAPI, {
      ...payload,
    });
    if (response.status === 200) {
      yield getBusinessPartnerDocumentsSagas();
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);
    if (payload.callback) {
      payload.callback(error);
    }
  }
}

export function* removeBusinessPartnerDocumentSaga({ payload }) {
  try {
    const response = yield call(
      deleteBusinessPartnerDocumentFromAPI,
      payload.document
    );
    if (response.status === 200) {
      yield getBusinessPartnerDocumentsSagas();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* updateBusinessPartnerDocumentsSagas({ payload }) {
  try {
    let response = yield call(getBusinessPartnerDocumentsFromAPI, {
      ...payload,
    });
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
  }
}

export function* createBusinessPartnerDocumentSagas({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(createBusinessPartnerDocumentFromAPI, {
      ...payload.businessPartnerDocument,
      ...payload.file,
    });
    if (response.status === 200) {
      if (payload.callback) {
        payload.callback();
      }
      const response = yield call(getBusinessPartnerDocumentsFromAPI);
      const { businessPartnerDocuments } = response.data;
      yield put(
        businessPartnerActions.updateBusinessPartnerDocuments(
          businessPartnerDocuments
        )
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

export function* createBusinessPartnerResourceSagas({ payload }) {
  try {
    const response = yield call(createBusinessPartnerResourceFromAPI, {
      ...payload.businessPartner,
    });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback();
      }
      const response = yield call(getBusinessPartnerResourcesFromAPI);
      const { businessPartnerResources } = response.data;
      yield put(
        businessPartnerActions.updateBusinessPartnerResourcesInformation(
          businessPartnerResources
        )
      );
    }
  } catch (error) {
    console.log(error);
    if (payload.callback) {
      payload.callback(error);
    }
  } finally {
    yield getBusinessPartnerResourcesSagas();
  }
}

function* watchBusinessPartner() {
  yield takeLatest(
    businessPartnerConstants.GET_BUSINESS_PARTNER_MEMBERS,
    getBusinessPartnerMemberSagas
  );
  yield takeLatest(
    businessPartnerConstants.UPDATE_BUSINESS_PARTNER_RESOURCES_INFORMATION,
    updateBusinessPartnerResourcesSagas
  );
  yield takeLatest(
    businessPartnerConstants.UPDATE_BUSINESS_PARTNER_RESOURCE,
    updateBusinessPartnerResourceSagas
  );
  yield takeLatest(
    businessPartnerConstants.DELETE_BUSINESS_PARTNER_RESOURCE,
    removeBusinessPartnerResourceSaga
  );
  yield takeLatest(
    businessPartnerConstants.GET_BUSINESS_PARTNER_DOCUMENTS,
    getBusinessPartnerDocumentsSagas
  );
  yield takeLatest(
    businessPartnerConstants.UPDATE_BUSINESS_PARTNER_DOCUMENTS,
    updateBusinessPartnerDocumentsSagas
  );
  yield takeLatest(
    businessPartnerConstants.UPDATE_BUSINESS_PARTNER_DOCUMENT_FILE,
    uploadBusinessPartnerDocumentSagas
  );
  yield takeLatest(
    businessPartnerConstants.CREATE_BUSINESS_PARTNER_DOCUMENT,
    createBusinessPartnerDocumentSagas
  );
  yield takeLatest(
    businessPartnerConstants.GET_BUSINESS_PARTNER_RESOURCES,
    getBusinessPartnerResourcesSagas
  );
  yield takeLatest(
    businessPartnerConstants.CREATE_BUSINESS_PARTNER_RESOURCE,
    createBusinessPartnerResourceSagas
  );
  yield takeLatest(
    businessPartnerConstants.GET_BUSINESS_PARTNER_RESOURCE,
    getBusinessPartnerResounceByIdSagas
  );
  yield takeLatest(
    businessPartnerConstants.DELETE_BUSINESS_PARTNER_DOCUMENT,
    removeBusinessPartnerDocumentSaga
  );
}

export const businessPartnerSaga = [fork(watchBusinessPartner)];
