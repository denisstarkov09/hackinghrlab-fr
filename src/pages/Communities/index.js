import React from "react";
import { connect } from "react-redux";
import { CustomSwitch } from "components";
import CommunityOption from "./Option";
import { INTERNAL_LINKS } from "enum";
import { updateReciveCommunityNotification } from "redux/actions/home-actions";
import WaterCoolerImage from "../../images/water-cooler.png";
import MentoringImage from "../../images/two-way-communication.png";
import BonfireImage from "../../images/bonfire.png";
import CoachingImage from "../../images/coaching.png";

import "./style.scss";
import { homeSelector } from "redux/selectors/homeSelector";

const CommunititesPage = ({
  userProfile,
  updateReciveCommunityNotification,
}) => {
  const handleReciveNotification = () => {
    updateReciveCommunityNotification(
      !userProfile.receiveCommunityNotification
    );
  };
  return (
    <div className="communities-page">
      <div className="communities-page-container">
        <CommunityOption
          title="Watercooler"
          subTitle="Projects and Collaboration"
          image={WaterCoolerImage}
          coomingSoon="(Coming November 2022)"
        />

        <CommunityOption
          title="Mentoring"
          image={MentoringImage}
          link={`${INTERNAL_LINKS.COMMUNITIES}/mentoring`}
        />

        <CommunityOption
          title="Bonfire"
          subTitle="Conversations and Sharing"
          image={BonfireImage}
          link={`${INTERNAL_LINKS.COMMUNITIES}/bonfires`}
        />

        <CommunityOption
          title="Group Coaching"
          image={CoachingImage}
          coomingSoon="(Coming in 2023)"
        />
      </div>

      <div className="turn-notification">
        <span>
          Do you want to be notified when a new project of your interest is
          posted?
        </span>
        <div className="switch-container">
          <span>No</span>{" "}
          <CustomSwitch
            checked={userProfile.receiveCommunityNotification}
            onChange={handleReciveNotification}
          />{" "}
          <span>Yes</span>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  updateReciveCommunityNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunititesPage);
