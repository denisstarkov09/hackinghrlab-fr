import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { connect } from "react-redux";
import { CloseCircleFilled } from "@ant-design/icons";
import clsx from "clsx";

import { envSelector } from "redux/selectors/envSelector";
import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";

const CustomModal = ({
  className,
  wrapClassName,
  title,
  subTitle,
  visible,
  width,
  children,
  isMobile,
  onCancel,
  ...rest
}) => {
  return isMobile ? (
    <div className={clsx("custom-panel", { visible: visible })}>
      <div className="custom-panel-header">
        <div className="custom-panel-header-logo">
          <img src={IconLogo} alt="payment-logo" />
        </div>
        <h3 style={{ whiteSpace: "pre-line" }}>{title}</h3>
        <h5>{subTitle}</h5>
      </div>
      <div className="custom-panel-close" onClick={onCancel}>
        <i className="fas fa-times" />
      </div>
      <div className="custom-panel-content">{children}</div>
    </div>
  ) : (
    <Modal
      {...rest}
      onCancel={onCancel}
      className={clsx("custom-modal", className)}
      wrapClassName={clsx("custom-modal-wrap", wrapClassName)}
      title={
        <div className="custom-modal-title">
          <h3>{title}</h3>
          <h5>{subTitle}</h5>
          <div className="custom-modal-logo">
            <img src={IconLogo} alt="custom-logo" />
          </div>
        </div>
      }
      centered
      visible={visible}
      width={width}
      closable={true}
      footer={[]}
      closeIcon={<CloseCircleFilled className="custom-modal-close" />}
    >
      {children}
    </Modal>
  );
};

CustomModal.propTypes = {
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.number,
  onCancel: PropTypes.func,
};

CustomModal.defaultProps = {
  className: "",
  wrapClassName: "",
  title: "",
  subTitle: "",
  visible: false,
  width: 300,
  onCancel: () => {},
};

const mapStateToProps = (state) => ({
  isMobile: envSelector(state).isMobile,
});

export default connect(mapStateToProps)(CustomModal);
