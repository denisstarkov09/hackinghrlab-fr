import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";
import {
  CustomDrawer,
  CustomButton,
  CustomInput,
  ImageUpload3,
  FroalaEdit,
} from "components";

import { envSelector } from "redux/selectors/envSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import { actions as councilConversation } from "redux/actions/councilConversation-actions";

const { Option } = Select;

const CouncilConversationDrawer = ({
  s3Hash,
  allCategories,
  upsertCouncilConversation,
  visible,
  onClose,
  councilConversation,
  isEdit = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...councilConversation,
    });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [councilConversation]);

  const handleOnFinish = (values) => {
    let transformedValues = {
      ...values,
    };

    if (isEdit) {
      transformedValues = {
        ...transformedValues,
        id: councilConversation.id,
      };
    }

    upsertCouncilConversation(transformedValues);

    form.resetFields();
    onClose();
  };

  return (
    <CustomDrawer visible={visible} onClose={onClose} width={720}>
      <Form form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <CustomInput />
        </Form.Item>
        <Form.Item
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
          <FroalaEdit s3Hash={s3Hash} />
        </Form.Item>
        <Form.Item name="topics" label="Topics" rules={[{ required: true }]}>
          <Select allowClear mode="multiple" size="large">
            {allCategories.map((item) => (
              <Option key={`option-${item.value}`} value={item.value}>
                {item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Upload image" name="imageUrl">
          <ImageUpload3 aspect={16 / 9} />
        </Form.Item>
        <Form.Item>
          <CustomButton htmlType="submit" type="primary" text="Submit" />
        </Form.Item>
      </Form>
    </CustomDrawer>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  s3Hash: envSelector(state).s3Hash,
});

const mapDispatchToProps = {
  ...councilConversation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CouncilConversationDrawer);
