import React from "react";
import PropTypes from "prop-types";
import { Form, Checkbox, Slider } from "antd";

import { CustomCheckbox } from "components";

import "./style.scss";

const RecommendedAgendaForm = ({ step, allCategories }) => {
  return (
    <React.Fragment>
      {step === 0 && (
        <Form.Item
          label="Which topics interest you?"
          name="topics"
          rules={[
            {
              required: true,
              message: "Please select one!",
            },
          ]}
        >
          <Checkbox.Group className="d-flex flex-column form-recent-workarea">
            {allCategories.map((item) => (
              <CustomCheckbox key={item.id} value={item.value} size="sm">
                {item.title}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      )}
      {step === 1 && (
        <React.Fragment>
          <Form.Item
            label="How many hours do you have available for learning during conference week?"
            name="time"
            rules={[
              {
                required: true,
                message: "Please select one!",
              },
            ]}
          >
            <Slider
              min={0}
              max={56}
              tipFormatter={(value) => `${value} hours`}
              step={0.25}
            />
          </Form.Item>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

RecommendedAgendaForm.propTypes = {
  step: PropTypes.number,
};

RecommendedAgendaForm.defaultProps = {
  step: 0,
};

export default RecommendedAgendaForm;
