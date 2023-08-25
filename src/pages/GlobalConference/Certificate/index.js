import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import moment from "moment";
import { CustomButton, CustomModal } from "components";
import { setLoading } from "redux/actions/home-actions";
import { getEvent } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";

import "./style.scss";

const Certificate = ({ visible, onCancel, sessionsUserJoined, user }) => {
  let duration = 0;

  if (sessionsUserJoined.length > 0) {
    for (let i = 0; i < sessionsUserJoined.length; i++) {
      const durationSession = moment.duration(
        moment(sessionsUserJoined[i].endTime).diff(
          sessionsUserJoined[i]?.startTime
        ),
        "milliseconds"
      );

      duration += durationSession;
    }

    duration = `${
      moment.duration(duration).asHours() < 1
        ? `${moment.duration(duration).asMinutes()} minutes`
        : `${moment.duration(duration).asHours()} hour${
            moment.duration(duration).asHours() > 1 ? "s" : ""
          }`
    }`;
  }

  const generateCertificate = async (option) => {
    setLoading(true);
    const domElement = document.getElementById("certificate-conference");
    const canvas = await html2canvas(domElement, { scale: 4 });

    const width = domElement.clientWidth;
    const height = domElement.clientHeight;

    const imgData = canvas.toDataURL("image/png");

    if (option === "pdf") {
      const pdf = new jsPdf({
        orientation: "landscape",
        format: [2000, (2000 / width) * height],
        unit: "px",
        hotfixes: ["px_scaling"],
        precision: 32,
      });

      pdf.addImage(
        imgData,
        "jpeg",
        0,
        0,
        2000,
        (2000 / width) * height,
        "",
        "SLOW"
      );
      return pdf.save("Certificate.pdf");
    }

    var link = document.createElement("a");
    link.download = "Certificate.png";
    link.href = imgData;
    link.click();

    setLoading(false);
  };

  return (
    <CustomModal visible={visible} title="" width={800} onCancel={onCancel}>
      <div className="certificate-conference">
        <div
          className="certificate-conference-wrapper"
          id="certificate-conference"
        >
          <div className="certificate">
            <div className="certificate-top">
              <div className="certificate-logo">
                <img src={ImgHHRLogo} alt="sidebar-logo" />
              </div>
              <h3 className="certificate-title">
                Hacking HR's Certificate of Participation
              </h3>
              <h1 className="certificate-username">{`${user.firstName} ${user.lastName}`}</h1>
            </div>
            <div className="certificate-center">
              <h5 className="certificate-text1 organizer">For Attending</h5>
              <h4 className="certificate-text2">
                The Hacking HR 2022 Global Online Conference
              </h4>
              <h5 className="certificate-text1 duration">{`Participation time: ${duration}`}</h5>
            </div>
            <div className="certificate-bottom">
              <div className="certificate-bottom-sign">
                <h5 className="certificate-text1 date">March 7 - 12, 2022</h5>
                <div className="certificate-divider" />
                <h5 className="certificate-text1">Date</h5>
              </div>
              <div className="certificate-bottom-image">
                <img src={ImgCertificateStamp} alt="certificate-img" />
              </div>
              <div className="certificate-bottom-sign">
                <div className="certificate-signature">
                  <img src={ImgSignature} alt="certificate-signature" />
                </div>
                <div className="certificate-divider" />
                <h5 className="certificate-text1 signature">
                  Founder at Hacking HR
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="certificate-conference-actions">
          <CustomButton
            id="print-button"
            text="Download Image"
            type="primary"
            className="downloadImgButton"
            size="lg"
            onClick={() => generateCertificate("img")}
          />
          {/* <CustomButton
            id="print-button"
            text="Download PDF"
            type="primary"
            size="lg"
            onClick={() => generateCertificate("pdf")}
          /> */}
        </div>
      </div>
    </CustomModal>
  );
};

Certificate.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
};

Certificate.defaultProps = {
  visible: false,
  onCancel: () => {},
};

const mapStateToProps = (state) => ({
  user: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  setLoading,
  getEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(Certificate);
