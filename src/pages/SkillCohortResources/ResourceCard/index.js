import { CustomButton } from "components";
import React from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import { Space, Tooltip } from "antd";

import { actions as SkillCohortResourceActions } from "redux/actions/skillCohortResource-actions";
import "./style.scss";

const ResourceCard = ({
  skillCohortResource,
  getSkillCohortResource,
  switchTab,
}) => {
  const handleJoinTheConversation = (e) => {
    e.stopPropagation();
    e.preventDefault();
    getSkillCohortResource(skillCohortResource.id);
    switchTab();
  };

  const displayResourcesBtn = (
    <div className="skill-cohort-resource-card-content">
      <div className="skill-cohort-resource-card-join-btn">
        <CustomButton
          text="Join the conversation"
          onClick={handleJoinTheConversation}
        />
      </div>
    </div>
  );

  return (
    <div>
      <a
        href={skillCohortResource.resourceLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="card">
          <Space direction="vertical" size="middle">
            <h3>{skillCohortResource.title}</h3>
            <Tooltip title={skillCohortResource.description}>
              <div className="description truncate">
                {skillCohortResource.description}
              </div>
            </Tooltip>
            <div className="description">
              {moment(skillCohortResource.releaseDate).format("LL")}
            </div>
          </Space>
          {displayResourcesBtn}
        </div>
      </a>
    </div>
  );
};

const mapDispatchToProps = {
  ...SkillCohortResourceActions,
};

export default connect(null, mapDispatchToProps)(ResourceCard);
