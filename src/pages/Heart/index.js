import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Form } from "antd";

import HEARTComment from './HeartComment';
import generateId from 'utils/generateId.js';
import HEART_COMMENT_CATEGORIES from 'enum/HEARTCommentCategories.js';
import MAP_HEART_CATEGORY_TO_COLOR from 'enum/MapHeartCategoryToColor.js';
import CustomInput from 'components/Input';
import CustomButton from "components/Button";

import { getAll, post, put, remove } from "api/module/heart";
import { authSelector } from "redux/selectors/authSelector";

import "./style.scss";

const COMMENT_MAX_WORDS_COUNT = 100;

function getWordsCountFromString(str = '') {
  return str.split(' ').length;
}

function HEARTPage(props) {
  const [heartCards, setHeartCards] = useState([]);
  const [createNewCardState, setCreateNewCardState] = useState(null);
  const [parentComment, setParentComment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let data = await getAll();
      setHeartCards(data.data.heart);
    } catch (error) {
      console.log(`Heart module error: fetchData - ${error}`);
    }
  }

  const startNewComment = ({ category }) => {
    const commentPlaceholder = createNewCardState === null
      ? ({
        id: generateId(20),
        category,
        rate: 0,
        content: '',
        responses: [],
      })
      : { ...createNewCardState, category }

    setCreateNewCardState(commentPlaceholder);
  }

  const startNewResponse = (response) => {
    const { id, category } = response;
    const commentPlaceholder = createNewCardState === null
      ? ({
        id: generateId(20),
        category,
        rate: 0,
        content: '',
        responses: [],
      })
      : { ...createNewCardState, category }
    setParentComment(id)
    startNewComment(commentPlaceholder);
  }

  const prepareToEdit = (comment) => {
    setCreateNewCardState(comment);
  }

  const submitNewComment = async ({ content }) => {
    let commentToSubmitTemplate = { ...createNewCardState, content, created_at: new Date() }
    try {
      if (parentComment !== null) {
        commentToSubmitTemplate['parentId'] = parentComment;
      }
      if (!isNaN(commentToSubmitTemplate.id)) {
        await put(commentToSubmitTemplate);
      } else {
        await post(commentToSubmitTemplate);
      }
      fetchData();
      dismissNewComment();
    } catch (error) {
      console.log(`Heart module error: Post - ${error}`);
    }
  }

  const dismissNewComment = () => {
    setCreateNewCardState(null);
    setParentComment(null);
  }

  const rateChange = async ({ id, newRate }) => {
    try {
      await put({ id, rate: newRate });
      fetchData();
      dismissNewComment();
    } catch (error) {
      console.log(`Heart module error: Put - ${error}`);
    }
  }

  const removeComment = async (id) => {
    try {
      let result = window.confirm("Are you sure you want to delete this comment?");
      if (result) {
        await remove(id);
        fetchData();
      }
    } catch (error) {
      console.log(`Heart module error: Remove - ${error}`);
    }
  }

  return (
    <div className="heart-page">
      <div className="heart-page__container">
        <header className="heart-page__header">
          <h2 className="text-center">
            Peer-To-Peer Emotional and Wellness Support
          </h2>
          <h3>
            This tool provides Hacking HR LAB members the opportunity to provide each other emotional, mental health, wellness and wellbeing support.
          </h3>
          <p>
            How to it works: share stories, examples, tips, resources or questions.
            This forum is anonymous. Click on the icon of to select what kind of 
            content you want to share, enter the text in the comment box and click 
            "Post Comment". You can also respond to other users' comments and also 
            rate the comments by how relevant they are.
          </p>
        </header>
        <div className="heart-categories__container">
          <div className="heart-categories__container-col">
            <section className="heart-categories__row">
              {Object.keys(HEART_COMMENT_CATEGORIES).map((catKey, i) => (
                <div className="heart-categories__col"
                  key={catKey}
                >
                  <button
                    className={`
                    heart-categories__button
                    border-color--${MAP_HEART_CATEGORY_TO_COLOR[HEART_COMMENT_CATEGORIES[catKey].name]}
                  `}
                    onClick={() => startNewComment({ category: HEART_COMMENT_CATEGORIES[catKey].name })}
                  >
                    <span
                      className="heart-categories__button-ico"
                      style={{
                        backgroundImage: `url(${HEART_COMMENT_CATEGORIES[catKey].icon})`,
                      }}
                    ></span>
                    <span className="heart-truncate">
                      {HEART_COMMENT_CATEGORIES[catKey].title}
                    </span>
                  </button>
                </div>
              ))}
            </section>
          </div>
          {(createNewCardState && createNewCardState.id) &&
            <section className="heart-new-comment__wrap">
              <Form
                initialValues={createNewCardState}
                onFinish={submitNewComment}
              >
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your comment",
                    },
                    () => ({
                      validator(_, value) {
                        if (getWordsCountFromString(value) > COMMENT_MAX_WORDS_COUNT) {
                          return Promise.reject(
                            "Comment length should be up to 100 words"
                          );
                        }
                        return Promise.resolve();

                      },
                    }),
                  ]}
                >
                  <CustomInput multiple placeholder="Please enter your comment" />
                </Form.Item>

                <div className="heart-new-comment__cta-wrap">
                  <CustomButton
                    htmlType="button"
                    text="Cancel"
                    type="default"
                    size="md"
                    onClick={dismissNewComment}
                  />

                  <CustomButton
                    htmlType="submit"
                    text="Post Comment"
                    type="primary"
                    size="lg"
                  />
                </div>

              </Form>

            </section>
          }
        </div>

        <section className="heart-cards-list__wrap">
          {heartCards.map(item => (
            <HEARTComment
              key={item.id}
              category={item.category}
              rate={item.rate && parseFloat(item.rate)}
              content={item.content}
              icon={HEART_COMMENT_CATEGORIES[item.category].icon}
              id={item.id}
              allowResponses
              allowActions={props.userId === item.UserId}
              rateChange={rateChange}
              onClick={() => { startNewResponse(item); }}
              onEditClick={() => { prepareToEdit(item); }}
              onRemoveClick={() => { removeComment(item.id) }}
            >
              {item.hasOwnProperty("responses") ? item.responses.map(response => (
                <HEARTComment
                  key={response.id}
                  id={response.id}
                  category={response.category}
                  content={response.content}
                  allowActions={props.userId === response.UserId}
                  icon={HEART_COMMENT_CATEGORIES[response.category].icon}
                  onEditClick={() => { prepareToEdit(response); }}
                  onRemoveClick={() => { removeComment(response.id) }}
                />
              )) : null}
            </HEARTComment>
          ))}
        </section>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => ({
  userId: authSelector(state).id,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HEARTPage);
