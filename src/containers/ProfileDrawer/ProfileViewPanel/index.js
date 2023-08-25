import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import { connect } from "react-redux";

import { ProfileAvatar, CustomButton } from "components";
import {
  CONTACT_ICONS,
  TIMEZONE_LIST,
  LANGUAGES,
  COUNTRIES,
  PROFILE_SETTINGS,
} from "enum";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import { createConversartion } from "redux/actions/conversation-actions";
import { setVisibleProfileUser } from "redux/actions/home-actions";
import { isEmptyPersonalLinks } from "utils/profile";

import "./style.scss";

const Languages = LANGUAGES.ParsedLanguageData;

const WorkAreas = PROFILE_SETTINGS.WORK_AREAS;

class ProfileViewPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
    };
  }

  componentDidUpdate(preProps) {
    if (!isEqual(preProps.user, this.props.user)) {
      this.setState({ user: this.props.user });
    }
  }

  onEdit = () => {
    this.props.onEdit();
  };

  getEmptyPersonalLinks = (personalLinks) => {
    let empty = true;
    if (personalLinks) {
      Object.keys(personalLinks).forEach((contact) => {
        if (personalLinks[contact]) {
          empty = false;
        }
      });
    }

    return empty;
  };

  getLanguage = (value) => {
    const language = (Languages.find((item) => item.value === value) || {})
      .text;

    return language;
  };

  handleStartConversation = (members) => {
    this.props.createConversartion(members);
    this.props.setVisibleProfileUser(false);
  };

  render() {
    const { user } = this.state;
    const personalLinksCompleted = !isEmptyPersonalLinks(user.personalLinks);
    const timezone = (
      TIMEZONE_LIST.find((item) => item.value === user.timezone) || {}
    ).text;
    const location = (
      COUNTRIES.find((item) => item.value === user.location) || {}
    ).text;

    return (
      <div className="profile-view-panel">
        <div className="profile-view-panel-header">
          <ProfileAvatar
            className="user-info-avatar"
            user={user}
            percent={user.percentOfCompletion}
          />
          <h1 className="user-info-name">{`${user.firstName} ${user.lastName}`}</h1>
          {}
          {this.props.userProfile.id === user.id ? (
            <CustomButton
              className="profile-complete-btn"
              text={user.completed ? "Edit Profile" : "Complete profile"}
              type="primary"
              size="lg"
              onClick={this.onEdit}
            />
          ) : (
            <CustomButton
              type="primary"
              size="lg"
              text={`Chat`}
              onClick={() =>
                this.handleStartConversation([
                  user.id,
                  this.props.userProfile.id,
                ])
              }
            />
          )}
        </div>
        <div className="profile-view-panel-content">
          {user.id === this.props.userProfile.id && (
            <>
              <h5 className="textfield-label">Email</h5>
              <h3 className="textfield-value completed">{user.email}</h3>
            </>
          )}
          <h5 className="textfield-label">Title</h5>
          <h3
            className={clsx("textfield-value", {
              completed: !!user.titleProfessions,
            })}
          >
            {user.titleProfessions || "-"}
          </h3>
          <h5 className="textfield-label">Company</h5>
          <h3
            className={clsx("textfield-value", { completed: !!user.company })}
          >
            {user.company || "-"}
          </h3>
          <h5 className="textfield-label">Location</h5>
          <h3
            className={clsx("textfield-value", {
              completed: !!location,
            })}
          >
            {location || "-"}
          </h3>
          <h5 className="textfield-label">City</h5>
          <h3 className={clsx("textfield-value", { completed: !!user.city })}>
            {user.city || "-"}
          </h3>
          {user.id === this.props.userProfile.id && (
            <>
              <h5 className="textfield-label">Time zone</h5>
              <h3
                className={clsx("textfield-value", {
                  completed: !!user.timezone,
                })}
              >
                {timezone || "-"}
              </h3>
            </>
          )}

          <h5 className="textfield-label">Main language</h5>
          {user?.languages && user?.languages?.length > 0 ? (
            user?.languages.map((lang, index) => (
              <h3 key={index} className="textfield-value completed">
                {this.getLanguage(lang)}
              </h3>
            ))
          ) : (
            <h3 className="textfield-value">-</h3>
          )}
          <h5 className="textfield-label">Tell us more about you</h5>
          <h3 className={clsx("textfield-value", { completed: !!user.about })}>
            {user.about || "-"}
          </h3>
          <h5 className="textfield-label">Topics of interest</h5>
          <h3
            className={clsx("textfield-value", {
              completed:
                user?.topicsOfInterest && user?.topicsOfInterest?.length,
            })}
          >
            {user.topicsOfInterest
              ?.map((item) => {
                const index = this.props.allCategories.findIndex(
                  (t) => t.value === item
                );
                if (index >= 0) {
                  return this.props.allCategories[index].title;
                }
                return item;
              })
              .join(", ") || "-"}
          </h3>
          <h5 className="textfield-label">Personal links</h5>
          {personalLinksCompleted &&
            Object.keys(user.personalLinks).map((contact) => {
              if (contact === "linkedin") {
                return (
                  <div className="personal-link" key={contact}>
                    <div className="personal-link-icon">
                      <i className={CONTACT_ICONS[contact]} />
                    </div>
                    <h3 className="textfield-value completed">
                      {user.personalLinks[contact] || ""}
                    </h3>
                  </div>
                );
              } else {
                return null;
              }
            })}
          {!personalLinksCompleted && <h3 className="textfield-value">-</h3>}
          {user.id === this.props.userProfile.id && (
            <>
              <h5 className="textfield-label">
                Are open to receiving information/being contacted via email
                about open job positions?
              </h5>
              <h3
                className={clsx("textfield-value", {
                  completed: user.isOpenReceivingEmail !== -1,
                })}
              >
                {user.isOpenReceivingEmail === 1
                  ? "Yes"
                  : user.isOpenReceivingEmail === 0
                  ? "No"
                  : "-"}
              </h3>
            </>
          )}
          <h5 className="textfield-label">
            {user.id === this.props.userProfile.id
              ? "What best defines your current or most recent job level?"
              : "Job Level"}
          </h5>
          <h3
            className={clsx("textfield-value", {
              completed: !!user.recentJobLevel,
            })}
          >
            {user.recentJobLevel || "-"}
          </h3>
          {user.id === this.props.userProfile.id && (
            <>
              <h5 className="textfield-label">
                In what area of HR do you currently work or most recently
                worked?
              </h5>
              <h3
                className={clsx("textfield-value", {
                  completed: user.recentWorkArea && user.recentWorkArea.length,
                })}
              >
                {user.recentWorkArea.includes("all")
                  ? WorkAreas.filter((item) => item.value !== "all")
                      .map((item) => item.label)
                      .join(", ")
                  : user.recentWorkArea.join(", ") || "-"}
              </h3>
            </>
          )}
          <h5 className="textfield-label">
            {user.id === this.props.userProfile.id
              ? "What is the size of the organization your work for?"
              : "Size of the organization"}
          </h5>
          <h3
            className={clsx("textfield-value", {
              completed: !!user.sizeOfOrganization,
            })}
          >
            {user.sizeOfOrganization || "-"}
          </h3>
        </div>
      </div>
    );
  }
}

ProfileViewPanel.propTypes = {
  user: PropTypes.object,
  onEdit: PropTypes.func,
};

ProfileViewPanel.defaultProps = {
  user: {},
  onEdit: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  createConversartion,
  setVisibleProfileUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileViewPanel);
