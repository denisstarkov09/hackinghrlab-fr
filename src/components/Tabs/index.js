import React, {useState} from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import clsx from "clsx";

import "./style.scss";

const { TabPane } = Tabs;

const TabData = [
  {
    title: "Upcoming events",
    content: () => <div>Content 1</div>,
  },
  {
    title: "My events",
    content: () => <div>Content 2</div>,
  },
];

const CustomTabs = ({ current, className, data, onChange, functionClass, ...rest }) => {

  const [classCouncilTap, setClassCouncilTap] = useState("")

  const onTabChange = (tab) => {

    if(tab === "2" && data[2].title === "Council Members"){
      if(functionClass !== undefined){
        functionClass("search-results-container-members");
      }
      setClassCouncilTap("custom-tabs-tabpane")
    }else{
      if(functionClass !== undefined){
        functionClass("search-results-container");
      }
      setClassCouncilTap("")
    }

    onChange(tab);
  };

  return (
    <Tabs
      {...rest}
      className={clsx("custom-tabs", className)}
      activeKey={current}
      onChange={onTabChange}
    >
      {data.map((tab, index) => (
        <TabPane
          className={classCouncilTap}
          tab={tab.title}
          key={index.toString()}
          // style={{ minHeight: "100vh", background: "red" }}
        >
          {tab.content()}
        </TabPane>
      ))}
    </Tabs>
  );
};

CustomTabs.propTypes = {
  current: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.array,
  onChange: PropTypes.func,
};

CustomTabs.defaultProps = {
  current: "0",
  className: "",
  data: TabData,
  onChange: () => {},
};

export default CustomTabs;
