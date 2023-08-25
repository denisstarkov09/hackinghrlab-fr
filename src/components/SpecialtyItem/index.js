import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import "./style.scss";

const SpecialtyItem = ({ active, title }) => {
  return (
    <div className={clsx("specialty-item", { active: active })}>
      <span>{title}</span>
    </div>
  );
};

SpecialtyItem.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
};

SpecialtyItem.defaultProps = {
  active: true,
  title: "",
};

export default SpecialtyItem;
