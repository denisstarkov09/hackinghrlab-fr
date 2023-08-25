import React from "react";
import PropTypes from "prop-types";

import { CustomDrawer } from "components";

import PodcastForm from "./PodcastForm";

const PodcastDrawer = ({ visible, edit, podcast, onAdded, onClose }) => {
  return (
    <CustomDrawer
      title={`${edit ? "Edit" : "Add"} Podcast`}
      visible={visible}
      onClose={onClose}
    >
      <PodcastForm
        onAdded={onAdded}
        edit={edit}
        podcast={podcast}
        onCancel={onClose}
      />
    </CustomDrawer>
  );
};

PodcastDrawer.propTypes = {
  visible: PropTypes.bool,
  edit: PropTypes.bool,
  podcast: PropTypes.object,
  onAdded: PropTypes.func,
  onClose: PropTypes.func,
};

PodcastDrawer.defaultProps = {
  visible: false,
  edit: false,
  podcast: {},
  onAdded: () => {},
  onClose: () => {},
};

export default PodcastDrawer;
