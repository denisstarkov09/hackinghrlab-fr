import React, { useState } from "react";
import { connect } from "react-redux";
import { Select, Form } from "antd";
import { categorySelector } from "redux/selectors/categorySelector";
import { envSelector } from "redux/selectors/envSelector";
import clsx from "clsx";
import { INTERNAL_LINKS } from "enum";
import moment from "moment";
import { Modal, DatePicker } from "antd";

import {
  CustomButton,
  CustomInput,
  CustomModal,
  FroalaEdit,
  ImageUpload,
} from "components";

import "./style.scss";

const ModalCreateOrEdit = ({
  onCancelModal,
  handleCreateOrEditBlog,
  editOrDeleteBlogPost,
  allCategories,
  s3Hash,
}) => {
  const [blogForm] = Form.useForm();
  const [summary, setSummary] = useState("");
  const [bulModal2, setBulModal2] = useState(false)
  const [date, setDate] = useState('')
  const [required, setRequirect] = useState({
    title: 'title',
    description: 'descrption',
    summary: 'summary',
    categories: [],
    date: 'date'
  })

  const handleSummary = (value) => {
    console.log(value.length)
    setSummary(value.length);
  };

  const handleSaveDraftBlogPost = (type) => {
    let values = blogForm.getFieldsValue();

    for (const key in values) {
      if (!values[key] && key !== "imageUrl") {
        blogForm.submit();
        return;
      }
    }
    handleCreateOrEditBlog({ ...values, status: type });
    onCancelModal();
  };

  const handleSaveLaterBlogPost = (type) => {
    let values = blogForm.getFieldsValue();

    setRequirect({ ...values, date: date })
    setTimeout(() => {
      setRequirect({
        title: 'title',
        description: 'descrption',
        summary: 'summary',
        categories: [],
        date: 'date'
      })
    }, 3000);

    if (date === '') {
      return
    }
    for (const key in values) {
      if (!values[key] && key !== "imageUrl") {
        blogForm.submit();
        return;
      }
    }

    handleCreateOrEditBlog({ ...values, status: type, date: moment.utc(date.format("YYYY-MM-DD HH:mm")).format() });
    onCancelModal();
  };

  const functionPreviuw = () => {
    let values = blogForm.getFieldValue();

    localStorage.setItem("previuw", JSON.stringify(values))

    window.open(`${INTERNAL_LINKS.BLOGS}/-1`, "_blank")
  }

  const customFormat = (value) => `${moment(value.format('YYYY/MM/DD HH'), 'YYYY/MM/DD HH').format('YYYY/MM/DD')} at ${moment(value.format('YYYY/MM/DD HH'), 'YYYY/MM/DD HH').format('HH a')} (Pacific Time)`;

  return (
    <>
      <CustomModal
        visible={true}
        title="Create Blog"
        width={800}
        onCancel={() => onCancelModal()}
      >
        <Form
          form={blogForm}
          layout="vertical"
          onFinish={(data) => {
            handleCreateOrEditBlog(data);
          }}
          initialValues={editOrDeleteBlogPost}
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
            label="Summary"
            name="summary"
            rules={[
              { required: true, message: "Summary is required." },
            ]}
          >
            <CustomInput multiple onChange={handleSummary} />
          </Form.Item>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: '10px',
            paddingRight: '10px',
            transform: 'translateY(-7.5px)'
          }}>
            <p style={(summary > 100) ? {
              color: 'red',
              margin: '0px',
              opacity: '1',
              transition: 'all 1s'
            } : {
              color: 'red',
              margin: '0px',
              opacity: '0',
              transition: 'all 1s'
            }}>The summary cannot be longer than 100 characters</p>
            <p style={{
              margin: "0px",

            }}><span style={(summary > 100) ? { color: 'red' } : {}}>{100 - summary}</span> / 100</p>
          </div>

          <Form.Item
            label={<label className="labelFroala">Body</label>}
            name="description"
            rules={[
              {
                required: true,
                message: "Body is required.",
              },
            ]}
          >
            <FroalaEdit
              s3Hash={s3Hash}
              additionalConfig={{
                placeholderText: "Add a blog...",
                toolbarButtons: [
                  "bold",
                  "italic",
                  "strikeThrough",
                  "paragraphFormat",
                  "align",
                  "formatOL",
                  "formatUL",
                  "indent",
                  "outdent",
                ],
              }}
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="Image">
            <ImageUpload className="event-pic-2" aspect={755 / 305} />
          </Form.Item>

          <Form.Item
            name="categories"
            label="Categories"
            className="categoris-input"
            rules={[{ required: true, message: "Categories is required." }]}
          >
            <Select mode="multiple" className={clsx("custom-select", { border: "bordered" })} style={{ background: "white" }}>
              {allCategories?.map((item) => {
                return (
                  <Select.Option key={item?.value} value={item?.value}>
                    {item?.title}
                  </Select.Option>
                );
              })}
            </Select>
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
              onClick={() => onCancelModal()}
            />
            <CustomButton
              text="Save As Draft"
              type="primary"
              size="lg"
              onClick={() => {
                handleSaveDraftBlogPost("draft");
              }}
              style={{ marginLeft: "10px" }}
            />
            <CustomButton
              text="Post"
              type="secondary"
              size="lg"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setBulModal2(true)
              }}
            />
            <CustomButton
              text="Preview"
              type="secondary"
              size="lg"
              onClick={() => {
                functionPreviuw()
              }}
              style={{ marginLeft: "10px" }}
            />
          </div>
        </Form>
      </CustomModal>
      <Modal
        visible={bulModal2}
        footer={null}
        width={400}
        bodyStyle={{ marginBottom: '40px', padding: "20px", display: 'flex', justifyContent: 'center' }}
        onCancel={() => { setBulModal2(false); }}
      >
        <div style={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            marginTop: '0px',
            width: '470px',
            background: 'white',
            height: 'auto',
            borderRadius: '5px',
            display: 'flex',
            padding: '40px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center'
          }}>
            <h3 style={{ margin: '0px', paddingTop: '20px' }}>Post Now</h3>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '10px' }}>
              <CustomButton
                className="button-speaker font-size-more"
                text="Post Now"
                size="md"
                style={{ padding: '10px', height: '40px', width: '320px', marginTop: '10px' }}
                type={"primary"}
                onClick={() => {
                  handleSaveDraftBlogPost('published')
                }}
              />
            </div>
            <h3 style={{ margin: '0px', paddingTop: '40px' }}>Schedule Your Post</h3>
            <DatePicker
              className={clsx("custom-input")}
              style={{ width: "100%" }}
              onChange={(date) => { setDate(date) }}
              format={customFormat}
              showTime
              panelRender={(data) => {
                return (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      right: '0px',
                      height: '40.89px',
                      width: '170px',
                      background: "white",
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold'
                    }}>Hour ( in Pacific Time )</div>
                    {data}
                  </div>
                )
              }}
            />
            {!required.title &&
              <p style={{ color: '#fe5621', margin: '5px' }}>Title is required</p>
            }
            {!required.summary &&
              <p style={{ color: '#fe5621', margin: '5px' }}>Summary is required</p>
            }
            {!required.description &&
              <p style={{ color: '#fe5621', margin: '5px' }}>Description is required</p>
            }
            {!required.categories &&
              <p style={{ color: '#fe5621', margin: '5px' }}>Categories is required</p>
            }
            {!required.date &&
              <p style={{ color: '#fe5621', margin: '5px' }}>Date is required</p>
            }
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '10px' }}>
              <CustomButton
                className="button-speaker font-size-more"
                text="Schedule Your Post"
                size="md"
                style={{ padding: '10px', height: '40px', width: '320px', marginTop: '20px' }}
                type={"primary"}
                onClick={() => {
                  handleSaveLaterBlogPost('draft')
                }}
              />
            </div>
          </div>
        </div>

      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  s3Hash: envSelector(state).s3Hash,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateOrEdit);
