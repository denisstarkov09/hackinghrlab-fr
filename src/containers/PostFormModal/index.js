import React from "react";
import { Form } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

import { CustomDrawer, CustomButton } from "components";
import PostForm from "containers/PostForm";

import "./style.scss";

const PostFormModal = ({ userProfile, visible, onCancel, ...rest }) => {
  const [externalForm] = Form.useForm();
  return (
    <CustomDrawer
      title={"Add Story"}
      width={1000}
      visible={visible}
      bodyStyle={{ overflowY: "scroll", maxHeight: "calc(100vh - 200px)" }}
      onCancel={onCancel}
      onClose={onCancel}
      closable={true}
      footer={
        <div className="drawer-footer">
          <CustomButton
            onClick={onCancel}
            type="primary third outlined"
            text="Cancel"
          />
          <CustomButton
            onClick={() => {
              externalForm.submit();
            }}
            type="primary secondary"
            text="Post"
          />
        </div>
      }
      closeIcon={<CloseCircleFilled className="payment-modal-close" />}
    >
      <PostForm externalForm={externalForm}></PostForm>
    </CustomDrawer>
  );
};

export default PostFormModal;
