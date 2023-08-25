import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, notification, DatePicker, Select } from "antd";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";

import {
  CustomInput,
  CustomButton,
  CustomSelect,
  ImageUpload,
  RichEdit,
  FroalaEdit,
} from "components";
import { SETTINGS} from "enum";
import { useSearchCity } from "hooks";

import {
  createChannelEvent,
  updateChannelEvent,
} from "redux/actions/event-actions";
import { categorySelector } from "redux/selectors/categorySelector";
import { channelSelector } from "redux/selectors/channelSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { envSelector } from "redux/selectors/envSelector";
import clsx from "clsx";
import moment from "moment";

import {
  isValidURL,
  getNameOfCityWithTimezone
} from "utils/format";
import {
  notificationEmailToNewContentCreators
}  from "redux/actions/channel-actions";

import "./style.scss";

const VisibleLevel = SETTINGS.VISIBLE_LEVEL;

const { RangePicker } = DatePicker;

// const EventTypes = [
//   {
//     text: "Presentation",
//     value: "presentation",
//   },
//   {
//     text: "Workshop",
//     value: "workshop",
//   },
//   {
//     text: "Panel",
//     value: "panel",
//   },
//   {
//     text: "Peer-to-Peer Conversation",
//     value: "peer-to-peer",
//   },
//   {
//     text: "Conference",
//     value: "conference",
//   },
// ];

const EventAddEditForm = ({
  allCategories,
  selectedChannel,
  edit,
  s3Hash,
  selectedEvent,
  onAdded,
  onCancel,
  createChannelEvent,
  updateChannelEvent,
  notificationEmailToNewContentCreators
}) => {
  const refForm = useRef(null);
  const [editor, setEditor] = useState("froala");
  const [searchCity, setSearchCity] = useState("");
  const cities = useSearchCity(searchCity);

  const handleSearchCity = (value) => {
    if (value === "") {
      return;
    }

    let timer = setTimeout(() => {
      setSearchCity(value);
      clearTimeout(timer);
    }, 1000);
  }

  const onFinish = (values) => {

    const timezoneFirstSliceIndex = values.timezone.indexOf("/");

    const convertedStartTime = moment
      .utc(values.startAndEndDate[0].format("YYYY-MM-DD HH:mm"))
      .format();

    const convertedEndTime = moment
      .utc(values.startAndEndDate[1].format("YYYY-MM-DD HH:mm"))
      .format();

    let params = {
      ...omit(values, "startAndEndDate"),
      startDate: convertedStartTime,
      endDate: convertedEndTime,
      level: VisibleLevel.CHANNEL,
      channel: selectedChannel.id,
      timezone: values.timezone.slice(
        timezoneFirstSliceIndex + 1,
        values.timezone.length
      ),
    };
    if (edit) {
      console.log("**** params ", params);
      updateChannelEvent(
        {
          ...params,
          id: selectedEvent.id,
        },
        (err) => {
          if (err) {
            notification.error({
              message: err,
            });
          } else {
            notification.info({
              message: "Event was successfully updated.",
            });
            onAdded();
          }
        }
      );
    } else {
      createChannelEvent(
        {
          ...params,
          channel: selectedChannel.id,
          level: VisibleLevel.CHANNEL,
        },
        () => {
          notification.info({
            message: "New event was successfully created.",
          });
          onAdded();
          notificationEmailToNewContentCreators({
            channelName: selectedChannel.name, 
            channelAdmin: selectedChannel.User.firstName,
            channelAdminEmail: selectedChannel.User.email,
            contentType: "event",
            name: values.title,
            link: values.externalLink
          })
        }
      );
    }
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    if (edit && !isEmpty(selectedEvent)) {
      if (refForm && refForm.current) {
        const startTime = moment(selectedEvent.startDate, "YYYY-MM-DDTHH:mm:ss")
        const endTime = moment(selectedEvent.endDate, "YYYY-MM-DDTHH:mm:ss")
        let city

        if(selectedEvent.timezone && selectedEvent.timezone.includes("/")){
          city = getNameOfCityWithTimezone(selectedEvent.timezone);
          setSearchCity(city);
        }

        refForm.current.setFieldsValue({
          ...selectedEvent,
          startAndEndDate: [startTime,endTime],
          timezone: (!city) ? selectedEvent.timezone : `${city}/${selectedEvent.timezone}`,
        });
      }
    }

    if (edit) {
      if (selectedEvent.description && selectedEvent.description.blocks) {
        setEditor("draft");
      } else {
        setEditor("froala");
      }
    } else {
      setEditor("froala");
    }
  }, [selectedEvent, edit]);

  return (
    <div className="event-addedit-form-panel">
      <Form
        className="event-addedit-form"
        layout="vertical"
        name="basic"
        ref={refForm}
        initialValues={{ ticket: "free" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item 
          name="title" 
          label="Title" 
          rules={[
            { required: true, message: "Title is required." },
          ]}
        >
          <CustomInput />
        </Form.Item>
        {/* <Form.Item name="organizer" label="Organizer">
          <CustomInput />
        </Form.Item>
        <Form.Item name="organizerEmail" label="Organizer's Email">
          <CustomInput />
        </Form.Item> */}
        <Form.Item 
          name="startAndEndDate" 
          label="Start date - End date"
          rules={[
            { required: true, message: "Start date - End date is required." },
          ]}
        >
          <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY/MM/DD HH:mm" />
        </Form.Item>
        <Form.Item name="timezone" label="Timezone" 
          rules={[
            { required: true, message: "Timezone is required" },
          ]}
        >
          <CustomSelect
            showSearch
            options={cities}
            optionFilterProp="children"
            onSearch={(value) => handleSearchCity(value)}
            className="border"
          />
        </Form.Item>
        <Form.Item
          name="categories" 
          label="Categories"
          className="categoris-input"
          rules={[
            { required: true, message: "Categories is required." },
          ]}
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
        {/* <Form.Item name="ticket" label="Tickets">
          <Radio.Group className="d-flex flex-column event-addedit-form-radiogrp">
            <CustomRadio value="free">Free</CustomRadio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="type" label="Type">
          <Checkbox.Group className="d-flex flex-column event-addedit-form-cbgrp">
            {EventTypes.map((type) => (
              <CustomCheckbox key={type.value} value={type.value}>
                {type.text}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Checkbox.Group className="d-flex flex-column event-addedit-form-cbgrp">
            <CustomCheckbox value="online">Online</CustomCheckbox>
            <CustomCheckbox value="priced">Venue</CustomCheckbox>
          </Checkbox.Group>
        </Form.Item> */}
        <Form.Item 
          name="description" 
          label="Description"
          rules={[
            { required: true, message: "Description is required." },
          ]}
        >
          {editor === "froala" ? (
            <FroalaEdit s3Hash={s3Hash} />
          ) : (
            <RichEdit readOnly={false} data={selectedEvent.description} />
          )}
        </Form.Item>
        {window.location.pathname.includes("channels") ? (
          <Form.Item
            name="externalLink"
            label="External Link"
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || isValidURL(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject("This is not a valid URL!");
                },
              }),
            ]}
          >
            <CustomInput size="sm" />
          </Form.Item>
        ) : (
          <Form.Item
            name="link"
            label="Connect to link"
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || isValidURL(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject("This is not a valid URL!");
                },
              }),
            ]}
          >
            <CustomInput size="sm" />
          </Form.Item>
        )}
        {/*<Form.Item name="credit" label="Apply for credits">
          <CreditSelect />
        </Form.Item>
        <Form.Item name="code" label="Event Code">
          <EventCodeGenerator disabled={edit} />
        </Form.Item>
         <Form.Item name="image" label="Image (220 / 280)">
          <ImageUpload className="event-pic-1" aspect={220 / 280} />
        </Form.Item> */}
        <Form.Item 
          name="image2" 
          label="Images (755 / 305) px"
          rules={[
            { required: true, message: "Images is required." },
          ]}
        >
          <ImageUpload className="event-pic-2" aspect={755 / 305} />
        </Form.Item>
        <div className="event-addedit-form-panel-footer">
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

EventAddEditForm.propTypes = {
  edit: PropTypes.bool,
  onAdded: PropTypes.func,
  onCancel: PropTypes.func,
};

EventAddEditForm.defaultProps = {
  edit: false,
  onAdded: () => {},
  onCancel: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  selectedChannel: channelSelector(state).selectedChannel,
  selectedEvent: eventSelector(state).updatedEvent,
  s3Hash: envSelector(state).s3Hash,
});

const mapDispatchToProps = {
  createChannelEvent,
  updateChannelEvent,
  notificationEmailToNewContentCreators
};

export default connect(mapStateToProps, mapDispatchToProps)(EventAddEditForm);
