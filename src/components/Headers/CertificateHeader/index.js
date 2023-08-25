import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import ImgArticle from "images/icon-document.svg";

import "./style.scss";

const CertificateHeader = ({ history }) => {
  const onCloseClick = () => {
    history.goBack();
  };

  return (
    <div className="certificate-header">
      <Row gutter={16}>
        <Col span={24} lg={{ span: 12, offset: 6 }}>
          <div className="certificate-header-content d-flex justify-center items-center">
            <div className="d-flex items-center">
              <div className="icon-wrapper">
                <img src={ImgArticle} alt="article-img" />
              </div>
              <span className="article-title">Claim digital certificate</span>
            </div>
            <div className="certificate-header-mobile-close">
              <CloseOutlined
                className="certificate-header-mobile-close-icon"
                onClick={onCloseClick}
              />
            </div>
          </div>
        </Col>
      </Row>
      <CloseOutlined
        className="certificate-header-close"
        onClick={onCloseClick}
      />
    </div>
  );
};

CertificateHeader.propTypes = {
  title: PropTypes.string,
};

CertificateHeader.defaultProps = {
  title: "",
};

export default CertificateHeader;
