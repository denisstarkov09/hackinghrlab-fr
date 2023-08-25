import React from "react";
import PropTypes from "prop-types";
import { Progress } from "antd";
import clsx from "clsx";

import "./style.scss";

class ProfileAvatar extends React.Component {
  getPos = () => {
    const { width, percent } = this.props;
    const RADIAN = Math.PI / 180;
    const radius = width / 2 - 4 / 2;
    const x =
      width / 2 + radius * Math.cos((90 - (360 * percent) / 100) * RADIAN) - 4;
    const y =
      width / 2 - radius * Math.cos(((360 * percent) / 100) * RADIAN) - 4;
    return { left: x, top: y };
  };

  render() {
    const { color, percent, width, className, user } = this.props;
    const dotPos = this.getPos();

    return (
      <div className={clsx("profile-avatar", className)}>
        <Progress
          strokeColor={color}
          strokeWidth={2}
          width={width}
          type="circle"
          percent={percent}
          format={() => (
            <div className="profile-avatar-inner">
              {user.img ? (
                <div className="profile-avatar-wrapper">
                  <img src={user.img} alt="user-avatar" />
                </div>
              ) : (
                <h1>{user.abbrName}</h1>
              )}
            </div>
          )}
        />
        {percent !== 0 && percent !== 100 && (
          <i
            className="profile-avatar-dot fas fa-circle"
            style={{ ...dotPos, color: color }}
          />
        )}
      </div>
    );
  }
}

ProfileAvatar.propTypes = {
  className: PropTypes.string,
  percent: PropTypes.number,
  color: PropTypes.string,
  width: PropTypes.number,
  user: PropTypes.object,
};

ProfileAvatar.defaultProps = {
  className: "",
  percent: 0,
  color: "#fe5621",
  width: 120,
  user: {},
};

export default ProfileAvatar;
