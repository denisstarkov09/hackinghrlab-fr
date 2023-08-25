import React, { Component } from "react";
import { connect } from "react-redux";
import { CustomButton, CustomInput } from "components";
import clsx from "clsx";
import { Modal } from 'antd'
import IconLogo from "images/logo-sidebar.svg";
import { CloseCircleFilled } from "@ant-design/icons";

import IconChevronDown from "images/icon-chevron-down.svg";

import { sendEmail } from "api/module/feedback";
import { authSelector } from "redux/selectors/authSelector";

import {
  verifySuscribedUser,
  suscriptionSendingBlue
} from "redux/actions/event-actions";

import "./style.scss";

class FeedbackBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: "",
      loadingMessage: "Sending...",
      heightFeedbackBox: "40px",
      rotateArrow: "rotate(0deg)",
      bulModal: false
    };
  }
  onChangeMessage(text) {
    this.setState({ message: text });
  }
  onSend() {
    this.setState(
      {
        loading: true,
      },
      async () => {
        let data = {
          message: this.state.message,
        };
        let result = await sendEmail(data);
        if (result.status === 200) {
          this.props.verifySuscribedUser((data) => {
            if (data) {
              this.setState({
                bulModal: true
              })
            }
          })
          this.setState(
            {
              message: "",
              loadingMessage: "Thank you!",
            },
            () => {
              setTimeout(() => {
                this.setState({
                  loading: false,
                  loadingMessage: "Sending...",
                });
              }, 500);
            }
          );
        }
      }
    );
  }
  changeHeightFeedbackBox() {
    if (this.state.heightFeedbackBox === "auto") {
      this.setState({
        heightFeedbackBox: "40px",
        rotateArrow: "rotate(180deg)",
      });
    } else {
      this.setState({ heightFeedbackBox: "auto", rotateArrow: "rotate(0deg)" });
    }
  }

  render() {
    return (
      <>
        {this.props.userId ? (
          <div
            className="feedback-box-container"
            style={{ height: this.state.heightFeedbackBox }}
          >
            <div
              className="feedback-box-container__header"
              onClick={() => {
                this.changeHeightFeedbackBox();
              }}
            >
              <h4>
                <img
                  src={IconChevronDown}
                  style={{ transform: this.state.rotateArrow }}
                  alt="icon-chevron"
                />{" "}
                Please Help Us Improve The LAB
              </h4>
            </div>
            <div className="feedback-box-container__container">
              <CustomInput
                className="feedback-box-container__container--textarea"
                multiple={true}
                value={this.state.message}
                onChange={(text) => {
                  this.onChangeMessage(text);
                }}
              ></CustomInput>
            </div>
            <div className="feedback-box-container__button">
              {this.state.loading ? (
                this.state.loadingMessage
              ) : (
                <CustomButton
                  text="Send"
                  type="primary"
                  size="sm"
                  className=""
                  onClick={() => {
                    this.onSend();
                  }}
                ></CustomButton>
              )}
            </div>
            <Modal
              className={clsx("custom-modal")}
              wrapClassName={clsx("custom-modal-wrap")}
              title={
                <div className="custom-modal-title">
                  <h3>Thank you for your inquiry or feedback.</h3>
                  <div className="custom-modal-logo">
                    <img src={IconLogo} alt="custom-logo" />
                  </div>
                </div>
              }
              centered
              onCancel={() => this.setState({ bulModal: false })}
              visible={this.state.bulModal}
              closable={true}
              footer={[]}
              width={"300px"}
              closeIcon={<CloseCircleFilled className="custom-modal-close" />}
            >
              <p>Please keep in mind that you must be subscribed to our email list to get further information in response to your inquiry or feedback (if applicable).</p>
              <div className="container-buttons">
                <CustomButton
                  key="Cancel"
                  text="Cancel"
                  type="third"
                  size="xs"
                  className="button-modal"
                  style={{ padding: "0px 10px", marginLeft: "10px" }}
                  onClick={() => { this.setState({ bulModal: false }) }}
                />
                <CustomButton
                  key="Subscribe to email list"
                  text="Subscribe to email list"
                  type="primary"
                  size="xs"
                  className="button-modal"
                  style={{ padding: "0px 10px", marginLeft: "10px" }}
                  onClick={() => {
                    this.props.suscriptionSendingBlue(() => {
                      this.setState({ bulModal: false })
                    })
                  }}
                />
              </div>
            </Modal>
          </div>
        ) : null}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  userId: authSelector(state).id,
});

const mapDispatchToProps = {
  verifySuscribedUser,
  suscriptionSendingBlue
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackBox);
