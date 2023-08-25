import React from "react";
import PropTypes from "prop-types";
import { Progress } from "antd";

import "./style.scss";

class CircularProgressbar extends React.Component {
  getPos = () => {
    const { width, percent } = this.props;
    const RADIAN = Math.PI / 180;
    const radius = width / 2 - 4 / 2;
    const x =
      width / 2 + radius * Math.cos((90 - (360 * percent) / 100) * RADIAN) - 7;
    const y =
      width / 2 - radius * Math.cos(((360 * percent) / 100) * RADIAN) - 7;
    return { left: x, top: y };
  };

  render() {
    const { color, percent, width } = this.props;
    const dotPos = this.getPos();

    return (
      <div className="circular-progress-bar">
        <Progress
          strokeColor={color}
          strokeWidth={4}
          width={width}
          type="circle"
          percent={percent}
          format={() => (
            <div className="circular-progress-bar-inner">
              <span>{`Only ${100 - percent}%`}</span>
              <span>{`to go!`}</span>
            </div>
          )}
        />
        <i className="circular-progress-bar-dot fas fa-circle" style={dotPos} />
      </div>
    );
  }
}

CircularProgressbar.propTypes = {
  percent: PropTypes.number,
  color: PropTypes.string,
  width: PropTypes.number,
};

CircularProgressbar.defaultProps = {
  percent: 0,
  color: "#fe5621",
  width: 140,
};

export default CircularProgressbar;
