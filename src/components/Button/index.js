import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import clsx from "clsx";

import "./style.scss";

class CustomButton extends React.Component {
  render() {
    const { type, text, size, className, remove, ...rest } = this.props;

    return (
      <Button
        {...rest}
        className={clsx("custom-button", type, size, className, {
          remove: remove,
        })}
      >
        {text}
      </Button>
    );
  }
}

CustomButton.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

CustomButton.defaultProps = {
  text: "",
  type: "primary",
  size: "lg",
  className: "",
};

export default CustomButton;
