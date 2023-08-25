import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Col, Row } from "antd";

import { homeSelector } from "redux/selectors/homeSelector";
import { actions as homeActions } from "redux/actions/home-actions";
import Emitter from "services/emitter";

import BusinessPartnerList from "./BusinessPartnerList";
import BusinessPartnerMembers from "./BusinessPartnerMembers";

import FilterDrawer from "pages/Library/FilterDrawer";
import BusinessPartnerDocuments from "containers/BusinessPartnerDocuments";
import { LibraryFilterPanel, Tabs } from "components";
import NoItemsMessageCard from "components/NoItemsMessageCard";

import { EVENT_TYPES, INTERNAL_LINKS } from "enum";

import IconBack from "images/icon-back.svg";

import "./style.scss";

const BusinessPartnerPage = ({ userProfile, confirmApply, getUser }) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const history = useHistory();

  const [currentTab, setCurrentTab] = useState(query.get("tab") || "0");
  const accepted = query.get("accepted");
  const id = query.get("id");
  const [, setFilter] = useState({});

  const handleTabChange = (tab) => {
    history.replace({
      pathname: window.location.pathname,
      search: `tab=${tab}`,
    });
    setCurrentTab(tab);
  };

  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  useEffect(() => {
    if (accepted != null && id)
      confirmApply(id, accepted === "true" ? true : false);
    history.push("business-partner");
  }, [id, confirmApply, accepted, getUser, history]);

  const onFilterChange = (values) => {
    setFilter(values);
  };
  const TabData = [
    {
      title: "Members",
      content: () => <BusinessPartnerMembers />,
    },
    {
      title: "Relevant Content",
      content: () => (
        <BusinessPartnerList
          type="article"
          refresh={currentTab === "0"}
          setCurrentValue={setCurrentTab}
          // filter={filter}
          currentTab={currentTab}
        />
      ),
    },
    {
      title: "Download/Upload Resources",
      content: () => <BusinessPartnerDocuments currentTab={currentTab} />,
    },
    {
      title: "Projects",
      content: () => (
        <div className="cooming-soon-container">
          <h3>Coming Soon</h3>
        </div>
      ),
    },
    {
      title: "Roundtable",
      content: () => (
        <div className="cooming-soon-container">
          <h3>Coming Soon</h3>
        </div>
      ),
    },
  ];
  return (
    <>
      {userProfile.isBusinessPartner === "accepted" &&
      userProfile.memberShip === "premium" ? (
        <div className="businessPartner-page">
          <LibraryFilterPanel
            onChange={onFilterChange}
            currentTab={currentTab}
            isBusiness={true}
          />
          <FilterDrawer onChange={onFilterChange} />
          <div className="search-results-container">
            <Row>
              <Col span={24}>
                <div className="search-results-container-mobile-header">
                  <h3 className="filters-btn" onClick={showFilterPanel}>
                    Filters
                  </h3>
                  {/* <h3>{`${numberWithCommas(countOfResults)} result${
                countOfResults > 1 ? "s" : ""
              }`}</h3> */}
                </div>
              </Col>
            </Row>
            <div className="businessPartner-page__container">
              <div className="businessPartner-page__results">
                <div className="businessPartner-page__row">
                  <div className="businessPartner-page__info-column"></div>
                  <div className="businessPartner-page__content">
                    <Link to={INTERNAL_LINKS.HOME}>
                      <div className="businessPartner-page__content-top">
                        <div className="businessPartner-page__content-top-back">
                          <img src={IconBack} alt="icon-back" />
                        </div>
                        <h4>Back</h4>
                      </div>
                    </Link>
                    <Tabs
                      data={TabData}
                      current={currentTab}
                      onChange={handleTabChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="businessPartner-page__list-wrap">
          <NoItemsMessageCard
            message={
              userProfile.isBusinessPartner === 'accepted'
                ? "You must be a premium member to see this view"
                : `You must be a business partner and premium member to see this view.`
            }
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  confirmApply: homeActions.confirmInvitationApply,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessPartnerPage);
