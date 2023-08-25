import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  CustomButton,
  CustomDrawer,
  ProfileAvatar,
  SpecialtyItem,
} from "components";
import { LANGUAGES, TIMEZONE_LIST } from "enum";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const Languages = LANGUAGES.ParsedLanguageData;

const MemberDrawer = ({
  visible,
  member,
  allCategories,
  match,
  onClose,
  onMatch,
}) => {
  const getLanguage = (value) => {
    const language = (Languages.find((item) => item.value === value) || {})
      .text;

    return language;
  };

  const timezone = TIMEZONE_LIST.find(
    (item) => member && item.value === member.timezone
  );

  const blockMatch =
    member.isMentor === 1
      ? member.blockMatchAsMentor === 1
      : member.blockMatchAsMentee === 1;

  return (
    <CustomDrawer
      title={"Mentor profile"}
      width={772}
      visible={visible}
      onClose={onClose}
    >
      <div className="member-details">
        <div className="member-details-header">
          <ProfileAvatar
            className="user-info-avatar"
            user={member}
            color="#438cef"
            percent={member.percentOfCompletion}
          />
          <h1 className="user-info-name">{`${member.firstName} ${member.lastName}`}</h1>
          {!blockMatch && (
            <CustomButton
              className="profile-complete-btn"
              text={member.connected ? "Connected" : "Match"}
              type="primary"
              size="lg"
              disabled={member.connected}
              onClick={() => !member.connected && onMatch()}
            />
          )}
        </div>
        <div className="member-details-content">
          <h5 className="member-details-content-label">
            {`Why do I to be a ${member.isMentor ? "mentor" : "mentee"}?`}
          </h5>
          <p className="member-details-content-text">
            {member.mentorAbout || ""}
          </p>
          <h5 className="member-details-content-label">Title / Profession</h5>
          <p className="member-details-content-text">{member.title || ""}</p>
          <h5 className="member-details-content-label">My specialties</h5>
          <div className="member-details-content-specialties">
            {(member.areas || [])
              .sort((x, y) => {
                const first = (match || []).includes(x);
                const second = (match || []).includes(y);

                return !first && second ? 1 : first && second ? 0 : -1;
              })
              .map((spec, index) => {
                const specialty = allCategories.find(
                  (item) => item.value === spec
                );

                return (
                  <SpecialtyItem
                    key={`specialty-${index}`}
                    title={specialty ? specialty.title : ""}
                    active={(match || []).includes(spec)}
                  />
                );
              })}
          </div>
          <h5 className="member-details-content-label">Main language</h5>
          {member.languages && member.languages.length > 0 ? (
            member.languages.map((lang, index) => (
              <p key={index} className="member-details-content-text">
                {getLanguage(lang)}
              </p>
            ))
          ) : (
            <p className="member-details-content-text">-</p>
          )}
          <h5 className="member-details-content-label">Time zone</h5>
          <p className="member-details-content-text">
            {timezone ? timezone.text : ""}
          </p>
        </div>
      </div>
    </CustomDrawer>
  );
};

MemberDrawer.propTypes = {
  member: PropTypes.object,
  match: PropTypes.array,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onMatch: PropTypes.func,
};

MemberDrawer.defaultProps = {
  member: {},
  match: [],
  visible: false,
  onClose: () => {},
  onMatch: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(MemberDrawer);
