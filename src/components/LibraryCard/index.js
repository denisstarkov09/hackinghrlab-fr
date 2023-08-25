import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import clsx from "clsx";
import ReactPlayer from "react-player";
import Emitter from "services/emitter";
import { notification, Tooltip } from "antd";
import { isEmpty } from "lodash";

import CustomButton from "../Button";
import LibraryClaimModal from "./LibraryClaimModal";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  setLibraryViewed,
  claimLibrary,
  saveForLaterLibrary,
} from "redux/actions/library-actions";
import { SEARCH_FILTERS, CARD_TYPE, CARD_MENUS, EVENT_TYPES } from "enum";
import { ReactComponent as IconPlus } from "images/icon-plus.svg";
import CardMenu from "../CardMenu";
import IconMenu from "images/icon-menu.svg";

import "./style.scss";

let ContentTypes = SEARCH_FILTERS.library["Content type"];
ContentTypes = ContentTypes.reduce(
  (res, item) => ({ ...res, [item.value]: item }),
  {}
);

const LibraryCard = ({
  data,
  type,
  keyword,
  frequency,
  userProfile,
  onAdd,
  onMenuClick,
  claimLibrary,
  setLibraryViewed,
  saveForLaterLibrary,
  isInHRCredits = false,
  isFree = false,
}) => {
  const { viewed, saveForLater: saveForLaterData } = data;
  const [lineClamp, setLineClamp] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  const { title, image, description, contentType } = data || {};
  const randomId = `article-description-${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        getRowNum();
      }
    }, 500);

    window.addEventListener("resize", getRowNum);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", getRowNum);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isUserPremium = userProfile.memberShip === "premium";
    const isLibraryItemPremium = data.isPremium;

    if (isUserPremium && isLibraryItemPremium) {
      setIsClickable(true);
    } else if (!isLibraryItemPremium) {
      setIsClickable(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const getRowNum = () => {
    const descElement = document.querySelector(`#${randomId}`);
    if (descElement) {
      const maxRow = Math.floor(descElement.offsetHeight / 23);
      setLineClamp(maxRow ? maxRow : 1);
    }
  };

  const onCardClick = () => {
    if (isClickable) {
      if (type === CARD_TYPE.ADD) {
        onAdd();
      } else if (data.link && !modalVisible) {
        if(data.link !== 'https://'){
          window.open(data.link);
        }
      }
    }
  };

  const onClaimCredits = (e) => {
    if (isClickable) {
      e.preventDefault();
      e.stopPropagation();
      if (userProfile && userProfile.memberShip === "premium") {
        setModalVisible(true);
      } else {
        setShowFirewall(true);
      }
    }
  };

  const handleSaveForLater = (e) => {
    if (isClickable) {
      e.preventDefault();
      e.stopPropagation();

      const isSavedForLater =
        !isEmpty(saveForLaterData) && saveForLaterData.includes(userProfile.id);
      const status = isSavedForLater ? "not saved" : "saved";

      saveForLaterLibrary(data.id, userProfile.id, status, isInHRCredits);
    }
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const onHRClaimOffered = async () => {
    claimLibrary(data.id, (err) => {
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

  const tooltipTitle = isClickable ? "" : "ONLY FOR PREMIUM USERS";

  return (
    <Tooltip title={tooltipTitle}>
      <div
        className={clsx("library-card", {
          add: type === CARD_TYPE.ADD,
          isNotClickable: !isClickable,
        })}
        onClick={onCardClick}
        // style={{ background: "red" }}
      >
        <div
          className={clsx({
            overlay: !isClickable,
          })}
        ></div>
        {type === CARD_TYPE.ADD ? (
          <div className="library-card-plus">
            <IconPlus />
          </div>
        ) : (
          <>
            <div className="library-card-header">
              {contentType === "video" && (
                <ReactPlayer
                  className="library-card-player"
                  controls={false}
                  url={data.link}
                />
              )}
              {contentType !== "video" && image && (
                <img src={image} alt="header-img" />
              )}
            </div>
            <div className="library-card-content">
              <h3 className="library-card-title">{title}</h3>
              <div id={randomId} className="d-flex items-center">
                <p
                  className="library-card-desc"
                  style={{
                    WebkitLineClamp: lineClamp,
                    maxHeight: 22 * lineClamp,
                  }}
                >
                  {description}
                </p>
              </div>
              <div className="library-card-content-footer">
                <div className="d-flex items-center">
                  <div className="library-card-icon">
                    <img
                      src={(ContentTypes[contentType || "article"] || {}).icon}
                      alt="doc-icon"
                    />
                  </div>
                  <h6>{(ContentTypes[contentType || "article"] || {}).text}</h6>
                </div>

                <div className="d-flex flex-column">
                  {contentType === "video" && (
                    <CustomButton
                      className={clsx("mark-viewed", {
                        isNotClickable: !isClickable,
                      })}
                      type={
                        viewed && viewed[userProfile.id] === "mark"
                          ? "remove"
                          : "secondary"
                      }
                      size="xs"
                      text={
                        viewed && viewed[userProfile.id] === "mark"
                          ? "Viewed"
                          : "Mark As Completed"
                      }
                      onClick={(e) => {
                        if (isClickable) {
                          e.preventDefault();
                          e.stopPropagation();
                          setLibraryViewed(
                            data.id,
                            viewed && viewed[userProfile.id] === "mark"
                              ? "unmark"
                              : "mark"
                          );
                        }
                      }}
                    />
                  )}
                  {data.showClaim === 1 && (
                    <CustomButton
                      className={clsx("claim-credits", {
                        isNotClickable: !isClickable,
                      })}
                      type="primary"
                      size="xs"
                      text="Claim HR Credits"
                      onClick={onClaimCredits}
                    />
                  )}
                  {contentType === "video" &&
                    viewed &&
                    viewed[userProfile.id] !== "mark" && (
                      <CustomButton
                        className={clsx("save-for-later", {
                          isNotClickable: !isClickable,
                        })}
                        type={
                          !isEmpty(saveForLaterData) &&
                          saveForLaterData.includes(userProfile.id)
                            ? "remove"
                            : "third"
                        }
                        size="xs"
                        text={
                          !isEmpty(saveForLaterData) &&
                          saveForLaterData.includes(userProfile.id)
                            ? "Unsave"
                            : "Save for later"
                        }
                        onClick={handleSaveForLater}
                      />
                    )}
                </div>
              </div>
              {type === CARD_TYPE.EDIT && (
                <CardMenu
                  menus={CARD_MENUS}
                  onClick={(value) => {
                    if (isClickable) {
                      onMenuClick(value);
                    }
                  }}
                >
                  <div className="library-card-menu">
                    <img src={IconMenu} alt="icon-menu" />
                  </div>
                </CardMenu>
              )}
            </div>
            {frequency ? (
              <div className="library-card-keyword">
                {`${keyword}: Found ${frequency} time${
                  frequency > 1 ? "s" : ""
                }`}
              </div>
            ) : null}
          </>
        )}
        {showFirewall && (
          <div
            className="library-card-firewall"
            onClick={() => {
              if (isClickable) {
                setShowFirewall(false);
              }
            }}
          >
            <div
              className="upgrade-notification-panel"
              onClick={() => {
                if (isClickable) {
                  planUpgrade();
                }
              }}
            >
              <h3>
                Upgrade to a PREMIUM Membership and get unlimited access to the
                LAB features
              </h3>
            </div>
          </div>
        )}

        <LibraryClaimModal
          visible={modalVisible}
          title="HR Credit Offered"
          destroyOnClose={true}
          data={data}
          onClaim={onHRClaimOffered}
          onCancel={() => setModalVisible(false)}
        />
      </div>
    </Tooltip>
  );
};

LibraryCard.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  frequency: PropTypes.number,
  keyword: PropTypes.string,
  onAdd: PropTypes.func,
  onMenuClick: PropTypes.func,
};

LibraryCard.defaultProps = {
  data: {},
  type: CARD_TYPE.VIEW,
  frequency: 0,
  keyword: "",
  onAdd: () => {},
  onMenuClick: () => {},
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  claimLibrary,
  setLibraryViewed,
  saveForLaterLibrary,
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryCard);
