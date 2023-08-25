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

const ImageUpload3 = ({ value, aspect, onChange }) => {
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

  return (
    <div className="image-upload-3-container">
      <ImgCrop rotate aspect={aspect}>
        <Upload
          customRequest={imageUpload}
          listType="image-upload-control"
          fileList={fileList}
          maxCount={1}
          onChange={handleChange}
          onRemove={removeFile}
        >
          <CustomButton text="Upload image" size="sm" type="primary outlined" />
        </Upload>
      </ImgCrop>

      <>{src && <img alt="upload-3" src={src} />}</>
    </div>
  );
};

ImageUpload3.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  aspect: PropTypes.number,
  onChange: PropTypes.func,
  previewSrc: PropTypes.bool,
};

ImageUpload3.defaultProps = {
  className: "",
  value: "",
  aspect: 1 / 1,
  onChange: () => {},
  previewSrc: true,
};

export default ImageUpload3;
