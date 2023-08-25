import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";

import { CustomButton } from "components";

import "./style.scss";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const ImageUpload2 = ({ value, aspect, width, height, onChange }) => {
  const [fileList, setFileList] = useState([]);
  const [src, setSrc] = useState("");

  const imageUpload = async ({ file, onSuccess }) => {
    const base64FormatFile = await getBase64(file);
    onChange(base64FormatFile);
    setSrc(base64FormatFile);
    onSuccess("ok");
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const removeFile = () => {};

  useEffect(() => {
    setSrc(value);
    return () => {};
  }, [value]);

  const style = {
    width,
    height,
  };

  return (
    <div
      className="image-upload-2"
      style={src ? { ...style, backgroundImage: `url("${src}")` } : style}
    >
      <ImgCrop rotate aspect={aspect}>
        <Upload
          customRequest={imageUpload}
          listType="image-upload-2-control"
          fileList={fileList}
          maxCount={1}
          onChange={handleChange}
          onRemove={removeFile}
        >
          <CustomButton text="Upload image" size="md" type="primary outlined" />
        </Upload>
      </ImgCrop>
    </div>
  );
};

ImageUpload2.propTypes = {
  value: PropTypes.string,
  aspect: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
  onChange: PropTypes.func,
};

ImageUpload2.defaultProps = {
  value: "",
  aspect: 1 / 1,
  width: "100%",
  height: "700px",
  onChange: () => {},
};

export default ImageUpload2;
