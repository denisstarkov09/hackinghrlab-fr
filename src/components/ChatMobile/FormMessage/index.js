import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  CloseOutlined,
  FileTextTwoTone,
  LoadingOutlined,
  PaperClipOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, notification, Spin, Upload } from "antd";

import "./style.scss";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const FormMessage = ({
  handleSendMessage,
  openEmojiPicker,
  setOpenEmojiPicker,
}) => {
  const focusMessage = useRef();
  const [fileList, setFileList] = useState([]);
  const [message] = Form.useForm();

  useEffect(() => {
    if (focusMessage.current) focusMessage.current.focus();
  }, [focusMessage]);

  const handleSubmit = (values) => {
    handleSendMessage(values.message);
    message.resetFields();
  };

  const handleOpenEmojiPicker = () => {
    setOpenEmojiPicker(!openEmojiPicker);
  };

  const onEmojiClick = (event, emojiObject) => {
    const prevValue = message.getFieldsValue().message || "";
    message.setFieldsValue({
      message: `${prevValue} ${emojiObject.emoji}`,
    });
  };

  const filesUpload = async ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 3000);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };

  const handleChange = async ({ fileList }) => {
    for (let file of fileList) {
      if (file.size > 10500000) {
        return notification.error({
          message: "Error",
          description: `You can't upload files larger than 10mb`,
        });
      }
    }
    const newFileList = await Promise.all(
      fileList.map(async (file) => {
        const thumbUrl = await getBase64(file.originFileObj);

        return {
          ...file,
          thumbUrl,
        };
      })
    );

    setFileList(newFileList);
  };
  const handleDeleteFile = (id) => {
    const newfiles = fileList.filter((file) => file.uid !== id);

    setFileList(newfiles);
  };

  return (
    <div className="form-message-mobile-container">
      {fileList.length > 0 && (
        <div className="files-upload-container">
          {fileList.map((file) => {
            if (file.percent < 100) {
              return (
                <Spin
                  key={file.uid}
                  style={{ marginLeft: "21px" }}
                  indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                />
              );
            }

            return (
              <div
                key={file.uid}
                style={{
                  position: "relative",
                  marginLeft: "10px",
                  marginBottom: "5px",
                }}
              >
                {file.type.includes("image") ? (
                  <img
                    src={file.thumbUrl}
                    alt={file.name}
                    style={{ width: "60px" }}
                  />
                ) : file.type.includes("video") ? (
                  <video
                    src={file.thumbUrl}
                    type={file.type}
                    controls
                    style={{ width: "100px", height: "50px" }}
                  />
                ) : file.type.includes("audio") ? (
                  <audio
                    src={file.thumbUrl}
                    controls
                    style={{ width: "60px" }}
                  />
                ) : (
                  <div className="file-not-image">
                    {file.type.includes("application") ? (
                      <FileTextTwoTone style={{ fontSize: 20 }} />
                    ) : null}

                    <p className="file-name">{file.name}</p>
                  </div>
                )}
                <CloseOutlined
                  className="delete-image"
                  onClick={() => handleDeleteFile(file.uid)}
                />
              </div>
            );
          })}
        </div>
      )}
      <Form
        form={message}
        onFinish={handleSubmit}
        className="form-message-mobile"
      >
        <Form.Item name="message" className="form-message-mobile-textarea">
          <Input.TextArea
            ref={focusMessage}
            rows={2}
            size="small"
            placeholder="Message"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                message.submit();
                e.preventDefault();
              }
            }}
            onClick={() => setOpenEmojiPicker(false)}
            autoFocus
          />
        </Form.Item>

        <Form.Item name="images">
          <Upload
            customRequest={filesUpload}
            listType="picture"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={false}
            maxCount={8}
            className="upload-list-inline"
            accept="audio/*,image/*,application/*,video/*"
          >
            <PaperClipOutlined
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
            />
          </Upload>
        </Form.Item>

        {openEmojiPicker && (
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            pickerStyle={{
              width: "270px",
              position: "absolute",
              zIndex: "500",
              bottom: 60,
              right: 130,
            }}
            native
            disableSearchBar
          />
        )}
        <SmileOutlined
          style={{ fontSize: "1.2rem", cursor: "pointer", margin: "0px 10px" }}
          onClick={handleOpenEmojiPicker}
        />

        <Form.Item>
          <Button
            htmlType="submit"
            className="button-send-message"
            shape="circle"
            icon={<SendOutlined />}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormMessage;
