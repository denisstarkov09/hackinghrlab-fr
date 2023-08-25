import React from "react";
import PropTypes from "prop-types";

import { CustomDrawer } from "components";

import LibraryForm from "./LibraryForm";

const LibraryAddDrawer = ({ visible, type, edit, onAdded, onClose }) => {
  return (
    <CustomDrawer
      title={
        type === "article"
          ? `${edit ? "Edit" : "Add"} Resource`
          : `${edit ? "Edit" : "Add"} Video`
      }
      visible={visible}
      onClose={onClose}
    >
      <LibraryForm
        type={type}
        edit={edit}
        onAdded={onAdded}
        onCancel={onClose}
      />
    </CustomDrawer>
  );
};

LibraryAddDrawer.propTypes = {
  visible: PropTypes.bool,
  edit: PropTypes.bool,
  type: PropTypes.string,
  onAdded: PropTypes.func,
  onClose: PropTypes.func,
};

LibraryAddDrawer.defaultProps = {
  visible: false,
  edit: false,
  type: "",
  onAdded: () => {},
  onClose: () => {},
};

export default LibraryAddDrawer;
