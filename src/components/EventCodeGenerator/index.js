import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import IconRefresh from "images/icon-refresh.svg";

import "./style.scss";

const EventCodeGenerator = ({
  className,
  value,
  disabled,
  onChange,
  ...rest
}) => {
  const getRandomCode = () => {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  };

  useEffect(() => {
    if (!value) {
      onChange(getRandomCode());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx("code-generator", className)}>
      <div className="code-generator-value">
        <span>{value}</span>
      </div>
      {!disabled && (
        <img
          src={IconRefresh}
          alt="refres-icon"
          onClick={() => onChange(getRandomCode())}
        />
      )}
    </div>
  );
};

EventCodeGenerator.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

EventCodeGenerator.defaultProps = {
  className: "",
  value: "",
  disabled: false,
  onChange: () => {},
};

export default EventCodeGenerator;
