import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { notification } from "antd";
import { blogPostSelector } from "redux/selectors/blogPostSelector";
import {
  createBlogPost,
  getBlogsPostsByChannel,
  updateBlogPost,
  deleteBlogPost,
} from "redux/actions/blog-post-action";
import { homeSelector } from "redux/selectors/homeSelector";
import { channelSelector } from "redux/selectors/channelSelector";
import NoItemsMessageCard from "components/NoItemsMessageCard";
import { CustomButton, CustomModal, BlogCard } from "components";
import ModalCreateOrEdit from "./ModalCreateOrEditBlog";
import {
  notificationEmailToNewContentCreators
} from "redux/actions/channel-actions";

const BlogList = ({
  isOwner,
  isEditor,
  userProfile,
  blogsPostByChannel,
  createBlogPost,
  getBlogsPostsByChannel,
  updateBlogPost,
  deleteBlogPost,
  notificationEmailToNewContentCreators,
  selectedChannel,
  limit,
  buttomEdit
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [editOrDeleteBlogPost, setEditOrDeleteBlogPost] = useState({});

  const onShowBlogPosstModal = () => {
    setVisibleModal(true);
  };

  const onCancelModal = () => {
    setEditOrDeleteBlogPost({});
    setVisibleModal(false);
    setVisibleDeleteModal(false);
  };

  const handleCreateOrEditBlog = (data) => {
    if (editOrDeleteBlogPost.id) {
      updateBlogPost(editOrDeleteBlogPost.id, data, (error) => {
        if (error) {
          return notification.error({
            message: error,
          });
        }
        getBlogsPostsByChannel(selectedChannel?.id);

        return notification.success({
          message: "Blog Updated Successfully",
        });
      });
    } else {
      createBlogPost(
        { ...data, UserId: userProfile?.id, ChannelId: selectedChannel?.id },
        (error) => {
          if (error) {
            return notification.error({
              message: error,
            });
          }

          getBlogsPostsByChannel(selectedChannel.id);
          if (data.date === undefined) {
            notificationEmailToNewContentCreators({
              channelName: selectedChannel?.name,
              channelAdmin: selectedChannel?.User?.firstName,
              channelAdminEmail: selectedChannel?.User?.email,
              contentType: "blogs",
              name: data.title,
              link: "blogs not have link"
            })
          }

          return notification.success({
            message: "Blog Posted Successfully",
          });
        }
      );
    }

    setEditOrDeleteBlogPost({});
    onCancelModal();
  };

  const handleEditOrDelete = (option, blogId) => {
    const blogPost = blogsPostByChannel.find(
      (blogPost) => blogPost?.id === blogId
    );

    if (!blogPost) return;
    setEditOrDeleteBlogPost(blogPost);
    if (option === "edit") {
      return setVisibleModal(true);
    }
    setVisibleDeleteModal(true);
  };

  const handleDeleteBlogPost = (blogPostId) => {
    deleteBlogPost(blogPostId, (error) => {
      if (error) {
        return notification.error({
          message: error,
        });
      }
      getBlogsPostsByChannel(selectedChannel?.id);

      return notification.success({
        message: "Blog Deleted Successfully",
      });
    });

    setVisibleDeleteModal(false);
    setEditOrDeleteBlogPost({});
  };

  useEffect(() => {
    if (selectedChannel !== undefined) {
      getBlogsPostsByChannel(selectedChannel?.id);
    }
  }, [getBlogsPostsByChannel, selectedChannel]);

  return (
    <div className="channel-page__list-wrap">
      {visibleModal && (
        <ModalCreateOrEdit
          onCancelModal={onCancelModal}
          handleCreateOrEditBlog={handleCreateOrEditBlog}
          editOrDeleteBlogPost={editOrDeleteBlogPost}
        />
      )}

      <CustomModal
        visible={visibleDeleteModal}
        title={`Are you sure to delete this blog?`}
        subTitle="this option is not reversible"
        onCancel={() => setVisibleDeleteModal(false)}
        width={500}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CustomButton
            type="primary outlined"
            text="No"
            onClick={() => onCancelModal()}
          />
          <CustomButton
            type="primary"
            text="Yes"
            style={{ marginLeft: "5px" }}
            onClick={() => handleDeleteBlogPost(editOrDeleteBlogPost?.id)}
          />
        </div>
      </CustomModal>
      {!isOwner && !isEditor && blogsPostByChannel?.length === 0 ? (
        <NoItemsMessageCard
          message={`There are no Blogs for you at the moment`}
        />
      ) : (
        <>
          <div className="channels__list">
            {(isOwner || isEditor) && (
              <CustomButton
                text="Add Blog Posts"
                htmlType="submit"
                size="sm"
                type="primary"
                className={(buttomEdit === 'home') ? "buttomAddRR" : "buttomAddR"}
                style={(buttomEdit === 'home') ? { left: "100px" } : { left: '200px' }}
                onClick={() => onShowBlogPosstModal()}
              />
            )}
            {blogsPostByChannel
              .filter((blogPost) => {
                if (
                  (blogPost?.UserId === userProfile?.id &&
                    blogPost?.status === "draft") ||
                  blogPost?.status === "published"
                ) {
                  return blogPost;
                }

                return null;
              })
              .map((blogPost, index) => {
                if (limit > index || limit === 'all') {
                  return (
                    <BlogCard
                      data={blogPost}
                      onMenuClick={handleEditOrDelete}
                      isOwner={isOwner}
                      isEditor={isEditor}
                      key={blogPost?.id}
                      id={blogPost?.id}
                      image={blogPost?.imageUrl}
                      date={blogPost?.createdAt}
                      title={blogPost?.title}
                      summary={blogPost?.summary}
                      isDraft={blogPost?.status === "draft"}
                      categories={blogPost?.categories}
                    />
                  )
                } else {
                  return (<div key={blogPost?.id} style={{ display: "none" }}></div>)
                }
              })}
          </div>
        </>
      )}
    </div>
  );
};

BlogList.propTypes = {
  blogPosts: PropTypes.array,
  isOwner: PropTypes.bool,
  isEditor: PropTypes.bool,
  filter: PropTypes.object,
};

BlogList.defaultProps = {
  blogPosts: [],
  isOwner: false,
  isEditor: false,
  filter: {},
};

const mapStateToProps = (state) => ({
  blogsPostByChannel: blogPostSelector(state).blogsPostByChannel,
  selectedChannel: channelSelector(state).selectedChannel,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  createBlogPost,
  getBlogsPostsByChannel,
  updateBlogPost,
  deleteBlogPost,
  notificationEmailToNewContentCreators
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogList);
