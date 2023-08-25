import React, { useState, useEffect } from "react";
import { Form, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { CustomInput, CustomButton } from "components";

import { verifyToken, resetPassword } from "api/module/auth";
import { INTERNAL_LINKS } from "enum";

import AuthAlert from "containers/AuthAlert";

import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";

const ResetPasswordPage = ({ match, history }) => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(null);
  const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    execVerifyPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const execVerifyPassword = async () => {
    try {
      let response = await verifyToken(match.params.token);
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        setIsValid(true);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setIsValid(false);
    }
  };

  const execResetPassword = async (data) => {
    setLoading(true);
    try {
      let response = await resetPassword(match.params.token, data.new_password);
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        history.push(INTERNAL_LINKS.HOME);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setIsValid(false);
    }
  };

  return (
    <>
      <section className="reset-password-layout">
        <div className="reset-password-layout__form-container">
          <div className="reset-password-layout__logo">
            <img src={IconLogo} alt="login-logo" />
          </div>
          <h3>Reset password</h3>
          {!loading ? (
            isValid ? (
              <Form
                layout="vertical"
                onFinish={(data) => {
                  execResetPassword(data);
                }}
              >
                <Form.Item
                  label="New password"
                  name="new_password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password!",
                    },
                  ]}
                >
                  <CustomInput
                    type="password"
                    placeholder="New Password"
                    size="sm"
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm password"
                  name="confirm_password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your confirm password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("new_password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <CustomInput
                    type="password"
                    placeholder="Confirm Password"
                    size="sm"
                  />
                </Form.Item>
                <Form.Item>
                  <CustomButton
                    htmlType="submit"
                    text="Reset password"
                    type="primary"
                    size="md"
                  />
                </Form.Item>
              </Form>
            ) : (
              <>
                <AuthAlert
                  title="Sorry!"
                  message={
                    <>
                      We have problems to reset password, try again process from
                      beginning or contact us via email{" "}
                      <a href={`mailto:${process.env.REACT_APP_MAIN_EMAIL}`}>
                        {" "}
                        {process.env.REACT_APP_MAIN_EMAIL}
                      </a>
                      .
                    </>
                  }
                />
                <div className="form-container__footer">
                  <br />
                  <Link to={INTERNAL_LINKS.HOME}>Log In</Link>
                </div>
              </>
            )
          ) : (
            <div className="spinner-container">
              <Spin indicator={spinIcon}></Spin>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ResetPasswordPage;
