import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  BusinessDocumentsCard,
  // CustomButton,
  // UploadResumeModal,
} from "components";
import { businessPartnerSelector } from "redux/selectors/businessPartnerSelector";
import {
  getBusinessPartnerResources,
  setBusinessPartnerResources,
  uploadDocumentFile,
  getBusinessPartnerDocuments,
  createBusinessPartnerDocument,
} from "redux/actions/business-partner-actions";

const BusinessPartnerDocuments = ({
  getBusinessPartnerDocuments,
  businessPartnerDocuments,
  createBusinessPartnerDocument,
}) => {
  const businessDocumentsSort = businessPartnerDocuments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  useEffect(() => {
    getBusinessPartnerDocuments();
  }, [getBusinessPartnerDocuments, createBusinessPartnerDocument]);
  return (
    <div className="channel-page__list-wrap">
      {businessDocumentsSort?.map((item) => (
        <BusinessDocumentsCard documentFile={item} key={item.id} />
      ))}
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  businessPartnerDocuments:
    businessPartnerSelector(state).businessPartnerDocuments,
});

const mapDispatchToProps = {
  getBusinessPartnerResources,
  setBusinessPartnerResources,
  getBusinessPartnerDocuments,
  createBusinessPartnerDocument,
  uploadDocumentFile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessPartnerDocuments);
