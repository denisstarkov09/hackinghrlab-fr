import React, { useState } from "react";
import { connect } from "react-redux";
import { Avatar, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  LikeFilled,
} from "@ant-design/icons";

import { actions as councilConversationActions } from "redux/actions/councilConversation-actions";
import { actions as councilConversationLikeActions } from "redux/actions/council-conversation-like-actions";

import { categorySelector } from "redux/selectors/categorySelector";
import { authSelector } from "redux/selectors/authSelector";

import CouncilComment from "components/CouncilComment";
import CouncilCommentForm from "containers/CouncilCommentForm.js";
import CouncilConversationDrawer from "containers/CouncilConversationDrawer";

import "./style.scss";
import moment from "moment";

const CouncilConversationsCard = ({
  councilConversation,
  destroyCouncilConversation,
  allCategories,
  userId,
  createCouncilConversationLike,
  deleteCouncilConversationLike,
  getCouncilConversation,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDeleteConversation = () => {
    destroyCouncilConversation(councilConversation.id);
  };

  const hasLiked = councilConversation.CouncilConversationLikes?.some(
    (like) => like.UserId === userId
  );

  const displayLike = hasLiked ? (
    <LikeFilled
      style={{ fontSize: "1.5rem", cursor: "pointer", color: "dodgerblue" }}
      onClick={() => deleteCouncilConversationLike(councilConversation.id)}
    />
  ) : (
    <LikeOutlined
      style={{ fontSize: "1.5rem", cursor: "pointer" }}
      onClick={() => createCouncilConversationLike(councilConversation.id)}
    />
  );

  return (
    <div className="post-card-container-council">
      <div
        key={`custom-post-card-council${councilConversation?.id}`}
        className="custom-post-card-council"
      >
        <section className="custom-post-card--header">
          <section className="custom-post-card-council--content">
            <div
              className="d-flex justify-between"
              style={{
                width: "75%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div className="d-flex">
                <div style={{ marginRight: "1rem" }}>
                  <Avatar src={councilConversation?.User?.img} size={100} />
                </div>
                <div className="user-text">
                  <h4>{`${councilConversation?.User?.firstName} ${councilConversation?.User?.lastName}`}</h4>
                  <p>{councilConversation?.User?.titleProfessions}</p>
                  <p>{councilConversation?.User?.company}</p>
                  <span>
                    Posted {moment(councilConversation.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              {userId === councilConversation?.User?.id && (
                <section className="d-flex items-baseline">
                  <div
                    className="d-flex items-baseline"
                    style={{ marginRight: "1rem", cursor: "pointer" }}
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <span style={{ marginRight: "5px" }}>
                      <EditOutlined />
                    </span>
                    <span>Edit</span>
                  </div>
                  <Popconfirm
                    title="Are you sure you want to permanently remove this item?"
                    onConfirm={handleDeleteConversation}
                  >
                    <div className="d-flex" style={{ cursor: "pointer" }}>
                      <span style={{ marginRight: "5px" }}>
                        <DeleteOutlined />
                      </span>
                      <span>Delete</span>
                    </div>
                  </Popconfirm>
                </section>
              )}
            </div>
            <div className="conversation-content">
              <h1 className="text-center">{councilConversation.title}</h1>
              <section
                dangerouslySetInnerHTML={{
                  __html: (councilConversation.text || {}).html,
                }}
              />
              <div className="d-flex">
                {councilConversation?.topics?.map((topic) => {
                  let category = allCategories.find(
                    (cat) => cat.value === topic
                  );

                  if(category !== undefined){
                    category = ''
                  }

                  return (
                    <div 
                      key={category ? category?.title : ""}
                      style={{ marginRight: "1rem", color: "dodgerblue" }}
                    >
                      #{category ? category?.title : ""}
                    </div>
                  );
                })}
              </div>
              {councilConversation.imageUrl && (
                <div>
                  <img
                    src={councilConversation.imageUrl}
                    alt="conversation-img"
                    style={{
                      objectFit: "fill",
                      width: "100%",
                      marginTop: "1rem",
                    }}
                  />
                </div>
              )}
              <div style={{ margin: "1rem 0" }}>
                {displayLike}{" "}
                {councilConversation.CouncilConversationLikes.length}
              </div>
            </div>
            <div className="custom-comment-card-container">
              <CouncilCommentForm />
              <div>
                {(councilConversation.CouncilConversationComments || []).map(
                  (item) => (
                    <CouncilComment
                      data={item}
                      enableReply
                      key={item.comment}
                    />
                  )
                )}
              </div>
            </div>
          </section>
        </section>
      </div>
      <CouncilConversationDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        councilConversation={councilConversation}
        isEdit
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  ...categorySelector(state),
  userId: authSelector(state).id,
});

const mapDispatchToProps = {
  ...councilConversationActions,
  ...councilConversationLikeActions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CouncilConversationsCard);
