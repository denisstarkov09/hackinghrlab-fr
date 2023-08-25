import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";

import { CustomButton, MemberCard } from "components";
import { numberWithCommas } from "utils/format";
import { setSettingCollapsed } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";

import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const MentorList = ({
  user,
  data,
  total,
  setting,
  setSettingCollapsed,
  loading,
  hideMore,
  onShowMore,
  onSetMatch,
  onMemberClick,
}) => {
  const collapsed = setting.collapsed.mentee;

  // const [match] = useState(8);

  const onMatchClicked = (index) => {
    if (!data[index].connected) {
      onSetMatch(true, data[index].mid);
    }
  };

  const onCollapseClick = () => {
    setSettingCollapsed({ mentee: !collapsed });
  };

  return (
    <div className="mentor-list">
      <div className="mentor-list-collapse" onClick={onCollapseClick}>
        <i
          className={clsx(
            "fas",
            { "fa-chevron-down": collapsed },
            { "fa-chevron-up": !collapsed }
          )}
        />
      </div>
      <div className="mentor-list-header">
        <div className="mentor-list-header-left">
          <span>{`${numberWithCommas(total)}`}</span>
          <span>{` ${total === 1 ? "mentor" : "mentors"} match with you`}</span>
        </div>
        {/* <span className="mentor-list-header-right">
          {`You have ${numberWithCommas(match)} match left this month`}
        </span> */}
      </div>
      <div className="mentor-list-items">
        {(data || []).map((mentor, index) => (
          <MemberCard
            key={`mentor-${index}`}
            user={mentor}
            block={mentor.blockMatchAsMentor === 1}
            match={user ? user.areas : []}
            onClick={() => onMemberClick(mentor)}
            onMatchClicked={() => onMatchClicked(index)}
          />
        ))}
        {!hideMore && (
          <div className="mentor-list-items-more">
            {loading && (
              <div className="mentor-list-loading-more">
                <img src={IconLoadingMore} alt="loading-more-img" />
              </div>
            )}
            {!loading && (
              <CustomButton
                text="Show more"
                type="primary outlined"
                size="lg"
                onClick={onShowMore}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

MentorList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
  hideMore: PropTypes.bool,
  onShowMore: PropTypes.func,
  onSetMatch: PropTypes.func,
  onMemberClick: PropTypes.func,
};

MentorList.defaultProps = {
  user: {},
  data: [],
  total: 0,
  loading: false,
  hideMore: false,
  onShowMore: () => {},
  onSetMatch: () => {},
  onMemberClick: () => {},
};

const mapStateToProps = (state) => ({
  setting: homeSelector(state).setting,
});

const mapDispatchToProps = {
  setSettingCollapsed,
};

export default connect(mapStateToProps, mapDispatchToProps)(MentorList);
