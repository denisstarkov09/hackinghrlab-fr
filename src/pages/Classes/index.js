import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Row, Col } from "antd";
import Emitter from "services/emitter";
import {
  CustomSelect,
  PodcastFilterPanel as ClassesFilterPanel,
} from "components";

import { getAllCourses } from "redux/actions/course-actions";

import { courseSelector } from "redux/selectors/courseSelector";

import ClassCard from "./ClassCard";
import FilterDrawer from "./FilterDrawer";
import { SETTINGS, EVENT_TYPES } from "enum";

import "./style.scss";

const SortOptions = SETTINGS.SORT_OPTIONS;

const Classes = ({ getAllCourses, allCourses }) => {
  const [sortValue, setSortValue] = useState(SortOptions[0].value);
  const [orderValue, setOrderValue] = useState('["createdAt","DESC"]');
  const [filters, setFilters] = useState({});
  const [meta, setMeta] = useState("");

  useEffect(() => {
    getAllCourses({ order: orderValue });
    // eslint-disable-next-line
  }, []);

  const onSortChange = (value) => {
    setSortValue(value);
    let order = "";
    switch (value) {
      case "newest-first":
        order = '["createdAt","DESC"]';
        break;
      case "newest-last":
        order = '["createdAt","ASC"]';
        break;
      case "sort-name":
        order = '["title","ASC"]';
        break;
      default:
      // default
    }
    setOrderValue(order);
    getAllCourses({ ...filters, meta, order });
  };

  const onFilterChange = (filter) => {
    getAllCourses({ ...filter, meta, order: orderValue });
    setFilters(filter);
  };

  const onSearch = (value) => {
    getAllCourses({
      ...filters,
      meta: value,
      order: orderValue,
    });
    setMeta(value);
  };

  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  return (
    <div className="classes-page">
      <ClassesFilterPanel
        hidePodcastSeries
        onChange={onFilterChange}
        onSearch={onSearch}
      />
      <FilterDrawer onChange={onFilterChange} onSearch={setMeta} />
      <div className="classes-page__container">
        <div className="search-results-container">
          <Row>
            <Col span={24}>
              <div className="search-results-container-mobile-header">
                <h3
                  className="filters-btn"
                  onClick={() => {
                    showFilterPanel();
                  }}
                >
                  Filters
                </h3>
                <h3>
                  {allCourses.length} result{allCourses.length > 1 ? "s" : ""}
                </h3>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="search-results-container-header d-flex justify-between items-center">
                <h3>
                  {allCourses.length} result{allCourses.length > 1 ? "s" : ""}
                </h3>
                <CustomSelect
                  className="search-results-container-sort"
                  bordered={false}
                  options={SortOptions}
                  value={sortValue}
                  onChange={(value) => onSortChange(value)}
                />
              </div>
            </Col>
          </Row>
          <div className="classes-list">
            {allCourses.map((classItem) => (
              <ClassCard
                key={classItem.id}
                id={classItem.id}
                title={classItem.title}
                description={classItem.description}
                image={
                  classItem.image != null
                    ? classItem.image
                    : "https://lab-user-images.s3.us-east-2.amazonaws.com/library/1611980789047.jpeg"
                }
                hrCreditOffered={classItem.hrCreditOffered}
                categories={classItem.topics}
                duration={Number(classItem.duration)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  allCourses: courseSelector(state).allCourses,
});

const mapDispatchToProps = {
  getAllCourses,
};

export default connect(mapStateToProps, mapDispatchToProps)(Classes);
