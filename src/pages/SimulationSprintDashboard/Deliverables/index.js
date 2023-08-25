import React from "react";
import DeliverableCard from "./DeliverableCard";

const Deliverables = ({ deliverables }) => {
  return (
    <>
      {deliverables?.map((deliverable, i) => (
        <DeliverableCard
          key={deliverable.id}
          deliverable={deliverable}
          index={i}
        />
      ))}

      {deliverables?.map((deliverable, i) => (
        <DeliverableCard
          key={deliverable.id}
          deliverable={deliverable}
          index={i}
        />
      ))}
    </>
  );
};

export default Deliverables;
