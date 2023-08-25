import React, { useEffect } from "react";
import { connect } from "react-redux";

import {
  getAllJourneys,
  addJourney,
  updateJourney,
  setShowForm,
} from "redux/actions/journey-actions";

import { journeySelector } from "redux/selectors/journeySelector";

import JourneyHomeMessage from "./Message";
import JourneyCardList from "./CardList";
import JourneyForm from "./Form";
import JourneyDetails from "./Details";

import "./style.scss";

const JourneyPage = ({
  getAllJourneys,
  addJourney,
  updateJourney,
  allJourneys,
  journey,
  setShowForm,
  showForm,
}) => {
  useEffect(() => {
    getAllJourneys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (data) => {
    if (journey == null) {
      addJourney(data);
    } else {
      updateJourney(journey.id, data);
    }
    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div
      className="learning-journey-page"
      style={{
        background: showForm === true || journey != null ? "#fff" : "none",
      }}
    >
      <div className="learning-journey-page--content">
        {showForm && (
          <JourneyForm
            key="form-journey"
            onSave={onFinish}
            onCancel={() => {
              closeForm();
            }}
          />
        )}
        {allJourneys.length === 0 && !showForm && journey == null && (
          <JourneyHomeMessage
            onClick={() => {
              setShowForm(true);
            }}
          />
        )}
        {allJourneys.length > 0 && !showForm && journey == null && (
          <JourneyCardList
            showForm={() => {
              setShowForm(true);
            }}
            allJourneys={allJourneys}
          />
        )}
        {journey != null && !showForm && (
          <JourneyDetails
            showForm={() => {
              setShowForm(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  allJourneys: journeySelector(state).allJourneys,
  journey: journeySelector(state).journey,
  showForm: journeySelector(state).showForm,
});

const mapDispatchToProps = {
  addJourney,
  updateJourney,
  getAllJourneys,
  setShowForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(JourneyPage);
