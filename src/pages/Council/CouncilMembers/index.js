import React, { useEffect } from "react";
import { connect } from "react-redux";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { councilSelector } from "redux/selectors/councilSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { getParticipants } from "redux/actions/session-actions";
import { getCouncilMembers } from "redux/actions/council-actions";
import CouncilParticipantsCards from "../../../components/CouncilParticipantsCards";
import "./style.scss";

const CouncilMembers = ({ userProfile, councilMembers, getCouncilMembers }) => {
  useEffect(() => {
    if (userProfile.topicsOfInterest.length > 0) {
      getCouncilMembers();
    }
  }, [userProfile, getCouncilMembers]);
  return (
    <div className="channel-page__list-wrap">
      <div className="participants-list">
        {councilMembers?.map((councilMember, i) => (
          <CouncilParticipantsCards
            key={i}
            participant={councilMember}
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
  councilMembers: councilSelector(state).councilMembers,
});

const mapDispatchToProps = {
  getParticipants,
  getCouncilMembers,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilMembers);
