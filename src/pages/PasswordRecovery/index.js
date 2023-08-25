import React, { useState } from "react";
import { Form, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { CustomInput, CustomButton } from "components";

import { passwordRecovery } from "api/module/auth";
import { INTERNAL_LINKS } from "enum";

import AuthAlert from "containers/AuthAlert";

import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";

const PasswordRecoveryPage = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const sendPasswordRecovery = async (data) => {
    setLoading(true);
    setShowError(false);
    try {
      let response = await passwordRecovery(data.email);
      setLoading(false);
      console.log(response.status);
      let codes = [200, 201, 204];
      if (codes.indexOf(response.status) > -1) {
        history.push(`/login/passwordRecoverySent`);
      }
    } catch (err) {
      setLoading(false);
      setShowError(true);
    }
  };
  return (
    <>
      <section className="password-recovery-layout">
        <div className="password-recovery-layout__form-container">
          <div className="password-recovery-layout__logo">
            <img src={IconLogo} alt="login-logo" />
          </div>
          <h3>Password recovery</h3>
          <p className="password-recovery-layout__form-container--p">
            We will send you an email with the instructions on how to reset your
            password.
          </p>
          <Form
            layout="vertical"
            onFinish={(data) => {
              sendPasswordRecovery(data);
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter the valid email!" },
              ]}
            >
              <CustomInput size="sm" />
            </Form.Item>
            <Form.Item>
              {loading ? (
                <div className="spinner-container">
                  <Spin indicator={spinIcon}></Spin>
                </div>
              ) : (
                <CustomButton
                  htmlType="submit"
                  text="Recover password"
                  type="primary"
                  size="md"
                />
              )}
            </Form.Item>
          </Form>
          {showError && (
            <>
              <br />
              <AuthAlert
                title="Error"
                message="Email doesn't match with any user."
              />
            </>
          )}
          <div className="form-container__footer">
            <Link to={INTERNAL_LINKS.HOME}>Log In</Link>
            <Link to={INTERNAL_LINKS.HOME}>Sign Up</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PasswordRecoveryPage;
