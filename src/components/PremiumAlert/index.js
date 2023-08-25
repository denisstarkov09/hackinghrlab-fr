import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";

import "./style.scss";

const PremiumAlert = ({ visible, onCancel }) => (
  <Modal
    className="premium-alert-modal"
    wrapClassName="premium-alert-modal-wrap"
    centered
    visible={visible}
    width={500}
    footer={[]}
    closable={false}
    onCancel={onCancel}
  >
    <div className="premium-alert-modal-content">
      <h3>UPGRADE TO PREMIUM</h3>
    </div>
  </Modal>
);

PremiumAlert.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
};

PremiumAlert.defaultProps = {
  visible: false,
  onCancel: () => {},
};

export default PremiumAlert;
