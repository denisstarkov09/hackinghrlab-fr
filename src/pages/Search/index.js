import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Empty, List, Pagination, Skeleton } from "antd";
import {
  searchUser,
  setVisibleProfileUser,
  setUserShow,
  setSearchedUsers,
} from "redux/actions/home-actions";
import { createConversartion } from "redux/actions/conversation-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import { CustomButton, CustomSelect } from "components";
import { COUNTRIES, PROFILE_SETTINGS } from "enum";
import "./style.scss";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 5",
  },
  {
    title: "Ant Design Title 6",
  },
  {
    title: "Ant Design Title 7",
  },
  {
    title: "Ant Design Title 8",
  },
  {
    title: "Ant Design Title 9",
  },
];

const SearchPage = ({
  searchedUsers,
  userProfile,
  searchUser,
  setUserShow,
  setVisibleProfileUser,
  createConversartion,
  allCategories,
  totalUsers,
  inputUserSearchValue,
  setSearchedUsers,
  loadingSearchUsers,
}) => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    searchUser({
      recentJobLevel: userProfile.recentJobLevel,
      titleProfessions: userProfile.titleProfessions,
      location: userProfile.location,
      topicsOfInterest: userProfile.topicsOfInterest,
      sizeOfOrganization: userProfile.sizeOfOrganization,
      offset: (currentPage - 1) * 50,
    });
  }, [currentPage, searchUser, userProfile]);

  const handleStartConversation = (members) => {
    createConversartion(members);
  };

  const handleFilters = (field, values) => {

    const newFilter = {
      ...filters,
      [field]: typeof values !== 'string' ?  JSON.stringify(values) : values,
    };

    if (values.length === 0) {
      delete newFilter[field];
    }
    setFilters(newFilter);
    setSearchedUsers([]);
    searchUser({
      search: inputUserSearchValue,
      ...newFilter,
      offset: (currentPage - 1) * 50,
    });
  };

  const handlePaginate = (value) => {
    setCurrentPage(value);
    setSearchedUsers([]);
    searchUser({
      search: inputUserSearchValue,
      ...filters,
      offset: (currentPage - 1) * 50,
    });
  };

  return (
    <div className="search">
      <div className="search-filters">
        <CustomSelect
          bordered={true}
          mode="multiple"
          options={COUNTRIES}
          placeholder={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="ant-select-selection-item"
                style={{ background: "none", border: "none" }}
              >
                Countries
              </span>

              <span className="ant-select-arrow">
                <i className="fal fa-angle-down" />
              </span>
            </div>
          }
          onChange={(value) => handleFilters("location", value)}
          showSearch
          optionFilterProp="location"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
        <CustomSelect
          bordered={true}
          mode="multiple"
          placeholder={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="ant-select-selection-item"
                style={{ background: "none", border: "none" }}
              >
                Job Levels
              </span>

              <span className="ant-select-arrow">
                <i className="fal fa-angle-down" />
              </span>
            </div>
          }
          options={PROFILE_SETTINGS.JOB_LEVELS}
          onChange={(value) => handleFilters("recentJobLevel", value)}
        />
        <CustomSelect
          mode="multiple"
          placeholder={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="ant-select-selection-item"
                style={{ background: "none", border: "none" }}
              >
                Topics
              </span>

              <span className="ant-select-arrow">
                <i className="fal fa-angle-down" />
              </span>
            </div>
          }
          bordered={true}
          options={allCategories}
          onChange={(value) => handleFilters("topicsOfInterest", value)}
        />

        <CustomSelect
          bordered={true}
          mode="multiple"
          placeholder={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="ant-select-selection-item"
                style={{ background: "none", border: "none" }}
              >
                Organization Size
              </span>

              <span className="ant-select-arrow">
                <i className="fal fa-angle-down" />
              </span>
            </div>
          }
          options={PROFILE_SETTINGS.ORG_SIZES}
          onChange={(value) => handleFilters("sizeOfOrganization", value)}
        />

        <CustomSelect
          bordered={true}
          placeholder={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8
              }}
            >
              <span
                className="ant-select-selection-item"
                style={{ background: "none", border: "none" }}
              >
                Type User
              </span>

              <span className="ant-select-arrow">
                <i className="fal fa-angle-down" />
              </span>
            </div>
          }
          options={[
            {
              label: "Online",
              value: "online",
            },
            {
              label: "All",
              value: "all",
            },
          ]}
          onChange={(value) => handleFilters("typeUser", value)}
        />
      </div>
      <div className="search-container">
        {!loadingSearchUsers && searchedUsers.length === 0 ? (
          <Empty description="No results found" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={searchedUsers.length === 0 ? data : searchedUsers}
            renderItem={(user) => (
              <List.Item key={user.id}>
                <Skeleton loading={loadingSearchUsers} active avatar>
                  <List.Item.Meta
                    avatar={
                      user.img ? (
                        <div
                        className={`${user.isOnline === true ? "avatar-container" : ""}`}
                      >
                        <Avatar
                          size={30}
                          src={user.img}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        </div>
                      ) : (
                        <div
                        className={`${user.isOnline === true ? "avatar-container" : ""}`}
                      >
                        <Avatar size={30}>{user.abbrName}</Avatar>
                        </div>
                      )
                    }
                    title={
                      <h5>
                        {" "}
                        {user.firstName} {user.lastName}
                      </h5>
                    }
                    description={user.titleProfessions}
                    onClick={() => {
                      setUserShow(user);
                      setVisibleProfileUser(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />

                  {userProfile.id !== user.id && (
                    <CustomButton
                      type="primary"
                      size="sm"
                      text={`Chat`}
                      onClick={() =>
                        handleStartConversation([user.id, userProfile.id])
                      }
                    />
                  )}
                </Skeleton>
              </List.Item>
            )}
          />
        )}
      </div>

      <div className="search-pagination">
        <Pagination
          defaultPageSize={50}
          defaultCurrent={1}
          current={currentPage}
          pageSize={50}
          showSizeChanger={false}
          pageSizeOptions={[]}
          total={totalUsers > 0 ? totalUsers : totalUsers + 1}
          onChange={(value) => handlePaginate(value)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchedUsers: homeSelector(state).searchedUsers,
  userProfile: homeSelector(state).userProfile,
  totalUsers: homeSelector(state).totalUsers,
  allCategories: categorySelector(state).categories,
  inputUserSearchValue: homeSelector(state).inputUserSearchValue,
  loadingSearchUsers: homeSelector(state).loadingSearchUsers,
});

const mapDispatchToProps = {
  searchUser,
  setUserShow,
  setVisibleProfileUser,
  createConversartion,
  setSearchedUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
