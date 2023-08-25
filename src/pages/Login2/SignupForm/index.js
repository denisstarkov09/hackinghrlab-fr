import React from "react";
import PropTypes from "prop-types";
import { Form, Radio, Checkbox } from "antd";
import ReCAPTCHA from "react-google-recaptcha";

import {
  CustomInput,
  CustomRadio,
  CustomCheckbox,
  CustomSelect,
} from "components";
import { COUNTRIES, PROFILE_SETTINGS, LANGUAGES } from "enum";

import { isValidPassword } from "utils/format";

const SecretKey = process.env.REACT_APP_RECAPTCHA_SITEKEY;

const JobLevels = PROFILE_SETTINGS.JOB_LEVELS;

const WorkAreas = PROFILE_SETTINGS.WORK_AREAS;

const OrgSizes = PROFILE_SETTINGS.ORG_SIZES;

const Languages = LANGUAGES.ParsedLanguageData;

const SignupForm = ({ step }) => {
  return (
    <React.Fragment>
      {step === 0 && (
        <React.Fragment>
          <Form.Item
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please enter your first name!",
              },
            ]}
            className="form-full-name"
          >
            <CustomInput placeholder="First Name" size="sm" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please enter your last name!",
              },
            ]}
            className="form-full-name"
          >
            <CustomInput placeholder="Last Name" size="sm" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                required: true,
                type: "regexp",
                pattern: new RegExp(/^\S*$/),
                message:
                  "Blank spaces are not allowed. Please remove the blank space at the end of your email",
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
            name="confirmEmail"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                pattern: new RegExp(/^\S*$/),
                message:
                  "Blank spaces are not allowed. Please remove the blank space at the end of your email",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value !== getFieldValue("email")) {
                    return Promise.reject(new Error("Confirm your email."));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            className="form-full-name"
          >
            <CustomInput placeholder="Confirm Email" size="sm" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              () => ({
                validator(rule, value) {
                  switch (isValidPassword(value)) {
                    case 0:
                      return Promise.resolve();
                    case 1:
                      return Promise.reject(
                        "Password length should be 8 or more!"
                      );
                    case 2:
                      return Promise.reject("Password should contain number!");
                    case 3:
                      return Promise.reject("Password should contain symbol!");
                    case 4:
                      return Promise.reject(
                        "Password should contain capital letter!"
                      );
                    case 5:
                      return Promise.reject("Please enter your password!");
                    default:
                      return Promise.reject("Something went wrong!");
                  }
                },
              }),
            ]}
            className="form-full-name"
          >
            <CustomInput type="password" placeholder="Password" size="sm" />
          </Form.Item>
          <Form.Item
            name="password2"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
            className="form-full-name"
          >
            <CustomInput
              type="password"
              placeholder="Confirm Password"
              size="sm"
            />
          </Form.Item>
          <Form.Item
            name="recaptcha"
            rules={[
              {
                required: true,
                message: "Please resolve the reCAPTCHA!",
              },
            ]}
            className="form-recaptcha"
          >
            <ReCAPTCHA sitekey={SecretKey} />
          </Form.Item>
        </React.Fragment>
      )}
      {step === 1 && (
        <>
          <Form.Item
            name="titleProfessions"
            rules={[
              {
                required: true,
                message: "Please enter your title!",
              },
            ]}
          >
            <CustomInput placeholder="Title" size="sm"></CustomInput>
          </Form.Item>
          <Form.Item
            name="company"
            rules={[
              {
                required: true,
                message: "Please enter your company!",
              },
            ]}
          >
            <CustomInput placeholder="Company" size="sm"></CustomInput>
          </Form.Item>
          <Form.Item
            name="languages"
            rules={[
              {
                required: true,
                message: "Please select one!",
              },
            ]}
          >
            <CustomSelect
              placeholder="Main language"
              className="border"
              showSearch
              options={Languages}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
          <Form.Item
            name="city"
            rules={[
              {
                required: true,
                message: "Please enter your city!",
              },
            ]}
          >
            <CustomInput placeholder="City" size="sm"></CustomInput>
          </Form.Item>
          <Form.Item
            label="Country"
            name="location"
            rules={[
              {
                required: true,
                message: "Please select one!",
              },
            ]}
          >
            <CustomSelect
              className="border"
              showSearch
              options={COUNTRIES}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
          <Form.Item
            label="What best defines your current or most recent job level?"
            name="recentJobLevel"
            rules={[
              {
                required: true,
                message: "Please select one!",
              },
            ]}
          >
            <Radio.Group className="d-flex flex-column form-job-level">
              {JobLevels.map((job) => (
                <CustomRadio key={job.value} value={job.value}>
                  {job.label}
                </CustomRadio>
              ))}
            </Radio.Group>
          </Form.Item>
        </>
      )}
      {step === 2 && (
        <Form.Item
          label="In what area of HR do you currently work or most recently worked?"
          name="recentWorkArea"
          rules={[
            {
              required: true,
              message: "Please select one!",
            },
          ]}
        >
          <Checkbox.Group className="d-flex flex-column form-recent-workarea">
            {WorkAreas.map((area, index) => (
              <CustomCheckbox key={index} value={area.value}>
                {area.label}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      )}
      {step === 3 && (
        <React.Fragment>
          <Form.Item
            label="What is the size of the organization your work for?"
            name="sizeOfOrganization"
            rules={[
              {
                required: true,
                message: "Please select one!",
              },
            ]}
          >
            <Radio.Group className="d-flex flex-column form-organization-size">
              {OrgSizes.map((size, index) => (
                <CustomRadio key={index} value={size.value}>
                  {size.label}
                </CustomRadio>
              ))}
            </Radio.Group>
          </Form.Item>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

SignupForm.propTypes = {
  step: PropTypes.number,
};

SignupForm.defaultProps = {
  step: 0,
};

export default SignupForm;
