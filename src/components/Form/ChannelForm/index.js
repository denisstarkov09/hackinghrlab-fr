import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Checkbox, notification } from "antd";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import {
  CustomInput,
  CustomButton,
  ImageUpload2,
  CustomCheckbox,
} from "components";

import { categorySelector } from "redux/selectors/categorySelector";
import { channelSelector } from "redux/selectors/channelSelector";

import "./style.scss";

const MAX_DESCRIPTION = 50;

const ChannelForm = ({
  selectedChannel,
  edit,
  allCategories,
  onSubmit,
  onCancel,
  type = 'all'
}) => {
  const [description, setDescription] = useState("");

  const refForm = React.useRef(null);
  const onFinish = (values) => {
    console.log("values", values);
    if (edit) {
      onSubmit({
        id: selectedChannel.id,
        ...values,
      });
    } else {
      onSubmit(values);
    }
  };

  const onFinishFailed = () => {};

  const onFormValuesChange = (values) => {
    if (values.categories && values.categories.length > 5) {
      if (refForm && refForm.current) {
        refForm.current.setFieldsValue({
          categories: values.categories.slice(0, 5),
        });
      }
      notification.info({
        message: "You can only select five categories."
      })
    }

    if (values.description !== undefined) {
      const words = values.description.replaceAll("\n", " ").split(" ");
      const length = words.length;
      let value = values.description;
      if (length > MAX_DESCRIPTION) {
        const lastWord = words[words.length - 1];
        value = values.description.slice(
          0,
          values.description.length - lastWord.length
        );
      }

      setDescription(value);
      if (refForm && refForm.current) {
        refForm.current.setFieldsValue({ description: value });
      }
    }
  };

  useEffect(() => {
    if (edit && !isEmpty(selectedChannel)) {
      if (refForm && refForm.current) {
        refForm.current.setFieldsValue({
          ...selectedChannel,
        });
        setDescription(selectedChannel.description);
      }
    }
  }, [selectedChannel, edit]);

  const filterChannelForm = {
    all:{
      name:true,
      description: true,
      image:true,
      image2:false,
      categories:true
    },
    frontImage:{
      name:false,
      description: false,
      image:true,
      image2:false,
      categories:false
    },
    content:{
      name:true,
      description: true,
      image:false,
      image2:false,
      categories:true
    },
    bannerImage:{
      name:false,
      description: false,
      image:false,
      image2:true,
      categories: false
    }
  }

  return (
    <Form
      className="channel-form"
      layout="vertical"
      name="basic"
      style={{padding: "25px"}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onFormValuesChange}
      ref={refForm}
    >
      {filterChannelForm[type].name && (
        <Form.Item
          name="name"
          label="Channel Name"
          rules={[
            { required: true, message: "Please enter the channel name.    " },
          ]}
        >
          <CustomInput />
        </Form.Item>
      )}
      {filterChannelForm[type].description && (
        <Form.Item
          name="description"
          label={`Description (${Math.min(
            description ? description.replaceAll("\n", " ").split(" ").length : 0,
            MAX_DESCRIPTION
          )}/${MAX_DESCRIPTION})`}
        >
          <CustomInput multiple={true} />
        </Form.Item>
      )}
      {filterChannelForm[type].image && (
        <Form.Item name="image" label="Upload image (400 / 152) px">
          <ImageUpload2 width="400px" height="152px" aspect={400 / 152} />
        </Form.Item>
      )}
      {filterChannelForm[type].image2 && (
        <Form.Item name="image2" label="Upload image (900 / 175) px">
          <ImageUpload2 width="400px" height="152px" aspect={900 / 175} />
        </Form.Item>
      )}
      {filterChannelForm[type].categories && (
        <Form.Item name="categories" label="What are the content topics?">
          <Checkbox.Group className="d-flex flex-column channel-form-topics">
            {allCategories.map((topic, index) => (
              <CustomCheckbox key={index} value={topic.value}>
                {topic.title}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      )}
      <div className="channel-form-footer">
        <CustomButton
          text="Cancel"
          type="third outlined"
          size="lg"
          onClick={onCancel}
        />
        <CustomButton
          htmlType="submit"
          text="Submit"
          type="secondary"
          size="lg"
        />
      </div>
    </Form>
  );
};

ChannelForm.propTypes = {
  edit: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

ChannelForm.defaultProps = {
  edit: false,
  onSubmit: () => {},
  onCancel: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  selectedChannel: channelSelector(state).selectedChannel,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelForm);
