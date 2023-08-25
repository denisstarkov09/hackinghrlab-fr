import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Comment, Avatar, Popconfirm } from "antd";

import { getPublicationTime } from "utils/format";

import { default as SubPostComment } from "components/PostComment";
import PostCommentForm from "containers/PostCommentForm";
import { deleteComment } from "redux/actions/post-comment-actions";
import { authSelector } from "redux/selectors/authSelector";

import { ReactComponent as IconTrashOutline } from "images/icon-trash-outline.svg";
import { ReactComponent as IconChatBubblesOutline } from "images/icon-chatbubbles-outline.svg";

import "./style.scss";

const PostComment = ({
  userId,
  data,
  postId,
  afterSave,
  enableReply,
  deleteComment,
  postOwnerUserId
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const onReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const getPostComments = (item) => {
    return (
      <SubPostComment
        key={`post-comment-${item.id}`}
        data={item}
        postId={postId}
        postCommentId={item.id}
        afterSave={afterSave}
        enableReply={false}
      />
    );
  };

  const onRemoveComment = () => {
    deleteComment({ id: data.id, PostId: data.PostId });
  };

  return (
    <Comment
      author={`${data.userFirstName} ${data.userLastName}`}
      avatar={
        <Avatar
          src={data.userImg}
          alt={`${data.userFirstName} ${data.userLastName}`}
        />
      }
      datetime={<span>{getPublicationTime(data.createdAt)}</span>}
      content={data.comment}
      actions={[
        enableReply && (
          <span key="comment-basic-reply-to" onClick={onReplyClick}>
            <IconChatBubblesOutline /> Reply
          </span>
        ),
        userId === data.UserId && (
          <Popconfirm
            title="Are you sure you want to permanently remove this item?"
            onConfirm={onRemoveComment}
          >
            <IconTrashOutline /> Remove
          </Popconfirm>
        ),
      ]}
    >
      {showReplyForm && (
        <PostCommentForm
          postId={postId}
          postCommentId={data.id}
          postCommentUserId={data.UserId}
          postOwnerUserId={postOwnerUserId}
          afterSave={() => {
            setShowReplyForm(!showReplyForm);
            afterSave();
          }}
        />
      )}
      {data.PostComments && (
        <>{data.PostComments.map((item) => getPostComments(item))}</>
      )}
    </Comment>
  );
};

PostComment.propTypes = {
  enableReply: PropTypes.bool,
  data: PropTypes.object,
  postId: PropTypes.number,
  afterSave: PropTypes.func,
};

PostComment.defaultProps = {
  enableReply: true,
  data: null,
  postId: 0,
  afterSave: () => {},
};

const mapStateToProps = (state) => ({
  userId: authSelector(state).id,
});

const mapDispatchToProps = {
  deleteComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostComment);
