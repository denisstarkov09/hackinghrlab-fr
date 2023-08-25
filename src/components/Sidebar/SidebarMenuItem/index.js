import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

class SidebarMenuItem extends React.Component {
  render() {
    const { icon, text } = this.props;

    return (
      <div className="sidebar-menu-item">
        {text !== 'My Learning' ? (
          <div className="sidebar-menu-item-icon">
            <img src={icon} alt="menu-icon" />
          </div>
        ) : (
          <div className="sidebar-menu-item-icon-2">
            <img src={icon} alt="menu-icon" />
          </div>
        )}
        <span className="sidebar-menu-item-text">{text}</span>
      </div>
    );
  }
}

SidebarMenuItem.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
};

SidebarMenuItem.defaultProps = {
  icon: null,
  text: "",
};

export default SidebarMenuItem;
