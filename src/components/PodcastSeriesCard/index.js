import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { SpecialtyItem, CustomButton } from "components";
import { categorySelector } from "redux/selectors/categorySelector";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  setPodcastseriesViewed,
  saveForLaterPodcastSeries,
} from "redux/actions/podcast-actions";

import "./style.scss";

const PodcastSeriesCard = ({
  data,
  allCategories,
  userProfile,
  onClick,
  setPodcastseriesViewed,
  saveForLaterPodcastSeries,
  isInHRCredits = false
}) => {
  const [lineClamp, setLineClamp] = useState(12);
  const {
    id,
    title,
    img,
    description,
    hrCreditOffered,
    categories,
    viewed,
    saveForLater: saveForLaterData,
  } = data || {};
  const randomId = `podcastseries-description-${Math.floor(
    Math.random() * 1000
  )}`;

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

  const getRowNum = () => {
    const descElement = document.querySelector(`#${randomId}`);
    if (descElement) {
      const maxRow = Math.floor(descElement.offsetHeight / 18);
      setLineClamp(maxRow ? maxRow : 1);
    }
  };

  const handleSaveForLater = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isSavedForLater =
      !isEmpty(saveForLaterData) && saveForLaterData.includes(userProfile.id);
    const status = isSavedForLater ? "not saved" : "saved";

    saveForLaterPodcastSeries(id, userProfile.id, status, isInHRCredits);
  };

  return (
    <div className="podcast-series-card" onClick={onClick}>
      <div className="podcast-series-card-header">
        {img ? (
          <img src={img} alt="header-img" />
        ) : (
          <div className="podcast-series-card-backimg" />
        )}
      </div>
      <div className="podcast-series-card-content">
        <h3 className="podcast-series-card-title">{title}</h3>
        <div id={randomId} className="d-flex">
          <p
            className="podcast-series-card-desc"
            style={{
              WebkitLineClamp: lineClamp,
              maxHeight: 50 * lineClamp,
            }}
          >
            {description}
          </p>
        </div>
        <h5 className="podcast-series-card-hr">
          <strong>{`HR Credit Offered: `}</strong>
          {hrCreditOffered || ""}
        </h5>
        <div className="podcast-series-card-categories">
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
        <div className="d-flex flex-column card-btn">
          <CustomButton
            className="mark-viewed"
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
              e.preventDefault();
              e.stopPropagation();
              setPodcastseriesViewed(
                data.id,
                viewed && viewed[userProfile.id] === "mark" ? "unmark" : "mark"
              );
            }}
          />
          {viewed && viewed[userProfile.id] !== "mark" && (
            <CustomButton
              className="save-for-later"
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
    </div>
  );
};

PodcastSeriesCard.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};

PodcastSeriesCard.defaultProps = {
  data: {},
  onClick: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setPodcastseriesViewed,
  saveForLaterPodcastSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastSeriesCard);
