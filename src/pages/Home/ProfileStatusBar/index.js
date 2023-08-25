import React from "react";
import PropTypes from "prop-types";
import { Alert } from "antd";

import { CustomButton, CircularProgressbar } from "components";
import Emitter from "services/emitter";
import { EVENT_TYPES, TIMEZONE_LIST, COUNTRIES } from "enum";

import "./style.scss";

const ProfileStatusBar = ({ user }) => {
  const timezone = (
    TIMEZONE_LIST.find((item) => item.value === user.timezone) || {}
  ).text;
  const location = (
    COUNTRIES.find((item) => item.value === user.location) || {}
  ).text;
  const openProfileEditWindow = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE, true);
  };

  return (
    <>
      <div className="profile-status-bar">
        <div className="section-left">
          <span>We want to show you the most relevant information for you</span>
          <CustomButton
            text="Complete your profile"
            type="primary"
            size="lg"
            onClick={openProfileEditWindow}
          />
        </div>
        <div className="section-right">
          <CircularProgressbar
            percent={user ? user.percentOfCompletion : 0}
            color="#fe5621"
          />
        </div>
      </div>
      <Alert
        message={
          <>
            <strong>Missing information:</strong>
            <ul className="inline-comma">
              {!user.img ? <li>Profile Picture</li> : null}
              {!user.firstName ? <li>First name</li> : null}
              {!user.lastName ? <li>Last name</li> : null}
              {!user.titleProfessions ? <li>Title</li> : null}
              {!user.company ? <li>Company</li> : null}
              {!location ? <li>Location</li> : null}
              {!user.city ? <li>City</li> : null}
              {!timezone ? <li>Time zone</li> : null}
              {!user.languages ? (
                <li>Main language</li>
              ) : Object.keys(user.languages).length === 0 ? (
                <li>Main languages</li>
              ) : null}
              {!user.about ? <li>Tell us more about you</li> : null}
              {user.topicsOfInterest ? (
                Object.keys(user.topicsOfInterest).length === 0 ? (
                  <li>Topics of interest</li>
                ) : null
              ) : (
                <li>Topics of interest</li>
              )}
              {user.personalLinks ? (
                !user.personalLinks.hasOwnProperty("linkedin") ? (
                  <li>Personal links</li>
                ) : user.personalLinks.linkedin.toString().trim() === "" ||
                  user.personalLinks.linkedin.toString().trim() ===
                    "https://" ? (
                  <li>Personal links</li>
                ) : null
              ) : null}
              {user.isOpenReceivingEmail === -1 ? (
                <li>
                  Are open to receiving information/being contacted via email
                  about open job positions?
                </li>
              ) : null}
              {!user.recentJobLevel ? (
                <li>
                  What best defines your current or most recent job level?
                </li>
              ) : null}
              {Array.isArray(user.recentWorkArea) ? (
                user.recentWorkArea.length === 0 ? (
                  <li>
                    In what area of HR do you currently work or most recently
                    worked?
                  </li>
                ) : null
              ) : null}
              {!user.sizeOfOrganization ? (
                <li>What is the size of the organization your work for?</li>
              ) : null}
            </ul>
          </>
        }
        type="info"
      />
    </>
  );
};

ProfileStatusBar.propTypes = {
  user: PropTypes.object,
};

ProfileStatusBar.defaultProps = {
  user: {},
};

export default ProfileStatusBar;
