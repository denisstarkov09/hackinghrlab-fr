import React, { useState } from "react";
import { Card, Avatar, Tooltip, Button, Popconfirm } from "antd";
import {
  LinkedinOutlined,
  MailOutlined,
  ProfileOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";
import { CustomButton, SpecialtyItem, CustomModal } from "components";
import { JOB_BOARD } from "enum";

import "./style.scss";

const ParticipantCardInfo = ({
  participant,
  userProfile,
  marketplaceProfile,
  jobPosts,
  invitationToApply,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.setAttribute("href", participant.resumeUrl);
    link.setAttribute(
      "download",
      `${participant.firstName} ${participant.lastName}`
    );
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirm = (id) => {
    invitationToApply(participant.UserId, id);
    setIsModalVisible(false);
  };

  const displayJobPosts =
    jobPosts &&
    jobPosts.map((jobPost) => {
      const displayLocation = jobPost.location
        .map((location) => {
          const data = JOB_BOARD.LOCATIONS.find(
            (loc) => loc.value === location
          );

          return data.text;
        })
        .join("/");

      return (
        <Popconfirm
          key={jobPost.id}
          title="Confirm send invitation to apply"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleConfirm(jobPost.id)}
        >
          <div className="active-job-post">
            <div>
              <h3>{jobPost.jobTitle}</h3>
              <div>
                <div>
                  <strong>Role level:</strong> {jobPost.level}
                </div>
                <div>
                  <strong>Job location type: </strong>
                  {displayLocation}
                </div>
                <div>
                  <strong>Salary range:</strong> {jobPost.salaryRange}
                </div>
              </div>
            </div>
          </div>
        </Popconfirm>
      );
    });

  return (
    <>
      {participant.img ? (
        <Avatar size={150} src={participant.img} />
      ) : (
        <Avatar size={150} style={{ fontSize: "2rem" }}>
          {participant.abbrName}
        </Avatar>
      )}

      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 500 }}>
          {participant.firstName} {participant.lastName}
        </p>
        {participant.lookingFor ? (
          <div style={{ marginTop: -10 }}>
            <span className="participant-card-marketplaceprofile--title">
              Looking For:
            </span>
            {participant.lookingFor.map((profesion, i) => (
              <SpecialtyItem key={i} title={profesion} />
            ))}
          </div>
        ) : (
          <p style={{ marginTop: -10 }}>{participant.titleProfessions}</p>
        )}
        <p style={{ marginTop: -10 }}>{participant.company}</p>

        {participant.location && marketplaceProfile && (
          <div style={{ marginBottom: "50px" }}>
            <span className="participant-card-marketplaceprofile--title">
              Available locations:
            </span>

            {participant.location.map((location, i) => (
              <SpecialtyItem key={i} title={location} />
            ))}
          </div>
        )}
      </div>
      {marketplaceProfile && (
        <div className="participant-card-marketplaceprofile">
          {participant.resumeUrl !== "" && participant.resumeUrl && (
            <Tooltip title="Download Resume">
              <Button
                shape="circle"
                type="link"
                icon={<ProfileOutlined />}
                onClick={() => downloadFile()}
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
              onClick={() =>
                window.open(participant.personalLinks?.linkedin, "_blank")
              }
              className="participant-card-marketplaceprofile-icon"
              disabled={!userProfile.recruiterSubscription}
            />
          </Tooltip>

          <Tooltip title="Contact Email">
            <Button
              shape="circle"
              type="link"
              icon={<MailOutlined />}
              onClick={() =>
                window.open(`mailto:${participant.email}`, "_blank")
              }
              className="participant-card-marketplaceprofile-icon"
              disabled={!userProfile.recruiterSubscription}
            />
          </Tooltip>

          <Tooltip title="Invite To Apply">
            <Button
              shape="circle"
              type="link"
              icon={<UserAddOutlined />}
              onClick={showModal}
              disabled={!userProfile.recruiterSubscription}
              className="participant-card-marketplaceprofile-icon"
            />
          </Tooltip>
        </div>
      )}
      <CustomModal
        title="Select Job Post"
        visible={isModalVisible}
        onCancel={handleCancel}
        width={768}
      >
        <div className="active-job-posts">{displayJobPosts}</div>
      </CustomModal>
    </>
  );
};

const ParticipantCard = ({
  participant,
  onOpenModalBonfires,
  invitedAllBonfires,
  marketplaceProfile,
  userProfile,
  jobPosts,
  invitationToApply,
}) => {
  return (
    <Card
      hoverable
      bordered
      type="inner"
      extra={<UserOutlined />}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      className="participant-card-container"
    >
      {invitedAllBonfires === false && invitedAllBonfires !== null ? (
        <CustomButton
          size="sm"
          text="Invite to bonfire"
          style={{ marginTop: "-30px", marginBottom: "30px" }}
          onClick={() => onOpenModalBonfires(participant.id)}
        />
      ) : null}

      {marketplaceProfile ? (
        <>
          <ParticipantCardInfo
            participant={participant}
            marketplaceProfile
            userProfile={userProfile}
            jobPosts={jobPosts}
            invitationToApply={invitationToApply}
          />
        </>
      ) : (
        <a
          href={participant.personalLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="link-container"
        >
          <ParticipantCardInfo participant={participant} />
        </a>
      )}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

export default connect(mapStateToProps)(ParticipantCard);
