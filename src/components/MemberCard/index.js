import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CustomButton, SpecialtyItem } from "components";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const MemberCard = ({
  user,
  match,
  block,
  allCategories,
  onClick,
  onMatchClicked,
}) => {
  const onClickMatch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onMatchClicked();
  };

  const randomId = Math.floor(Math.random() * 1000) + 1;

  return (
    <div className="member-card" onClick={onClick}>
      <div className="member-card-left">
        <div className="member-avatar">
          {user.img ? (
            <div className="member-avatar-img">
              <img src={user.img} alt="user-img" />
            </div>
          ) : (
            <span className="member-avatar-name">{user.abbrName}</span>
          )}
        </div>
      </div>
      <div className="member-card-right">
        <div className="member-card-right-header">
          <h3 className="member-name">{`${user.firstName} ${user.lastName}`}</h3>
          {!block && (
            <CustomButton
              text={user.connected ? "Connected" : "Match"}
              size="sm"
              type="primary"
              disabled={user.connected}
              onClick={onClickMatch}
            />
          )}
        </div>
        <h5 className="member-title">{user.title}</h5>
        <p className="member-about">{user.mentorAbout}</p>
        <div className="member-specialties">
          {(user.areas || [])
            .sort((x, y) => {
              const first = (match || []).includes(x);
              const second = (match || []).includes(y);

              return !first && second ? 1 : first && second ? 0 : -1;
            })
            .map((spec, index) => {
              const specialty = allCategories.find(
                (item) => item.value === spec
              );

              return (
                <SpecialtyItem
                  key={`specialty-${randomId}-${index}`}
                  title={specialty ? specialty.title : ""}
                  active={(match || []).includes(spec)}
                />
              );
            })}
        </div>
      </div>
      <CustomButton
        className="mobile-match-button"
        text={user.connected ? "Connected" : "Match"}
        size="md"
        type="primary"
        disabled={user.connected}
        onClick={onClickMatch}
      />
    </div>
  );
};

MemberCard.propTypes = {
  user: PropTypes.object,
  match: PropTypes.array,
  block: PropTypes.bool,
  onClick: PropTypes.func,
  onMatchClicked: PropTypes.func,
};

MemberCard.defaultProps = {
  user: "",
  match: [],
  block: false,
  onClick: () => {},
  onMatchClicked: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(MemberCard);
