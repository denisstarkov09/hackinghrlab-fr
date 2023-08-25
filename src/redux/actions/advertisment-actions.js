import { createAction } from "redux-actions";

const GET_ADVERTISEMENTS_TODAY_BY_PAGE = "GET_ADVERTISEMENTS_TODAY_BY_PAGE";
const SET_ADVERTISEMENTS_TODAY_BY_PAGE = "SET_ADVERTISEMENTS_TODAY_BY_PAGE";
const GET_ADVERTISEMENTS_BY_ADVERTISER = "GET_ADVERTISEMENTS_BY_ADVERTISER";
const SET_ADVERTISEMENTS_BY_ADVERTISER = "SET_ADVERTISEMENTS_BY_ADVERTISER";
const CREATE_ADVERTISEMENT = "CREATE_ADVERTISEMENT";
const GET_ADVERTISEMENT_BY_ID = "GET_ADVERTISEMENT_BY_ID";
const SET_ADVERTISEMENT_BY_ID = "SET_ADVERTISEMENT_BY_ID";
const GET_ALL_ACTIVE_ADVERTISEMENTS = "GET_ALL_ACTIVE_ADVERTISEMENTS";
const SET_ALL_ACTIVE_ADVERTISEMENTS = "SET_ALL_ACTIVE_ADVERTISEMENTS";
const SET_CREATED_ADVERTISEMENT = "SET_CREATED_ADVERTISEMENT";
const EDIT_ADVERTISEMENT_BY_ADVERTISER = "EDIT_ADVERTISEMENT_BY_ADVERTISER";
const SET_EDIT_ADVERTISEMENT_BY_ADVERTISER =
  "SET_EDIT_ADVERTISEMENT_BY_ADVERTISER";
const CREATE_ADVERTISEMENT_CLICK = "CREATE_ADVERTISEMENT_CLICK";

export const constants = {
  GET_ADVERTISEMENTS_TODAY_BY_PAGE,
  SET_ADVERTISEMENTS_TODAY_BY_PAGE,
  GET_ADVERTISEMENTS_BY_ADVERTISER,
  SET_ADVERTISEMENTS_BY_ADVERTISER,
  CREATE_ADVERTISEMENT,
  GET_ADVERTISEMENT_BY_ID,
  SET_ADVERTISEMENT_BY_ID,
  GET_ALL_ACTIVE_ADVERTISEMENTS,
  SET_ALL_ACTIVE_ADVERTISEMENTS,
  SET_CREATED_ADVERTISEMENT,
  EDIT_ADVERTISEMENT_BY_ADVERTISER,
  SET_EDIT_ADVERTISEMENT_BY_ADVERTISER,
  CREATE_ADVERTISEMENT_CLICK,
};

export const getAdvertisementsTodayByPage = createAction(
  GET_ADVERTISEMENTS_TODAY_BY_PAGE,
  (page) => ({ page })
);
export const setAdvertisementsTodayByPage = createAction(
  SET_ADVERTISEMENTS_TODAY_BY_PAGE,
  (advertisement, page) => ({ advertisement, page })
);

export const getAdvertisementsByAdvertiser = createAction(
  GET_ADVERTISEMENTS_BY_ADVERTISER,
  (UserId) => ({ UserId })
);
export const setAdvertisementsByAdvertiser = createAction(
  SET_ADVERTISEMENTS_BY_ADVERTISER,
  (advertisements) => ({ advertisements })
);
export const createAdvertisement = createAction(
  CREATE_ADVERTISEMENT,
  (advertisement) => ({ advertisement })
);
export const getAdvertisementById = createAction(
  GET_ADVERTISEMENT_BY_ID,
  (advertisementId) => ({ advertisementId })
);
export const setAdvertisement = createAction(
  SET_ADVERTISEMENT_BY_ID,
  (advertisement) => ({ advertisement })
);
export const getAllActiveAdvertisements = createAction(
  GET_ALL_ACTIVE_ADVERTISEMENTS
);
export const setAllActiveAdvertisements = createAction(
  SET_ALL_ACTIVE_ADVERTISEMENTS,
  (advertisements) => ({ advertisements })
);
export const setCreatedAdvertisement = createAction(
  SET_CREATED_ADVERTISEMENT,
  (advertisement) => ({ advertisement })
);
export const editAdvertisement = createAction(
  EDIT_ADVERTISEMENT_BY_ADVERTISER,
  (AdvertisementId, payload) => ({ AdvertisementId, payload })
);
export const setEditAdvertisement = createAction(
  SET_EDIT_ADVERTISEMENT_BY_ADVERTISER,
  (advertisement) => ({ advertisement })
);
export const createAdvertisementClick = createAction(
  CREATE_ADVERTISEMENT_CLICK,
  (advertisementId) => ({ advertisementId })
);

export const actions = {
  getAdvertisementsTodayByPage,
  setAdvertisementsTodayByPage,
  getAdvertisementsByAdvertiser,
  setAdvertisementsByAdvertiser,
  createAdvertisement,
  getAdvertisementById,
  setAdvertisement,
  getAllActiveAdvertisements,
  setAllActiveAdvertisements,
  setCreatedAdvertisement,
  editAdvertisement,
  setEditAdvertisement,
  createAdvertisementClick
};
