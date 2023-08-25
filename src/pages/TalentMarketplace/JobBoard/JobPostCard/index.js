import React, { useState } from "react";
import { CustomButton, CustomModal } from "components";
import JobPostDrawer from "containers/JobPostDrawer";
import {
  Form,
  Tag,
  Space,
  Tooltip,
  notification,
  Empty,
  Button,
  Popconfirm,
} from "antd";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { INTERNAL_LINKS, JOB_BOARD } from "enum";
import {
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  UserOutlined,
  LinkedinOutlined,
  ProfileOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { isEmpty } from "lodash";

import { actions as jobBoardActions } from "redux/actions/jobBoard-actions";

import { homeSelector } from "redux/selectors/homeSelector";
import { marketplaceProfileSelector } from "redux/selectors/marketplaceProfile";

import "./styles.scss";

const levels = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
};

const JobPostCard = ({
  post,
  upsertJobPost,
  marketplaceProfile,
  marketplaceProfiles,
  myPostedJob = false,
  userProfile,
  invitationToApply,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [status, setStatus] = useState();
  const [form] = Form.useForm();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    preferredSkills = [transformedPreferredSkillsMain, ...preferredSkills];

    delete values.preferredSkillsMain;

    values = {
      ...values,
      location: JSON.stringify(values.location),
      preferredSkills: JSON.stringify(preferredSkills),
      mainJobFunctions: JSON.stringify(values.mainJobFunctions),
      status: status || values.status,
    };

    if (status) {
      form.setFieldsValue({
        status,
      });
    }

    upsertJobPost({
      ...values,
      id: post.id,
    });

    setStatus(null);
  };

  const handlePostButton = () => {
    form.submit();
  };

  const displayLocation = (location) => {
    return location
      .map((location) => {
        const data = JOB_BOARD.LOCATIONS.find((loc) => loc.value === location);

        return data.text;
      })
      .join("/");
  };

  const displayMoreBtn = !myPostedJob && (
    <div className="job-post-btn">
      <CustomButton
        text="More Information"
        block
        onClick={() =>
          history.push(
            `${INTERNAL_LINKS.TALENT_MARKETPLACE}/job-post/${post.id}`
          )
        }
      />
    </div>
  );

  const duplicateJobPost = () => {
    let transformedPost = {
      ...post,
      location: JSON.stringify(post.location),
      preferredSkills: JSON.stringify(post.preferredSkills),
      mainJobFunctions: JSON.stringify(post.mainJobFunctions),
      status: "draft",
    };

    delete transformedPost.id;
    delete transformedPost.createdAt;
    delete transformedPost.updatedAt;

    upsertJobPost(transformedPost);
  };

  const handlePostJob = () => {
    upsertJobPost({
      ...post,
      preferredSkills: JSON.stringify(post.preferredSkills),
      mainJobFunctions: JSON.stringify(post.mainJobFunctions),
      location: JSON.stringify(post.location),
      status: "active",
    });
  };

  const handlePostDraftButton = () => {
    setStatus("active");
    form.submit();
  };

  const displayMyPostedJobBtns = myPostedJob && (
    <div className="job-post-btn">
      <Space>
        <Tooltip title="Edit Job Post">
          <EditOutlined
            onClick={() => setIsDrawerVisible(true)}
            className="job-post-bnt-icon"
          />
        </Tooltip>
        {post.status === "draft" && (
          <Tooltip title="Publish Job Post">
            <PlusOutlined
              onClick={handlePostJob}
              className="job-post-bnt-icon"
            />
          </Tooltip>
        )}
        <Tooltip title="Duplicate Job Post">
          <CopyOutlined
            onClick={duplicateJobPost}
            className="job-post-bnt-icon"
          />
        </Tooltip>
        {myPostedJob && (
          <Tooltip title="Qualified Candidates">
            <UserOutlined
              onClick={() => setIsModalVisible(true)}
              className="job-post-bnt-icon"
            />
          </Tooltip>
        )}
      </Space>
    </div>
  );

  const calculateSkillMatchPercentage = (profile) => {
    let percentage = 0;

    if (!isEmpty(profile) && !isEmpty(profile.skills)) {
      const numberOfPercentagePerSkill = 100 / post.preferredSkills.length;

      // eslint-disable-next-line array-callback-return
      post.preferredSkills.map((preferredSkill) => {
        const profileSkillLevel = profile.skills[preferredSkill.skill];

        if (profileSkillLevel) {
          const diff = levels[profileSkillLevel] - levels[preferredSkill.level];

          if (diff >= 0) {
            percentage += numberOfPercentagePerSkill;
          } else if (diff === -1) {
            percentage += numberOfPercentagePerSkill / 2;
          }
        }
      });
    }

    return Number.isInteger(percentage) ? percentage : percentage.toFixed(2);
  };

  const skillMatchPercentage =
    calculateSkillMatchPercentage(marketplaceProfile);

  const displayStatusTag = () => {
    let color;

    if (post.status === "active") {
      color = "blue";
    } else if (post.status === "draft") {
      color = "orange";
    } else if (post.status === "expired") {
      color = "red";
    } else {
      color = "black";
    }

    const data = JOB_BOARD.STATUS.find(
      (status) => status.value === post.status
    );

    return <Tag color={color}>{data.text}</Tag>;
  };

  const marketpaceProfileFilter = (profile) => {
    const isLocationMatched = profile.location.some((p) =>
      post.location.includes(p)
    );

    return (
      profile.UserId !== userProfile.id &&
      profile.percentage >= 75 &&
      isLocationMatched
    );
  };

  const transformMarketplaceProfiles = (profile) => {
    const percentage = calculateSkillMatchPercentage(profile);

    return {
      ...profile,
      percentage,
    };
  };

  const qualifiedPeople =
    myPostedJob &&
    marketplaceProfiles
      .map(transformMarketplaceProfiles)
      .filter(marketpaceProfileFilter)
      .sort((a, b) => {
        if (a.percentage < b.percentage) {
          return 1;
        }

        if (a.percentage > b.percentage) {
          return -1;
        }

        return 0;
      });

  const downloadFile = (user) => {
    const link = document.createElement("a");
    link.setAttribute("href", user.resumeUrl);
    link.setAttribute("download", `${user.firstName} ${user.lastName}`);
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirm = (p, id) => {
    invitationToApply(p.UserId, id);
  };

  const displayQualifiedPeople = (qualifiedPeople || []).map((p, index) => {
    return (
      <>
        <div className="qualified-people-modal-item" key={p.id}>
          <div className="qualified-people-modal-content">
            <strong style={{ marginRight: "5px" }}>{`${index + 1}: ${
              p.firstName
            } ${p.lastName}`}</strong>
            <div>Skill Match: {calculateSkillMatchPercentage(p)}%</div>
          </div>
          <div className="qualified-people-modal-btn">
            {p.resumeUrl !== "" && p.resumeUrl && (
              <Tooltip title="Download Resume">
                <Button
                  shape="circle"
                  type="link"
                  icon={<ProfileOutlined />}
                  onClick={() => downloadFile(p)}
                  disabled={!userProfile.recruiterSubscription}
                  className="participant-card-marketplaceprofile-icon"
                />
              </Tooltip>
            )}
            <Tooltip title="Linkedin">
              <Button
                shape="circle"
                type="link"
                icon={<LinkedinOutlined />}
                onClick={() => window.open(p.personalLinks?.linkedin, "_blank")}
                className="participant-card-marketplaceprofile-icon"
                disabled={!userProfile.recruiterSubscription}
              />
            </Tooltip>

            <Tooltip title="Contact Email">
              <Button
                shape="circle"
                type="link"
                icon={<MailOutlined />}
                onClick={() => window.open(`mailto:${p.email}`, "_blank")}
                className="participant-card-marketplaceprofile-icon"
                disabled={!userProfile.recruiterSubscription}
              />
            </Tooltip>

            <Tooltip title="Invite To Apply">
              <Popconfirm
                title="Confirm send invitation to apply"
                onConfirm={() => handleConfirm(p, post.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  shape="circle"
                  type="link"
                  icon={<UserAddOutlined />}
                  disabled={!userProfile.recruiterSubscription}
                  className="participant-card-marketplaceprofile-icon"
                />
              </Popconfirm>
            </Tooltip>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          Location type: {displayLocation(p.location)}
        </div>
      </>
    );
  });

  return (
    <div className="job-post-card">
      <div className="job-post">
        <div className="job-post-card-wrapper">
          <div className="job-post-card-header">
            <h3>{post.jobTitle}</h3>
            <div>{myPostedJob && displayStatusTag()}</div>
          </div>
          <div className="job-post-card-content">
            <div>
              <strong>Role level:</strong> {post.level}
            </div>
            <div>
              <strong>Job location type:</strong>{" "}
              {displayLocation(post.location)}
            </div>
            <div>
              <strong>Salary range:</strong> {post.salaryRange}
            </div>
          </div>
        </div>
        <div>
          {!myPostedJob && (
            <div className="job-post-skill-match-wrapper">
              <h3>Skill Match: {skillMatchPercentage}%</h3>
            </div>
          )}
          {displayMoreBtn}
          {displayMyPostedJobBtns}
        </div>
      </div>
      <JobPostDrawer
        isEdit
        form={form}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        handleOnFinish={handleOnFinish}
        post={post}
        handlePostButton={handlePostButton}
        handlePostDraftButton={handlePostDraftButton}
      />
      <CustomModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        title="Qualified Candidates"
        width={520}
      >
        {qualifiedPeople.length === 0 && <Empty />}
        <div className="qualified-people-modal">{displayQualifiedPeople}</div>
      </CustomModal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...marketplaceProfileSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...jobBoardActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobPostCard);
