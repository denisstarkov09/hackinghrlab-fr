import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Select, notification } from "antd";
import isEmpty from "lodash/isEmpty";

import {
  CustomInput,
  CustomButton,
  ImageUpload,
} from "components";
import { SETTINGS } from "enum";
import clsx from "clsx";

import {
  addChannelLibrary,
  updateChannelLibrary,
} from "redux/actions/library-actions";
import {
  notificationEmailToNewContentCreators
}  from "redux/actions/channel-actions";
import { categorySelector } from "redux/selectors/categorySelector";
import { channelSelector } from "redux/selectors/channelSelector";
import { librarySelector } from "redux/selectors/librarySelector";

import "./style.scss";

const VisibleLevel = SETTINGS.VISIBLE_LEVEL;

const LibraryForm = ({
  allCategories,
  selectedChannel,
  type,
  edit,
  selectedLibrary,
  onAdded,
  onCancel,
  addChannelLibrary,
  updateChannelLibrary,
  notificationEmailToNewContentCreators
}) => {
  const refForm = useRef(null);
  const onFinish = (values) => {
    if (edit) {
      updateChannelLibrary(
        {
          ...values,
          link:
            values.link && values.link.includes("https://")
              ? values.link
              : `https://${values.link}`,
          id: selectedLibrary.id,
        },
        (err) => {
          if (err) {
            notification.error({
              message: err,
            });
          } else {
            notification.info({
              message: "Resource was successfully updated.",
            });
            onAdded();
          }
        }
      );
    } else {

      addChannelLibrary(
        {
          ...values,
          channel: selectedChannel.id,
          level: VisibleLevel.CHANNEL,
          contentType: type,
        },
        () => {
          notification.info({
            message: "New resource was successfully created.",
          });

          onAdded();
          notificationEmailToNewContentCreators({
            channelName: selectedChannel.name, 
            channelAdmin: selectedChannel.User.firstName,
            channelAdminEmail: selectedChannel.User.email,
            contentType: (type === "article") ? "resources" : "video",
            name: values.title,
            link: values.link 
          })
        }
      );
    }
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    if (edit && !isEmpty(selectedLibrary)) {
      if (refForm && refForm.current) {
        refForm.current.setFieldsValue({
          ...selectedLibrary,
          link: selectedLibrary.link ? selectedLibrary.link.slice(8) : "",
        });
      }
    }
  }, [selectedLibrary, edit]);

  return (
    <div className="library-form-panel">
      <Form
        className="library-form"
        layout="vertical"
        name="basic"
        ref={refForm}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="title" label="Title">
          <CustomInput />
        </Form.Item>
        <Form.Item name="link" label="URL">
          <CustomInput addonBefore="https://" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <CustomInput multiple={true} />
        </Form.Item>
        <Form.Item
          name="topics" 
          label="What are the content topics?"
          className="categoris-input"
        >
          <Select mode="multiple" className={clsx("custom-select", { border: "bordered" })}>
            {allCategories?.map((item) => {
              return (
                <Select.Option key={item?.value} value={item?.value}>
                  {item?.title}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {type !== "video" && (
          <Form.Item name="image" label="Upload image (400 / 152) px">
            <ImageUpload aspect={400 / 152} />
          </Form.Item>
        )}
        <div className="library-form-panel-footer">
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
    </div>
  );
};

LibraryForm.propTypes = {
  type: PropTypes.string,
  edit: PropTypes.bool,
  onCancel: PropTypes.func,
  onAdded: PropTypes.func,
};

LibraryForm.defaultProps = {
  type: "article",
  edit: false,
  onCancel: () => {},
  onAdded: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  selectedChannel: channelSelector(state).selectedChannel,
  selectedLibrary: librarySelector(state).selectedLibrary,
});

const mapDispatchToProps = {
  addChannelLibrary,
  updateChannelLibrary,
  notificationEmailToNewContentCreators
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryForm);
