import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from "antd";

import FilterDrawer from "./FilterDrawer";
import { numberWithCommas } from "utils/format";
import {
  CustomSelect,
  LibraryCard,
  CustomButton,
  LibraryFilterPanel,
} from "components";
import Emitter from "services/emitter";
import { EVENT_TYPES, SETTINGS } from "enum";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  getMoreLibraries,
  searchLibraries,
} from "redux/actions/library-actions";
import { librarySelector } from "redux/selectors/librarySelector";

import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const SortOptions = SETTINGS.SORT_OPTIONS;

const LearningLibraryPage = ({
  userProfile,
  loading,
  countOfResults,
  currentPage,
  allLibraries,
  getMoreLibraries,
  searchLibraries,
}) => {
  const [sortValue, setSortValue] = useState(SortOptions[0].value);
  const [filters, setFilters] = useState({});
  const [meta, setMeta] = useState("");

  const onShowMore = () => {
    getMoreLibraries({
      ...filters,
      page: currentPage + 1,
      order: sortValue,
      meta,
    });
  };

  const planUpdate = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  const onFilterChange = (filters) => {
    searchLibraries({ ...filters, meta }, sortValue);
    setFilters(filters);
  };

  const onSortChange = (value) => {
    setSortValue(value);
    searchLibraries({ ...filters, meta }, value);
  };

  const onSearch = (value) => {
    searchLibraries(
      {
        ...filters,
        meta: value,
      },
      sortValue
    );
    setMeta(value);
  };

  useEffect(() => {
    searchLibraries({}, sortValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="learning-library-page"> 
      <LibraryFilterPanel onChange={onFilterChange} onSearch={onSearch} />
      <FilterDrawer onChange={onFilterChange} onSearch={setMeta} />
      <div className="search-results-container">
        <Row>
          <Col span={24}>
            <div className="search-results-container-mobile-header">
              <h3 className="filters-btn" onClick={showFilterPanel}>
                Filters
              </h3>
              <h3>{`${numberWithCommas(countOfResults)} result${
                countOfResults > 1 ? "s" : ""
              }`}</h3>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="search-results-container-header d-flex justify-between items-center">
              <h3>{`${numberWithCommas(countOfResults)} result${
                countOfResults > 1 ? "s" : ""
              }`}</h3>
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
        <div className="search-results-list">
          {allLibraries.map((item, index) => {
            let frequency = 0;
            if (item.meta && meta) {
              frequency = [...item.meta.toLowerCase().matchAll(meta)].length;
            }
            return (
              <LibraryCard
                key={index}
                data={item}
                onClickAccess={planUpdate}
                keyword={meta}
                frequency={frequency}
              />
            );
          })}
        </div>
        {currentPage * SETTINGS.MAX_SEARCH_ROW_NUM < countOfResults && (
          <div className="search-results-container-footer d-flex justify-center items-center">
            {loading && (
              <div className="learning-library-page-loading-more">
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

LearningLibraryPage.propTypes = {
  title: PropTypes.string,
};

LearningLibraryPage.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
  loading: librarySelector(state).loading,
  allLibraries: librarySelector(state).allLibraries,
  countOfResults: librarySelector(state).countOfResults,
  currentPage: librarySelector(state).currentPage,
});

const mapDispatchToProps = {
  getMoreLibraries,
  searchLibraries,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LearningLibraryPage);
