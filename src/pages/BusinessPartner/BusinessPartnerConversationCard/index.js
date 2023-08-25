import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { Spin } from "antd";
import OpengraphReactComponent from "opengraph-react";

import {
  getBusinessPartnerResources,
  getBusinessPartnerResourceById,
} from "redux/actions/business-partner-actions";
import { getAllBusinessPartnerComments } from "redux/actions/business-partner-comments-actions";

import { categorySelector } from "redux/selectors/categorySelector";
import { authSelector } from "redux/selectors/authSelector";
import { businessPartnerSelector } from "redux/selectors/businessPartnerSelector";
import { businessPartnerCommentsSelector } from "redux/selectors/businessPartnerCommentsSelector";

import { INTERNAL_LINKS } from "enum";

import CouncilComment from "components/CouncilComment";
import IconBack from "images/icon-back.svg";
import CouncilCommentForm from "containers/CouncilCommentForm.js";

import "./style.scss";

const BusinessPartnerConversationsCard = ({
  businessPartnerResource,
  getBusinessPartnerResourceById,
  getAllBusinessPartnerComments,
  allComments,
}) => {
  const { search } = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(search);
  const id = query.get("id");

  useEffect(() => {
    getBusinessPartnerResourceById(id);
    getAllBusinessPartnerComments({ businessPartnerId: id });
  }, [getBusinessPartnerResourceById, getAllBusinessPartnerComments, id]);
  return (
    <div className="post-card-container-businessPartner">
      <div
        key={`custom-post-card-businessPartner${businessPartnerResource?.id}`}
        className={`custom-post-card-businessPartner`}
      >
        <div
          className="skill-cohort-detail-page-header-content-back-btn"
          onClick={() => history.push(`${INTERNAL_LINKS.BUSINESS_PARTNER}?tab=1`)}
        >
          <div className="skill-cohort-detail-page-header-content-back backToList">
            <div className="skill-cohort-detail-page-header-content-back-img">
              <img src={IconBack} alt="icon-back" />
            </div>
            <h4>Back to List</h4>
          </div>
        </div>
        <section className="custom-post-card--header">
          <section className="custom-post-card-businessPartner--content">
            <div className="custom-image">
              <OpengraphReactComponent
                site={businessPartnerResource?.link}
                appId={process.env.REACT_APP_OPENGRAPH_KEY}
                loader={<Spin className="d-center"></Spin>}
                size={"large"}
                acceptLang="auto"
              />
            </div>
            <div className="custom-comment-card-container">
              <CouncilCommentForm />
              <div>
                {allComments?.map((item) => (
                  <CouncilComment data={item} />
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

BusinessPartnerConversationsCard.propTypes = {
  showEdit: PropTypes.bool,
  generalFooter: PropTypes.bool,
  onCommentClick: PropTypes.func,
  afterRemove: PropTypes.func,
  details: PropTypes.bool,
};

BusinessPartnerConversationsCard.defaultProps = {
  showEdit: false,
  generalFooter: true,
  onCommentClick: () => {},
  afterRemove: () => {},
  details: false,
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  businessPartnerResources:
    businessPartnerSelector(state).businessPartnerResources,
  businessPartnerResource:
    businessPartnerSelector(state).businessPartnerResource,
  allComments: businessPartnerCommentsSelector(state).allComments,
  userId: authSelector(state).id,
});

const mapDispatchToProps = {
  getBusinessPartnerResources,
  getBusinessPartnerResourceById,
  getAllBusinessPartnerComments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessPartnerConversationsCard);
