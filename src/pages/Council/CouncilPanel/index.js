import React, { useState } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import clsx from "clsx";
import moment from "moment-timezone";
import { Select } from "antd";

import { CustomButton } from "components";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import { actions as councilConversation } from "redux/actions/councilConversation-actions";
import { councilConversationSelector } from "redux/selectors/councilConversationSelector";

import CouncilConversationDrawer from "containers/CouncilConversationDrawer";
import "./style.scss";

const Option = Select;

const FilterPanel = ({
  title,
  allCategories,
  onChange,
  councilConversations,
  councilConversation,
  getCouncilConversation,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onFilterChange = (values) => {
    onChange(values);
  };

  return (
    <div className="council-conversation-filter-panel">
      <CustomButton
        className="council-conversation-filter-panel-share"
        text="Add conversation"
        size="md"
        type="primary"
        onClick={() => setIsDrawerOpen(true)}
      />
      <div style={{ margin: "1rem 2rem" }}>
        <h2 className="font-regular">{title}</h2>
      </div>
      <div className="search-filter">
        <h5 className="search-filter-title font-bold">Topics</h5>
        <Select
          allowClear
          mode="multiple"
          size="large"
          style={{ width: "100%" }}
          onChange={onFilterChange}
        >
          {allCategories.map((item) => (
            <Option key={`option-${item.value}`} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
      </div>
      <div className="council-conversation-filter-panel-content">
        {!isEmpty(councilConversations) &&
          councilConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={clsx("council-conversation-item", {
                active: conversation.id === councilConversation?.id,
              })}
              onClick={() => getCouncilConversation(conversation.id)}
            >
              <h5>{moment(conversation.createdAt).format("LL")}</h5>
              <h5>{conversation.title}</h5>
            </div>
          ))}
      </div>
      <CouncilConversationDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...councilConversationSelector(state),
  userProfile: homeSelector(state).userProfile,
  allCategories: categorySelector(state).categories,
});

const mapDispatchToProps = {
  ...councilConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
