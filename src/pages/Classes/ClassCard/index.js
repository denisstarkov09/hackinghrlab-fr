import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";
import RenderPropsTruncatedString from "components/RenderPropsTruncatedString.js";
import { SpecialtyItem } from "components";
import { connect } from "react-redux";

import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const HARDCODED_COVER_PLACEHOLDER =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

function fmtMSS(s) {
  return (s - (s %= 60)) / 60;
}

const ClassCard = ({
  id,
  title,
  description,
  duration,
  image,
  hrCreditOffered,
  categories,
  allCategories,
}) => (
  <Link className="class-card" to={`${INTERNAL_LINKS.MICRO_CLASS}/${id}`}>
    <div className="class-card-header">
      {image && <img src={image} alt={title || "cover image"} />}
    </div>
    <div className="class-card-content">
      <h3 className="class-card-title">{title}</h3>
      <div className="d-flex items-center">
        <p className="class-card-desc">
          <RenderPropsTruncatedString text={description} threshold={250}>
            {({ truncatedText }) => <>{truncatedText}</>}
          </RenderPropsTruncatedString>
        </p>
      </div>
      <h5 className="class-card-hr">
        <strong>{`HR Credit Offered: `}</strong>
        {hrCreditOffered || ""}
      </h5>
      <h5 className="class-card-hr">
        <strong>{`Duration: `}</strong>
        {`${fmtMSS(duration)} minutes`}
      </h5>
      <div className="class-card-categories">
        {(categories || []).slice(0, 2).map((item, index) => {
          const category = allCategories.find((cat) => cat.value === item);
          return (
            <SpecialtyItem
              key={index}
              title={category ? category.title : item}
              active={false}
            />
          );
        })}
        {(categories || []).length > 2 && (
          <span className="class-card-categories-more">{`${
            (categories || []).length - 2
          }+ More`}</span>
        )}
      </div>
      <div className="class-card-content-footer">
        <div className="d-flex items-center"></div>
        <div className="d-flex items-center"></div>
      </div>
    </div>
  </Link>
);

ClassCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  hrCreditOffered: PropTypes.string,
  duration: PropTypes.number,
};

ClassCard.defaultProps = {
  title: "",
  description: "",
  image: HARDCODED_COVER_PLACEHOLDER,
  hrCreditOffered: "",
  duration: 0,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(ClassCard);
