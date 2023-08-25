import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import clsx from "clsx";
import { isEmpty } from "lodash";
import moment from "moment";

import { actions as skillCohortResourceActions } from "redux/actions/skillCohortResource-actions";

import { skillCohortResourceSelector } from "redux/selectors/skillCohortResourceSelector";

import "./style.scss";

const SkillCohortPanel = ({
  entireSkillCohortResources,
  skillCohortResource,
  getSkillCohortResource,
}) => {
  return (
    <div className="skill-cohort-resource-panel">
      <h2 className="font-regular">Resources</h2>
      <div className="skill-cohort-resource-panel-container">
        {!isEmpty(entireSkillCohortResources) &&
          entireSkillCohortResources.map((rsc) => (
            <div
              key={rsc.id}
              className={clsx("skill-cohort-resource-item", {
                active: rsc.id === skillCohortResource.id,
              })}
              onClick={() => getSkillCohortResource(rsc.id)}
            >
              <h5>{moment(rsc.releaseDate).format("LL")}</h5>
              <h5>{rsc.title}</h5>
            </div>
          ))}
      </div>
    </div>
  );
};

SkillCohortPanel.propTypes = {
  title: PropTypes.string,
};

SkillCohortPanel.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  ...skillCohortResourceSelector(state),
});

const mapStateToDispatch = {
  ...skillCohortResourceActions,
};

export default connect(mapStateToProps, mapStateToDispatch)(SkillCohortPanel);
