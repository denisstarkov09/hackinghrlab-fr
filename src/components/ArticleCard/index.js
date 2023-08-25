import React from "react";
import PropTypes from "prop-types";

import { SvgIcon } from "components";
import { SEARCH_FILTERS } from "enum";

import "./style.scss";

let ContentTypes = SEARCH_FILTERS.library["Content type"];
ContentTypes = ContentTypes.reduce(
  (res, item) => ({ ...res, [item.value]: item }),
  {}
);

class ArticleCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineClamp: 3,
      randomId: `article-description-${Math.floor(Math.random() * 1000)}`,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.getRowNum();
    }, 500);
    window.addEventListener("resize", () => {
      this.getRowNum();
    });
  }

  getRowNum = () => {
    const descElement = document.querySelector(`#${this.state.randomId}`);
    if (descElement) {
      const maxRow = Math.floor(descElement.offsetHeight / 23);
      this.setState({ lineClamp: maxRow ? maxRow : 1 });
    }
  };

  onCardClick = () => {
    const { data } = this.props;

    if (data.link) {
      window.open(data.link);
    }
  };

  render() {
    const {
      data: { image2, title, description, contentType },
      className,
    } = this.props;
    const { randomId, lineClamp } = this.state;
    const newClassName = `article-card ${className || ""}`;

    return (
      <div className={newClassName} onClick={this.onCardClick}>
        <div className="article-card-img">
          {image2 && <img src={image2} alt="article-card-img" />}
        </div>
        <div className="article-card-content">
          <h3>{title}</h3>
          <div id={randomId} className="d-flex items-center">
            <p
              style={{
                WebkitLineClamp: lineClamp,
                maxHeight: 23 * lineClamp,
              }}
            >
              {description}
            </p>
          </div>
          <div className="article-card-content-file">
            <div className="d-flex items-center">
              <div className="article-card-icon">
                <img
                  src={(ContentTypes[contentType || "article"] || {}).icon}
                  alt="doc-icon"
                />
              </div>
              <h6>{(ContentTypes[contentType || "article"] || {}).text}</h6>
            </div>
            <div className="d-flex items-center">
              <SvgIcon name="star" className="article-card-icon" />
              <SvgIcon name="bookmark" className="article-card-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ArticleCard.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
};

ArticleCard.defaultProps = {
  data: {},
  className: "",
};

export default ArticleCard;
