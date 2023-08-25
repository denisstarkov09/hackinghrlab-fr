import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CustomButton } from "components";

import HomeRecommendationsItem from "./Item";

import { INTERNAL_LINKS } from "enum";

import "./style.scss";

const HomeRecommendationsColumn = ({ columnTitle, type, items, history }) => {
  const [buttonText, setButtonText] = useState("View more");
  const [buttonLink, setButtonLink] = useState(null);

  useEffect(() => {
    switch (type) {
      case "podcast":
        setButtonLink(INTERNAL_LINKS.PODCAST);
        setButtonText("More podcasts");
        break;
      case "library":
        setButtonLink(INTERNAL_LINKS.LEARNING_LIBRARY);
        break;
      case "conference":
        setButtonLink(INTERNAL_LINKS.CONFERENCE_LIBRARY);
        setButtonText("More videos");
        break;
      case "event":
        setButtonLink(INTERNAL_LINKS.EVENTS);
        setButtonText("More events");
        break;
      default:
      // do nothing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMore = () => {
    history.push(buttonLink);
  };

  return (
    <div className="column-container">
      <div className="column-container__title-container">
        <h3>{columnTitle}</h3>
      </div>
      <div className="column-container__content">
        {items.map((item, index) => (
          <HomeRecommendationsItem
            key={`${type}-${index}`}
            element={item}
            type={type}
          />
        ))}
      </div>
      <div className="column-container__button-container">
        <CustomButton
          onClick={() => {
            onMore();
          }}
          type="primary outlined"
          size="md"
          text={buttonText}
        />
      </div>
    </div>
  );
};

HomeRecommendationsColumn.propTypes = {
  columnTitle: PropTypes.string,
  history: PropTypes.object,
  items: PropTypes.array,
  type: PropTypes.string,
};

HomeRecommendationsColumn.defaultProps = {
  columnTitle: "",
  history: {},
  items: [],
  type: "",
};

export default HomeRecommendationsColumn;
