import React, { useState, useEffect } from "react";
import { Pagination } from "antd";

import { connect } from "react-redux";
import { marketplaceProfileSelector } from "redux/selectors/marketplaceProfile";
import { homeSelector } from "redux/selectors/homeSelector";
import { getMarketplaceProfiles } from "redux/actions/marketplaceProfile-actions";
import { ParticipantCard } from "components";

import { actions as jobBoardActions } from "redux/actions/jobBoard-actions";
import { jobBoardSelector } from "redux/selectors/jobBoardSelector";

import "./styles.scss";

const Marketplace = ({
  marketplaceProfiles,
  getMarketplaceProfiles,
  userProfile,
  filters,
  getMyJobPosts,
  myJobPosts,
  invitationToApply
}) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMarketplaceProfiles({});
    getMyJobPosts({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    getMarketplaceProfiles(filters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePaginated = (value) => {
    setPage(value);
  };

  const myActiveJobPosts = (myJobPosts || []).filter(
    (jobPost) => jobPost.status === "active"
  );

  return (
    <>
      <div className="speaker-list">
        <div className="speaker-list-container">
          {marketplaceProfiles.length > 0 &&
            marketplaceProfiles
              .slice((page - 1) * 20, page * 20)
              .map((marketplaceProfile, i) => (
                <ParticipantCard
                  jobPosts={myActiveJobPosts}
                  key={i}
                  participant={marketplaceProfile}
                  marketplaceProfile
                  invitationToApply={invitationToApply}
                />
              ))}
        </div>
        {marketplaceProfiles.length > 0 && (
          <div className="pagination">
            <Pagination
              defaultCurrent={page}
              defaultPageSize={20}
              total={marketplaceProfiles.length}
              showSizeChanger={false}
              onChange={handlePaginated}
            />
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  marketplaceProfiles: marketplaceProfileSelector(state).marketplaceProfiles,
  ...jobBoardSelector(state),
});

const mapDispatchToProps = {
  getMarketplaceProfiles,
  ...jobBoardActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);
