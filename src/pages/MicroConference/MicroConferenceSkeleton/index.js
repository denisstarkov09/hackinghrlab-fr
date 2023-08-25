import React from "react";
import { Skeleton } from "antd";
import "./style.scss";

function MicroConferenceSkeleton() {
  return (
    <div className="micro-conference-skeleton__row">
      <div className="micro-conference-skeleton__col-1">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>

      <div className="micro-conference-skeleton__col-2">
        <Skeleton.Input
          active
          shape="round"
          style={{
            width: "100%",
            paddingTop: "56.25%",
          }}
        />
      </div>
    </div>
  );
}

export default MicroConferenceSkeleton;
