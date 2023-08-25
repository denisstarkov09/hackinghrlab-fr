import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

import { CustomButton } from "../../../components";

import "./style.scss";

class PhotoUploadForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: props.src,
      crop: {
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1 / 1,
      },
      croppedImageUrl: null,
      base64: null,
    };
  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const { url: croppedImageUrl, base64 } = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl, base64 });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        const base64 = canvas.toDataURL("image/jpeg");
        resolve({ url: this.fileUrl, base64 });
      }, "image/jpeg");
    });
  }

  clickedUploadFile = () => {
    if (this.inputRef) {
      this.inputRef.click();
    }
  };

  onSave = () => {
    const { croppedImageUrl, base64 } = this.state;

    this.props.onSave(croppedImageUrl, base64);
  };

  render() {
    const { className } = this.props;
    const { crop, src } = this.state;

    const newClassName = `photo-upload-form ${className}`;

    return (
      <div className={newClassName}>
        <div className="photo-upload-form-img">
          {src && (
            <ReactCrop
              src={src}
              crop={crop}
              circularCrop={true}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}
        </div>
        <div className="photo-upload-form-footer">
          <CustomButton
            text="Upload your photo"
            className="upload-btn"
            type="primary outlined"
            size_custom="xs"
            onClick={this.clickedUploadFile}
          />
          <CustomButton
            text="SAVE"
            type="secondary"
            size_custom="md"
            onClick={this.onSave}
          />
          <input
            type="file"
            accept="image/*"
            className="profile_pic"
            ref={(ref) => (this.inputRef = ref)}
            onChange={this.onSelectFile}
          />
        </div>
      </div>
    );
  }
}

PhotoUploadForm.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  onSave: PropTypes.func,
};

PhotoUploadForm.defaultProps = {
  src: null,
  className: "",
  onSave: () => {},
};

export default PhotoUploadForm;
