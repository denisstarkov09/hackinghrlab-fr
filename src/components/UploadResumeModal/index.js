import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FilePdfOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";

import { CustomModal, CustomButton } from "components";
import { uploadResume, deleteResume } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";

import { uploadDocumentFile } from "redux/actions/business-partner-actions";
import IconLoading from "images/icon-loading.gif";

import "./style.scss";
import { useLocation } from "react-router-dom";

const UploadResumeModal = ({
  visible,
  userProfile,
  onClose,
  uploadResume,
  deleteResume,
  setFile,
}) => {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const isBusiness = location.pathname.includes("business-partner");

  const onUploadResume = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.click();
    }
  };

  const onDeleteResume = async () => {
    setLoading(true);
    setErrorMessage("");
    const response = await new Promise((resolve) => {
      deleteResume((error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    if (response) {
      console.log("success delete");
    } else {
      setErrorMessage("Something went wrong. Please try again!");
    }
    setLoading(false);
  };

  const onFileChange = async () => {
    if (fileRef && fileRef.current) {
      // check file type

      const file = fileRef.current.files[0];
      const supportedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!supportedTypes.includes(file.type)) {
        setErrorMessage("Invalid format!");
        return;
      }
      setErrorMessage("");
      let formData = new FormData();
      formData.append(isBusiness ? "document" : "resume", file);
      if (isBusiness) {
        setLoading(true);
        setFile(formData);
        setLoading(false);
        onClose();
      } else {
        setLoading(true);
        const response = await new Promise((resolve) => {
          uploadResume(formData, (error) => {
            if (error) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
        if (response) {
          notification.success({
            message: "Success",
            description: "Resume was saved",
          });
          onClose();
        } else {
          setErrorMessage("Something went wrong. Please try again!");
        }
        setLoading(false);
      }
    }
  };

  const onOpenResume = (resume) => {
    window.open(resume, "_target");
  };

  return (
    <CustomModal
      title={isBusiness ? "Upload your file" : "Upload your resume"}
      centered
      visible={visible}
      width={500}
      maskClosable={false}
      onCancel={onClose}
    >
      <div className="upload-resume">
        {loading && (
          <div className="loading-container">
            <Spin indicator={<img src={IconLoading} alt="loading-img" />} />
          </div>
        )}
        {!loading && (
          <React.Fragment>
            <div className="upload-resume-form">
              <span className="upload-resume-form-label">
                {isBusiness ? "File" : "Resume"}:
              </span>
              {!!userProfile.resumeFileName ? (
                <>
                  {isBusiness ? (
                    ""
                  ) : (
                    <>
                      <FilePdfOutlined className="upload-resume-form-pdficon" />
                      <span className="upload-resume-filename">
                        userProfile.resumeFileName
                      </span>
                      <i
                        className="fas fa-external-link-alt external-link"
                        onClick={() => onOpenResume(userProfile.resumeUrl)}
                      />
                    </>
                  )}
                </>
              ) : (
                <span className="upload-resume-none">-</span>
              )}
            </div>
            {errorMessage && (
              <div className="upload-resume-error">{errorMessage}</div>
            )}
            <div className="upload-resume-footer">
              <CustomButton
                text="Upload"
                type="primary"
                size="xs"
                // disabled={!!userProfile.resumeFileName}
                onClick={onUploadResume}
              />
              {isBusiness || (
                <CustomButton
                  text="Delete"
                  type="primary outlined"
                  size="xs"
                  disabled={!userProfile.resumeFileName}
                  style={{ marginLeft: "1rem" }}
                  onClick={onDeleteResume}
                />
              )}
              <CustomButton
                text="Close"
                type="primary outlined"
                size="xs"
                style={{ marginLeft: "1rem" }}
                onClick={onClose}
              />
            </div>
            <input
              id="file-upload"
              ref={fileRef}
              style={{ display: "none" }}
              type="file"
              onChange={onFileChange}
              accept=".pdf,.doc,.docx"
            />
          </React.Fragment>
        )}
      </div>
    </CustomModal>
  );
};

UploadResumeModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

UploadResumeModal.defaultProps = {
  visible: false,
  onClose: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  uploadResume,
  deleteResume,
  uploadDocumentFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadResumeModal);
