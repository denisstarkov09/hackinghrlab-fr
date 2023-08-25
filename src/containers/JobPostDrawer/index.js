/* eslint-disable no-template-curly-in-string */
import { Form, Checkbox, Space, DatePicker, Modal, Cascader } from "antd";
import {
  CustomDrawer,
  CustomButton,
  CustomInput,
  CustomSelect,
  CustomCheckbox,
  FroalaEdit,
} from "components";
import UploadImageForm from "../UploadImageForm";
import { COUNTRIES, PROFILE_SETTINGS, JOB_BOARD } from "enum";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { connect } from "react-redux";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { compact, isEmpty } from "lodash";

import { envSelector } from "redux/selectors/envSelector";

import "./styles.scss";

const validateMessages = {
  required: "${label} is required!",
  types: {
    url: "${label} is not a valid url!",
  },
};

const level = [
  {
    value: "basic",
    label: "Basic",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "advanced",
    label: "Advanced",
  },
];

const transformJobBoardPreferredSkills = JOB_BOARD.PREFERRED_SKILLS.map(
  (skills) => {
    const children = skills.children.map((data) => {
      return {
        ...data,
        children: level,
      };
    });

    return {
      ...skills,
      children,
    };
  }
);

const JobPostDrawer = ({
  isDrawerVisible,
  setIsDrawerVisible,
  handleOnFinish,
  handlePostButton,
  handleDraftButton,
  handlePostDraftButton,
  form,
  post,
  isEdit = false,
  s3Hash,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState();
  const [listOfTakenSkills, setListOfTakenSkills] = useState([]);
  const [cascadeOptions, setCascadeOptions] = useState(
    transformJobBoardPreferredSkills
  );

  useEffect(() => {
    if (isEdit) {
      const country = COUNTRIES.find(
        (country) => country.value === post.country
      );

      let preferredSkillsMain = post.preferredSkills[0] || null;

      const preferredSkills = post.preferredSkills.slice(1).map((skill) => {
        return {
          preferredSkills: [skill.title, skill.skill, skill.level],
        };
      });

      preferredSkillsMain = preferredSkillsMain && [
        preferredSkillsMain?.title,
        preferredSkillsMain?.skill,
        preferredSkillsMain?.level,
      ];

      const transformedPreferredSkills = preferredSkills.map((skill) => {
        return skill.preferredSkills;
      });

      let listOfTknSkills = [preferredSkillsMain];

      if (!isEmpty(transformedPreferredSkills)) {
        listOfTknSkills.push(...transformedPreferredSkills);
      }

      const compactedListOfTakenSkills = compact(listOfTknSkills);

      const listOfPreferredSkills = transformJobBoardPreferredSkills;

      // eslint-disable-next-line array-callback-return
      const data = compactedListOfTakenSkills.map((takenSkills, index) => {
        const titleIndex = listOfPreferredSkills.findIndex(
          (item) => item.value === takenSkills[0]
        );

        if (titleIndex !== -1) {
          const skillIndex = transformJobBoardPreferredSkills[
            titleIndex
          ].children.findIndex((skill) => skill.value === takenSkills[1]);

          if (skillIndex !== -1) {
            let newTakenSkills = [...listOfTakenSkills];

            return (newTakenSkills[index] = {
              titleIndex,
              skillIndex,
            });
          }
        }
      });

      setListOfTakenSkills(data);

      form.setFieldsValue({
        jobTitle: post.jobTitle,
        jobDescription: post.jobDescription,
        city: post.city,
        country: country.value,
        location: post.location,
        salaryRange: post.salaryRange,
        level: post.level,
        mainJobFunctions: post.mainJobFunctions,
        preferredSkills: preferredSkills,
        preferredSkillsMain: preferredSkillsMain || null,
        linkToApply: post.linkToApply,
        closingDate: moment(post.closingDate),
        companyName: post.companyName,
        companyDescription: post.companyDescription,
        companyLogo: post.companyLogo,
        status: post.status,
      });
    }

    setEditImageUrl(post?.companyLogo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  useEffect(() => {
    const newCascadeOptions = cascadeOptions.map((item, itemIndex) => {
      const children = item.children.map((skill, skillIndex) => {
        const takenSkill = listOfTakenSkills.find(
          (tknSkill) =>
            tknSkill?.titleIndex === itemIndex &&
            tknSkill?.skillIndex === skillIndex
        );

        // if (takenSkill) {
        //   skill = {
        //     ...skill,
        //     disabled: true,
        //   };
        // } else {
        //   skill = {
        //     ...skill,
        //     disabled: false,
        //   };
        // }

        // console.log(takenSkill, 'takenSkill')

        const disabled = !!takenSkill;

        return {
          ...skill,
          disabled,
        };
      });

      return {
        ...item,
        children,
      };
    });

    setCascadeOptions(newCascadeOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfTakenSkills]);

  const displayLocationsCheckbox = JOB_BOARD.LOCATIONS.map(
    (location, index) => {
      return (
        <CustomCheckbox key={index} value={location.value}>
          {location.text}
        </CustomCheckbox>
      );
    }
  );

  const levels = PROFILE_SETTINGS.JOB_LEVELS.map((level) => {
    return {
      value: level.value,
      text: level.label,
    };
  });

  const handleOnSave = (url, base64) => {
    setEditImageUrl(url);
    form.setFieldsValue({
      companyLogo: base64,
    });
    setVisibleModal(false);
  };

  const handleDiscard = () => {
    setIsDrawerVisible(false);
  };

  const handleDisabledDate = (currentDate) => {
    return currentDate && currentDate.valueOf() < Date.now();
  };

  const handleCascadeChange = (values, index) => {
    const listOfPreferredSkills = transformJobBoardPreferredSkills;

    const titleIndex = listOfPreferredSkills.findIndex(
      (item) => item.value === values[0]
    );

    if (titleIndex !== -1) {
      const skillIndex = transformJobBoardPreferredSkills[
        titleIndex
      ].children.findIndex((skill) => skill.value === values[1]);

      if (skillIndex !== -1) {
        let newTakenSkills = [...listOfTakenSkills];

        newTakenSkills[index] = {
          titleIndex,
          skillIndex,
        };

        setListOfTakenSkills(newTakenSkills);
      }
    }
  };

  return (
    <CustomDrawer
      title={!isEdit ? "Create Job Post" : "Edit Job Post"}
      placement="right"
      visible={isDrawerVisible}
      onClose={() => setIsDrawerVisible(false)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
        validateMessages={validateMessages}
      >
        <div className="header-container">
          <h3>JOB INFORMATION</h3>
        </div>
        <Form.Item
          name="jobTitle"
          label="Job Title"
          rules={[{ required: true }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          name="jobDescription"
          label="Full Job Description"
          rules={[{ required: true }]}
        >
          <FroalaEdit s3Hash={s3Hash} />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <CustomSelect
            options={COUNTRIES}
            bordered
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <CustomInput />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true }]}
        >
          <Checkbox.Group>
            <Space>{displayLocationsCheckbox}</Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          name="salaryRange"
          label="Salary Range"
          rules={[{ required: true }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item name="level" label="Level" rules={[{ required: true }]}>
          <CustomSelect
            options={levels}
            bordered
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        <Form.Item name="companyLogo" noStyle />
        <Form.Item
          name="mainJobFunctions"
          label="Main Job Functions"
          rules={[{ required: true }]}
        >
          <CustomSelect
            mode="multiple"
            options={PROFILE_SETTINGS.TOPICS}
            bordered
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        <Form.Item
          label="Preferred Skills"
          rules={[{ required: true }]}
          name="preferredSkillsMain"
        >
          <Cascader
            options={cascadeOptions}
            size="large"
            onChange={(values) => handleCascadeChange(values, 0)}
          />
        </Form.Item>
        <Form.List name="preferredSkills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                return (
                  <div className="preferred-skills-container" key={key}>
                    <div className="preferred-skills-content">
                      <Form.Item
                        name={[name, "preferredSkills"]}
                        rules={[{ required: true }]}
                        {...restField}
                      >
                        <Cascader
                          options={cascadeOptions}
                          style={{ width: "100%" }}
                          size="large"
                          onChange={(values) =>
                            handleCascadeChange(values, index + 1)
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="minus-btn">
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  </div>
                );
              })}
              <Form.Item>
                <PlusOutlined onClick={() => add()} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          name="linkToApply"
          label="Link To Apply"
          rules={[{ required: true, type: "url" }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          name="closingDate"
          label="Closing Date"
          rules={[{ required: true }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            disabledDate={handleDisabledDate}
            // onChange={handleDateOnChange}
          />
        </Form.Item>
        <div className="header-container">
          <h3>COMPANY INFORMATION</h3>
        </div>
        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[{ required: true }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          name="companyDescription"
          label="Company Description"
          rules={[{ required: true }]}
        >
          <CustomInput multiple />
        </Form.Item>
        <div style={{ marginBottom: "1rem" }}>
          {editImageUrl && (
            <img
              src={editImageUrl}
              alt="company-logo"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          )}
          <CustomButton
            text="Upload Company Logo"
            type="third"
            block
            onClick={() => setVisibleModal(true)}
          />
        </div>
        {isEdit && (
          <>
            <div className="header-container">
              <h3>JOB POST STATUS</h3>
            </div>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <CustomSelect options={JOB_BOARD.STATUS} bordered />
            </Form.Item>
          </>
        )}
        <Space>
          <CustomButton
            text={!isEdit ? "Post" : "Save"}
            onClick={handlePostButton}
          />
          {post?.status === "draft" && (
            <CustomButton
              text="Post Job"
              onClick={handlePostDraftButton}
              type="secondary"
            />
          )}
          {isEdit && (
            <CustomButton
              text="Discard"
              onClick={handleDiscard}
              type="primary outlined"
            />
          )}
          {!isEdit && (
            <CustomButton
              text="Save as draft"
              type="secondary"
              onClick={handleDraftButton}
            />
          )}
        </Space>
      </Form>
      <Modal
        className="photo-upload-modal"
        title={
          <div className="photo-upload-modal-title">Select your photo.</div>
        }
        centered
        visible={visibleModal}
        width={500}
        closable={true}
        maskClosable={false}
        footer={[]}
        onCancel={() => setVisibleModal(false)}
      >
        <UploadImageForm onSave={handleOnSave} />
      </Modal>
    </CustomDrawer>
  );
};

const mapStateToProps = (state) => ({
  ...envSelector(state),
});

export default connect(mapStateToProps)(JobPostDrawer);
