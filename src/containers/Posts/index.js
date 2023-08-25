import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CustomButton } from "components";
import PostCard from "components/PostCard";

import { categorySelector } from "redux/selectors/categorySelector";
import { postSelector } from "redux/selectors/postSelector";
import { authSelector } from "redux/selectors/authSelector";

import { INTERNAL_LINKS, SETTINGS } from "enum";

import { getAllPost } from "redux/actions/post-actions";
import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const Posts = ({
  history,
  loading,
  getAllPost,
  allPosts,
  currentPage,
  countOfResults,
  onShowMore,
  userId,
}) => {
  useEffect(() => {
    getAllPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id="posts-container-home">
        {allPosts.map((item) => {
          return (
            <PostCard
              key={`post-card-${item.id}`}
              data={item}
              showEdit={true}
              generalFooter={!(userId === item.UserId)}
              onCommentClick={() => {
                history.push(`${INTERNAL_LINKS.POST}/${item.id}`);
              }}
              onEditClick={() => {
                history.push(
                  `${INTERNAL_LINKS.POST}/${item.id}/${item.UserId}`
                );
              }}
            />
          );
        })}
        <div className="moreContainer">
          {currentPage * SETTINGS.MAX_SEARCH_ROW_NUM < countOfResults && (
            <div className="post-page-footer d-flex justify-center items-center">
              {loading && (
                <div className="post-page-loading-more">
                  <img src={IconLoadingMore} alt="loading-more-img" />
                </div>
              )}
              {!loading && (
                <CustomButton
                  text="Show more"
                  type="primary outlined"
                  size="lg"
                  onClick={onShowMore}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Posts.propTypes = {
  onShowMore: PropTypes.func,
  history: PropTypes.object,
};

Posts.defaultProps = {
  onShowMore: () => {},
  history: null,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  userId: authSelector(state).id,
  ...postSelector(state),
});

const mapDispatchToProps = {
  getAllPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
