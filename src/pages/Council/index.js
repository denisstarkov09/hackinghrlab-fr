import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { isEmpty } from "lodash";

import { homeSelector } from "redux/selectors/homeSelector";
import { councilSelector } from "redux/selectors/councilSelector";
import { INTERNAL_LINKS } from "enum";
import qs from "query-string";

import FilterDrawer from "./CouncilPanel";
import { Tabs } from "components";
import NoItemsMessageCard from "components/NoItemsMessageCard";
import CouncilMembers from "./CouncilMembers";
import CouncilList from "./CouncilList.js";
import CouncilConversationsCard from "./CouncilConversationsCard";

import { actions as councilConversation } from "redux/actions/councilConversation-actions";
import { councilConversationSelector } from "redux/selectors/councilConversationSelector";

import IconBack from "images/icon-back.svg";

import "./style.scss";

const CouncilPage = ({
  userProfile,
  getCouncilConversations,
  councilConversation,
  getCouncilConversation,
}) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [currentTab, setCurrentTab] = useState(query.get("tab") || "0");
  const [filter, setFilter] = useState([]);
  const [classCouncilContainer, setClassCouncilContainer] = useState("search-results-container")
  const location = useLocation();
  

  const parsed = qs.parse(location.search);

  useEffect(() => {
    getCouncilConversations(filter);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (councilConversation?.id) {
      window.history.replaceState(
        null,
        "Page",
        `${INTERNAL_LINKS.COUNCIL}?id=${councilConversation.id}`
      );
    }
  }, [councilConversation]);

  useEffect(() => {
    if (parsed.id) {
      getCouncilConversation(parsed.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.id]);

  const onFilterChange = (values) => {
    setFilter(values);
  };

  const TabData = [
    {
      title: "Conversations",
      content: () =>
        isEmpty(councilConversation) ? (
          <NoItemsMessageCard />
        ) : (
          <CouncilConversationsCard councilConversation={councilConversation} />
        ),
    },
    {
      title: "Resources",
      content: () => (
        <CouncilList
          type="article"
          refresh={currentTab === "0"}
          setCurrentValue={setCurrentTab}
          filter={filter}
        />
      ),
    },
    {
      title: "Council Members",
      content: () => <CouncilMembers />,
    },
  ];

  return (
    <>
      {userProfile.councilMember || userProfile.role === "admin" ? (
        <div className="council-page">
          <div className="council-filter-panel">
            <FilterDrawer onChange={onFilterChange} />
          </div>
          <div className={classCouncilContainer}> 
            {/* <Row>
              <Col span={24}>
                <div className="search-results-container-mobile-header">
                  <h3 className="filters-btn" onClick={showFilterPanel}>
                    Filters
                  </h3>
                </div>
              </Col>
            </Row> */}
            <div className="council-page__container">
              <div className="council-page__results">
                <div className="council-page__row">
                  <div className="council-page__info-column"></div>
                  <div className="council-page__content">
                    <div className="council-filter-panel">
                      <Link to={INTERNAL_LINKS.HOME}>
                        <div className="council-page__content-top">
                          <div className="council-page__content-top-back">
                            <img src={IconBack} alt="icon-back" />
                          </div>
                          <h4>Back</h4>
                        </div>
                      </Link>
                    </div>
                    <Tabs
                      data={TabData}
                      current={currentTab}
                      onChange={setCurrentTab}
                      functionClass={setClassCouncilContainer}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="council-page__list-wrap">
          <NoItemsMessageCard
            message={`You must be a council member to see this view.`}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
  councilResources: councilSelector(state).councilResources,
  ...councilConversationSelector(state),
});

const mapDispatchToProps = {
  ...councilConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilPage);
