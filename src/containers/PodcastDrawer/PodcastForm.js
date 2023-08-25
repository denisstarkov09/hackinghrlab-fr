import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Select, notification } from "antd";
import isEmpty from "lodash/isEmpty";
import moment from "moment";

import {
  CustomInput,
  CustomButton,
  ImageUpload,
  CustomCalendar,
} from "components";
import { SETTINGS } from "enum";
import clsx from "clsx";

import {
  addPodcastToChannel,
  updateChannelPodcast,
} from "redux/actions/podcast-actions";
import {
  notificationEmailToNewContentCreators
}  from "redux/actions/channel-actions";
import { categorySelector } from "redux/selectors/categorySelector";
import { channelSelector } from "redux/selectors/channelSelector";

import "./style.scss";

const VisibleLevel = SETTINGS.VISIBLE_LEVEL;

const PodcastForm = ({
  allCategories,
  selectedChannel,
  podcast,
  edit,
  onAdded,
  onCancel,
  addPodcastToChannel,
  updateChannelPodcast,
  notificationEmailToNewContentCreators
}) => {
  const refForm = useRef(null);

  const onFinish = (values) => {
    if (edit) {
      updateChannelPodcast(
        {
          ...values,
          id: podcast.id,
        },
        (err) => {
          if (err) {
            notification.error({
              message: err,
            });
          } else {
            notification.info({
              message: "Podcast was successfully updated.",
            });
            onAdded();
          }
        }
      );
    } else {
      addPodcastToChannel(
        {
          ...values,
          channel: selectedChannel.id,
          level: VisibleLevel.CHANNEL,
        },
        () => {
          onAdded();
          notification.info({
            message: "New podcast was successfully created.",
          });
          notificationEmailToNewContentCreators({
            channelName: selectedChannel.name, 
            channelAdmin: selectedChannel.User.firstName,
            channelAdminEmail: selectedChannel.User.email,
            contentType: "podcast",
            name: values.title,
            link: values.vimeoLink 
          })
        }
      );
    }
  };

  const onFinishFailed = () => {};

  const onFormValuesChange = (values) => {
    if (values.topics && values.topics.length > 4) {
      if (refForm && refForm.current) {
        refForm.current.setFieldsValue({
          topics: values.topics.slice(0, 4),
        });
      }
      notification.info({
        message: "You can only select four categories."
      })
    }
  };

  useEffect(() => {
    if (edit && !isEmpty(podcast)) {
      if (refForm && refForm.current) {
        refForm.current.setFieldsValue({
          ...podcast,
          imageData: podcast.imageUrl,
          dateEpisode: moment(podcast.dateEpisode),
        });
      }
    }
  }, [podcast, edit]);

  return (
    <div className="podcast-form-panel">
      <Form
        className="podcast-form"
        layout="vertical"
        name="basic"
        ref={refForm}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onFormValuesChange}
      >
        <Form.Item name="title" label="Title">
          <CustomInput />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <CustomInput multiple={true} />
        </Form.Item>
        <Form.Item name="order" label="Order (the highest number shows on top)">
          <CustomInput />
        </Form.Item>
        {!edit && (
          <Form.Item name="dateEpisode" label="Date">
            <CustomCalendar />
          </Form.Item>
        )}
        <Form.Item
          name="topics" 
          label="Topics?"
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
        <Form.Item name="imageData" label="Upload image (400 / 152) px">
          <ImageUpload aspect={400 / 152} />
        </Form.Item>
        <Form.Item label="Vimeo Link" name="vimeoLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Anchor Link" name="anchorLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Apple Link" name="appleLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Google Link" name="googleLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Breaker Link" name="breakerLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Pocket Link" name="pocketLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Radio Public Link" name="radioPublicLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="Spotify Link" name="spotifyLink">
          <CustomInput size="sm" />
        </Form.Item>
        <Form.Item label="I Heart Radio Link" name="iHeartRadioLink">
          <CustomInput size="sm" />
        </Form.Item>
        <div className="podcast-form-panel-footer">
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

PodcastForm.propTypes = {
  podcast: PropTypes.object,
  edit: PropTypes.bool,
  onCancel: PropTypes.func,
  onAdded: PropTypes.func,
};

PodcastForm.defaultProps = {
  podcast: {},
  edit: false,
  onCancel: () => {},
  onAdded: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  selectedChannel: channelSelector(state).selectedChannel,
});

const mapDispatchToProps = {
  addPodcastToChannel,
  updateChannelPodcast,
  notificationEmailToNewContentCreators
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastForm);
