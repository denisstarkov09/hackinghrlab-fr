import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";

import { SpecialtyItem, WantCard, CustomButton } from "components";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const MentorPanel = ({
  setting,
  isMentor,
  mobileSetting,
  allCategories,
  openSetting,
  onEdit,
}) => {
  const collapsed = mobileSetting.collapsed.mentor;

  return (
    <div className={clsx("mentor-panel", { collapsed: collapsed })}>
      <div className="mentor-panel-container">
        {isMentor ? (
          <div className="mentor-panel-description">
            <CustomButton
              className="mentor-panel-description-edit"
              text="Edit mentor information"
              type="primary outlined"
              size="xs"
              onClick={onEdit}
            />
            <h5 className="mentor-panel-description-label">
              Why do you want to be a mentor?
            </h5>
            <p className="mentor-panel-description-reason">
              {setting.about || ""}
            </p>
            <div className="mentor-panel-description-specialties">
              {(setting.areas || []).map((spec, index) => {
                const specialty = allCategories.find(
                  (item) => item.value === spec
                );
                return specialty ? (
                  <SpecialtyItem
                    key={`specialty-${index}`}
                    title={specialty ? specialty.title : ""}
                  />
                ) : (
                  ""
                );
              })}
            </div>
            <span className="edit-information" onClick={onEdit}>
              Edit mentor information
            </span>
          </div>
        ) : (
          <WantCard type="mentor" onClick={openSetting} />
        )}
      </div>
    </div>
  );
};

MentorPanel.propTypes = {
  setting: PropTypes.object,
  isMentor: PropTypes.bool,
  collapsed: PropTypes.bool,
  openSetting: PropTypes.func,
  onEdit: PropTypes.func,
};

MentorPanel.defaultProps = {
  setting: {},
  isMentor: false,
  collapsed: false,
  openSetting: () => {},
  onEdit: () => {},
};

const mapStateToProps = (state) => ({
  mobileSetting: homeSelector(state).setting,
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(MentorPanel);
