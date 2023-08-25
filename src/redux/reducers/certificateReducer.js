import { handleActions } from "redux-actions";

// Action Type Imports
import { constants as certificateConstanst } from "redux/actions/certificate-ations";
import { Map } from "immutable";

export const reducers = {
    [certificateConstanst.UPDATE_CERTIFICATE_INFORMATION]: (state, { payload }) => {
      const {data} = payload
      const {certificate,userCertificate,} = data
      
      return state.merge({
        certificate,
        userCertificate,
      })
    },
    [certificateConstanst.UPDATE_ALL_CERTIFICATE_INFORMATION]: (state, {payload}) => {
      const {data} = payload
      const {certificate} = data

      return state.merge({
        certificateLearning: certificate
      })
    }
  };
  
  export const initialState = () =>
    Map({
        userCertificate: {},
        certificate: {},
        certificateLearning: [],
    }
  );

  export default handleActions(reducers, initialState());
  