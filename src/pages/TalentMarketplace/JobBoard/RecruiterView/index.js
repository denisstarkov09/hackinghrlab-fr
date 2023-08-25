import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Form, notification } from "antd";

import { getMarketplaceProfiles } from "redux/actions/marketplaceProfile-actions";
import { actions as jobBoardActions } from "redux/actions/jobBoard-actions";

import { jobBoardSelector } from "redux/selectors/jobBoardSelector";

import JobPostDrawer from "containers/JobPostDrawer";
import JobPostCard from "../JobPostCard";

import "./styles.scss";

const RecruiterView = ({
  myJobPosts,
  upsertJobPost,
  getMyJobPosts,
  filter,
  getMarketplaceProfiles,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [status, setStatus] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    getMyJobPosts({
      ...filter,
    });
    getMarketplaceProfiles({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleOnFinish = (values) => {
    if (!values.companyLogo) {
      return notification.warning({
        message: "Missing company logo",
        description: "Please provide a company logo",
      });
    }

    let preferredSkills = values.preferredSkills?.map((skill) => {
      return {
        title: skill.preferredSkills[0],
        skill: skill.preferredSkills[1],
        level: skill.preferredSkills[2],
      };
    });

    const transformedPreferredSkillsMain = {
      title: values.preferredSkillsMain[0],
      skill: values.preferredSkillsMain[1],
      level: values.preferredSkillsMain[2],
    };

    preferredSkills = [
      ...(preferredSkills || []),
      transformedPreferredSkillsMain,
    ];

    delete values.preferredSkillsMain;

    values = {
      ...values,
      location: JSON.stringify(values.location),
      preferredSkills: JSON.stringify(preferredSkills),
      mainJobFunctions: JSON.stringify(values.mainJobFunctions),
      status,
    };

    upsertJobPost(values);
    form.resetFields();
    setIsDrawerVisible(false);
  };

  const handlePostButton = () => {
    setStatus("active");
    form.submit();
  };

  const handleDraftButton = () => {
    setStatus("draft");
    form.submit();
  };

  return (
    <>
      <div className="recruiter-view">
        <div
          className="job-post-card"
          onClick={() => setIsDrawerVisible(true)}
          style={{ cursor: "pointer" }}
        >
          <PlusOutlined
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 48,
            }}
          />
        </div>
        {myJobPosts?.map((post, index) => {
          return <JobPostCard post={post} key={index} myPostedJob />;
        })}
      </div>
      <JobPostDrawer
        form={form}
        // isDrawerVisible={true}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        handleOnFinish={handleOnFinish}
        handlePostButton={handlePostButton}
        handleDraftButton={handleDraftButton}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  ...jobBoardSelector(state),
});

const mapDispatchToProps = {
  ...jobBoardActions,
  getMarketplaceProfiles,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecruiterView);
