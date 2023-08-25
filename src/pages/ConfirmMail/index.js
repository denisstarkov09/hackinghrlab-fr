import React, { useEffect } from "react";
import { connect } from "react-redux";

import { homeSelector } from "redux/selectors/homeSelector";
import { actions as homeActions } from "redux/actions/home-actions";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";

const ConfirmMail = ({ confirmApply }) => {
  const { search } = useLocation();
  const { id } = useParams();
  const query = new URLSearchParams(search);
  const accepted = query.get("accepted");

  useEffect(() => {
    confirmApply(id, accepted === "true" ? true : false);
  }, [id, confirmApply, accepted]);
  return (
    <>
    </>
  );
};

const mapStateToProps = (state) => homeSelector(state);

const mapDispatchToProps = {
  confirmApply: homeActions.confirmInvitationApply,
  ...homeActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmMail);
