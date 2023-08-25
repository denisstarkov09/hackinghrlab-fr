import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import Modal from "components/Modal";
import {
  CategoriesSelect,
  CustomButton,
  CustomInput,
  CustomSelect,
} from "components";
import { categorySelector } from "redux/selectors/categorySelector";
import { useSearchCity } from "hooks";
import { getNameOfCityWithTimezone } from "utils/format";
import moment from "moment";

const CreateBonfireModal = ({
  visible,
  onCancel,
  bonfireToEdit,
  allCategories,
  handleBonfire,
}) => {
  const [searchCity, setSearchCity] = useState("");
  const cities = useSearchCity(searchCity);

  const [bonfireForm] = Form.useForm();

  useEffect(() => {
    if (bonfireToEdit && bonfireToEdit.timezone) {
      const city = getNameOfCityWithTimezone(bonfireToEdit.timezone);

      if (city) {
        setSearchCity(city);

        bonfireForm.setFieldsValue({
          timezone: `${city}/${bonfireToEdit.timezone}`,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bonfireToEdit]);

  const handleSearchCity = (value) => {
    if (value === "") {
      return;
    }

    let timer = setTimeout(() => {
      setSearchCity(value);
      clearTimeout(timer);
    }, 1000);
  };

  const handleDisabledDate = (currentDate) => {
    currentDate = moment(currentDate).tz("America/Los_Angeles");

    if (
      moment().tz("America/Los_Angeles").add(6, "days").isAfter(currentDate)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={(data) => {
        handleBonfire(data);
      }}
      width={800}
    >
      <Form
        form={bonfireForm}
        layout="vertical"
        initialValues={{
          ...bonfireToEdit,
          time: bonfireToEdit ? moment(bonfireToEdit?.startTime).utc() : "",
        }}
        onFinish={(data) => {
          handleBonfire(data);
        }}
        style={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required." }]}
        >
          <CustomInput />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required." }]}
        >
          <CustomInput multiple={true} />
        </Form.Item>

        <Form.Item
          name="time"
          label="Data and time  (bonfires are designed to be no more than one hour)"
          rules={[{ required: true, message: "Time is required." }]}
        >
          <CustomInput type="time" value="" disabledDate={handleDisabledDate} />
        </Form.Item>

        <Form.Item
          name={"timezone"}
          label="Select your city (this will determine the time zone of the bonfire. Users who are invited will receive the invitation in their corresponding time zones)"
          rules={[{ required: true, message: "City is required." }]}
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
          label="Main topics of your Bonfire (you can select up to two topics)"
          rules={[{ required: true, message: "Categories is required." }]}
        >
          <CategoriesSelect options={allCategories} maxValues={2} />
        </Form.Item>

        <Form.Item
          name="link"
          label="Link (this is the link that people will use to connect - Zoom, Google Meets, Hangouts, etc. Please do not use a link that forces people to register and enter their emails, otherwise your Bonfire will be deleted)"
          rules={[{ required: true, message: "Link is required." }]}
        >
          <CustomInput />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <CustomButton
            text="Cancel"
            type="third outlined"
            size="lg"
            onClick={() => onCancel()}
          />

          <CustomButton
            htmlType="submit"
            text={bonfireToEdit ? "Save" : "Post"}
            type="primary"
            size="lg"
            style={{ marginLeft: "10px" }}
          />
        </div>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBonfireModal);
