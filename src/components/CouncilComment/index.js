import React, { useState } from "react";
import { connect } from "react-redux";
import { Comment, Avatar, Popconfirm, Form } from "antd";
import moment from "moment-timezone";
import { EditOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { CustomInput, CustomButton } from "components";
import qs from "query-string";

import { actions as councilCommentActions } from "redux/actions/council-conversation-comment-actions";
import { authSelector } from "redux/selectors/authSelector";
import { councilConversationSelector } from "redux/selectors/councilConversationSelector";

import { ReactComponent as IconTrashOutline } from "images/icon-trash-outline.svg";
import { ReactComponent as IconChatBubblesOutline } from "images/icon-chatbubbles-outline.svg";
import CouncilCommentForm from "../../containers/CouncilCommentForm.js";
import CouncilConversationCommentReply from "./CouncilCommentReply";

import "./style.scss";

const CouncilComment = ({
  userId,
  data,
  enableReply,
  upsertCouncilConversationComment,
  deleteCouncilConversationComment,
  councilConversation
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setEditForm] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();

  const parsed = qs.parse(location.search);

  const handleDeleteComment = () => {
    deleteCouncilConversationComment(data.id, parsed.id);
  };

  const handleOnFinish = (values) => {
    upsertCouncilConversationComment({
      ...values,
      id: data.id,
      CouncilConversationId: councilConversation.id,
    });

    form.resetFields();
    setEditForm((state) => !state);
  };

  const displayContent = showEditForm ? (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleOnFinish}
      initialValues={{ comment: data.comment }}
    >
      <Form.Item name="comment" rules={[{ required: true }]}>
        <CustomInput multiple />
      </Form.Item>
      <Form.Item>
        <CustomButton htmlType="submit" text="Submit" />
      </Form.Item>
    </Form>
  ) : (
    <div>{data.comment}</div>
  );

  return (
    <Comment
      author={`${data.User.firstName} ${data.User.lastName}`}
      avatar={
        <Avatar
          src={data.User.img}
          alt={`${data.User.firstName} ${data.User.lastName}`}
        />
      }
      datetime={<span>{moment(data.createdAt).fromNow()}</span>}
      content={displayContent}
      actions={[
        userId === data.User.id && (
          <span
            key="comment-basic-reply-to"
            onClick={() => setEditForm((value) => !value)}
          >
            <EditOutlined /> Edit
          </span>
        ),
        enableReply && (
          <span
            key="comment-basic-reply-to"
            onClick={() => setShowReplyForm((state) => !state)}
          >
            <IconChatBubblesOutline /> Reply
          </span>
        ),
        userId === data.UserId && (
          <>
            <Popconfirm
              title="Are you sure you want to permanently remove this item?"
              onConfirm={handleDeleteComment}
            >
              <IconTrashOutline /> Remove
            </Popconfirm>
          </>
        ),
      ]}
    >
      {showReplyForm && (
        <CouncilCommentForm
          afterSave={() => {
            setShowReplyForm((state) => !state);
          }}
          data={data}
          isReply
        />
      )}
      {data.CouncilConversationReplies.map((item) => {
        return (
          <CouncilConversationCommentReply
            key={item.id}
            data={item}
          />
        );
      })}
    </Comment>
  );
};

const mapStateToProps = (state) => ({
  userId: authSelector(state).id,
  ...councilConversationSelector(state)
});

const mapDispatchToProps = {
  ...councilCommentActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilComment);
