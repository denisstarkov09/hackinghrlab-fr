import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tooltip } from "antd";
import moment from "moment";

import { SpecialtyItem } from "components";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
const DATE_FORMAT = "MMMM DD, YYYY";

function EpisodeCard({
  created_at,
  episode_number,
  episode_cover,
  categories,
  links,
  allCategories,
  title,
}) {
  return (
    <div className="podcast-episode__card">
      <div className="podcast-episode__card-cover">
        <img
          src={episode_cover || HARDCODED_COVER_PLACEHOLDER}
          alt="header-img"
        />
      </div>
      <div className="podcast-episode__card-body">
        <div className="podcast-episode__card-body-data">
          <span className="podcast-episode__card-body-data-episode-num">
            Episode #{episode_number}
          </span>
          <span className="podcast-episode__card-body-data-episode-date">
            {moment(created_at).format(DATE_FORMAT)}
          </span>
        </div>
        <div className="podcast-episode__card-body-title">
          {title}
        </div>
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
            const category = allCategories.find((cat) => cat.value === item);
            return (
              <SpecialtyItem
                key={index}
                title={category ? category.title : item}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

EpisodeCard.propTypes = {
  created_at: PropTypes.object.isRequired,
  episode_number: PropTypes.number.isRequired,
  episode_cover: PropTypes.string,
  categories: PropTypes.array,
  links: PropTypes.array,
  title: PropTypes.string,
};

EpisodeCard.defaultProps = {
  created_at: "",
  episode_number: 0,
  episode_cover: HARDCODED_COVER_PLACEHOLDER,
  categories: [],
  links: [],
  title: "",
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(EpisodeCard);
