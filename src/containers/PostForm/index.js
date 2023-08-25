import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Spin, Select } from "antd";
import Emitter from "services/emitter";
import OpengraphReactComponent from "opengraph-react";

import { CustomButton, FroalaEdit, ImageUpload3 } from "components";

import { categorySelector } from "redux/selectors/categorySelector";
import { envSelector } from "redux/selectors/envSelector";
import { addPost } from "redux/actions/post-actions";

import { EVENT_TYPES } from "enum";

import "./style.scss";

const { Item } = Form;
const { Option } = Select;

const PostForm = ({
  allCategories,
  s3Hash,
  addPost,
  postData,
  onUpdate,
  buttonText,
  externalForm,
}) => {
  const [form] = Form.useForm();
  const [links, setLinks] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [checkGroupDisabled, setCheckGroupDisabled] = useState(false);

  useEffect(() => {
    if (postData) {
      if (postData.text) {
        getOgLinks(postData.text);
      }
      if (postData.topics != null) {
        if (postData.topics.length === 5) {
          setSelectedTopics(postData.topics);
          setCheckGroupDisabled(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (data) => {
    if (postData) {
      onUpdate(data);
    } else {
      addPost(data);
      Emitter.emit(EVENT_TYPES.CLOSE_POST_MODAL);
    }
    if (externalForm != null) {
      externalForm.resetFields();
    }
    form.resetFields();
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

  const validLimit = (data) => {
    if (data.hasOwnProperty("topics")) {
      setSelectedTopics(data.topics);
      if (data.topics.length === 5) {
        setCheckGroupDisabled(true);
      } else {
        setCheckGroupDisabled(false);
      }
    }
  };

  return (
    <div className="post-form-container">
      <Form
        form={externalForm == null ? form : externalForm}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(data) => {
          validLimit(data);
        }}
        initialValues={
          postData && {
            ...postData,
            topics: postData.topics,
            text: { html: postData.text },
            imageData: postData.imageUrl,
          }
        }
      >
        <Item
          label={
            <label className="labelFroala">
              What do you want to talk about?
            </label>
          }
          name="text"
          rules={[
            {
              required: true,
              message: "What do you want to talk about? is required.",
            },
          ]}
        >
          <FroalaEdit
            s3Hash={s3Hash}
            additionalConfig={{
              linkAlwaysBlank: true,
              emoticonsUseImage: false,
              quickInsertTags: [],
              placeholderText: "Add a post...",
              toolbarButtons: [
                "bold",
                "italic",
                "underline",
                "strikeThrough",
                "subscript",
                "superscript",
                "-",
                "paragraphFormat",
                "align",
                "formatOL",
                "formatUL",
                "indent",
                "outdent",
                "-",
                "undo",
                "redo",
                "|",
                "emoticons",
              ],
              events: {
                contentChanged: function () {
                  getOgLinks(this.html.get());
                },
                "paste.after": function () {
                  getOgLinks(this.html.get());
                },
              },
            }}
          />
        </Item>
        <Item>
          {links.length > 0 && (
            <OpengraphReactComponent
              site={links[0].href}
              appId={process.env.REACT_APP_OPENGRAPH_KEY}
              loader={<Spin></Spin>}
              size={"large"}
              acceptLang="auto"
            />
          )}
        </Item>
        <Item
          label="Topics (select at least one)"
          name="topics"
          rules={[
            {
              required: true,
              message: "Topics (select at least one) is required.",
            },
          ]}
        >
          <Select allowClear mode="multiple">
            {allCategories.map((item) => (
              <Option
                disabled={
                  checkGroupDisabled &&
                  selectedTopics.indexOf(item.value) === -1
                }
                key={`option-${item.value}`}
                value={item.value}
              >
                {item.title}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="Upload image" name="imageData">
          <ImageUpload3 aspect={16 / 9} />
        </Item>
        {externalForm == null && (
          <Item>
            <CustomButton
              htmlType="submit"
              type="primary secondary"
              text={buttonText}
            />
          </Item>
        )}
      </Form>
    </div>
  );
};

PostForm.propTypes = {
  allCategories: PropTypes.array,
  externalForm: PropTypes.object,
};

PostForm.defaultProps = {
  allCategories: [],
  buttonText: "Post",
  externalForm: null,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  s3Hash: envSelector(state).s3Hash,
});

const mapDispatchToProps = {
  addPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
