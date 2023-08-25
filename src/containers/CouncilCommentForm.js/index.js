import React from "react";
import { connect } from "react-redux";
import { Avatar, Form } from "antd";
import { CustomButton, CustomInput } from "components";

import { councilConversationSelector } from "redux/selectors/councilConversationSelector";
import { actions as councilConversationCommentActions } from "redux/actions/council-conversation-comment-actions";
import { actions as councilConversationReplyActions } from "redux/actions/council-conversation-reply-actions";

import { homeSelector } from "redux/selectors/homeSelector";

import "./style.scss";

const CouncilCommentForm = ({
  userProfile,
  upsertCouncilConversationComment,
  upsertCouncilConversationReply,
  councilConversation,
  isReply = false,
  data = {},
  afterSave,
}) => {
  const [form] = Form.useForm();

  const handleOnFinish = (values) => {
    if (isReply) {
      upsertCouncilConversationReply({
        ...values,
        CouncilConversationId: councilConversation.id,
        CouncilConversationCommentId: data.id,
      });
      afterSave();
    } else {
      upsertCouncilConversationComment({
        ...values,
        CouncilConversationId: councilConversation.id,
      });
    }

    form.resetFields();
  };

  return (
    <div className="form-comment-container">
      <div className="form-comment-container--content">
        <section className="user-img">
          {userProfile.img != null ? (
            <img src={userProfile.img} alt="user-img-form-comment" />
          ) : (
            <Avatar>{`${userProfile.firstName[0]}${userProfile.lastName[0]}`}</Avatar>
          )}
        </section>
        <section className="comment-form">
          <Form form={form} layout="vertical" onFinish={handleOnFinish}>
            <Form.Item name="comment" rules={[{ required: true }]}>
              <CustomInput
                multiple={true}
                placeholder="Add a comment..."
                rows={2}
              />
            </Form.Item>
            <Form.Item>
              <CustomButton
                htmlType="submit"
                size="sm"
                text="Post comment"
              ></CustomButton>
            </Form.Item>
          </Form>
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  ...councilConversationSelector(state)
});

const mapDispatchToProps = {
  ...councilConversationCommentActions,
  ...councilConversationReplyActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilCommentForm);
