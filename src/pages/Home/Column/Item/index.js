import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CheckOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import moment from "moment";

import { SpecialtyItem, CustomButton } from "components";
import { categorySelector } from "redux/selectors/categorySelector";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  addToMyEventList,
  removeFromMyEventList,
} from "redux/actions/event-actions";

import { ReactComponent as IconDocument } from "images/icon-document.svg";
import { ReactComponent as IconVideo } from "images/icon-video.svg";

import "./style.scss";

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const HomeRecommendationsItem = ({
  element,
  allCategories,
  type,
  userProfile,
  addToMyEventList,
  removeFromMyEventList,
}) => {
  const [image, setImage] = useState(HARDCODED_COVER_PLACEHOLDER);
  const [eventStatus, setEventStatus] = useState("attend");
  const contentType = {
    article: { text: "Article", icon: <IconDocument /> },
    video: { text: "Video", icon: <IconVideo /> },
  };

  useEffect(() => {
    if (type === "podcast") {
      setImage(element.imageUrl);
    } else if (type !== "conference") {
      setImage(element.image);
    }

    if (type === "event") {
      if (element.status) {
        setEventStatus(element.status[userProfile.id] || "attend");
      }
    }
  }, [element, type, userProfile]);

  const onAttend = () => {
    setEventStatus("going");
    let event = element;
    event.going = true;
    addToMyEventList(event);
  };

  const onRemove = () => {
    setEventStatus("attend");
    let event = element;
    event.going = false;
    removeFromMyEventList(event);
  };

  const numberOfCategories = (element.topics || element.categories || [])
    .length;

  return (
    <div className="item-container">
      {type === "event" && (
        <div className="item-circle-date">
          <span>{moment(element.startDate).format("DD")}</span>
          <span>{moment(element.startDate).format("MMM")}</span>
        </div>
      )}
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
      {type === "library" && (
        <p className="item-description">{element.description}</p>
      )}
      {type !== "library" && type === "event" ? (
        <span className="item-date">
          {moment(element.startDate).format("DD MMM - HH:MM A ")}
        </span>
      ) : (
        type !== "library" && (
          <span className="item-date">
            {moment(element.createdAt).format("DD MMM")}
          </span>
        )
      )}
      {type === "library" && element.contentType && (
        <div className="item-library-info">
          <div className="item-library-type">
            {contentType[element.contentType].icon}
            {contentType[element.contentType].text}
          </div>
        </div>
      )}
      {type === "event" && (
        <div className="item-event-info">
          <span>{`${(element.location || []).join(", ")} event`}</span>
          <span>{element.ticket}</span>
        </div>
      )}
      {type !== "library" && (
        <div className="recomendation-topics">
          {(element.topics || element.categories || [])
            .slice(0, 2)
            .map((item, index) => {
              const category = allCategories.find((cat) => cat.value === item);
              return (
                <SpecialtyItem
                  key={`topic-item-recomendation-${index}`}
                  title={category ? category.title : item}
                  active={false}
                />
              );
            })}
          {numberOfCategories > 2 && (
            <span className="recomendation-topics-more">{`${numberOfCategories - 2
              }+ More`}</span>
          )}
        </div>
      )}
      {type === "event" && eventStatus === "attend" ? (
        <CustomButton
          text="REGISTER HERE"
          size="md"
          type="primary"
          onClick={() => {
            onAttend();
          }}
        />
      ) : (
        eventStatus === "going" && (
          <div className="going-group-part">
            <div className="going-label">
              <CheckOutlined />
              <span>I'm going</span>
            </div>
            <CustomButton
              className="not-going-btn"
              text="Not going"
              size="md"
              type="remove"
              remove={true}
              onClick={() => {
                onRemove();
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

HomeRecommendationsItem.propTypes = {
  element: PropTypes.object,
  allCategories: PropTypes.array,
  type: PropTypes.string,
  addToMyEventList: PropTypes.func,
  removeFromMyEventList: PropTypes.func,
};

HomeRecommendationsItem.defaultProps = {
  element: {},
  allCategories: [],
  type: "",
  addToMyEventList: () => { },
  removeFromMyEventList: () => { },
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  addToMyEventList,
  removeFromMyEventList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeRecommendationsItem);
