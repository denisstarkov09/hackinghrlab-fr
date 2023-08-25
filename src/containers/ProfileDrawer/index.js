import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CustomDrawer } from "components";
import { EVENT_TYPES } from "enum";
import Emitter from "services/emitter";
import { updateUser } from "redux/actions/home-actions";

import ProfileEditPanel from "./ProfileEditPanel";
import ProfileViewPanel from "./ProfileViewPanel";

import { homeSelector } from "redux/selectors/homeSelector";

class ProfileDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      edit: false,
    };
  }

  componentDidMount() {
    Emitter.on(EVENT_TYPES.EVENT_VIEW_PROFILE, (edit) => {
      this.setState({ visible: true, edit: !!edit });
    });
  }

  onDrawerClose = () => {
    this.setState({ visible: false, edit: false });
  };

  onEdit = () => {
    this.setState({ edit: true });
  };

  onSave = (userInfo) => {
    this.props.updateUser(userInfo);
    this.setState({ edit: false });
  };

  render() {
    const { visible, edit } = this.state;
    const { userProfile: user } = this.props;

    return (
      <CustomDrawer
        title={edit ? "Edit profile" : "Profile"}
        visible={visible}
        onClose={this.onDrawerClose}
      >
        {edit && (
          <ProfileEditPanel
            user={user}
            onSave={this.onSave}
            onCancel={() => this.setState({ edit: false })}
          />
        )}
        {!edit && <ProfileViewPanel user={user} onEdit={this.onEdit} />}
      </CustomDrawer>
    );
  }
}

ProfileDrawer.propTypes = {
  title: PropTypes.string,
};

ProfileDrawer.defaultProps = {
  title: "",
};

const mapStateToProps = (state, props) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDrawer);
