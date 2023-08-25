import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  getJourney,
} from "redux/actions/journey-actions";
import {
  getAllJourneyItems,
} from "redux/actions/journeyItem-actions";

import {
  CustomButton,
} from "components";
import JourneyCard from "pages/Journey/JourneyCard";

import "./style.scss";

const JourneyCardList = ({
  allJourneys,
  showForm,
  getAllJourneyItems,
  getJourney,
}) => {

  const getJourneyDetails = (id) => {
    getJourney(id);
    getAllJourneyItems({id});
  };

  return (<div className="learning-journey-card-list">
    <div className="learning-journey-card-list__header">
      <h3>Learning journey list</h3>
      <CustomButton onClick={showForm} text="Create journey" size="sm" />
    </div>
    <div className="learning-journey-card-list__results">
      {
        allJourneys.map((item, key) => {
          return (<JourneyCard
            key={`card-${key}`}
            name={item.name}
            started={item.createdAt}
            categories={item.topics}
            progress={item.progress}
            onClick={() => { getJourneyDetails(item.id); }}
          />);
        })
      }
    </div>
  </div>);
};

JourneyCardList.propTypes = {
  allJourneys: PropTypes.array,
  showForm: PropTypes.func,
  getAllJourneyItems: PropTypes.func,
  getJourney: PropTypes.func,
};

JourneyCardList.defaultProps = {
  allJourneys: [],
  showForm: () => {},
  getAllJourneyItems: () => {},
  getJourney: () => {},
};

const mapStateToProps = (state, props) => ({ 
});

const mapDispatchToProps = {
  getAllJourneyItems,
  getJourney,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JourneyCardList);