import React, { useEffect } from "react";
import { connect } from "react-redux";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { businessPartnerSelector } from "redux/selectors/businessPartnerSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { getParticipants } from "redux/actions/session-actions";
import { getBusinessPartnerMembers } from "redux/actions/business-partner-actions";
import CouncilParticipantsCards from "components/CouncilParticipantsCards";
import "./style.scss";

const BusinessPartnerMembers = ({
  userProfile,
  businessPartnerMembers,
  getBusinessPartnerMembers,
}) => {
  useEffect(() => {
    getBusinessPartnerMembers();
  }, [userProfile, getBusinessPartnerMembers]);
  return (
    <div className="channel-page__list-wrap">
      <div className="participants-list">
        {businessPartnerMembers?.map((businessPartnerMember, i) => (
          <CouncilParticipantsCards
            key={i}
            participant={businessPartnerMember}
            invitedAllBonfires={true}
          />
        ))}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ...sessionSelector(state),
  userProfile: homeSelector(state).userProfile,
  businessPartnerMembers: businessPartnerSelector(state).businessPartnerMembers,
});

const mapDispatchToProps = {
  getParticipants,
  getBusinessPartnerMembers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessPartnerMembers);
