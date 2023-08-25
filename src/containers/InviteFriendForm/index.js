import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form } from "antd"
import clsx from "clsx";

import { CustomInput, CustomButton } from "components";
import { envSelector } from "redux/selectors/envSelector";

import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";

const InviteFriendForm = ({ isMobile, handleSubmit, hidePanel }) => {
  const [form] = Form.useForm();
  return (
    <>
      <div
        className={clsx("invite-friend-form", { mobile: isMobile })}
      >
        {isMobile && (
          <>
            <div className="invite-friend-form-header">
              <div className="invite-friend-form-header-logo">
                <img src={IconLogo} alt="invite-logo" />
              </div>
              <h3>Invite a Friend</h3>
              <h5>Send an invitation email to join</h5>
            </div>
            <div className="invite-friend-form-close" onClick={hidePanel}>
              <i className="fas fa-times" />
            </div>
          </>
        )}
        <div className="invite-friend-form-content">
          <Form
            form={form}
            layout="vertical"
            onFinish={(data) => {
              handleSubmit(data);
              form.resetFields();
            }}
          >
            <Form.Item
              name="email"
              label="Email address"
              rules={[{ required: true, message: 'Please input the email address!' }]}
            >
              <CustomInput />
            </Form.Item>
            <Form.Item
            >
              <CustomButton  htmlType="submit" size="md" text="Send" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

InviteFriendForm.propTypes = {
  handleSubmit: PropTypes.func,
  hidePanel: PropTypes.func,
};

InviteFriendForm.defaultProps = {
  handleSubmit: () => { },
  hidePanel: () => { },
};

const mapStateToProps = (state) => ({
  isMobile: envSelector(state).isMobile,
});

export default connect(mapStateToProps)(InviteFriendForm);
