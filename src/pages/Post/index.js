import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card } from "antd";

import { setPost, getPost, updatePost } from "redux/actions/post-actions";
import { getAllComments } from "redux/actions/post-comment-actions";
import { postSelector } from "redux/selectors/postSelector";
import { postCommentSelector } from "redux/selectors/postCommentSelector";
import { authSelector } from "redux/selectors/authSelector";

import PostCard from "components/PostCard";
import PostComment from "components/PostComment";

import PostForm from "containers/PostForm";
import PostCommentForm from "containers/PostCommentForm";

import { ReactComponent as IconArrowBackCircleOutline } from "images/icon-arrow-back-circle-outline.svg";

import { INTERNAL_LINKS } from "enum";

import "./style.scss";

const PostPage = ({
  setPost,
  getPost,
  match,
  post,
  updatePost,
  getAllComments,
  allComments,
  history,
  userId,
}) => {
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    setPost(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (post && match.params.edit) {
      if (post.UserId === userId && parseInt(match.params.edit) === userId) {
        setIsUpdate(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const load = async () => {
    getPost(match.params.id);
    getAllComments({ postId: match.params.id });
  };

  const onUpdate = (data) => {
    updatePost({ ...data, id: post.id });
    setIsUpdate(false);
  };

  const afterSaveComment = () => {
    getAllComments({ postId: post.id });
  };

  return (
    <div className="post-page">
      <div className="post-page-container">
        <div className="post-page-container--header-button-section">
          <IconArrowBackCircleOutline
            title="Back to home"
            onClick={() => {
              if (isUpdate === true) {
                setIsUpdate(false);
              } else {
                history.push(INTERNAL_LINKS.HOME);
              }
            }}
          />
        </div>
        {post != null && isUpdate && (
          <>
            {isUpdate && (
              <Card title="Edit Post">
                <PostForm
                  postData={post}
                  buttonText="SAVE EDITS"
                  onUpdate={onUpdate}
                />
              </Card>
            )}
          </>
        )}
        {post != null && !isUpdate && (
          <>
            <PostCard
              details={true}
              data={post}
              showEdit={true}
              onEditClick={() => {
                setIsUpdate(true);
              }}
              afterRemove={() => {
                history.push(INTERNAL_LINKS.HOME);
              }}
            />
            <PostCommentForm postId={post.id} afterSave={afterSaveComment} postOwnerUserId={post.UserId}/>
            <div className="post-page-container--comments-container">
              {allComments.length > 0 ? (
                <>
                  {allComments.map((item) => (
                    <PostComment
                      key={`post-comment-${item.id}`}
                      data={item}
                      postId={post.id}
                      afterSave={afterSaveComment}
                      postOwnerUserId={post.UserId}
                    />
                  ))}
                </>
              ) : (
                <div className="post-page-container--comments-container--empty-message">
                  Comments not found.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

PostPage.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

PostPage.defaultProps = {
  match: null,
  history: null,
};

const mapStateToProps = (state) => ({
  post: postSelector(state).post,
  allComments: postCommentSelector(state).allComments,
  userId: authSelector(state).id,
});

const mapDispatchToProps = {
  setPost,
  getPost,
  updatePost,
  getAllComments,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
