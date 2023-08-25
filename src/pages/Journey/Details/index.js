import React, { useState } from "react";
import PropTypes from "prop-types";
import { Switch, Progress } from "antd";
import { connect } from "react-redux";
import moment from "moment";

import { unsetJourney } from "redux/actions/journey-actions";
import {
  updateJourneyItem,
  getAllJourneyItems,
} from "redux/actions/journeyItem-actions";
import { journeySelector } from "redux/selectors/journeySelector";
import { journeyItemSelector } from "redux/selectors/journeyItemSelector";

import { CustomButton } from "components";
import JourneyDetailsCard from "./Card";
import { ReactComponent as IconArrowBackCircleOutline } from "images/icon-arrow-back-circle-outline.svg";
import { ReactComponent as IconDoubleCheckmark } from "images/icon-double-checkmark.svg";

import { getValidDescription } from "utils/format";

import "./style.scss";

const JourneyDetails = ({
  journey,
  allJourneyItems,
  unsetJourney,
  updateJourneyItem,
  getAllJourneyItems,
  showForm,
}) => {
  const [switchValue, setSwitchValue] = useState(false);
  const getDescription = (item) => {
    let description = "";

    if (item.contentType === "event") {
      description = getValidDescription({
        description: item.description ? JSON.parse(item.description) : null
      });
    } else {
      description = item.description;
    }

    return description;
  };

  const markAsViewed = (id) => {
    const data = {
      id,
      journeyId: journey.id,
      viewed: true,
      loadRemovedItems: switchValue,
    };
    updateJourneyItem(data);
  };

  const viewed = (id) => {
    const data = {
      id,
      journeyId: journey.id,
      viewed: false,
      loadRemovedItems: switchValue,
    };
    updateJourneyItem(data);
  };

  const remove = (id) => {
    const data = {
      id,
      journeyId: journey.id,
      removed: true,
      loadRemovedItems: switchValue,
    };
    updateJourneyItem(data);
  };

  const addItem = (id) => {
    const data = {
      id,
      journeyId: journey.id,
      removed: false,
      loadRemovedItems: switchValue,
    };
    updateJourneyItem(data);
  };

  const switchChange = (checked) => {
    setSwitchValue(checked);
    if (checked) {
      getAllJourneyItems({
        id: journey.id,
        removed: true,
      });
    } else {
      getAllJourneyItems({
        id: journey.id,
      });
    }
  };
  return (
    <div className="journey-details-container">
      <div className="journey-details-container__header">
        <div className="journey-details-container__header--back">
          <IconArrowBackCircleOutline
            onClick={() => {
              unsetJourney();
            }}
          />
          <h3>{journey ? journey.name : ""}</h3>
        </div>
        <div className="journey-details-container__header--progress">
          <span className="learning-details--progress">
            <span>
              <IconDoubleCheckmark />
              {journey.progress != null ? journey.progress : 0}
            </span>
            % completed
          </span>
          <Progress
            percent={journey.progress != null ? journey.progress : 0}
            size="small"
            showInfo={false}
            strokeColor="#438cef"
          />
        </div>
      </div>
      <div className="journey-details-container__actions">
        <CustomButton
          onClick={showForm}
          text="Edit journey"
          size="sm"
          type="primary outlined"
        />
        <div className="journey-details-container__actions--switch">
          View removed items{" "}
          <Switch
            onChange={(checked) => {
              switchChange(checked);
            }}
            unCheckedChildren="No"
            checkedChildren="Yes"
          />
        </div>
      </div>
      <div className="journey-details-container__date">
        <h4>Started: {moment(journey.createdAt).format("MMMM DD - YYYY")}</h4>
      </div>
      <div className="journey-details-container__list">
        {allJourneyItems.map((item) => {
          return (
            <JourneyDetailsCard
              key={`joruney-card-${item.id}`}
              element={item}
              description={getDescription(item)}
              markAsViewed={() => {
                markAsViewed(item.id);
              }}
              viewed={() => {
                viewed(item.id);
              }}
              remove={() => {
                remove(item.id);
              }}
              addItem={() => {
                addItem(item.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

JourneyDetails.propTypes = {
  journey: PropTypes.object,
  allJourneyItems: PropTypes.array,
  unsetJourney: PropTypes.func,
  updateJourneyItem: PropTypes.func,
  getAllJourneyItems: PropTypes.func,
  showForm: PropTypes.func,
};

JourneyDetails.defaultProps = {
  journey: null,
  allJourneyItems: [],
  unsetJourney: () => {},
  updateJourneyItem: () => {},
  getAllJourneyItems: () => {},
  showForm: () => {},
};

const mapStateToProps = (state, props) => ({
  journey: journeySelector(state).journey,
  allJourneyItems: journeyItemSelector(state).allJourneyItems,
});

const mapDispatchToProps = {
  unsetJourney,
  updateJourneyItem,
  getAllJourneyItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(JourneyDetails);
