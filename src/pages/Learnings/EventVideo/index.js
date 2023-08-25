import { notification, Tooltip, Space } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import Emitter from "services/emitter";
import { EVENT_TYPES } from "enum";
import { isEmpty } from "lodash";
import {
  StarOutlined,
  BookOutlined,
  BookFilled,
  SaveOutlined,
  SaveFilled,
} from "@ant-design/icons";

import LibraryClaimModal from "components/LibraryCard/LibraryClaimModal";

import { homeSelector } from "redux/selectors/homeSelector";
import {
  setLibraryViewed,
  claimLibrary,
  saveForLaterLibrary,
} from "redux/actions/library-actions";

import "./styles.scss";

const EventVideos = ({
  library,
  userProfile,
  claimLibrary,
  setLibraryViewed,
  saveForLaterLibrary,
  isInHRCredits = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

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
    claimLibrary(library.id, (err) => {
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
      !isEmpty(library.saveForLater) &&
      library.saveForLater.includes(userProfile.id);
    const status = isSavedForLater ? "not saved" : "saved";

    saveForLaterLibrary(library.id, userProfile.id, status, isInHRCredits);
  };

  return (
    <div className="event-video">
      <a
        href={library.link}
        target="_blank"
        rel="noopener noreferrer"
        className="event-video-content"
      >
        {library.title}
      </a>
      <div className="event-video-btns">
        <Space>
          {library.contentType === "video" && (
            <Tooltip
              title={
                library.viewed && library.viewed[userProfile.id] === "mark"
                  ? "Viewed"
                  : "Mark As Completed"
              }
            >
              {library.viewed && library.viewed[userProfile.id] === "mark" ? (
                <SaveFilled
                  className="icon-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLibraryViewed(
                      library.id,
                      library.viewed && library.viewed[userProfile.id] === "mark"
                        ? "unmark"
                        : "mark"
                    );
                  }}
                />
              ) : (
                <SaveOutlined
                  className="icon-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLibraryViewed(
                      library.id,
                      library.viewed && library.viewed[userProfile.id] === "mark"
                        ? "unmark"
                        : "mark"
                    );
                  }}
                />
              )}
            </Tooltip>
          )}
          {library.showClaim === 1 && (
            <Tooltip title="Claim HR Credits">
              <StarOutlined onClick={onClaimCredits} className="icon-btn" />
            </Tooltip>
          )}
          {library.contentType === "video" &&
            library.viewed &&
            library.viewed[userProfile.id] !== "mark" && (
              <Tooltip
                title={
                  !isEmpty(library.saveForLater) &&
                  library.saveForLater.includes(userProfile.id)
                    ? "Unsave"
                    : "Save for later"
                }
              >
                {!isEmpty(library.saveForLater) &&
                library.saveForLater.includes(userProfile.id) ? (
                  <BookFilled
                    className="icon-btn"
                    onClick={handleSaveForLater}
                  />
                ) : (
                  <BookOutlined
                    className="icon-btn"
                    onClick={handleSaveForLater}
                  />
                )}
              </Tooltip>
            )}
          {showFirewall && (
            <div
              className="library-card-firewall"
              onClick={() => setShowFirewall(false)}
            >
              <div className="upgrade-notification-panel" onClick={planUpgrade}>
                <h3>
                  Upgrade to a PREMIUM Membership and get unlimited access to
                  the LAB features
                </h3>
              </div>
            </div>
          )}
          <LibraryClaimModal
            visible={modalVisible}
            title="HR Credit Offered"
            destroyOnClose={true}
            data={library}
            onClaim={onHRClaimOffered}
            onCancel={() => setModalVisible(false)}
          />
        </Space>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  claimLibrary,
  setLibraryViewed,
  saveForLaterLibrary,
};
export default connect(mapStateToProps, mapDispatchToProps)(EventVideos);
