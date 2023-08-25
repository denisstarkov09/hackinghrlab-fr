import React from "react";
import { connect } from "react-redux";
import { Modal, Form, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { createInvitation } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { CustomButton, CustomInput } from "components";

const InviteColleaguesFormModal = ({
  visible,
  onCancel,
  userProfile,
  createInvitation,
}) => {
  const [colleaguesForm] = Form.useForm();

  const handleSubmitEmailColleagues = (data) => {
    createInvitation(data.usersInvited, userProfile.id);

    onCancel(false);

    colleaguesForm.resetFields();
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      width={800}
      onCancel={() => {
        onCancel();
        colleaguesForm.resetFields();
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Form
        layout="vertical"
        onFinish={(data) => {
          handleSubmitEmailColleagues(data);
        }}
        autoComplete="off"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        form={colleaguesForm}
      >
        <Form.List name="usersInvited" initialValue={[{ name: "", email: "" }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    label="Name"
                    name={[name, "name"]}
                    fieldKey={[fieldKey, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Please Enter the Name of Invited",
                      },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name={[name, "email"]}
                    fieldKey={[fieldKey, "email"]}
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "is not valid Email",
                      },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <CustomButton
                  type="info"
                  text="Invite another colleague"
                  size="xs"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="button-invite-colleague"
                />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <CustomButton size="xs" text="Invite" htmlType="submit" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  createInvitation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteColleaguesFormModal);
