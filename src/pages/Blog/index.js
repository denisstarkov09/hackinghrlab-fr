import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Avatar } from "antd";
import moment from "moment";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { setLoading } from "redux/actions/home-actions";
import {
  setFollowChannel,
  unsetFollowChannel,
} from "redux/actions/channel-actions";
import {
  setBlogPostLike,
  deleteBlogPostLike,
} from "redux/actions/blog-post-action";
import { homeSelector } from "redux/selectors/homeSelector";
import { CustomButton } from "components";
import { getBlogPost, getChannel } from "api";
import { transformNames } from "utils/format";

import IconBack from "images/icon-back.svg";
import { ReactComponent as IconHeartOutline } from "images/icon-heart-outline.svg";
import "./style.scss";

const Blog = ({
  setLoading,
  userProfile,
  setFollowChannel,
  unsetFollowChannel,
  setBlogPostLike,
  deleteBlogPostLike,
}) => {
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState({});
  const [channel, setChannel] = useState({});
  const [blogPreviuw, setBlogPreviuw] = useState({})

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("previuw"))
    setBlogPreviuw(data)
    console.log(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const getBlog = async () => {
      setLoading(true);
      if (isNaN(Number(id))) {
        return history.push("/blogs");
      }
      const { data, status } = await getBlogPost(id);

      if (status === 200) {
        return setBlog(data.blogPost);
      }

      return history.push("/blogs");
    };

    getBlog();
    setLoading(false);
  }, [id, history, setLoading]);

  useEffect(() => {
    const getChannelApi = async () => {
      const { data, status } = await getChannel({ id: blog.ChannelId });

      if (status === 200) {
        return setChannel(data.channel);
      }
    };

    if (blog?.id && !channel.id) {
      getChannelApi();
    }
  }, [blog, channel]);

  const followChannel = () => {
    if (channel?.followedUsers?.includes(userProfile.id)) {
      unsetFollowChannel(channel, () => {
        setChannel({
          ...channel,
          followedUsers: channel.followedUsers.filter(
            (userId) => userId !== userProfile.id
          ),
        });
      });
    } else {
      setFollowChannel(channel, () => {
        setChannel({
          ...channel,
          followedUsers: [...channel.followedUsers, userProfile.id],
        });
      });
    }
  };

  const handleLike = () => {
    if (!blog.BlogPostLikes.some((like) => like.UserId === userProfile.id)) {
      setBlogPostLike(
        {
          BlogPostId: blog.id,
          blogPostOwnerUserId: blog.UserId,
        },
        (like) => {
          setBlog({
            ...blog,
            BlogPostLikes: [...blog.BlogPostLikes, like],
          });
        }
      );
    } else {
      deleteBlogPostLike(blog.id, () => {
        setBlog({
          ...blog,
          BlogPostLikes: blog.BlogPostLikes.filter(
            (likes) => likes.UserId !== userProfile.id
          ),
        });
      });
    }
  };

  const avatarCase = () => {
    if (!blogPreviuw.title) {
      return (<Avatar size={40}>DP</Avatar>)
    } else {
      return (<Avatar size={40} src={userProfile?.img} />)
    }
  }

  if (!blog.id && !blogPreviuw.title) {
    return <></>;
  }

  if (blog.status === "draft") {
    history.goBack();
    return <></>;
  }
  return (
    <div className="blog-page">
      <div
        onClick={() => {
          if (location.pathname.includes("channels")) {
            return history.replace({
              pathname: location.pathname.slice(0, 11),
              search: `?tab=blogs`,
            });
          }
          history.push("/blogs");
        }}
      >
        <div className="blog-page-link">
          <div className="blog-page-link-back">
            <img src={IconBack} alt="icon-back" />
          </div>
          <h4>Back to Blogs</h4>
        </div>
      </div>
      <div className="blog-page-container">
        <div className="blog-page-header">
          <div className="blog-page-title">
            <h1>{!blog.id ? blogPreviuw?.title : blog.title}</h1>
          </div>

          <div className="blog-page-date">
            {moment(!blog.id ? moment() : blog.createdAt).format("MMMM DD, YYYY")}
          </div>

          {(blog.imageUrl || blogPreviuw?.imageUrl) && (
            <div className="blog-page-image">
              <img src={!blog.id ? blogPreviuw?.imageUrl : blog.imageUrl} alt={"cover"} />
            </div>
          )}

          <div className="blog-page-info">
            <div className="blog-page-author">
              {(blog.User?.img) ? (
                <Avatar size={40} src={(blog.User.img)} />
              ) : (
                avatarCase()
              )}
              <div>
                <span className="author-name">
                  {transformNames(!blog.id ? userProfile?.firstName : blog.User?.firstName)}{" "}
                  {transformNames(!blog.id ? userProfile?.lastName : blog.User?.lastName)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="blog-page-content">
          <div dangerouslySetInnerHTML={{ __html: !blog.id ? blogPreviuw?.description?.html : blog.description?.html }} />
        </div>

        <div className="likes-container">
          <div className="likes">
            <IconHeartOutline />
          </div>

          <span>{!blog.id ? 0 : blog.BlogPostLikes.length}</span>
        </div>

        <div className="btn-like-container">
          <div>
            {blog.id && <span onClick={() => handleLike()} className="btn-like">
              <IconHeartOutline
                className={`icon-like ${blog?.BlogPostLikes?.some(
                  (like) => like.UserId === userProfile.id
                ) && "svg-fill-color"
                  } `}
              />
              Like
            </span>}

            {blog.id && <CustomButton
              htmlType="button"
              text={
                channel?.followedUsers?.includes(userProfile.id)
                  ? "Unfollow Channel"
                  : "Follow Channel"
              }
              type={
                channel?.followedUsers?.includes(userProfile.id)
                  ? "secondary"
                  : "primary"
              }
              size="sm"
              loading={false}
              onClick={followChannel}
              style={{ marginLeft: "10px" }}
            />}
          </div>
          {/* <div className="blog-page-categories">
            {blog.categories.map((category) => (
              <SpecialtyItem key={category} title={category} active={false} />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setLoading,
  setFollowChannel,
  unsetFollowChannel,
  setBlogPostLike,
  deleteBlogPostLike,
};

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
