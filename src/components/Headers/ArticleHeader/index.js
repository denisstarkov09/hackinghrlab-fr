import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import { SvgIcon } from "components";
import ImgArticle from "images/icon-document.svg";

import "./style.scss";

const ArticleHeader = ({ history }) => {
  const onCloseClick = () => {
    history.goBack();
  };

  return (
    <div className="article-header">
      <Row gutter={16}>
        <Col span={24} lg={{ span: 12, offset: 6 }}>
          <div className="article-header-content d-flex justify-between items-center">
            <div className="d-flex items-center">
              <div className="icon-wrapper">
                <img src={ImgArticle} alt="article-img" />
              </div>
              <span className="article-title">Article</span>
            </div>
            <div className="d-flex items-center">
              <SvgIcon name="star" className="star-icon" />
              <SvgIcon name="bookmark" className="bookmark-icon" />
            </div>
            <div className="article-header-mobile-close">
              <CloseOutlined
                className="article-header-mobile-close-icon"
                onClick={onCloseClick}
              />
            </div>
          </div>
        </Col>
      </Row>
      <CloseOutlined className="article-header-close" onClick={onCloseClick} />
    </div>
  );
};

ArticleHeader.propTypes = {
  title: PropTypes.string,
};

ArticleHeader.defaultProps = {
  title: "",
};

export default ArticleHeader;
