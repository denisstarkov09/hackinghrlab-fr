import React from "react";
import { Form } from "antd";

import { CustomInput } from "components";

const LoginForm = () => {
  return (
    <React.Fragment>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter your email!",
          },
          {
            type: "email",
            message: "Please enter the valid email!",
          },
        ]}
        className="form-full-name"
      >
        <CustomInput placeholder="Email" size="sm" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please enter your password!",
          },
        ]}
        className="form-full-name"
      >
        <CustomInput type="password" placeholder="Password" size="sm" />
      </Form.Item>
    </React.Fragment>
  );
};

export default LoginForm;
