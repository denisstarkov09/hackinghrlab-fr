import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { INTERNAL_LINKS } from "enum";
import { Menu, Space } from "antd";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import NoItemsMessageCard from "components/NoItemsMessageCard";

import {
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
} from "redux/actions/advertisment-actions";
import { 
  createControlCertificate
} from "redux/actions/certificate-ations";
import { advertisementSelector } from "redux/selectors/advertisementsSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { skillCohortSelector } from "redux/selectors/skillCohortSelector";
import { skillCohortParticipantSelector } from "redux/selectors/skillCohortParticipantSelector";

import { actions as skillCohortActions } from "redux/actions/skillCohort-actions";
import { actions as skillCohortParticipantActions } from "redux/actions/skillCohortParticipant-actions";

// import SkillCohortFilterDrawer from "./SkillCohortFilterDrawer";
import SkillCohortCard from "./SkillCohortCard";
import ActivityStatus from "./ActivityStatus";

import "./style.scss";

moment().tz("America/Los_Angeles").format();

const SkillCohort = ({
  allSkillCohorts,
  getAllSkillCohorts,
  userProfile,
  getAllParticipated,
  allParticipated,
  allOfMySkillCohorts,
  getAllOfMyCohort,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  advertisementsByPage,
  advertisementById,
  isAdPreview = false,
  createAdvertisementClick,
  createControlCertificate
}) => {
  useEffect(() => {
    getAllSkillCohorts([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedKeys, setSelectedKeys] = useState("general-information");
  const { id } = useParams();

  const location = useLocation();

  const parsed = qs.parse(location.search);

  useEffect(() => {
    if (userProfile.id) {
      getAllParticipated(userProfile.id);
      getAllOfMyCohort(userProfile.id);
    }
    // eslint-disable-next-line
  }, [userProfile]);

  useEffect(() => {
    if (isAdPreview) {
      getAdvertisementById(id);
    } else {
      getAdvertisementsTodayByPage("project-x");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setSelectedKeys(parsed.key || "general-information");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.history.replaceState(
      null,
      "Page",
      `${INTERNAL_LINKS.PROJECTX}?key=${selectedKeys}`
    );
  }, [selectedKeys]);

  const displayAds = (selectedKeys === undefined ||
    selectedKeys === "general-information") &&
    !isEmpty(advertisementsByPage["project-x"]) && (
      <div className="project-x-advertisement-wrapper">
        {advertisementsByPage["project-x"].map((advertisement) => {
          return (
            <div
              className="project-x-advertisement-wrapper-content"
              key={advertisement.id}
            >
              <div
                className="advertisement"
                onClick={() => {
                  createAdvertisementClick(advertisement.id);
                  window.open(advertisement.advertisementLink, "_blank");
                }}
              >
                <img
                  src={advertisement.adContentLink}
                  alt="advertisement"
                  className="advertisement-img"
                />
              </div>
            </div>
          );
        })}
      </div>
    );

  const displayPreviewAd = (selectedKeys === undefined ||
    selectedKeys === "0") &&
    isAdPreview && (
      <div className="project-x-advertisement-wrapper-preview">
        <div
          className="advertisement"
          onClick={() =>
            window.open(advertisementById.advertisementLink, "_blank")
          }
        >
          <img
            src={advertisementById.adContentLink}
            alt="advertisement"
            className="advertisement-img"
          />
        </div>
      </div>
    );

  // const handleFilterChange = (filter) => {
  //   getAllSkillCohorts(filter.category);
  // };

  const displaySkillCohorts = allSkillCohorts.map((skillCohort) => {
    
    const hasAccess = allParticipated.some((participant) => {
      return participant.SkillCohortId === skillCohort.id;
    });

    return (
      <SkillCohortCard
        key={skillCohort.id}
        skillCohort={skillCohort}
        hasAccess={hasAccess}
        createControlCertificate={createControlCertificate}
      />
    );
  })

  const kickedOutCohorts = allOfMySkillCohorts.filter(
    (cohort) => !cohort.hasAccess
  );

  const sortedAllOfMyActiveSkillCohorts = allOfMySkillCohorts
    .filter((cohort) => cohort.hasAccess)
    .sort((a, b) => {
      if (moment().isAfter(a.endDate) && moment().isBefore(b.endDate)) return 1;

      if (moment().isBefore(a.endDate) && moment().isAfter(b.endDate))
        return -1;

      return 0;
    });

  const displayMySkillCohorts = [
    ...sortedAllOfMyActiveSkillCohorts,
    ...kickedOutCohorts,
  ].map((skillCohort) => {
    return (
      <SkillCohortCard
        key={skillCohort.id}
        skillCohort={skillCohort}
        userProfile={userProfile}
        createControlCertificate={createControlCertificate}
      />
    );
  });

  const displayGeneralInformation = () => {
    return (
      <div className="display-general-information">
        <div className="information">
          <Space direction="vertical" size="large">
            <Space direction="vertical">
              <div>Hi {userProfile.firstName},</div>
              <div>Welcome to Hacking HR’s ProjectX!</div>
              <div>
                Thank you for checking out this page to find out more about one
                of our flagship learning programs.
              </div>
            </Space>
            <div>
              <Space direction="vertical">
                <h3>Project X</h3>
                <div>
                  ProjectX is a cohort-based, skill-focused learning program
                  designed to help you learn or improve your knowledge in the
                  specific cohort-skills. We do this through daily resources
                  that will help you learn and encourage you to reflect about
                  the lessons learned and how to apply them to your daily
                  professional work.
                </div>
              </Space>
            </div>
            <div>
              <Space direction="vertical">
                <h3>How it works</h3>
                <div>
                  This program is intense, but light touch: we will provide a
                  daily resource that you should be able to read, listen or
                  watch in less than 20 minutes.
                </div>
                <div>
                  After reading, listening or watching the resource, you will
                  provide a personal reflection about what you learned and how
                  you plan to apply the lessons learned.
                </div>
                <div>
                  This cohort program lasts 66 consecutive days (yes,
                  consecutive means every day, including weekends and any
                  holidays that fall in between). Each day, for 66 consecutive
                  days, you will receive via email and the cohort dashboard a
                  daily resource. You need to provide your daily reflection also
                  in the dashboard.
                </div>
                <div>
                  This approach to learning is fast, but also allows for lots of
                  flexibility. Reading/watching/listening to the daily resource
                  and providing your reflection won’t take more than 20-25
                  minutes per day… Hey, “excellence is a habit”… and we aim to
                  make light-touch learning a habit with discipline and
                  commitment.
                </div>
                <div>
                  The program relies on daily consistency and discipline.
                  Instead of bugging you with heavy daily resources, “self-pace”
                  learning program from which you disengage too soon or long
                  programs that lasts for hours and months, we only ask you for
                  20-25 minutes or less on a daily basis for 66 days. That’s it!
                </div>
              </Space>
            </div>
            <div>
              <Space direction="vertical">
                <h3>The Conditions</h3>
                <div>
                  Please note: you MUST complete all the requirements of the
                  program and the completion will be assessed weekly. If in any
                  given week you fail to complete two or more reflections,
                  unfortunately you will be removed from the program and won’t
                  be able to access the dashboard anymore and won’t receive the
                  learning resources either.
                </div>
                <div>We hope you join us! </div>
                <div>Thank you! </div>
              </Space>
            </div>
          </Space>
        </div>

        <div className="advertisements">
          {displayAds}
          {displayPreviewAd}
        </div>
      </div>
    );
  };

  return (
    <div className="skill-cohort-page">
      <div className="background-cohorts"></div>
      {/* <SkillCohortFilterDrawer onChange={handleFilterChange} /> */}
      <div className="skill-cohort-page-container">
        <Menu
          mode="horizontal"
          className="skill-cohort-page-container-menu"
          selectedKeys={selectedKeys}
        >
          <Menu.Item
            key="general-information"
            className="skill-cohort-page-container-menu-item"
            onClick={() => setSelectedKeys("general-information")}
          >
            General Information
          </Menu.Item>

          <Menu.Item
            key="upcoming-cohorts"
            className="skill-cohort-page-container-menu-item"
            onClick={() => setSelectedKeys("upcoming-cohorts")}
          >
            Upcoming Cohorts
          </Menu.Item>
          <Menu.Item
            key="my-cohorts"
            className="skill-cohort-page-container-menu-item"
            onClick={() => setSelectedKeys("my-cohorts")}
          >
            My Cohorts
          </Menu.Item>

          <Menu.Item
            key="activity-status"
            className="skill-cohort-page-container-menu-item"
            onClick={() => setSelectedKeys("activity-status")}
          >
            Activity Status
          </Menu.Item>
        </Menu>

        {selectedKeys === "general-information" ? (
          displayGeneralInformation()
        ) : selectedKeys === "upcoming-cohorts" ? (
          <div className="skill-cohort-list">{displaySkillCohorts}</div>
        ) : selectedKeys === "my-cohorts" ? (
          <div className="skill-cohort-list">{displayMySkillCohorts}</div>
        ) : (
          <ActivityStatus />
        )}

        {(selectedKeys === "upcoming-cohorts" && allSkillCohorts.length === 0) &&
          <NoItemsMessageCard
              message={`There are no ProjectX Cohorts open at this time. Please check again the last week of this month.`}
          />
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...skillCohortSelector(state),
  ...skillCohortParticipantSelector(state),
  userProfile: homeSelector(state).userProfile,
  ...advertisementSelector(state),
});

const mapDispatchToProps = {
  ...skillCohortActions,
  ...skillCohortParticipantActions,
  getAdvertisementsTodayByPage,
  getAdvertisementById,
  createAdvertisementClick,
  createControlCertificate
};

export default connect(mapStateToProps, mapDispatchToProps)(SkillCohort);
