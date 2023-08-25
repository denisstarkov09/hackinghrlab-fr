import React from "react";
import { connect } from "react-redux";
import { CustomButton, CustomInput } from "components";
import { Form } from "antd";

import { skillCohortParticipantSelector } from "redux/selectors/skillCohortParticipantSelector";
import { skillCohortResourceSelector } from "redux/selectors/skillCohortResourceSelector";
import { homeSelector } from "redux/selectors/homeSelector";

import { actions as skillCohortResourceResponseAssessmentActions } from "redux/actions/skillCohortResourceResponseAssessment-actions";
import { actions as skillCohortResourceResponseActions } from "redux/actions/skillCohortResourceResponse-actions";
import { actions as skillCohortResourceActions } from "redux/actions/skillCohortResource-actions";

import "./style.scss";

const SkillCohortResourceForm = ({
  userProfile,
  isResponse,
  createResourceResponse,
  skillCohortParticipant,
  getSkillCohortResource,
  upsertSkillCohortResourceResponseAssessment,
  skillCohortResourceResponse,
  skillCohortResource
}) => {
  const [form] = Form.useForm();

  const handleOnFinish = (values) => {
    if (isResponse) {
      createResourceResponse(
        skillCohortResource.id,
        skillCohortParticipant.id,
        values.data
      );
    } else {
      upsertSkillCohortResourceResponseAssessment({
        assessment: values.data,
        SkillCohortParticipantId: skillCohortParticipant.id,
        SkillCohortResourceResponseId: skillCohortResourceResponse.id,
        SkillCohortResourceId: skillCohortResource.id,
      })
    }

    getSkillCohortResource(skillCohortResource.id);
    form.resetFields();
  };
  return (
    <>
      <div className="comment-container">
        <img
          src={userProfile.img}
          alt="profile-pic"
          className="conversation-img"
        />
        <div className="form-container">
          <Form form={form} onFinish={handleOnFinish}>
            <Form.Item name="data">
              <CustomInput
                multiple
                placeholder="Add a comment"
                className="comment-input"
              />
            </Form.Item>
            <CustomButton text="Post comment" size="sm" htmlType="submit" />
          </Form>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  ...skillCohortParticipantSelector(state),
  ...skillCohortResourceSelector(state)
});

const mapStateToDispatch = {
  ...skillCohortResourceResponseAssessmentActions,
  ...skillCohortResourceResponseActions,
  ...skillCohortResourceActions,
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(SkillCohortResourceForm);
