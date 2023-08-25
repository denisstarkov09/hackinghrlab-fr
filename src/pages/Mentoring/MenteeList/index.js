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

const MenteeList = ({
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
  const collapsed = setting.collapsed.mentor;

  // const [match] = useState(8);

  const onMatchClicked = (index) => {
    if (!data[index].connected) {
      onSetMatch(true, data[index].mid);
    }
  };

  const onCollapseClick = () => {
    setSettingCollapsed({ mentor: !collapsed });
  };

  return (
    <div className="mentee-list">
      <div className="mentee-list-collapse" onClick={onCollapseClick}>
        <i
          className={clsx(
            "fas",
            { "fa-chevron-down": collapsed },
            { "fa-chevron-up": !collapsed }
          )}
        />
      </div>
      <div className="mentee-list-header">
        <div className="mentee-list-header-left">
          <span>{`${numberWithCommas(total)}`}</span>
          <span>{` ${total === 1 ? "mentee" : "mentees"} match with you`}</span>
        </div>
        {/* <span className="mentee-list-header-right">
          {`You have ${numberWithCommas(match)} match left this month`}
        </span> */}
      </div>
      <div className="mentee-list-items">
        {(data || []).map((mentee, index) => (
          <MemberCard
            key={`mentor-${index}`}
            user={mentee}
            block={mentee.blockMatchAsMentee === 1}
            match={user ? user.areas : []}
            onClick={() => onMemberClick(mentee)}
            onMatchClicked={() => onMatchClicked(index)}
          />
        ))}
        {!hideMore && (
          <div className="mentee-list-items-more">
            {loading && (
              <div className="mentee-list-loading-more">
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

MenteeList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
  hideMore: PropTypes.bool,
  onShowMore: PropTypes.func,
  onSetMatch: PropTypes.func,
  onMemberClick: PropTypes.func,
};

MenteeList.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MenteeList);
