import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Checkbox, notification } from "antd";
import { connect } from "react-redux";

import { CustomButton, CustomInput, CustomCheckbox } from "components";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const MentorSetting = ({ setting, allCategories, onCancel, onSave }) => {
  const [reason, setReason] = useState(setting.reason);
  const [title, setTitle] = useState(setting.title);
  const [specialties, setSpecialties] = useState(setting.specialties || []);
  const [activateMentoring, setActivateMentoring] = useState([]);

  const checkValidation = () => {
    if (!reason) {
      notification.error({
        message: "Please type why you want to be a mentor.",
      });
      return false;
    }

    if (!title) {
      notification.error({
        message: "Please type your job title.",
      });
      return false;
    }

    if (!specialties || specialties.length === 0) {
      notification.error({
        message: "Please select at least one area you want.",
      });
      return false;
    }

    return true;
  };

  const onClickSave = () => {
    if (checkValidation()) {
      onSave({
        reason,
        title,
        specialties,
        blockMatchAsMentor: activateMentoring.includes("block"),
      });
    }
  };

  useEffect(() => {
    setReason(setting.about);
    setTitle(setting.title);
    setSpecialties(setting.areas);
    setActivateMentoring(setting.blockMatchAsMentor ? ["block"] : "");
  }, [setting]);

  return (
    <div className="mentor-setting">
      <div className="mentor-setting-container">
        <h2>Becoming into a mentor</h2>
        <h5 className="mentor-setting-sublabel first">
          Why do you want to be a mentor?
        </h5>
        <CustomInput
          className="mentor-setting-input"
          multiple={true}
          value={reason}
          onChange={setReason}
        />
        <h5 className="mentor-setting-sublabel">
          What is your current or most recent job title?
        </h5>
        <CustomInput
          className="mentor-setting-input"
          value={title}
          onChange={setTitle}
        />
        <Checkbox.Group
          value={activateMentoring}
          className="mentor-setting-block"
          onChange={setActivateMentoring}
        >
          <CustomCheckbox value="block">Deactivate</CustomCheckbox>
        </Checkbox.Group>
        <h5 className="mentor-setting-sublabel">
          In what areas do you want to be a mentor?
        </h5>
        <Checkbox.Group
          value={specialties}
          className="mentor-setting-specialties"
          onChange={setSpecialties}
        >
          {allCategories.map((spec, index) => (
            <CustomCheckbox key={`specialty-${index}`} value={spec.value}>
              {spec.title}
            </CustomCheckbox>
          ))}
        </Checkbox.Group>
      </div>
      <div className="mentor-setting-footer">
        <CustomButton
          text="Cancel"
          type="third outlined"
          size="xl"
          onClick={onCancel}
        />
        <CustomButton
          text="Save"
          type="secondary"
          size="lg"
          onClick={onClickSave}
        />
      </div>
    </div>
  );
};

MentorSetting.propTypes = {
  setting: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

MentorSetting.defaultProps = {
  setting: {},
  onCancel: () => {},
  onSave: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(MentorSetting);
