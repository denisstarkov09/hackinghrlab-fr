import React, { useEffect } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Collapse } from "antd";
import moment from "moment-timezone";
import { useHistory } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";
import clsx from "clsx";

import { actions as skillCohortActions } from "redux/actions/skillCohort-actions";

import { homeSelector } from "redux/selectors/homeSelector";
import { skillCohortSelector } from "redux/selectors/skillCohortSelector";

import "./style.scss";

const { Panel } = Collapse;

const ActivityStatus = ({
  getAllOfMyCohort,
  userProfile,
  allOfMySkillCohorts,
}) => {
  const history = useHistory();

  useEffect(() => {
    if (!isEmpty(userProfile)) {
      getAllOfMyCohort(userProfile.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleClickLink = (cohort, resource, hasAccess) => {
    if (!hasAccess) {
      history.push(`${INTERNAL_LINKS.PROJECTX}/${cohort.id}`);
    } else {
      history.push(
        `${INTERNAL_LINKS.PROJECTX}/${cohort.id}/resources?key=2&id=${resource.id}`
      );
    }
  };

  const activity = (cohort, index) => {
    return (
      <Panel header={cohort.title} key={`${index}`}>
        <Collapse bordered={false}>
          {cohort.SkillCohortResources.sort(
            (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
          )
            .filter((resource) =>
              moment(resource.releaseDate).isBefore(moment())
            )
            .map((resource, resourceIndex) => {
              const countPersonalReflection =
                cohort.SkillCohortResourceResponses.filter(
                  (response) =>
                    response.SkillCohortResourceId === resource.id &&
                    response.SkillCohortParticipantId === cohort.ParticipantId
                );

              const displayPersonalReflection =
                countPersonalReflection.length >= 1 ? "COMPLETED" : "PENDING";

              // const countAssessments =
              //   cohort.SkillCohortResponseAssessments.filter(
              //     (response) =>
              //       response.SkillCohortResourceId === resource.id &&
              //       response.SkillCohortParticipantId === cohort.ParticipantId
              //   );

              // const displayComments =
              //   countAssessments.length >= 1 ? "COMPLETED" : "PENDING";

              const header = (
                <div className="header">
                  <span className="header-content">{`${moment(
                    resource.releaseDate
                  ).format("LL")}:`}</span>
                  <span
                    onClick={() =>
                      handleClickLink(cohort, resource, cohort.hasAccess)
                    }
                    style={{ color: "#0000EE" }}
                    className="header-content"
                  >
                    {resource.title}
                  </span>
                  <div
                    className={clsx(
                      {
                        "green-dot": countPersonalReflection.length >= 1,
                        // &&
                        // countAssessments.length >= 1
                        "red-dot": countPersonalReflection.length === 0,
                        // ||
                        // countAssessments.length === 0
                      },
                      "header-content"
                    )}
                  ></div>
                  <div>
                    {countPersonalReflection.length >= 1
                      ? // &&
                        // countAssessments.length >= 1
                        "ACTIVITIES COMPLETED"
                      : "PENDING ACTIVITIES"}
                  </div>
                </div>
              );

              return (
                <Panel header={header} key={resourceIndex}>
                  <div className="resource-panel">
                    <div>Personal REFLECTION: {displayPersonalReflection}</div>
                    {/* <div>
                      Comment's on one more participant's reflection:{" "}
                      {displayComments}
                    </div> */}
                  </div>
                </Panel>
              );
            })}
        </Collapse>
      </Panel>
    );
  };

  const displayHasAccessCohorts = allOfMySkillCohorts
    .filter(
      (cohort) => cohort.hasAccess && moment().isBefore(moment(cohort.endDate))
    )
    .map((cohort, index) => activity(cohort, index));

  const displayPastAndCohorts = allOfMySkillCohorts
    .filter(
      (cohort) => !cohort.hasAccess || moment().isAfter(moment(cohort.endDate))
    )
    .map((cohort, index) => activity(cohort, index));

  return (
    <div className="activity-status-wrapper">
      <div className="activity-status-content">
        <div style={{ marginBottom: "1rem" }}>
          <h1>Active Cohorts</h1>
        </div>
        <Collapse>{displayHasAccessCohorts}</Collapse>
      </div>
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <h1>Past Cohorts</h1>
        </div>
        <Collapse>{displayPastAndCohorts}</Collapse>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...skillCohortSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...skillCohortActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityStatus);

// export default ActivityStatus
