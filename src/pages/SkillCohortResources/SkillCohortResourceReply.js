import React, { useState } from "react";
import { connect } from "react-redux";
import { Popconfirm, Comment, Avatar, Form } from "antd";
import { getPublicationTime } from "utils/format";
import { EditOutlined } from "@ant-design/icons";
import { CustomInput, CustomButton } from "components";

import { ReactComponent as IconTrashOutline } from "images/icon-trash-outline.svg";
import { ReactComponent as IconChatBubblesOutline } from "images/icon-chatbubbles-outline.svg";

import { skillCohortParticipantSelector } from "redux/selectors/skillCohortParticipantSelector";
import { homeSelector } from "redux/selectors/homeSelector";

import { actions as skillCohortResourceActions } from "redux/actions/skillCohortResource-actions";
import { actions as skillCohortResponse } from "redux/actions/skillCohortResourceResponse-actions";
import { actions as skillCohortResponseASsessmentActions } from "redux/actions/skillCohortResourceResponseAssessment-actions";

import SkillCohortResourceForm from "./SkillCohortResourceForm";
import SkillCohortResourceResponseAssessmentReply from "./SkillCohortResourceResponseAssessmentReply";
import "./style.scss";

const SkillCohortResourceReply = ({
  userProfile,
  response,
  enableReply = true,
  getSkillCohortResource,
  updateResourceResponse,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditResponse, setIsEditResponse] = useState(false);
  const [form] = Form.useForm();

  const onReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleDeleteResponse = () => {
    updateResourceResponse(response.id, {
      isDeleted: true,
    });
    getSkillCohortResource(response.SkillCohortResourceId);
  };

  const handleOnFinish = (values) => {
    updateResourceResponse(response.id, {
      ...values,
    });
    getSkillCohortResource(response.SkillCohortResourceId);
    setIsEditResponse(false);
  };

  const displayContentResponse = isEditResponse ? (
    <Form
      form={form}
      initialValues={{ response: response.response }}
      onFinish={handleOnFinish}
    >
      <Form.Item name="response">
        <CustomInput multiple required />
      </Form.Item>
      <CustomButton size="sm" text="Edit" htmlType="submit" />
    </Form>
  ) : (
    response.response
  );

  return (
    <div className="replies-container">
      <Comment
        author={`${response.SkillCohortParticipant.User.firstName} ${response.SkillCohortParticipant.User.lastName}`}
        avatar={
          <Avatar
            src={response.SkillCohortParticipant.User.img}
            alt={`${response.SkillCohortParticipant.User.firstName} ${response?.SkillCohortParticipant?.User?.lastName}`}
          />
        }
        datetime={<span>{getPublicationTime(response.createdAt)}</span>}
        content={displayContentResponse}
        actions={[
          userProfile.id === response.SkillCohortParticipant.User.id && (
            <span
              key="comment-basic-reply-to"
              onClick={() => setIsEditResponse((value) => !value)}
            >
              <EditOutlined /> Edit
            </span>
          ),
          enableReply && (
            <span key="comment-basic-reply-to" onClick={onReplyClick}>
              <IconChatBubblesOutline /> Reply
            </span>
          ),
          userProfile.id === response.SkillCohortParticipant.User.id && (
            <Popconfirm
              title="Are you sure you want to permanently remove this item?"
              onConfirm={handleDeleteResponse}
            >
              <IconTrashOutline /> Remove
            </Popconfirm>
          ),
        ]}
      >
        {showReplyForm && (
          <div className="reply-resource-form">
            <SkillCohortResourceForm
              isResponse={false}
              skillCohortResourceResponse={response}
            />
          </div>
        )}
        {response.SkillCohortResponseAssessments.map((assessment) => {
          return (
            <SkillCohortResourceResponseAssessmentReply
              key={assessment.id}
              assessment={assessment}
              response={response}
            />
          );
        })}
      </Comment>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  ...skillCohortParticipantSelector(state),
});

const mapDispatchToProps = {
  ...skillCohortResponse,
  ...skillCohortResourceActions,
  ...skillCohortResponseASsessmentActions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SkillCohortResourceReply);
