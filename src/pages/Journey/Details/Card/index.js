import React from "react";
import PropTypes from "prop-types";
import { Typography, Button } from "antd";

import { ReactComponent as IconMenuOutline } from "images/icon-menu-outline.svg";
import { ReactComponent as IconCheckmark } from "images/icon-checkmark.svg";
import { ReactComponent as IconCalendar } from "images/icon-calendar.svg";
import { ReactComponent as IconDocument } from "images/icon-document.svg";
import { ReactComponent as IconHeadsetOutline } from "images/icon-headset-outline.svg";
import { ReactComponent as IconVideo } from "images/icon-video.svg";

const { Paragraph } = Typography;

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const JourneyDetailsCard = ({
  element,
  description,
  markAsViewed,
  remove,
  addItem,
  viewed,
}) => {
  const contentType = {
    article: { text: "Article", icon: <IconDocument /> },
    event: { text: "Event", icon: <IconCalendar /> },
    podcast: { text: "Podcast", icon: <IconHeadsetOutline /> },
    video: { text: "Video", icon: <IconVideo /> },
  };
  return (
    <>
      <div
        className={`journey-details-container__card__container ${
          element.removed ? "removed" : ""
        }`}
      >
        <div className="journey-details-container__card__container--check">
          <div className="journey-details-container__card__container--check--line"></div>
          <div
            className={
              element.viewed === true
                ? "journey-details-container__card__container--check--blue-circle"
                : "journey-details-container__card__container--check--circle"
            }
          >
            <IconCheckmark />
          </div>
        </div>
        <div className={`journey-details-container__card__container--content`}>
          <div className="journey-details-container__card__container--content--order">
            <IconMenuOutline />
          </div>
          <div
            className={`journey-details-container__card__container--content--card`}
          >
            <div className="card-image">
              <img
                src={element.image || HARDCODED_COVER_PLACEHOLDER}
                alt="header-img"
              />
            </div>
            <div className="card-information">
              {element.isNew && (
                <div className="card-new-flag-container">
                  <span>NEW</span>
                </div>
              )}
              <h3>
                <a
                  href={element.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {element.title}
                </a>
              </h3>
              <Paragraph
                ellipsis={{
                  rows: 3,
                  expandable: false,
                }}
              >
                {description}
              </Paragraph>
              <div className="card-information-footer">
                <span className="content-type">
                  {contentType[element.contentType].icon}{" "}
                  {contentType[element.contentType].text}
                </span>
                <div className="card--actions">
                  {element.removed === false && element.viewed === true ? (
                    <Button
                      className="button-viewed"
                      type="primary"
                      onClick={viewed}
                    >
                      Viewed
                    </Button>
                  ) : (
                    element.removed === false && (
                      <Button type="primary" onClick={markAsViewed}>
                        Mark as viewed
                      </Button>
                    )
                  )}
                  {element.removed === false ? (
                    <Button onClick={remove} danger>
                      Remove
                    </Button>
                  ) : (
                    <Button type="primary" onClick={addItem}>
                      Add Item
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

JourneyDetailsCard.propTypes = {
  element: PropTypes.object,
  description: PropTypes.string,
  markAsViewed: PropTypes.func,
  remove: PropTypes.func,
  addItem: PropTypes.func,
  viewed: PropTypes.func,
};

JourneyDetailsCard.defaultProps = {
  element: null,
  description: "",
  markAsViewed: () => {},
  remove: () => {},
  addItem: () => {},
  viewed: () => {},
};

export default JourneyDetailsCard;
