import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Popconfirm } from "antd";
import OpengraphReactComponent from "opengraph-react";

import {
  setPostLike,
  deletePostLike,
  setPostFollow,
  deletePostFollow,
  deletePost,
} from "redux/actions/post-actions";

import { getPublicationTime } from "utils/format";

import { categorySelector } from "redux/selectors/categorySelector";
import { authSelector } from "redux/selectors/authSelector";

import { ReactComponent as IconCreateOutline } from "images/icon-create-outline.svg";
import { ReactComponent as IconTrashOutline } from "images/icon-trash-outline.svg";
import { ReactComponent as IconWaterOutline } from "images/icon-water-outline.svg";
import { ReactComponent as IconFlameOutline } from "images/icon-flame-outline.svg";
import { ReactComponent as IconHeartOutline } from "images/icon-heart-outline.svg";
import { ReactComponent as IconDelete } from "images/icon-delete.svg";
import { ReactComponent as IconChatBubblesOutline } from "images/icon-chatbubbles-outline.svg";
import { ReactComponent as IconDocument } from "images/icon-document.svg";

import "./style.scss";
import { homeSelector } from "redux/selectors/homeSelector";

const PostCard = ({
  allCategories,
  userId,
  data,
  setPostLike,
  deletePostLike,
  onCommentClick,
  onEditClick,
  deletePost,
  afterRemove,
  setPostFollow,
  deletePostFollow,
  details,
  userProfile,
}) => {
  const [like, setLike] = useState();
  const [follow, setFollow] = useState();
  const [links, setLinks] = useState([]);
  const [newlike, setNewLike] = useState(0);

  useEffect(() => {
    setLike(data.like);
    setFollow(data.follow);
    if (data.hasOwnProperty("text")) {
      getOgLinks(data.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsLiked = () => {
    setPostLike({ PostId: data.id, postOwnerUserId: data.UserId });
    setLike(!like);
    setNewLike(1);
  };

  const removeLike = () => {
    deletePostLike({ id: data.id });
    setLike(!like);
    if (newlike > 0) {
      setNewLike(newlike - 1);
    } else {
      setNewLike(0);
    }
  };

  const markAsFollowing = () => {
    setPostFollow({ PostId: data.id });
    setFollow(!follow);
  };

  const removeFollow = () => {
    deletePostFollow({ id: data.id });
    setFollow(!follow);
  };

  const getOgLinks = async (html) => {
    const htmlElement = document.createElement("html");
    htmlElement.innerHTML = html;
    let anchorArray = [];
    for (let item of Array.from(htmlElement.getElementsByTagName("a"))) {
      if (item.href.indexOf("froala") === -1) {
        anchorArray.push(item);
      }
    }
    setLinks(anchorArray);
  };

  return (
    <div className="post-card-container">
      <div
        key={`custom-post-card-${data.id}`}
        className={`custom-post-card  ${details === false && "bordered"}`}
      >
        <section className="custom-post-card--header">
          <section className="custom-post-card--header--user">
            <div className="header--user-image">
              <img
                alt={`post-user-img-${data.User.id}`}
                src={data.User.img}
              ></img>
            </div>
            <div className="header--user-text">
              <h4>
                {data.User.firstName} {data.User.lastName}
              </h4>
              <p>{data.User.titleProfessions}</p>
              <p>{data.User.company}</p>
              <span>Posted {getPublicationTime(data.createdAt)}</span>
            </div>
          </section>
          {data.UserId === userId ? (
            <section className="custom-post-card--header--actions">
              <ul>
                <li onClick={onEditClick}>
                  <IconCreateOutline /> Edit
                </li>
                <li>
                  <Popconfirm
                    title="Are you sure you want to permanently remove this item?"
                    onConfirm={() => {
                      deletePost(data);
                      afterRemove();
                    }}
                  >
                    <IconTrashOutline /> Delete
                  </Popconfirm>
                </li>
                {false && (
                  <>
                    <li>
                      <IconWaterOutline /> Watercooler
                    </li>
                    <li>
                      <IconFlameOutline /> Bonfire
                    </li>
                  </>
                )}
              </ul>
            </section>
          ) : (
            <section className="custom-post-card--header--follow">
              {follow === false ? (
                <div onClick={markAsFollowing}>+ Follow conversation</div>
              ) : (
                <div onClick={removeFollow}>- Unfollow conversation</div>
              )}
            </section>
          )}
        </section>
        <section
          className="custom-post-card--content"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
        {links.length > 0 && (
          <OpengraphReactComponent
            site={links[0].href}
            appId={process.env.REACT_APP_OPENGRAPH_KEY}
            loader={<Spin></Spin>}
            size={"large"}
            acceptLang="auto"
          />
        )}
        <section className="custom-post-card--topics">
          {(data.topics || []).map((dataTopic, index) => {
            const category = allCategories.find(
              (cat) => cat.value === dataTopic
            );
            return (
              <div
                key={`hashtag-key-${index}-${
                  category ? category.title : dataTopic
                }`}
                className="custom-post-card--item"
              >
                #{category ? category.title : dataTopic}
              </div>
            );
          })}
        </section>
        <section className="custom-post-card--image">
          {data.imageUrl && <img alt={`post-${data.id}`} src={data.imageUrl} />}
        </section>
        {details === true ? (
          <>
            <section className="custom-post-card--counters details">
              <ul>
                <li
                  onClick={() => {
                    if (like === true) {
                      removeLike();
                    } else {
                      markAsLiked();
                    }
                  }}
                >
                  <IconHeartOutline className={`${like && "svg-fill-color"}`} />
                  Like
                </li>
              </ul>
              <ul>
                <li>
                  <div className="likes">
                    <IconHeartOutline />
                  </div>
                  {parseInt(data.likes) + newlike}
                </li>
                <li>
                  <div className="comments">
                    <IconChatBubblesOutline />
                  </div>{" "}
                  {data.comments}
                </li>
              </ul>
            </section>
          </>
        ) : (
          <>
            <section className="custom-post-card--counters">
              <ul>
                <li>
                  <div className="likes">
                    <IconHeartOutline />
                  </div>
                  {parseInt(data.likes) + newlike}
                </li>
                <li>
                  <div className="comments">
                    <IconChatBubblesOutline />
                  </div>{" "}
                  {data.comments}
                </li>
              </ul>
            </section>
            <section className="custom-post-card--footer-actions">
              <ul>
                <li
                  onClick={() => {
                    if (like === true) {
                      removeLike();
                    } else {
                      markAsLiked();
                    }
                  }}
                >
                  <IconHeartOutline className={`${like && "svg-fill-color"}`} />
                  Like
                </li>
                <li onClick={onCommentClick}>
                  <IconChatBubblesOutline /> Comment
                </li>
                <li onClick={onCommentClick}>
                  <IconDocument /> View full story
                </li>
                {userProfile.role === "admin" && (
                  <li onClick={() => deletePost(data)}>
                    <IconDelete /> Delete
                  </li>
                )}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

PostCard.propTypes = {
  showEdit: PropTypes.bool,
  generalFooter: PropTypes.bool,
  onCommentClick: PropTypes.func,
  afterRemove: PropTypes.func,
  details: PropTypes.bool,
};

PostCard.defaultProps = {
  showEdit: false,
  generalFooter: true,
  onCommentClick: () => {},
  afterRemove: () => {},
  details: false,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userId: authSelector(state).id,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setPostLike,
  deletePostLike,
  deletePost,
  setPostFollow,
  deletePostFollow,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
