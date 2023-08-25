import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tabs, CustomButton } from "components";
import { SETTINGS } from "enum";
import IconLoadingMore from "images/icon-loading-more.gif";
import { INTERNAL_LINKS } from "enum";
import qs from "query-string";
import { useLocation } from "react-router-dom";

import { actions as jobBoardActions } from "redux/actions/jobBoard-actions";
import { getMarketplaceProfiles } from "redux/actions/marketplaceProfile-actions";

import { jobBoardSelector } from "redux/selectors/jobBoardSelector";
import { homeSelector } from "redux/selectors/homeSelector";

import { JobPostCard, RecruiterView } from "./JobBoard";
import Marketplace from "./Marketplace";
import TalentMarketplaceProfile from "./TalentMarketplaceProfile";
import TalentMarketplaceFilterPanel from "./TalentMarketplaceFilterPanel";
import "./styles.scss";

const TalentMarketplacePage = ({
  userProfile,
  getAllJobPosts,
  allJobPosts,
  currentPage,
  loading,
  countOfResults,
  getMoreJobPosts,
}) => {
  const [currentTab, setCurrentTab] = useState("0");
  const [filters, setFilters] = useState({});
  const location = useLocation();

  const isRecruiter = userProfile.recruiterSubscription;

  useEffect(() => {
    getAllJobPosts();

    const parsed = qs.parse(location.search);
    setCurrentTab(parsed.key);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    if (currentTab === "2") {
      getAllJobPosts(filters);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleFilterOnChange = (values) => {
    setFilters(values);
    // getMarketplaceProfiles(values);
    getAllJobPosts(values);
  };
  const showMore = () => {
    getMoreJobPosts({
      ...filters,
      page: currentPage + 1,
    });
  };

  const displayMainJobPosts = () => {
    return (
      <div className="job-board-wrapper">
        <div className="job-posts-container">
          {allJobPosts?.map((post, index) => {
            return <JobPostCard post={post} key={index}/>;
          })}
        </div>
        {currentPage * SETTINGS.MAX_SEARCH_ROW_NUM < countOfResults && (
          <div className="search-results-container-footer d-flex justify-center items-center">
            {loading && (
              <div className="job-board-page-loading-more">
                <img src={IconLoadingMore} alt="loading-more-img" />
              </div>
            )}
            {!loading && (
              <CustomButton
                text="Show More"
                type="primary outlined"
                size="lg"
                onClick={showMore}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const TabData = [
    {
      title: "My Talent Marketplace Profile",
      content: () => <TalentMarketplaceProfile />,
    },
    {
      title: "Talent Marketplace",
      content: () => <Marketplace filters={filters} />,
    },
    {
      title: "Job Board",
      content: displayMainJobPosts,
    },
  ];

  if (isRecruiter) {
    const myJobPosts = {
      title: "My Job Postings",
      content: () => <RecruiterView filter={filters} />,
    };

    TabData.push(myJobPosts);
  }

  const addFilterToURL = (key) => {
    window.history.replaceState(
      null,
      "Page",
      `${INTERNAL_LINKS.TALENT_MARKETPLACE}?key=${key}`
    );
    setCurrentTab(key);
  };

  return (
    <div className="talent-marketplace-page">
      <TalentMarketplaceFilterPanel
        onChange={handleFilterOnChange}
        isRecruiter={isRecruiter}
      />
      <div className="talent-marketplace-tabs-wrapper">
        <Tabs data={TabData} current={currentTab} onChange={addFilterToURL} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...jobBoardSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...jobBoardActions,
  getMarketplaceProfiles,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TalentMarketplacePage);
