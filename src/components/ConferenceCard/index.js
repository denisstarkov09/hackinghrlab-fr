import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Emitter from "services/emitter";
import { notification } from "antd";
import { isEmpty } from "lodash";

import ReactPlayer from "react-player";
import { SpecialtyItem, CustomButton } from "components";
import { categorySelector } from "redux/selectors/categorySelector";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  claimConferenceLibrary,
  setConferenceLibraryViewed,
  saveForLaterConference,
} from "redux/actions/conference-actions";
import { EVENT_TYPES, INTERNAL_LINKS } from "enum";
import LibraryClaimModal from "../LibraryCard/LibraryClaimModal";

import IconVideo from "images/icon-video.svg";

import "./style.scss";

const ConferenceCard = ({
  data,
  userProfile,
  allCategories,
  keyword,
  frequency,
  claimConferenceLibrary,
  setConferenceLibraryViewed,
  afterUpdate,
  isInternalLink,
  saveForLaterConference,
  listOfYearsIndex,
  isInHRCredits = false
}) => {
  const { title, year, categories } = data || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

  const onCardClick = () => {
    if (data.link && !modalVisible && !showFirewall) {
      if (isInternalLink === false) {
        window.location = `${INTERNAL_LINKS.LIBRARY_ITEM}/conference-library/${data.id}`;
      }

      if (data.viewed && !data.viewed[userProfile.id]) {
        setConferenceLibraryViewed(data.id, "unmark", listOfYearsIndex);
      }
    }
  };

  const onClaimCredits = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userProfile && userProfile.memberShip === "premium") {
      setModalVisible(true);
    } else {
      setShowFirewall(true);
    }
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const onHRClaimOffered = async () => {
    claimConferenceLibrary(data.id, (err) => {
      if (err) {
        notification.error({
          message: "Error",
          description: (err || {}).msg,
        });
      } else {
        notification.info({
          message: "Email was sent successfully.",
        });
        setModalVisible(false);
      }
    });
  };

  const handleSaveForLater = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isSavedForLater =
      !isEmpty(data.saveForLater) && data.saveForLater.includes(userProfile.id);
    const status = isSavedForLater ? "not saved" : "saved";

    saveForLaterConference(data.id, userProfile.id, status, listOfYearsIndex, isInHRCredits);
  };

  return (
    <div className="conference-card" onClick={onCardClick}>
      <div className="conference-card-header">
        <ReactPlayer
          className="conference-card-player"
          controls={isInternalLink === true}
          url={data.link}
          onPlay={() => {
            if (isInternalLink === false) {
              window.location = `${INTERNAL_LINKS.LIBRARY_ITEM}/conference-library/${data.id}`;
            }
          }}
        />
      </div>
      <div className="conference-card-content">
        <h3 className="conference-card-title">{title}</h3>
        <h6 className="conference-card-year">{year}</h6>
        <div className="conference-card-categories">
          {(categories || []).map((item, index) => {
            const category = allCategories.find((cat) => cat.value === item);
            return (
              <SpecialtyItem
                key={index}
                title={category ? category.title : item}
                active={false}
              />
            );
          })}
        </div>
        <div className="conference-card-content-footer">
          <div className="d-flex items-center">
            <div className="conference-card-icon">
              <img src={IconVideo} alt="doc-icon" />
            </div>
            <h6>Video</h6>
          </div>
          <div className="d-flex flex-column">
            <CustomButton
              className="mark-viewed"
              type={
                data.viewed[userProfile.id] === "mark" ? "remove" : "secondary"
              }
              size="xs"
              text={
                data.viewed[userProfile.id] === "mark"
                  ? "Viewed"
                  : "Mark As Completed"
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConferenceLibraryViewed(
                  data.id,
                  data.viewed[userProfile.id] === "mark" ? "unmark" : "mark",
                  listOfYearsIndex
                );
                setTimeout(() => {
                  afterUpdate();
                }, 500);
              }}
            />
            {data.showClaim === 1 && (
              <CustomButton
                className="claim-credits"
                type="primary"
                size="xs"
                text="Claim HR Credits"
                onClick={onClaimCredits}
              />
            )}
            {data.viewed && data.viewed[userProfile.id] !== "mark" && (
              <CustomButton
                className="save-for-later"
                type={
                  !isEmpty(data.saveForLater) &&
                  data.saveForLater.includes(userProfile.id)
                    ? "remove"
                    : "third"
                }
                size="xs"
                text={
                  !isEmpty(data.saveForLater) &&
                  data.saveForLater.includes(userProfile.id)
                    ? "Unsave"
                    : "Save for later"
                }
                onClick={handleSaveForLater}
              />
            )}
          </div>
        </div>
      </div>
      {frequency ? (
        <div className="conference-card-keyword">
          {`${keyword}: Found ${frequency} time${frequency > 1 ? "s" : ""}`}
        </div>
      ) : null}
      {showFirewall && (
        <div
          className="conference-card-firewall"
          onClick={() => setShowFirewall(false)}
        >
          <div className="upgrade-notification-panel" onClick={planUpgrade}>
            <h3>
              Upgrade to a PREMIUM Membership and get unlimited access to the
              LAB features
            </h3>
          </div>
        </div>
      )}
      <div className="test">
        <LibraryClaimModal
          visible={modalVisible}
          title="HR Credit Offered"
          destroyOnClose={true}
          data={data}
          onClaim={onHRClaimOffered}
          onCancel={() => setModalVisible(false)}
        />
      </div>
    </div>
  );
};

ConferenceCard.propTypes = {
  data: PropTypes.object,
  frequency: PropTypes.number,
  keyword: PropTypes.string,
  afterUpdate: PropTypes.func,
  isInternalLink: PropTypes.bool,
};

ConferenceCard.defaultProps = {
  data: {},
  frequency: 0,
  keyword: "",
  afterUpdate: () => {},
  isInternalLink: false,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  claimConferenceLibrary,
  setConferenceLibraryViewed,
  saveForLaterConference,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceCard);
