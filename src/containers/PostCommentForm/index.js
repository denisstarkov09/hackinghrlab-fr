import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Avatar, Card, Form } from "antd";

import { CustomButton, CustomInput } from "components";

import { addComment as addPostComment } from "redux/actions/post-comment-actions";

import { homeSelector } from "redux/selectors/homeSelector";

import Emitter from "services/emitter";
import { EVENT_TYPES } from "enum";

import "./style.scss";

const PostCommentForm = ({
  postId,
  postCommentId,
  addPostComment,
  afterSave,
  userProfile,
  postOwnerUserId, // id of the owner of the post
  postCommentUserId, // id of the owner of the comment in a post
}) => {
  const [form] = Form.useForm();
  const addComment = (data) => {
    if (postCommentId) {
      // response to a post in a comment
      addPostComment({
        ...data,
        PostCommentId: postCommentId,
        PostId: postId,
        postCommentUserId,
        postOwnerUserId,
        isAComment: false,
      });
    } else {
      // comment to a post
      addPostComment({
        ...data,
        PostId: postId,
        postOwnerUserId,
        isAComment: true,
      });
    }
    afterSave();
    form.resetFields();
  };

  const onOpenFirewallModal = () => {
    Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "comment");
  };

  return (
    <Card bordered={false} className="form-comment-container">
      <div className="form-comment-container--content">
        <section className="user-img">
          {userProfile.img != null ? (
            <img src={userProfile.img} alt="user-img-form-comment" />
          ) : (
            <Avatar>{`${userProfile.firstName[0]}${userProfile.lastName[0]}`}</Avatar>
          )}
        </section>
        <section className="comment-form">
          <Form
            form={form}
            layout="vertical"
            onFinish={(data) => {
              if (userProfile.completed === true) {
                addComment(data, postId);
              } else {
                onOpenFirewallModal();
              }
            }}
          >
            <Form.Item name="comment">
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
    </Card>
  );
};

PostCommentForm.propTypes = {
  postId: PropTypes.number,
  postCommentId: PropTypes.number,
  afterSave: PropTypes.func,
};

PostCommentForm.defaultProps = {
  postId: 0,
  postCommentId: 0,
  afterSave: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  addPostComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCommentForm);
