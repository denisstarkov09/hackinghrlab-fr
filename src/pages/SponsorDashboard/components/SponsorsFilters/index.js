import React, { useEffect, useState } from "react";
import { PROFILE_SETTINGS, COUNTRIES } from "enum";
import { CustomSelect } from "components";

const SponsorsFilters = ({
  allUsers,
  setUsers,
  setUsersGeneral,
  users,
  generalDemographics,
  conferenceDemographics,
  usersGeneral,
  tab,
}) => {
  const [filter, setFilter] = useState(0);
  const [prevValue, setPrevValue] = useState([]);
  const [externalFilter, setExternalFilter] = useState();
  const [prevFilter, setPrevFilter] = useState(0);
  const [prevGeneral, setPrevGeneral] = useState();
  const [prevConference, setPrevConference] = useState();

  const OrgSizes = PROFILE_SETTINGS.ORG_SIZES;
  const JobLevels = PROFILE_SETTINGS.JOB_LEVELS;
  const WorkAreas = PROFILE_SETTINGS.WORK_AREAS;
  const topics = PROFILE_SETTINGS.TOPICS;

  const handleExternalFilter = (value) => {
    const sizes = OrgSizes.filter((el) =>
      value.some((item) => item === el.value)
    );
    if (sizes.length > 0) {
      return "orgsize";
    }
    const jobLeves = JobLevels.filter((el) =>
      value.some((item) => item === el.value)
    );
    if (jobLeves.length > 0) {
      return "jobLevels";
    }
    const workAreas = WorkAreas.filter((el) =>
      value.some((item) => item === el.value)
    );
    if (workAreas > 0) {
      return "workAreas";
    }
    const topicos = topics.filter((el) =>
      value.some((item) => item === el.value)
    );
    if (topicos.length > 0) {
      return "topics";
    }
    const countries = COUNTRIES.filter((el) =>
      value.some((item) => item === el.value)
    );
    if (countries.length > 0) {
      return "countries";
    }
  };

  useEffect(() => {
    setUsers(allUsers.filter((item) => item.attendedToConference === 1));
    setUsersGeneral(
      allUsers.filter((item) => item.percentOfCompletion === 100)
    );
  }, [allUsers, setUsers, setUsersGeneral]);

  const handleFilter = (value) => {
    setExternalFilter(handleExternalFilter(value));
    if (value.length < 2) {
      const isValue = value.map((el) => prevValue?.includes(el));
      if (isValue[0] === false || isValue.length === 0) {
        setPrevValue((prev) => [...prev, ...value]);
      }
    }
    if (tab === "0") {
      setPrevGeneral(usersGeneral.length > 0 ? usersGeneral : prevGeneral);
      setPrevFilter(usersGeneral.length > 0 ? filter : prevFilter);
    } else {
      setPrevConference(users.length > 0 ? users : prevConference);
      setPrevFilter(users.length > 0 ? filter : prevFilter);
    }
    if (value.length < 1) {
      setFilter((prev) => prev - 1);
      setPrevValue(prevValue.splice(prevValue, 1));
      if (filter > 0 && filter - 1 === prevFilter) {
        if (tab === "0") {
          setUsersGeneral(prevGeneral);
        } else {
          setUsers(prevConference);
        }
      }
    } else {
      setFilter((prev) => prev + 1);
    }
    if (prevValue.length === 0 && filter !== 0) {
      if (tab === "0") {
        setUsersGeneral(generalDemographics);
      } else {
        setUsers(conferenceDemographics);
      }
    }
  };

  const onTopicsFilterChange = (value) => {
    if (tab === "0") {
      const general =
        usersGeneral.length > 0 && externalFilter !== "topics"
          ? usersGeneral.filter((item) =>
              item.topicsOfInterest.some((el) => value.includes(el))
            )
          : generalDemographics.filter((item) =>
              item.topicsOfInterest.some((el) => value.includes(el))
            );
      setUsersGeneral(general);
    } else {
      const conference =
        users.length > 0 && externalFilter !== "topics"
          ? users.filter((item) =>
              item.topicsOfInterest.some((el) => value.includes(el))
            )
          : conferenceDemographics.filter((item) =>
              item.topicsOfInterest.some((el) => value.includes(el))
            );

      setUsers(conference);
    }
    handleFilter(value);
  };

  const searchCountries = (value) => {
    if (tab === "0") {
      const general =
        usersGeneral.length > 0 && externalFilter !== "countries"
          ? usersGeneral.filter((item) =>
              value.some((el) => el === item.location)
            )
          : generalDemographics.filter((item) =>
              value.some((el) => el === item.location)
            );
      setUsersGeneral(general);
    } else {
      const conference =
        users.length > 0 && externalFilter !== "countries"
          ? users?.filter((item) => value.some((el) => el === item.location))
          : conferenceDemographics.filter((item) =>
              value.some((el) => el === item.location)
            );
      setUsers(conference);
    }
    handleFilter(value);
  };

  const sizeFilter = (value) => {
    if (tab === "0") {
      const general =
        usersGeneral.length > 0 && externalFilter !== "orgSize"
          ? usersGeneral.filter((item) =>
              value.includes(item.sizeOfOrganization)
            )
          : generalDemographics.filter((item) =>
              value.includes(item?.sizeOfOrganization)
            );
      setUsersGeneral(general);
    } else {
      const conference =
        users.length > 0 && externalFilter !== "orgSize"
          ? users.filter((item) => value.includes(item?.sizeOfOrganization))
          : conferenceDemographics.filter((item) =>
              value.includes(item?.sizeOfOrganization)
            );
      setUsers(conference);
    }
    handleFilter(value);
  };

  const jobLvlFilter = (value) => {
    if (tab === "0") {
      const general =
        usersGeneral.length > 0 && externalFilter !== "jobLevels"
          ? usersGeneral.filter((item) => value.includes(item?.recentJobLevel))
          : generalDemographics?.filter((item) =>
              value.includes(item?.recentJobLevel)
            );
      setUsersGeneral(general);
    } else {
      const conference =
        users.length > 0 && externalFilter !== "jobLevels"
          ? users?.filter((item) => value.includes(item?.recentJobLevel))
          : conferenceDemographics?.filter((item) =>
              value.includes(item?.recentJobLevel)
            );

      setUsers(conference);
    }
    handleFilter(value);
  };

  const workAreasFilter = (value) => {
    if (tab === "0") {
      const general =
        usersGeneral.length > 0 && externalFilter !== "workAreas"
          ? usersGeneral?.filter((item) =>
              item.recentWorkArea?.some((el) => value.includes(el))
            )
          : generalDemographics?.filter((item) =>
              item.recentWorkArea?.some((el) => value.includes(el))
            );
      setUsersGeneral(general);
    } else {
      const conference =
        users.length > 0 && externalFilter !== "workAreas"
          ? users?.filter((item) =>
              item.recentWorkArea?.some((el) => value.includes(el))
            )
          : conferenceDemographics?.filter((item) =>
              item.recentWorkArea?.some((el) => value.includes(el))
            );

      setUsers(conference);
    }
    handleFilter(value);
  };

  return (
    <div className="filters-container">
      <div className="filter-item">
        <h4>Topics</h4>
        <CustomSelect
          options={topics}
          bordered
          mode="multiple"
          onChange={onTopicsFilterChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </div>
      <div className="filter-item">
        <h4>Countries</h4>
        <CustomSelect
          options={COUNTRIES}
          bordered
          showSearch
          mode="multiple"
          onChange={searchCountries}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </div>
      <div className="filter-item">
        <h4>Size of the organization</h4>
        <CustomSelect
          options={OrgSizes}
          bordered
          mode="multiple"
          onChange={sizeFilter}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </div>
      <div className="filter-item">
        <h4>Recent job level</h4>
        <CustomSelect
          options={JobLevels}
          bordered
          mode="multiple"
          onChange={jobLvlFilter}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </div>
      <div className="filter-item">
        <h4>Recently worked</h4>
        <CustomSelect
          options={WorkAreas}
          bordered
          mode="multiple"
          onChange={workAreasFilter}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </div>
    </div>
  );
};

export default SponsorsFilters;
