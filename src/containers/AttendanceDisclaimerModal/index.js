import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import clsx from "clsx";

import { CustomModal, CustomButton, CustomInput } from "components";
import { envSelector } from "redux/selectors/envSelector";
import { updateEventStatus } from "redux/actions/event-actions";
import Emitter from "services/emitter";
import { Form } from "antd";

import { EVENT_TYPES } from "enum";

import "./style.scss";

const Text = `
  By clicking on "Yes, I Confirm", you are certifying that you actually participated in the event.
`;

const AttendanceDisclaimerModal = ({ isMobile, updateEventStatus }) => {
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState({});
  const [codeValid, setCodeValid] = useState({
    validateStatus: "success",
    help: "",
  });

  Emitter.on(EVENT_TYPES.OPEN_ATTENDANCE_DISCLAIMER, (data) => {
    setVisible(true);
    setEvent(data);
  });

  const onFinish = (values) => {
    if (values.code !== event.code) {
      setCodeValid({
        validateStatus: "error",
        help: "Invalid code",
      });
      return;
    }
    setVisible(false);
    updateEventStatus(event, "confirmed");
  };

  const onValuesChange = (values) => {
    if (values.code) {
      setCodeValid({
        validateStatus: "success",
        help: "",
      });
    } else {
      setCodeValid({
        validateStatus: "error",
        help: "Please enter your code.",
      });
    }
  };

  return (
    <CustomModal
      wrapClassName="attendance-confirm-modal-wrap"
      title="Attendance disclaimer"
      subTitle="Must accept to continue"
      visible={visible}
      width={430}
      onCancel={() => setVisible(false)}
    >
      <div className={clsx("attendance-disclaimer", { mobile: isMobile })}>
        <p className="attendance-disclaimer-content">{Text}</p>
        <Form
          className="attendance-disclaimer-form"
          name="basic"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            name="code"
            label="Code"
            validateStatus={codeValid.validateStatus}
            help={codeValid.help}
          >
            <CustomInput size="sm" />
          </Form.Item>
          <div className="attendance-disclaimer-footer">
            <CustomButton
              text="Yes, I confirm"
              type="primary"
              size="md"
              htmlType="submit"
            />
          </div>
        </Form>
      </div>
    </CustomModal>
  );
};

AttendanceDisclaimerModal.propTypes = {
  visible: PropTypes.bool,
};

AttendanceDisclaimerModal.defaultProps = {
  visible: false,
};

const mapStateToProps = (state) => ({
  isMobile: envSelector(state).isMobile,
});

const mapDispatchToProps = {
  updateEventStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendanceDisclaimerModal);
