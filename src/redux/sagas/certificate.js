import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as certificateConstanst,
  actions as certificateActions,
} from "../actions/certificate-ations";

import {
    actions as homeActions,
  } from "../actions/home-actions";
import {
    createControlCertificateEndPoint,
    getControlCertificateEndPoint,
    getAllCertificateTypeEndPoint,
    getCodeCertificateEndPoint
} from "../../api";

export function* createControlCertificateSagas({ payload }) {
    const {data} = payload

    yield put(homeActions.setLoading(true));
  
    try {

      const response = yield call(createControlCertificateEndPoint, { data });
  
      if (response.status === 200) {

        const { codeCertificate } = response.data;

        yield put(homeActions.setLoading(false));
  
        if (payload.callback) {
          payload.callback(codeCertificate);
        }
  
      }
    } catch (error) {
      console.log(error)
        notification.error({
          message: "ERROR:",
          description: error?.response?.data?.msg,
        });
    } finally {
      yield put(homeActions.setLoading(false));
    }
}

export function* getCodeCertificateSagas({ payload }) {
  const {data} = payload

  yield put(homeActions.setLoading(true));

  try {

    const response = yield call(getCodeCertificateEndPoint, { data });

    if (response.status === 200) {

      const { codeCertificate } = response.data;

      yield put(homeActions.setLoading(false));

      if (payload.callback) {
        payload.callback(codeCertificate);
      }

    }
  } catch (error) {
    console.log(error)
      notification.error({
        message: "ERROR:",
        description: error?.response?.data?.msg,
      });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getCertficateSagas({ payload }) {
    const {code} = payload

    yield put(homeActions.setLoading(true));
  
    try {
      const response = yield call(getControlCertificateEndPoint, { code });
  
      if (response.status === 200) {

        yield put(homeActions.setLoading(false));

        const { userCertificate, certificate } = response.data;
  
        if (payload.callback) {
          payload.callback();
        }

        yield put(
            certificateActions.updateCertificate({
                certificate,
                userCertificate
            })
        );
  
      }
    } catch (error) {
        console.log(error)
        if (payload.callback) {
            payload.callback(true);
        }
    } finally {
      yield put(homeActions.setLoading(false));
    }
}

export function* getAllCertificateTypeSagas({ payload }) {
  const {type} = payload

    yield put(homeActions.setLoading(true));
  
    try {
      const response = yield call(getAllCertificateTypeEndPoint, { type });
  
      if (response.status === 200) {

        yield put(homeActions.setLoading(false));

        const { certificate } = response.data;
  
        if (payload.callback) {
          payload.callback();
        }

        yield put(
            certificateActions.updateAllCertificate({
                certificate,
            })
        );
  
      }
    } catch (error) {
        console.log(error)
        if (payload.callback) {
            payload.callback(true);
        }
    } finally {
      yield put(homeActions.setLoading(false));
    }
}

function* watchCertificate() {
  yield takeLatest(certificateConstanst.CONTROL_CERTIFICATE, createControlCertificateSagas);
  yield takeLatest(certificateConstanst.GET_CERTIFICATE, getCertficateSagas);
  yield takeLatest(certificateConstanst.GET_ALL_CERTIFICATE_TYPE, getAllCertificateTypeSagas);
  yield takeLatest(certificateConstanst.GET_CODE_CERTIFICATE, getCodeCertificateSagas);
}

export const certificateSaga = [fork(watchCertificate)];
