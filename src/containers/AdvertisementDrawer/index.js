/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import { Drawer, Form, DatePicker, Modal, notification } from "antd";
import { CustomButton, CustomInput, CustomSelect } from "components";
import { isEmpty } from "lodash";
import moment from "moment-timezone";
import { connect } from "react-redux";
import UploadImageForm from "../UploadImageForm";

import {
  getAllActiveAdvertisements,
  createAdvertisement,
  editAdvertisement,
} from "redux/actions/advertisment-actions";
import { advertisementSelector } from "redux/selectors/advertisementsSelector";
import { homeSelector } from "redux/selectors/homeSelector";

const { RangePicker } = DatePicker;

const AdvertisementDrawer = ({
  visible,
  setVisible,
  page = null,
  onDashboard = false,
  getAllActiveAdvertisements,
  createAdvertisement,
  allActiveAdvertisements,
  isEdit = false,
  advertisement = {},
  clearEditAndAdvertisement,
  editAdvertisement,
  userProfile
}) => {
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [disabledDates, setDisabledDates] = useState([]);
  const [page_, setPage_] = useState(null);
  const [form] = Form.useForm();
  const [isPagePopulated, setIsPagePopulated] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [hasAdvertisementStarted, setHasAdvertisementStarted] = useState(false);
  const [isDraft, setIsDraft] = useState(true);

  useEffect(() => {
    getAllActiveAdvertisements();
  }, []);

  useEffect(() => {

    if (isEdit) {
      form.setFieldsValue({
        ...advertisement,
        date: [
          moment.tz(advertisement.startDate, "America/Los_Angeles"),
          moment.tz(advertisement.endDate, "America/Los_Angeles"),
        ],
        image: advertisement.adContentLink,
      });

      setEditImageUrl(advertisement.adContentLink);

      const dateToday = moment().tz("America/Los_Angeles");
      const hasStarted = dateToday.isAfter(
        moment.tz(advertisement.startDate, "America/Los_Angeles")
      );
      setHasAdvertisementStarted(
        hasStarted && advertisement.status === "active"
      );
      setIsDraft(advertisement.status === "draft");
      setPage_(advertisement.page);

      let diff = 0;

      if (isEdit) {
        diff = moment
          .tz(advertisement.endDate, "America/Los_Angeles")
          .diff(
            moment.tz(advertisement.startDate, "America/Los_Angeles"),
            "days"
          );
        diff += 1;
        setTotalDays(diff);
        setTotalPrice(diff * advertisement.adCostPerDay);
      }
    }else{
      return () => {
        setHasAdvertisementStarted(false);
        setEditImageUrl(null);
        setIsDraft(false);
        setIsPagePopulated(false);
      };
    }

    
  }, [isEdit, advertisement]);

  useEffect(() => {
    const date = form.getFieldValue("date");

    if (!isEmpty(date)) {
      switch (page_) {
        case "home":
        case "conference-library":
          if (totalDays > 0) {
            let _totalPrice = 0;

            if (totalDays <= 7) {
              _totalPrice = totalDays * 7;
            } else if (totalDays >= 8 && totalDays <= 14) {
              _totalPrice = totalDays * 6;
            } else {
              _totalPrice = totalDays * 5;
            }

            setTotalPrice(_totalPrice);
          }
          break;
        case "events":
        case "project-x":
          if (totalDays > 0) {
            let _totalPrice = 0;

            if (totalDays <= 7) {
              _totalPrice = totalDays * 5;
            } else if (totalDays >= 8 && totalDays <= 14) {
              _totalPrice = totalDays * 4;
            } else {
              _totalPrice = totalDays * 3;
            }

            setTotalPrice(_totalPrice);
          }
          break;
        default:
          setTotalPrice(0);
      }
    }
  }, [page_, totalDays]);

  useEffect(() => {
    if (
      !isEmpty(allActiveAdvertisements) &&
      Array.isArray(allActiveAdvertisements)
    ) {
      let filteredDisabledDates = allActiveAdvertisements.filter(
        (advertisement) => advertisement.page === page_ || page
      );

      if (isEdit && !isEmpty(advertisement)) {
        filteredDisabledDates = filteredDisabledDates.filter(
          (date) => date.id !== advertisement.id
        );
      }

      let disabledDates = filteredDisabledDates.map(
        (advertisement) => advertisement.datesBetweenStartDateAndEndDate
      );

      disabledDates = disabledDates.flat();

      let _transformedDisabledDates = [];
      disabledDates.forEach((date) => {
        const filteredDates = disabledDates.filter((d) => d === date);

        if (filteredDates.length >= 3) {
          _transformedDisabledDates.push(date);
        }
      });

      _transformedDisabledDates = _transformedDisabledDates.map((date) => {
        return moment
          .tz(date, "America/Los_Angeles")
          .startOf("day")
          .format("YYYY-MM-DD");
      });

      setDisabledDates(_transformedDisabledDates);
      form.resetFields(["startDate", "endDate"]);
    }
  }, [allActiveAdvertisements, page_, advertisement.page]);

  const handleOnSave = (url, base64) => {
    setEditImageUrl(url);
    form.setFieldsValue({
      image: base64,
    });
    setVisibleModal(false);
  };

  const handleDisabledDate = (currentDate) => {
    const current = moment
      .tz(currentDate, "America/Los_Angeles")
      .startOf("day")
      .format("YYYY-MM-DD");

    const isMatch = disabledDates.some((date) => {
      const transformedDate = moment
        .tz(date, "America/Los_Angeles")
        .format("YYYY-MM-DD");

      return transformedDate === current;
    });

    return (
      (currentDate &&
        currentDate.valueOf() < moment().tz("America/Los_Angeles")) ||
      isMatch
    );
  };

  const handleOnFinish = (values) => {
    const canPurchase = userProfile.advertisementCredits >= totalPrice;

    if (!canPurchase) {
      return notification.warn({
        message: "You don't have enough credits.",
      });
    }

    const startDate = moment
      .tz(values.date[0], "America/Los_Angeles")
      .startOf("day");

    const endDate = moment
      .tz(values.date[1], "America/Los_Angeles")
      .startOf("day");
    // .endOf("day");

    const diff = endDate.diff(startDate, "days");
    const adDurationByDays = diff + 1;

    const datesBetweenStartDateAndEndDate = [];

    for (let i = 0; i <= diff; i++) {
      const date = moment
        .tz(values.date[0], "America/Los_Angeles")
        .add(i, "days")
        .startOf("day");

      datesBetweenStartDateAndEndDate.push(date);
    }

    if (isEdit) {
      const transformedValues = {
        ...values,
        startDate,
        endDate: endDate.endOf("day"),
        adDurationByDays,
        datesBetweenStartDateAndEndDate,
      };
      editAdvertisement(advertisement.id, transformedValues);
    } else {
      const transformedValues = {
        ...values,
        startDate,
        endDate: endDate.endOf("day"),
        adDurationByDays,
        datesBetweenStartDateAndEndDate,
        page: page || values.page,
      };

      createAdvertisement(transformedValues);
    }

    clearEditAndAdvertisement();
    setVisible(false);
    setIsDraft(true)
    form.resetFields();
  };

  const handleOnSelect = (value) => {
    setPage_(value);

    if (!isEdit) {
      setIsPagePopulated(true);
    }
  };

  // dates = [moment, moment]
  const validateDateRange = (_, value) => {
    const startDate = moment.tz(value[0], "America/Los_Angeles").startOf("day");
    const endDate = moment.tz(value[1], "America/Los_Angeles").startOf("day");

    const datesInBetween = [];
    const diff = endDate.diff(startDate, "days");
    setTotalDays(diff + 1);

    for (let i = 0; i <= diff; i++) {
      const date = moment
        .tz(value[0], "America/Los_Angeles")
        .startOf("day")
        .add(i, "day")
        .format("YYYY-MM-DD");

      datesInBetween.push(date);
    }

    const isOverlap = disabledDates.some((date) =>
      datesInBetween.includes(date)
    );

    if (isOverlap && !isDraft) {
      return Promise.reject(
        new Error(
          "Start Date and End Date are overlapping with disabled dates."
        )
      );
    } else {
      return Promise.resolve();
    }
  };

  const handleOnClose = () => {
    if (isEdit) {
      clearEditAndAdvertisement();
      setIsDraft(true)
      form.resetFields();
    }
    
    setVisible(false);
  };

  const handleDynamicSubmit = (status) => {
    form.setFieldsValue({
      status,
    });

    form.submit();
  };

  return (
    <>
      <Drawer
        visible={visible}
        onClose={handleOnClose}
        title="Rent this space"
        width={500}
      >
        <div style={{ padding: "1rem" }}>
          <Form
            form={form}
            onFinish={handleOnFinish}
            layout="vertical"
            validateMessages={{ required: "'${label}' is required!" }}
          >
            <div>
              <h3>{`Available credits: ${
                userProfile.advertisementCredits || 0
              }`}</h3>
            </div>
            <Form.Item label="Campaign Name" name="title" rules={[{ required: true }]}>
              <CustomInput 
                bordered 
              />
            </Form.Item>
            {onDashboard && (
              <Form.Item label="Page" name="page" rules={[{ required: true }]}>
                <CustomSelect
                  options={[
                    { text: "Home", value: "home" },
                    { text: "Events", value: "events" },
                    { text: "Project X", value: "project-x" },
                    { text: "Conference Library", value: "conference-library" },
                  ]}
                  bordered
                  onSelect={handleOnSelect}
                  disabled={(isEdit || !isPagePopulated) && !isDraft}
                  style={((isEdit || !isPagePopulated) && !isDraft) ? {background:"#f5f5f5", borderRadius:"5px"} : {background:"white"}}
                />
              </Form.Item>
            )}
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true }, { validator: validateDateRange }]}
            >
              <RangePicker
                showTime={false}
                style={{ width: "100%" }}
                size="large"
                disabledDate={handleDisabledDate}
                disabled={(isEdit || !isPagePopulated) && !isDraft}
              />
            </Form.Item>
            <Form.Item
              label="Advertisement Link"
              name="advertisementLink"
              rules={[{ required: true, type: "url" }]}
            >
              <CustomInput bordered />
            </Form.Item>
            <div>
              <h3>Total days: {totalDays}</h3>
            </div>
            <div>
              <h3>Total credits: {totalPrice} Credits</h3>
            </div>
            <Form.Item name="image" noStyle />
            <div style={{ marginBottom: "1rem" }}>
              Image (Aspect Ratio: 1 / 1)
            </div>
            <div style={{ marginBottom: "1rem" }}>
              {editImageUrl && (
                <img
                  src={editImageUrl}
                  alt="advertisement-img"
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
              )}
              <CustomButton
                text="Upload Advertisement Image"
                type="third"
                block
                onClick={() => setVisibleModal(true)}
              />
            </div>
            <Form.Item name="status" noStyle />
            <div>
              <div className="d-flex">
                {!hasAdvertisementStarted &&
                  advertisement.status !== "active" && (
                    <CustomButton
                      text="Save as Draft"
                      type="secondary outline"
                      block
                      onClick={() => handleDynamicSubmit("draft")}
                      style={{ width: "100%", marginRight: "1rem" }}
                    />
                  )}
                <CustomButton
                  text={(!isDraft && isEdit) ? "Save Campaign" : "Start Campaign"}
                  type="primary"
                  block
                  onClick={() => handleDynamicSubmit("active")}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
      <Modal
        className="photo-upload-modal"
        title={<div className="photo-upload-modal-title">Select an image.</div>}
        centered
        visible={visibleModal}
        width={500}
        closable={true}
        maskClosable={false}
        footer={[]}
        onCancel={() => setVisibleModal(false)}
      >
        <UploadImageForm onSave={handleOnSave} isFixed aspectRatio={1 / 1} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...advertisementSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getAllActiveAdvertisements,
  createAdvertisement,
  editAdvertisement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvertisementDrawer);
