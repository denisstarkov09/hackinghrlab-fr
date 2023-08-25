import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Button, Card, notification, Spin } from "antd";
import { CustomButton, SpecialtyItem } from "components";
import { ProfileOutlined } from "@ant-design/icons";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  deleteBusinessPartnerDocument,
  uploadDocumentFile,
  getBusinessPartnerDocuments,
} from "redux/actions/business-partner-actions";
import IconLoading from "images/icon-loading.gif";
import moment from "moment-timezone";
import "./style.scss";

const BusinessDocumentsCard = ({
  documentFile,
  uploadDocumentFile,
  deleteBusinessPartnerDocument,
  userProfile,
  isLoadinng
}) => {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onUploadResume = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.click();
    }
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
        // setErrorMessage("Invalid format!");
        return;
      }
      // setErrorMessage("");
      let formData = new FormData();
      formData.append("document", file);
      setLoading(true);
      const response = await new Promise((resolve) => {
        uploadDocumentFile(
          { formData, documentId: documentFile.id },
          (error) => {
            if (error) {
              resolve(false);
            } else {
              resolve(true);
            }
          }
        );
      });
      setLoading(false);
      if (response) {
        notification.success({
          message: "Success",
          description: "Document was saved",
        });
        // onClose();
      } else {
        notification.error({
          message: "Error",
          description: "Document was not saved",
        });
        // setErrorMessage("Something went wrong. Please try again!");
      }
    }
  };
  const onDeleteFile = async () => {
    const response = await new Promise((resolve) => {
      deleteBusinessPartnerDocument(
        { documentId: documentFile.id, fileUrl: documentFile.documentFileUrl },
        (error) => {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
    if (response) {
      console.log("success delete");
    } else {
      // setErrorMessage("Something went wrong. Please try again!");
    }
    // setLoading(false);
  };
  const downloadFile = () => {
    if (documentFile.documentFileUrl) {
      const link = document.createElement("a");
      link.setAttribute("href", documentFile.documentFileUrl);
      link.setAttribute(
        "download",
        `${documentFile.User.firstName} ${documentFile.User.lastName}`
      );
      link.setAttribute("target", "_blank");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className="business-card-container">
      {loading && (
        <div className="loading-container">
          <Spin indicator={<img src={IconLoading} alt="loading-img" />} />
        </div>
      )}
      <Card
        hoverable
        bordered
        type="inner"
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h3 style={{ marginBottom: 10 }}>{documentFile.title}</h3>
        <p>
          <strong>Description:</strong> {documentFile.description}
        </p>
        <div>
          <p style={{ display: "flex", gap: 5 }}>
            <strong>Categories:</strong>
            {documentFile.categories.map((el, index) => (
              <SpecialtyItem title={el} key={index} />
            ))}
          </p>
        </div>
        <p>
          <strong>Posted By:</strong> {documentFile.User.firstName}{" "}
          {documentFile.User.lastName}
        </p>
        <div className="business-download">
          {documentFile.documentFileUrl && (
            <div style={{ marginRight: "10px" }}>
              <Button
                shape="circle"
                type="link"
                icon={<ProfileOutlined />}
                className="participant-card-marketplaceprofile-icon"
              />
              <p style={{ display: "contents" }} onClick={() => downloadFile()}>
                {documentFile.documentFileName?.slice(0, 25)}
              </p>
            </div>
          )}
          {userProfile?.id === documentFile?.User?.id && (
            <div className="business-actions">
              {" "}
              <CustomButton
                text="Update"
                type="primary"
                size="xs"
                // disabled={!!userProfile.resumeFileName}
                onClick={onUploadResume}
              />
              <CustomButton
                text="Delete"
                type="primary outlined"
                size="xs"
                // disabled={!userProfile.resumeFileName}
                style={{ marginLeft: "1rem" }}
                onClick={onDeleteFile}
              />
            </div>
          )}
          <input
            id="file-upload"
            ref={fileRef}
            style={{ display: "none" }}
            type="file"
            onChange={onFileChange}
            accept=".pdf,.doc,.docx"
          />
        </div>
        <div className="card-date">
          <p>{moment(documentFile?.createdAt).format("YYYY-MM-DD")}</p>
        </div>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  isLoadinng: homeSelector(state).loading
});

const mapDispatchToProps = {
  uploadDocumentFile,
  deleteBusinessPartnerDocument,
  getBusinessPartnerDocuments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessDocumentsCard);
