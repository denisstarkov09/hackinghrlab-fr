import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import moment from "moment";
import converter from "number-to-words";
import isEmpty from "lodash/isEmpty";

import { CustomButton } from "components";
import { setLoading } from "redux/actions/home-actions";
import { getEvent } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { eventSelector } from "redux/selectors/eventSelector";
import { INTERNAL_LINKS } from "enum";

import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";

import "./style.scss";

const CertificatePage = ({
  user,
  updatedEvent,
  getEvent,
  match,
  setLoading,
  history,
}) => {
  const downloadPdf = async () => {
    setLoading(true);
    const domElement = document.getElementById("certificate-panel");
    const canvas = await html2canvas(domElement, { scale: 4 });

    const width = domElement.clientWidth;
    const height = domElement.clientHeight;

    const imgData = canvas.toDataURL("image/png");
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
    pdf.save("certificate.pdf");
    setLoading(false);
  };

  const getPerodOfEvent = (startDate, endDate) => {
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));

    return duration.asHours();
  };

  useEffect(() => {
    const {
      params: { id: eventId },
    } = match;
    getEvent(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !isEmpty(user) &&
      user.id &&
      !isEmpty(updatedEvent) &&
      updatedEvent.id
    ) {
      let allow = false;
      if (
        user.events &&
        user.events.includes(updatedEvent.id) &&
        updatedEvent.users.includes(user.id) &&
        updatedEvent.status === "confirmed"
      ) {
        allow = true;
      }

      if (!allow) {
        history.push(INTERNAL_LINKS.LANDING_PAGUE);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, updatedEvent]);

  const period = getPerodOfEvent(updatedEvent.startDate, updatedEvent.endDate);

  return (
    <div className="certificate-page">
      <div className="certificate-page-wrapper" id="certificate-panel">
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
            <h5 className="certificate-text1 organizer">
              {`For Attending ${updatedEvent.organizer} Session:`}
            </h5>
            <h4 className="certificate-text2">{updatedEvent.title}</h4>
            <h5 className="certificate-text1 duration">{`Duration: ${converter.toWords(
              period
            )} Hour${period > 1 ? "s" : ""}`}</h5>
          </div>
          <div className="certificate-bottom">
            <div className="certificate-bottom-sign">
              <h5 className="certificate-text1 date">{`${moment(
                updatedEvent.startDate
              ).format("MMMM DD, YYYY")}`}</h5>
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
      <div className="certificate-page-actions">
        <CustomButton
          id="print-button"
          text="Download PDF"
          type="primary"
          size="lg"
          onClick={downloadPdf}
        />
      </div>
    </div>
  );
};

CertificatePage.propTypes = {
  title: PropTypes.string,
};

CertificatePage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  user: homeSelector(state).userProfile,
  updatedEvent: eventSelector(state).updatedEvent,
});

const mapDispatchToProps = {
  setLoading,
  getEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(CertificatePage);
