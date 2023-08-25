import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import NoItemsMessageCard from "components/NoItemsMessageCard";

import { CARD_TYPE } from "enum";

import { businessPartnerSelector } from "redux/selectors/businessPartnerSelector";

import {
  getBusinessPartnerResources,
  setBusinessPartnerResources,
  createBusinessPartnerResource,
  updateBusinessPartnerResourcesInformation,
} from "redux/actions/business-partner-actions";

import BusinessPartnerCard from "../BusinessPartnerCard";
import { isEmpty } from "lodash";

const BusinessPartnerList = ({
  filter,
  isOwner,
  isEditor,
  type,
  refresh,
  getBusinessPartnerResources,
  businessPartnerResources,
  setCurrentValue,
  currentTab,
  createBusinessPartnerResource,
}) => {
  const [topics, setTopics] = useState(filter.topics || []);
  const [resources, setResources] = useState(businessPartnerResources);

  useEffect(() => {
    getBusinessPartnerResources();
  }, [getBusinessPartnerResources]);

  useEffect(() => {
    setTopics(JSON.parse(filter.topics || "[]"));
  }, [filter]);

  useEffect(() => {
    setResources(businessPartnerResources);
    let filterResources = [];
    if (topics && !isEmpty(topics)) {
      topics.some((el) => {
        return businessPartnerResources.filter((item) =>
          item.topics.map((topic) => {
            if (topic === el) {
              return filterResources.push(item);
            }
            return filterResources;
          })
        );
      });
      setResources(filterResources);
    }
  }, [topics, businessPartnerResources, filter]);

  useEffect(() => {
    if (refresh) {
      getBusinessPartnerResources();
      setResources(businessPartnerResources);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, createBusinessPartnerResource]);

  const businessResourcesSort = resources?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <div className="channel-page__list-wrap">
      {!isOwner && !isEditor && resources?.length === 0 ? (
        <NoItemsMessageCard
          message={`There are no ${
            type === "article" ? "resources" : "videos"
          } for you at the moment`}
        />
      ) : (
        <>
          <div className="channels__list">
            {(isOwner || isEditor) && <BusinessPartnerCard type={CARD_TYPE.ADD} />}
            {businessResourcesSort?.map((item, index) => (
              <BusinessPartnerCard
                type={(isOwner || isEditor) ? CARD_TYPE.EDIT : CARD_TYPE.VIEW}
                key={index}
                data={item}
                setCurrentValue={setCurrentValue}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

BusinessPartnerList.propTypes = {
  resources: PropTypes.array,
  isOwner: PropTypes.bool,
  isEditor: PropTypes.bool,
  refresh: PropTypes.bool,
  filter: PropTypes.object,
  type: PropTypes.string,
};

BusinessPartnerList.defaultProps = {
  resources: [],
  isOwner: false,
  isEditor: false,
  refresh: false,
  filter: {},
  type: "article",
};

const mapStateToProps = (state) => ({
  businessPartnerResources:
    businessPartnerSelector(state).businessPartnerResources,
});

const mapDispatchToProps = {
  getBusinessPartnerResources,
  setBusinessPartnerResources,
  createBusinessPartnerResource,
  updateBusinessPartnerResourcesInformation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessPartnerList);
