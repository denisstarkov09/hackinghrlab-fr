import { createAction } from "redux-actions";

const GET_PARTNERS = "GET_PARTNERS";
const GET_PARTNER = "GET_PARTNER";
const SET_PARTNERS = "SET_PARTNERS";
const SET_PARTNER = "SET_PARTNER";

export const constants = {
  GET_PARTNERS,
  GET_PARTNER,
  SET_PARTNERS,
  SET_PARTNER,
};

export const getPartners = createAction(GET_PARTNERS);
export const getPartner = createAction(GET_PARTNER, (id) => ({ id }));

export const setPartners = createAction(SET_PARTNERS, (partners) => ({
  partners,
}));
export const setPartner = createAction(SET_PARTNER, (partner) => ({
  partner,
}));

export const actions = {
  getPartners,
  setPartners,
  getPartner,
  setPartner,
};
