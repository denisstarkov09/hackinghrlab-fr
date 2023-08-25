import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { SVG_ICONS } from "enum";

import "./style.scss";

const SvgIcons = {
  star: SVG_ICONS.ICON_STAR,
  bookmark: SVG_ICONS.ICON_BOOKMARK,
};

class CustomIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
    };
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ active: !this.state.active });
    this.setState(
      (state) => {
        state.active = !this.state.active;
        return state;
      },
      () => {
        this.props.onChange(this.state.active);
      }
    );
  };

  render() {
    const { size, className, name, active, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={clsx("custom-icon", className, size, {
          active: this.state.active,
        })}
        onClick={this.onClick}
      >
        {SvgIcons[name]}
      </div>
    );
  }
}

CustomIcon.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  active: PropTypes.bool,
  onChange: PropTypes.func,
};

CustomIcon.defaultProps = {
  size: "sm",
  className: "",
  name: "star",
  active: false,
  onChange: () => {},
};

export default CustomIcon;
