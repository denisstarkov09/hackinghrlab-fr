import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Popover } from "antd";
import { Link } from "react-router-dom";

import { PUBLIC_HEADER_MENUS } from "enum";

import "./style.scss";

const PublicMenuPopup = ({ className, children, ...rest }) => {
  const [visible, setVisible] = useState(false);

  const ContentSection = () => (
    <div className="public-menu-popover-content">
      {PUBLIC_HEADER_MENUS.map((menu, index) => (
        <Link
          key={index}
          className="public-menu-popover-content-menu"
          to={menu.url}
          onClick={() => setVisible(false)}
        >
          {menu.text}
        </Link>
      ))}
    </div>
  );

  return (
    <Popover
      {...rest}
      className={clsx("public-menu-popover", className)}
      placement="bottomRight"
      trigger="click"
      visible={visible}
      content={<ContentSection />}
      onVisibleChange={(v) => setVisible(v)}
    >
      {children}
    </Popover>
  );
};

PublicMenuPopup.propTypes = {
  className: PropTypes.string,
};

PublicMenuPopup.defaultProps = {
  className: "",
};

export default PublicMenuPopup;
