import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Card, Space, Avatar, Tag, Tooltip, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { CustomButton } from "components";
import { COUNTRIES, PROFILE_SETTINGS, INTERNAL_LINKS, JOB_BOARD } from "enum";
import IconBack from "images/icon-back.svg";
import { startCase } from "lodash";
import { MailOutlined, LinkedinOutlined } from "@ant-design/icons";

import { actions as jobBoardActions } from "redux/actions/jobBoard-actions";
import { jobBoardSelector } from "redux/selectors/jobBoardSelector";

import "./styles.scss";

const JobPostDetailsPage = ({ getJobPost, jobPost }) => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getJobPost(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const country = COUNTRIES.find(
    (country) => country.value === jobPost.country
  );

  const displayLocation = (jobPost?.location || [])
    .map((location) => {
      const data = JOB_BOARD.LOCATIONS.find((loc) => loc.value === location);

      return data.text;
    })
    .join("/");

  const displayMainJobFunctions = (jobPost?.mainJobFunctions || []).map(
    (skill, index) => {
      const data = PROFILE_SETTINGS.TOPICS.find(
        (topic) => topic.value === skill
      );

      return (
        <Tag key={index} color="blue">
          {data.text}
        </Tag>
      );
    }
  );

  const displayPreferredSkills = (jobPost?.preferredSkills || []).map(
    (jobPostSkill, index) => {
      let title, skill;

      JOB_BOARD.PREFERRED_SKILLS.find((skills) => {
        if (skills.value === jobPostSkill.title) {
          title = skills.label;

          return skills.children.find((child) => {
            if (child.value === jobPostSkill.skill) {
              return (skill = child.label);
            } else {
              return "";
            }
          });
        } else {
          return "";
        }
      });
      return (
        <div>{`${index + 1}. ${title} / ${skill} - Level: ${startCase(
          jobPostSkill.level
        )}`}</div>
      );
    }
  );

  const handleBtnClick = () => {
    window.open(jobPost?.linkToApply, "_blank");
  };

  const cardActions = [
    <Tooltip title="Linkedin">
      <Button
        shape="circle"
        type="link"
        icon={<LinkedinOutlined />}
        onClick={() =>
          window.open(jobPost?.User?.personalLinks.linkedin, "_blank")
        }
        // className="participant-card-marketplaceprofile-icon"
      />
    </Tooltip>,
    <Tooltip title="Contact Email">
      <Button
        shape="circle"
        type="link"
        icon={<MailOutlined />}
        onClick={() => window.open(`mailto:${jobPost?.User?.email}`, "_blank")}
        // className="participant-card-marketplaceprofile-icon"
      />
    </Tooltip>,
  ];

  return (
    <div className="job-board-details-page">
      <div className="job-board-details-wrapper">
        <div className="job-board-details-content">
          <div
            className="job-board-detail-page-header-content-back-btn"
            onClick={() =>
              history.push(`${INTERNAL_LINKS.TALENT_MARKETPLACE}?key=2`)
            }
          >
            <div className="job-board-detail-page-header-content-back">
              <div className="job-board-detail-page-header-content-back-img">
                <img src={IconBack} alt="icon-back" />
              </div>
              <h4>Back to Job Board</h4>
            </div>
          </div>
          <div className="section1">
            <div className="img-container">
              <img
                src={jobPost.companyLogo}
                alt="company-logo"
                className="company-logo"
              />
            </div>
            <CustomButton text="Apply" onClick={handleBtnClick} />
          </div>
          <div className="section2">
            <Space direction="vertical">
              <h3>Company Description</h3>
              <div>
                <div>{jobPost.companyDescription}</div>
                <div>
                  <Space>
                    Company Website:
                    <a
                      href={jobPost.linkToApply}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {jobPost.linkToApply}
                    </a>
                  </Space>
                </div>
              </div>
            </Space>
          </div>
          <div className="section3">
            <Space direction="vertical" size="middle">
              <h3>Job Information</h3>
              <div>
                <strong>Job title:</strong> {jobPost.jobTitle}
              </div>
              <div>
                <strong>Job description: </strong>
                <section
                  dangerouslySetInnerHTML={{
                    __html: jobPost?.jobDescription?.html,
                  }}
                />
              </div>
              <div>
                <strong>Job location: </strong>
                {`${jobPost.city}, ${country?.text}`}
              </div>
              <div>
                <strong>Job location type: </strong>
                {displayLocation}
              </div>
              <div>
                <strong>Salary range: </strong>
                {jobPost.salaryRange}
              </div>
              <div>
                <strong>Job level: </strong>
                {jobPost.level}
              </div>
              <Space direction="vertical">
                <div>
                  <strong>Preferred Skills: </strong>
                </div>
                <div>
                  <Space direction="vertical">{displayPreferredSkills}</Space>
                </div>
              </Space>
              <div>
                <strong>Main Job Functions: </strong>
                <Space wrap>{displayMainJobFunctions}</Space>
              </div>
            </Space>
          </div>
          <div className="recruiter">
            <Card
              hoverable
              bordered
              type="inner"
              extra={<UserOutlined />}
              title={<h3>Recruiter</h3>}
              actions={cardActions}
            >
              {jobPost?.User?.img ? (
                <Avatar
                  size={180}
                  src={jobPost?.User?.img}
                  alt={`${jobPost?.User?.firstName} ${jobPost?.User?.lastName}`}
                />
              ) : (
                <Avatar size={180} icon={<UserOutlined />} />
              )}

              <div>
                <p className="participant-name">{`${jobPost?.User?.firstName} ${jobPost?.User?.lastName}`}</p>
                <p>{jobPost?.User?.titleProfessions}</p>
              </div>
            </Card>
          </div>
          <div className="section4">
            <CustomButton text="Apply" onClick={handleBtnClick} />
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ...jobBoardSelector(state),
});

const mapDispatchToProps = {
  ...jobBoardActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobPostDetailsPage);
