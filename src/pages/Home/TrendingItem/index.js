import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import moment from "moment";

import { ReactComponent as IconVideo } from "images/icon-video.svg";
import { ReactComponent as IconLearningJourney } from "images/icon-library.svg";
import { ReactComponent as IconCalendar } from "images/icon-calendar-number-outline.svg";
import { ReactComponent as IconMicOutline } from "images/icon-mic-outline.svg";

import "./style.scss";

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const TrendingItem = ({ element, type }) => {
  const [image, setImage] = useState(HARDCODED_COVER_PLACEHOLDER);

  const contentType = {
    library: { text: "Learning library", icon: <IconLearningJourney /> },
    article: { text: "Article", icon: <IconLearningJourney /> },
    video: { text: "Video", icon: <IconVideo /> },
    event: { text: "Upcoming event", icon: <IconCalendar /> },
    podcast: { text: "Podcast", icon: <IconMicOutline /> },
    conference: { text: "Conference library", icon: <IconVideo /> },
  };

  useEffect(() => {
    if (type === "podcast") {
      setImage(element.imageUrl);
    } else if (type !== "conference") {
      setImage(element.image);
    }
  }, [type, element]);

  return (
    <div className="trending-item-container">
      <div className="img-container">
        {type !== "conference" ? (
          <>
            {image ? (
              <img
                src={image}
                className={`image-${type}`}
                alt={`${type}-${element.id}`}
              />
            ) : (
              <div className="img-container-empty" />
            )}
          </>
        ) : (
          <>
            {element.link ? (
              <ReactPlayer
                className={`image-${type}`}
                controls={false}
                url={element.link}
              />
            ) : (
              <div className="img-container-empty" />
            )}
          </>
        )}
      </div>
      <h3>
        {type !== "event" ? (
          <a
            href={type === "podcast" ? element.appleLink : element.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {element.title}
          </a>
        ) : (
          element.title
        )}
      </h3>
      {type !== "event" && <p>{element.description}</p>}
      {type !== "library" && type === "event" && (
        <p>
          <span className="item-date">
            {moment(element.startDate).format("DD MMM - HH:MM A ")}
          </span>
          <span className="item-ticket">{element.ticket}</span>
        </p>
      )}
      {type === "event" ? (
        <div className="item-library-info">
          <div className="item-library-type">
            {contentType[type].icon}
            {contentType[type].text} -{" "}
            {`${(element.location || []).join(", ")} event`}
          </div>
        </div>
      ) : (
        <div className="item-library-info">
          <div className="item-library-type">
            {contentType[type].icon}
            {contentType[type].text}
          </div>
        </div>
      )}
    </div>
  );
};

TrendingItem.propTypes = {
  element: PropTypes.object,
  type: PropTypes.string,
  addToMyEventList: PropTypes.func,
  removeFromMyEventList: PropTypes.func,
};

TrendingItem.defaultProps = {
  element: {},
  type: "",
  addToMyEventList: () => {},
  removeFromMyEventList: () => {},
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TrendingItem);
