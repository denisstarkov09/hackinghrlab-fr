import React, { useEffect, useState } from "react";
import { Checkbox, Form, Switch, Radio, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { marketplaceProfileSelector } from "redux/selectors/marketplaceProfile";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import {
  getMarketplaceProfile,
  createMarketplaceProfile,
  updateMarketPlaceProfile,
} from "redux/actions/marketplaceProfile-actions";
import { PROFILE_SETTINGS, JOB_BOARD } from "enum";
import {
  CustomButton,
  CategoriesSelect,
  CustomCheckbox,
  UploadResumeModal,
} from "components";

import "./styles.scss";

const MyTalentMarketplaceProfile = ({
  allCategories,
  getMarketplaceProfile,
  createMarketplaceProfile,
  updateMarketPlaceProfile,
  userProfile,
  marketplaceProfile,
}) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (userProfile.id) {
      getMarketplaceProfile(userProfile.id);
    }
  }, [getMarketplaceProfile, userProfile]);

  useEffect(() => {
    if (marketplaceProfile.id) {
      form.setFieldsValue({
        ...marketplaceProfile,
        ...marketplaceProfile.skills,
      });
    } else {
      form.resetFields();
    }
  }, [marketplaceProfile, form]);

  const handleSubmit = (data) => {
    const { showMarketPlaceProfile } = data;

    if (showMarketPlaceProfile && !userProfile.resumeUrl) {
      return notification.warning({
        message: "Missing resume",
        description:
          "Resume is required if you want your marketplace profile to be shown.",
      });
    }

    let skills = {};

    JOB_BOARD.PREFERRED_SKILLS.map((item) => {
      return item.children.map((skill) => {
        return (skills[skill.value] = data[skill.value]);
      });
    });

    if (marketplaceProfile.id) {
      updateMarketPlaceProfile({ ...data, skills, id: marketplaceProfile.id });
    } else {
      const marketPlaceInfo = {
        ...data,
        skills,
        UserId: userProfile.id,
      };
      createMarketplaceProfile(marketPlaceInfo);
    }
  };

  const displaySkills = JOB_BOARD.PREFERRED_SKILLS.map((skill, index) => {
    return (
      <div className="skills-wrapper" key={index}>
        <div>
          <strong>{skill.label}</strong>
        </div>
        {skill.children.map((item, itemIndex) => {
          return (
            <div className="preferred-skills-wrapper" key={itemIndex}>
              <div className="preferred-skills-main-content">
                <div>{item.label}</div>
              </div>
              <Form.Item name={item.value}>
                <Radio.Group size="large">
                  <div className="preferred-skills-level-content">
                    <Radio value="basic">Basic</Radio>
                    <Radio value="intermediate">Intermediate</Radio>
                    <Radio value="advanced">Advance</Radio>
                  </div>
                </Radio.Group>
              </Form.Item>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="talent-marketplace-profile">
      <Form
        layout="vertical"
        form={form}
        onFinish={(data) => handleSubmit(data)}
        className="talent-marketplace-profile-form"
      >
        <Form.Item
          label="Are you a recruiter?"
          valuePropName="checked"
          name="isRecruiter"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Do you want to receive email notifications?"
          valuePropName="checked"
          name="isOpenReceivingEmail"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Do you want your profile to show in the talent marketplace?"
          valuePropName="checked"
          name="showMarketPlaceProfile"
          rules={[
            {
              required: true,
              message: "this is required",
            },
          ]}
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <CustomButton
            size="xs"
            text="Upload your resume"
            onClick={() => setShowResumeModal(true)}
          />
          {marketplaceProfile.resumeFileName !== "" && (
            <p>
              <CheckCircleOutlined className="check-icon" />{" "}
              {marketplaceProfile.resumeFileName}
            </p>
          )}
        </Form.Item>

        <Form.Item
          label="What role level are you looking for?"
          name="lookingFor"
          rules={[
            {
              required: true,
              message: "Please select one!",
            },
          ]}
        >
          <Checkbox.Group>
            {PROFILE_SETTINGS.JOB_LEVELS.map((job) => (
              <CustomCheckbox key={job.value} value={job.value}>
                {job.label}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="What areas in HR are you interested in?"
          name="topics"
          rules={[
            {
              required: true,
              message: "Please select one!",
            },
          ]}
        >
          <CategoriesSelect
            options={allCategories}
            maxValues={allCategories.length}
            style={{ maxWidth: "600px", height: "auto" }}
          />
        </Form.Item>
        <Form.Item
          label="Location type?"
          name="location"
          rules={[
            {
              required: true,
              message: "Please select one!",
            },
          ]}
        >
          <Checkbox.Group>
            {PROFILE_SETTINGS.LOCATIONS.map((location) => (
              <CustomCheckbox key={location.value} value={location.value}>
                {location.label}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <div>
          <div className="preferred-skills-wrapper">
            <div className="preferred-skills-main">
              <h3>Skill Self-Assessment</h3>
            </div>
          </div>
          {displaySkills}
        </div>

        <Form.Item>
          <CustomButton size="lg" text="Save" htmlType="submit" />
        </Form.Item>
        <Form.Item hidden name="UserId" />
      </Form>
      <UploadResumeModal
        visible={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  allCategories: categorySelector(state).categories,
  marketplaceProfile: marketplaceProfileSelector(state).marketplaceProfile,
});

const mapDispatchToProps = {
  getMarketplaceProfile,
  createMarketplaceProfile,
  updateMarketPlaceProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTalentMarketplaceProfile);
