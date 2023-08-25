import React from "react";
import { CustomButton } from "components";
import { connect } from "react-redux";
import { Form, Comment, Avatar, Input, List } from "antd";
import moment from "moment-timezone";

import { homeSelector } from "redux/selectors/homeSelector";
import { actions as councilEventActions } from "redux/actions/council-events-actions";

const CouncilEventPanelCommentForm = ({
  userProfile,
  councilEventPanelComments,
  upsertCommentCouncilEventPanel,
  CouncilEventPanelId,
  CouncilEventPanelistId,
}) => {
  const [form] = Form.useForm();

  const comments = councilEventPanelComments?.map((comment) => {
    const user = comment.CouncilEventPanelist.User;
    return {
      author: `${user.firstName} ${user.lastName}`,
      avatar: user.img,
      content: <p>{comment.comment}</p>,
      datetime: moment(comment.createdAt).fromNow(),
      abbrName: user.abbrName,
    };
  });

  const handleOnFinish = (values) => {
    upsertCommentCouncilEventPanel({
      CouncilEventPanelId,
      CouncilEventPanelistId,
      comment: values.comment,
    });

    form.resetFields()
  };

  const commentForm = (
    <Form form={form} onFinish={handleOnFinish}>
      <Form.Item name="comment">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <CustomButton text="Submit" htmlType="submit" size="small" />
      </Form.Item>
    </Form>
  );

  const commentList = (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => {
      return <Comment 
          author={props.author}
          content={props.content}
          datetime={props.datetime}
          avatar={props.avatar ? <Avatar src={props.avatar} /> : <Avatar size={50}>{props.abbrName}</Avatar>}
        />}}
    />
  );

  return (
    <>
      {comments?.length > 0 && commentList ? 
        <div>
          <div>{comments?.length > 0 && commentList}</div>
          <Comment
            avatar={<Avatar src={userProfile.img} alt="profile-picture" />}
            content={commentForm}
          />
        </div> : <Comment
            avatar={<Avatar src={userProfile.img} alt="profile-picture" />}
            content={commentForm}
          />}
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...councilEventActions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CouncilEventPanelCommentForm);
