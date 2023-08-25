import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import { actions as speakerActions, constants as speakerConstans } from "redux/actions/speaker-actions";
import {
    actions as homeActions,
  } from "../actions/home-actions";
import {
    allPanelSpeakersEndPonit,
    getAllUserSpeakerEndPoint,
    removeUserSpeakerToPanelEndPoint,
    addUserSpeakerToPanelEndPoint,
    registerUserIfNotAreRegisterConference2023EndPoint,
    getAllPanelsOfOneUserEndPoint,
    getAllMyPanels,
    addedToPersonalAgendaEndPoint,
    getAllSponsors2023EndPoint,
    getAllParrafsEndPoint,
    getAllMemberSpeakerPanelEndPoint
} from "../../api";

export function* getPanelSpeakerSaga({ payload }) {
  const {type, filters} = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(allPanelSpeakersEndPonit, { type });

    if (response.status === 200) {
      const { panelsSpeakers } = response.data;
        
      yield put(
        speakerActions.updatePanelSpeakers({panelsSpeakers}, filters)
      );
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

export function* getAllUserSpeakerSaga({payload}) {
  const {UserId} = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllUserSpeakerEndPoint, { UserId });

    if (response.status === 200) {
      const { userSpeakers } = response.data;

      yield put(
        speakerActions.updateAllUserSpeakers({
          userSpeakers
        })
      );
      yield put(homeActions.setLoading(false));
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

export function* removeUserSpeakerToPanelSaga({ payload }) {

  const {data} = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeUserSpeakerToPanelEndPoint, { data });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Withdrawn successfully",
      });
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

export function* addUserSpeakerToSaga({ payload }) {
  const {data} = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addUserSpeakerToPanelEndPoint, { data });

    if (response.status === 200) {
      const { panelsSpeakers } = response?.data;
      
      yield put(
        speakerActions.updatePanelSpeakers({
          panelsSpeakers
        })
      );

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Thank you for joining this panel",
      });
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

export function* registerUserIfNotAreRegisterConference2023({payload}) {

  try {

    const response = yield call(registerUserIfNotAreRegisterConference2023EndPoint);

    if(response.status === 200){
      if(payload.callback){
        payload.callback()
      }
    }

  } catch (error) {
    console.log(error)
    if(error?.response?.data?.msg){
      notification.error({
        message: "ERROR:",
        description: error?.response?.data?.msg,
      
      });
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllPanelsOfOneUserSagas({payload}) {

  const {UserId} = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllPanelsOfOneUserEndPoint, { UserId });

    if (response.status === 200) {
      const { userSpeakers } = response.data;
      if(payload.callback){
        payload.callback();
      }

      yield put(
        speakerActions.updateAllPanelsOfOneUser(
          userSpeakers
        )
      );
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

export function* getAllPanelsOfOneUserSpeakersSagas({payload}) {

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllMyPanels);

    if (response.status === 200) {
      const { userSpeakers } = response.data;
      if(payload.callback){
        payload.callback();
      }

      yield put(
        speakerActions.updateAllPanelsOfOneUserSpeakers(
          userSpeakers
        )
      );
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

export function* addedToPersonalAgendaSagas({payload}) {
  
  const {data} = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addedToPersonalAgendaEndPoint,  {data} );

    if (response.status === 200) {

      if (payload.callback) {
        payload.callback();
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

export function* getAllSponsors2023Sagas() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllSponsors2023EndPoint);
    if (response.status === 200) {
      const { sponsor } = response.data;

      yield put(
        speakerActions.updateAllSponsors2023(
          sponsor
        )
      );
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

export function* getAllParrafsSagas({payload}) {

  const {type} = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllParrafsEndPoint, { type });

    if (response.status === 200) {
      const { parraf } = response.data;

      yield put(
        speakerActions.updateParraf({
          parraf
        })
      );
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

export function* getAllMemberSpeakerPanelSagas({payload}) {

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllMemberSpeakerPanelEndPoint);

    if (response.status === 200) {
      const { member } = response.data;

      yield put(
        speakerActions.setAllMemberSpeakerPanel({
          member
        })
      );
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

function* watchLogin() {
    yield takeLatest(speakerConstans.GET_PANEL_SPEAKERS, getPanelSpeakerSaga);
    yield takeLatest(speakerConstans.GET_USERS_SPEAKERS, getAllUserSpeakerSaga);
    yield takeLatest(speakerConstans.REMOVE_USERS_PANEL, removeUserSpeakerToPanelSaga);
    yield takeLatest(speakerConstans.ADD_SPEAKER_TO_PANEL, addUserSpeakerToSaga);
    yield takeLatest(speakerConstans.REGISTER_USER_IF_NOT_REGISTER_CONFERENCE_2023 , registerUserIfNotAreRegisterConference2023);
    yield takeLatest(speakerConstans.GET_ALL_PANELS_OF_ONE_USER, getAllPanelsOfOneUserSagas);
    yield takeLatest(speakerConstans.ADDED_TO_MY_PERSONAL_AGENDA, addedToPersonalAgendaSagas);
    yield takeLatest(speakerConstans.GET_ALL_SPONSORS, getAllSponsors2023Sagas);
    yield takeLatest(speakerConstans.GET_ALL_PARRAF_CONFERENCE , getAllParrafsSagas);
    yield takeLatest(speakerConstans.GET_SPEAKER_MEMBER , getAllMemberSpeakerPanelSagas);
    yield takeLatest(speakerConstans.MY_PANELS_USER , getAllPanelsOfOneUserSpeakersSagas);
}
  
export const speakerSaga = [fork(watchLogin)];