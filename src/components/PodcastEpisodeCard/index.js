import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tooltip } from "antd";
import moment from "moment";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { useHistory, useParams } from "react-router";
import { isEmpty } from "lodash";

import { SpecialtyItem, CustomButton } from "components";
import CardMenu from "../CardMenu";
import { categorySelector } from "redux/selectors/categorySelector";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  setPodcastViewed,
  saveForLaterPodcast,
} from "redux/actions/podcast-actions";

import { CARD_TYPE, INTERNAL_LINKS } from "enum";

import { ReactComponent as IconPlus } from "images/icon-plus.svg";
import IconMenu from "images/icon-menu.svg";

import "./style.scss";

const DATE_FORMAT = "MMMM DD, YYYY";

function EpisodeCard({
  links,
  allCategories,
  type,
  keyword,
  frequency,
  onAdd,
  onMenuClick,
  userProfile,
  setPodcastViewed,
  isInternalLink,
  episode,
  saveForLaterPodcast,
}) {
  const {
    id,
    title,
    createdAt,
    order: episode_number,
    imageUrl: episode_cover,
    topics: categories,
    viewed,
    saveForLater: saveForLaterData,
  } = episode || {};
  const [linkValue, setLinkValue] = useState("img");
  const history = useHistory();
  const params = useParams();

  const onCardClick = () => {
    if (type === CARD_TYPE.ADD) {
      onAdd();
    } else if (isInternalLink === false) {
      history.push(
        params.id
          ? `${INTERNAL_LINKS.LIBRARY_ITEM}/podcast/${episode.id}?channel=${params.id}`
          : `${INTERNAL_LINKS.LIBRARY_ITEM}/podcast/${episode.id}`
      );
    }
  };
  const handleSaveForLater = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isSavedForLater =
      !isEmpty(saveForLaterData) && saveForLaterData.includes(userProfile?.id);
    const status = isSavedForLater ? "not saved" : "saved";

    saveForLaterPodcast(id, userProfile?.id, status);
  };

  useEffect(() => {
    const selectImageOrVideoLink = () => {
      if (!episode?.vimeoLink || episode?.vimeoLink === " ") {
        setLinkValue("img");
        return linkValue;
      }
      if (
        episode.vimeoLink?.includes("youtube") ||
        episode.vimeoLink?.includes("vimeo")
      ) {
        setLinkValue("video");
      }
    };

    selectImageOrVideoLink();
  }, [episode, linkValue]);

  return (
    <div
      className={clsx("podcast-episode__card", { add: type === CARD_TYPE.ADD })}
      onClick={onCardClick}
    >
      {type === CARD_TYPE.ADD ? (
        <div className="podcast-episode__card-plus">
          <IconPlus />
        </div>
      ) : (
        <>
          <div className="podcast-episode__card-cover">
            {isInternalLink === false ? (
              <>
                {episode_cover ? (
                  <img src={episode_cover} alt="header-img" />
                ) : (
                  <div />
                )}
              </>
            ) : linkValue === "img" ? (
              <div>
                <img
                  src={episode_cover}
                  alt="header-img"
                />
              </div>
            ) : (
              <ReactPlayer
                className="podcast-episode__player"
                controls={isInternalLink === true}
                url={episode.vimeoLink}
              />
            )}
          </div>
          <div className="podcast-episode__card-body">
            <div className="podcast-episode__card-body-data">
              <span className="podcast-episode__card-body-data-episode-num">
                Episode #{episode_number}
              </span>
              <span className="podcast-episode__card-body-data-episode-date">
                {moment(createdAt).format(DATE_FORMAT)}
              </span>
            </div>
            <div className="podcast-episode__card-body-title">{title}</div>
            <div className="podcast-episode__card-body-links">
              {links.length > 0 && (
                <>
                  <span className="podcast-episode__card-body-links-heading">
                    Listen on:
                  </span>
                  <div className="link-list">
                    {links.map((link, i) => (
                      <Tooltip key={i} placement="top" title={link.label}>
                        <a
                          className="podcast-episode__card-body-link"
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="podcast-episode__card-body-link-icon"
                            style={{
                              backgroundImage: `url(${link.icon})`,
                            }}
                            aria-label={`Listen on ${link.label}`}
                          ></span>
                        </a>
                      </Tooltip>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="podcast-episode__card-body-categories">
              {(categories || []).map((item, index) => {
                const category = allCategories.find(
                  (cat) => cat.value === item
                );
                return (
                  <SpecialtyItem
                    key={index}
                    title={category ? category.title : item}
                  />
                );
              })}
            </div>
            <div className="d-flex flex-column card-btn">
              <CustomButton
                className="mark-viewed"
                type={
                  viewed && viewed[userProfile?.id] === "mark"
                    ? "remove"
                    : "secondary"
                }
                size="xs"
                text={
                  viewed && viewed[userProfile?.id] === "mark"
                    ? "Viewed"
                    : "Mark As Completed"
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPodcastViewed(
                    id,
                    viewed && viewed[userProfile?.id] === "mark"
                      ? "unmark"
                      : "mark"
                  );
                }}
              />
              {viewed && viewed[userProfile?.id] !== "mark" && (
                <CustomButton
                  className="save-for-later"
                  type={
                    !isEmpty(saveForLaterData) &&
                    saveForLaterData.includes(userProfile?.id)
                      ? "remove"
                      : "third"
                  }
                  size="xs"
                  text={
                    !isEmpty(saveForLaterData) &&
                    saveForLaterData.includes(userProfile?.id)
                      ? "Unsave"
                      : "Save for later"
                  }
                  onClick={handleSaveForLater}
                />
              )}
            </div>
            {type === CARD_TYPE.EDIT && (
              <CardMenu onClick={onMenuClick}>
                <div className="podcast-episode__card-menu">
                  <img src={IconMenu} alt="icon-menu" />
                </div>
              </CardMenu>
            )}
            {frequency ? (
              <div className="podcast-episode__card-keyword">
                {`${keyword}: Found ${frequency} time${
                  frequency > 1 ? "s" : ""
                }`}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

EpisodeCard.propTypes = {
  created_at: PropTypes.object,
  episode_number: PropTypes.number,
  episode_cover: PropTypes.string,
  categories: PropTypes.array,
  links: PropTypes.array,
  title: PropTypes.string,
  type: PropTypes.string,
  frequency: PropTypes.number,
  keyword: PropTypes.string,
  onAdd: PropTypes.func,
  onMenuClick: PropTypes.func,
  isInternalLink: PropTypes.bool,
  episode: PropTypes.object,
};

EpisodeCard.defaultProps = {
  created_at: {},
  episode_number: 0,
  episode_cover: "",
  categories: [],
  links: [],
  title: "",
  type: CARD_TYPE.VIEW,
  frequency: 0,
  keyword: "",
  onAdd: () => {},
  onMenuClick: () => {},
  isInternalLink: false,
  episode: null,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setPodcastViewed,
  saveForLaterPodcast,
};

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeCard);
