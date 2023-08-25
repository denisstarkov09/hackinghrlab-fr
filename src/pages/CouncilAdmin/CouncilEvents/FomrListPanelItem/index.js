import React, { useEffect } from "react";
import { MinusCircleOutlined } from "@ant-design/icons";
import { DatePicker, Form, InputNumber, Checkbox } from "antd";
import { CustomInput, CustomCheckbox } from "components";

const EventTypes = [
  {
    text: "Presentation",
    value: "presentation",
  },
  {
    text: "Workshop",
    value: "workshop",
  },
  {
    text: "Panel",
    value: "panel",
  },
  {
    text: "Peer-to-Peer Conversation",
    value: "peer-to-peer",
  },
  {
    text: "Conference",
    value: "conference",
  },
];

const { RangePicker } = DatePicker;

const FormListPanelItem = ({
  restField,
  index,
  name,
  limit,
  numOfPanels,
  setNumOfPanels,
  remove,
  disableDate,
  panelsMemory,
  setPanelsMemory
}) => {

  useEffect(() => {
    if (index + 1 >= limit && panelsMemory < index + 1) {
      remove(name);

      if (numOfPanels > limit) {
        setNumOfPanels((state) => state - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, index, remove, name, numOfPanels, setNumOfPanels]);

  const saveNewDetail = () => {
    if(panelsMemory < index + 1){
      setPanelsMemory(index + 2)
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Form.Item {...restField}>
        <div className="add-panel-title">
          <h3>Panel #{index + 2}</h3>
          <MinusCircleOutlined
            onClick={() => {
              setNumOfPanels((state) => state - 1);
              remove(name);
            }}
          />
        </div>
      </Form.Item>
      <Form.Item
        {...restField}
        label="Panel name"
        name={[name, "panelName"]}
        rules={[{ required: true }]}
      >
        <CustomInput onChange={() => {saveNewDetail()}} />
      </Form.Item>
      <Form.Item
        {...restField}
        label="Start and End Date"
        name={[name, "panelStartAndEndDate"]}
        rules={[{ required: true }]}
      >
        <RangePicker
          showTime
          disabledDate={(date) => disableDate(date, true)}
          style={{ width: "100%" }}
          size="large"
          format="YYYY-MM-DD HH:mm"
          onChange={() => {saveNewDetail()}}
        />
      </Form.Item>
      <Form.Item
        {...restField}
        label="Number of panelists"
        name={[name, "numberOfPanelists"]}
        rules={[{ required: true }]}
      >
        <InputNumber size="large" min="1" style={{ width: "100%" }} onChange={() => {saveNewDetail()}} />
      </Form.Item>
      <Form.Item
        {...restField}
        label="Link to join each panel"
        name={[name, "linkToJoin"]}
        rules={[{ required: true, type: "url" }]}
      >
        <CustomInput onChange={() => {saveNewDetail()}}/>
      </Form.Item>
      <Form.Item {...restField} name={[name, "type"]} label="Type" rules={[{ required: true}]}>
        <Checkbox.Group className="d-flex flex-column event-edit-form-cbgrp">
          {EventTypes.map((type) => (
            <CustomCheckbox key={type.value} value={type.value}>
              {type.text}
            </CustomCheckbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </div>
  );
};

export default FormListPanelItem;
