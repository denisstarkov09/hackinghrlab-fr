import React from "react";
import PropTypes from "prop-types";
import { Modal, notification } from "antd";
import { connect } from "react-redux";
import { CloseCircleFilled } from "@ant-design/icons";

import { inviteFriend } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import InviteFriendForm from "../InviteFriendForm";

import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";

const InviteFriendModal = ({
  userProfile,
  visible,
  onInvite,
  inviteFriend,
  ...rest
}) => {
  const handleSubmit = (data) => {
    inviteFriend(data.email, (error) => {
      if (error) {
        notification.error({
          message: "Invitation was not sent to your friend. Please try again.",
        });
      } else {
        notification.info({
          message: "Invitation was successfully sent to your friend.",
        });
        onInvite();
      }
    });
  };

  return (
    <Modal
      {...rest}
      className="invite-modal"
      title={
        <div className="invite-modal-title">
          <h3>Invite a Friend</h3>
          <h5>Send an invitation email to join</h5>
          <div className="invite-modal-logo">
            <img src={IconLogo} alt="invite-logo" />
          </div>
        </div>
      }
      centered
      visible={visible}
      width={300}
      closable={true}
      footer={[]}
      closeIcon={<CloseCircleFilled className="invite-modal-close" />}
    >
      <InviteFriendForm handleSubmit={handleSubmit} />
    </Modal>
  );
};

InviteFriendModal.propTypes = {
  visible: PropTypes.bool,
  onInvite: PropTypes.func,
};

InviteFriendModal.defaultProps = {
  visible: false,
  onInvite: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  inviteFriend,
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriendModal);
