import React, { useEffect, useState } from "react";
import { Drawer, Form, Checkbox, Popconfirm, Space } from "antd";
import {
  CustomSelect,
  CustomButton,
  CustomCheckbox,
  CustomModal,
  CustomInput,
} from "components";
import { connect } from "react-redux";
import { COUNTRIES, PROFILE_SETTINGS } from "enum";

import { actions as matchmakingActions } from "redux/actions/matchmaking-actions";
import { matchmakeSelector } from "redux/selectors/matchmakeSelector";
import { categorySelector } from "redux/selectors/categorySelector";

import "./styles.scss";

const MatchmakingDrawer = ({
  visible,
  setVisible,
  allCategories,
  getMatchmake,
  matchmakingUsers,
  sendMatchEmail,
}) => {
  const [form] = Form.useForm();
  const [matchForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    if (matchedUser) {
      setIsPromptVisible(true);
    }
  }, [matchedUser]);

  const handleOnFinish = (values) => {
    getMatchmake(
      {
        countries: JSON.stringify(values.countries || []),
        topicsOfInterest: JSON.stringify(values.topicsOfInterest || []),
        recentJobLevel: JSON.stringify(values.recentJobLevel || []),
        recentWorkArea: JSON.stringify(values.recentWorkArea || []),
        sizeOfOrganization: JSON.stringify(values.sizeOfOrganization || []),
      },
      setIsModalVisible
    );

    setVisible(false);
  };

  const handleMatchOnFinish = (values) => {
    setIsPromptVisible(false);
    sendMatchEmail(matchedUser, values.message);
    setMatchedUser(null);
  };

  const handleConfirm = () => {
    matchForm.submit();
  };

  const handleClosePromptVisible = () => {
    setIsPromptVisible(false);
    setMatchedUser(null);
  };

  const handlePromptVisible = (id) => {
    setMatchedUser(id);
  };

  const displayMatchmakingUsers = matchmakingUsers.map((user) => {
    const country = COUNTRIES.find((c) => c.value === user.location);

    return (
      <div key={user.id} className="display-matchmaking-users">
        <div>
          <h3>Title: {user.titleProfessions}</h3>
          <h3>Company Size: {user.sizeOfOrganization}</h3>
          <h3>Country: {country.text}</h3>
        </div>
        <CustomButton
          text="Match"
          onClick={() => handlePromptVisible(user.id)}
        />
      </div>
    );
  });

  const handleSelectAll = () => {
    const topics = allCategories.map((category) => category.value);

    form.setFieldsValue({
      topicsOfInterest: topics,
    });
  };

  const handleUnselectAll = () => {
    form.resetFields(["topicsOfInterest"]);
  };

  const handleSelectAllRecentWorkAreas = () => {
    const areas = PROFILE_SETTINGS.WORK_AREAS.map((area) => area.value);

    form.setFieldsValue({
      recentWorkArea: areas,
    });
  };

  const handleUnselectAllRecentWorkAreas = () => {
    form.resetFields(["recentWorkArea"]);
  };

  return (
    <Drawer
      visible={visible}
      onClose={() => setVisible(false)}
      width={520}
      title="Find a match"
    >
      <Form form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item name="countries" label="Countries">
          <CustomSelect
            bordered
            mode="multiple"
            options={COUNTRIES}
            optionFilterProp="children"
          />
        </Form.Item>
        <Form.Item
          name="topicsOfInterest"
          label={
            <Space>
              <div>Topics of Interest</div>
              <div>|</div>
              <div style={{ cursor: "pointer" }} onClick={handleSelectAll}>
                Select All
              </div>
              <div>|</div>
              <div style={{ cursor: "pointer" }} onClick={handleUnselectAll}>
                Unselect All
              </div>
            </Space>
          }
        >
          <Checkbox.Group>
            {allCategories.map((topic) => {
              return (
                <CustomCheckbox key={topic.value} value={topic.value}>
                  {topic.title}
                </CustomCheckbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name="recentJobLevel" label="Recent Job Level">
          <Checkbox.Group>
            {PROFILE_SETTINGS.JOB_LEVELS.map((level) => {
              return (
                <CustomCheckbox key={level.value} value={level.label}>
                  {level.label}
                </CustomCheckbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          name="recentWorkArea"
          label={
            <Space>
              <div>Recent Work Areas</div>
              <div>|</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={handleSelectAllRecentWorkAreas}
              >
                Select All
              </div>
              <div>|</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={handleUnselectAllRecentWorkAreas}
              >
                Unselect All
              </div>
            </Space>
          }
        >
          <Checkbox.Group>
            {PROFILE_SETTINGS.WORK_AREAS.map((area, index) => (
              <CustomCheckbox key={index} value={area.value}>
                {area.label}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name="sizeOfOrganization" label="Size of Organization">
          <Checkbox.Group>
            {PROFILE_SETTINGS.ORG_SIZES.map((org, index) => (
              <CustomCheckbox key={index} value={org.value}>
                {org.label}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <CustomButton text="Submit" type="primary" htmlType="submit" />
        </Form.Item>
      </Form>
      <CustomModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        title="Matchmaking Results"
        width={720}
      >
        <div>{displayMatchmakingUsers}</div>
      </CustomModal>
      <CustomModal
        visible={isPromptVisible}
        onCancel={handleClosePromptVisible}
        title="Enter here a one paragraph description of how you would like us to introduce you and your company"
        width={720}
      >
        <Form form={matchForm} onFinish={handleMatchOnFinish} layout="vertical">
          <Form.Item label="Message" name="message">
            <CustomInput multiple />
          </Form.Item>
        </Form>
        <Popconfirm
          title="Do you want to connect?"
          onConfirm={handleConfirm}
          okText="Yes"
          cancelText="No"
        >
          <CustomButton text="Match" />
        </Popconfirm>
      </CustomModal>
    </Drawer>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  matchmakingUsers: matchmakeSelector(state).matchmakingUsers,
});

const mapDispatchToProps = {
  ...matchmakingActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchmakingDrawer);
