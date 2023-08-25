import React from "react";
import PropTypes from "prop-types";

import { CustomDrawer } from "components";

import EventAddEditForm from "./EventAddEditForm";

const EventAddEditDrawer = ({ visible, edit, onAdded, onClose }) => {
  return (
    <CustomDrawer
      title={`${edit ? "Edit" : "Add"} Event`}
      visible={visible}
      onClose={onClose}
    >
      <EventAddEditForm edit={edit} onAdded={onAdded} onCancel={onClose} />
    </CustomDrawer>
  );
};

EventAddEditDrawer.propTypes = {
  visible: PropTypes.bool,
  edit: PropTypes.bool,
  onAdded: PropTypes.func,
  onClose: PropTypes.func,
};

EventAddEditDrawer.defaultProps = {
  visible: false,
  edit: false,
  onAdded: () => {},
  onClose: () => {},
};

export default EventAddEditDrawer;
