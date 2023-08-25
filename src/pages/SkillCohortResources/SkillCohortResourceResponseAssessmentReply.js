import React, { useState } from "react";
import { Comment, Popconfirm, Avatar, Form } from "antd";
import { connect } from "react-redux";
import { getPublicationTime } from "utils/format";
import { EditOutlined } from "@ant-design/icons";
import { CustomInput, CustomButton } from "components";

import { homeSelector } from "redux/selectors/homeSelector";

import { actions as skillCohortResponseASsessmentActions } from "redux/actions/skillCohortResourceResponseAssessment-actions";
import { actions as skillCohortResourceActions } from "redux/actions/skillCohortResource-actions";

import { ReactComponent as IconTrashOutline } from "images/icon-trash-outline.svg";

const SkillCohortResourceResponseAssessmentReply = ({
  assessment,
  response,
  userProfile,
  upsertSkillCohortResourceResponseAssessment,
  getSkillCohortResource,
}) => {
  const [isEditAssessment, setIsEditAssessment] = useState(false);
  const [form] = Form.useForm();

  const handleOnFinish = (values) => {
    upsertSkillCohortResourceResponseAssessment({
      id: assessment.id,
      assessment: values.assessment,
    });
    getSkillCohortResource(assessment.SkillCohortResourceId);
    setIsEditAssessment(false);
    form.resetFields();
  };

  const handleDeleteAssessment = () => {
    upsertSkillCohortResourceResponseAssessment({
      id: assessment.id,
      isDeleted: true,
    });
    getSkillCohortResource(assessment.SkillCohortResourceId);
  };

  const displayContentAssessment = isEditAssessment ? (
    <Form
      form={form}
      initialValues={{ assessment: assessment.assessment }}
      onFinish={handleOnFinish}
    >
      <Form.Item name="assessment">
        <CustomInput multiple required />
      </Form.Item>
      <CustomButton size="sm" text="Edit" htmlType="submit" />
    </Form>
  ) : (
    assessment.assessment
  );

  return (
    <Comment
      key={assessment.id}
      author={`${assessment.SkillCohortParticipant.User.firstName} ${assessment.SkillCohortParticipant.User.lastName}`}
      avatar={
        <Avatar
          src={assessment.SkillCohortParticipant.User.img}
          alt={`${assessment.SkillCohortParticipant.User.firstName} ${assessment?.SkillCohortParticipant?.User?.lastName}`}
        />
      }
      datetime={<span>{getPublicationTime(assessment.createdAt)}</span>}
      content={displayContentAssessment}
      actions={[
        userProfile.id === response.SkillCohortParticipant.User.id && (
          <span
            key="comment-basic-reply-to"
            onClick={() => setIsEditAssessment((value) => !value)}
          >
            <EditOutlined /> Edit
          </span>
        ),
        userProfile.id === assessment.SkillCohortParticipant.User.id && (
          <Popconfirm
            key={assessment.id}
            title="Are you sure you want to permanently remove this item?"
            onConfirm={handleDeleteAssessment}
          >
            <IconTrashOutline /> Remove
          </Popconfirm>
        ),
      ]}
    ></Comment>
  );
};

const mapStateToProps = (state) => ({
  ...homeSelector(state),
});

const mapDispatchToProps = {
  ...skillCohortResponseASsessmentActions,
  ...skillCohortResourceActions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SkillCohortResourceResponseAssessmentReply);
