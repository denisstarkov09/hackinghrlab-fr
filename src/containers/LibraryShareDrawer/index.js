import React from "react";
import { connect } from "react-redux";

import { CustomDrawer } from "components";
import { EVENT_TYPES } from "enum";
import Emitter from "services/emitter";

import LibraryShareForm from "./LibraryShareForm";

class LibraryShareDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    Emitter.on(EVENT_TYPES.OPEN_SHARE_CONTENT, () => {
      this.setState({ visible: true });
    });
  }

  onDrawerClose = () => {
     this.setState({...this.state, visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <CustomDrawer
        title="Share content"
        visible={visible}
        onClose={this.onDrawerClose}
      >
        <LibraryShareForm onCancel={this.onDrawerClose} />
      </CustomDrawer>
    );
  }
}

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryShareDrawer);
