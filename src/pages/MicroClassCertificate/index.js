import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import moment from "moment";
import isEmpty from "lodash/isEmpty";

import { CustomButton } from "components";
import { setLoading } from "redux/actions/home-actions";
import { getCourse } from "redux/actions/course-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { courseSelector } from "redux/selectors/courseSelector";
import { INTERNAL_LINKS } from "enum";

import ImgCertificateStamp from "images/img-certificate-stamp.png";
import ImgHHRLogo from "images/img-certificate-logo.png";
import ImgSignature from "images/img-signature.png";

import "./style.scss";

const MicroClassCertificatePage = ({
  user,
  match,
  setLoading,
  history,
  getCourse,
  course,
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
    pdf.save(`${course.title} Certificate.pdf`);
    setLoading(false);
  };

  useEffect(() => {
    getCourse(match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !isEmpty(user) &&
      user.id &&
      !isEmpty(course)
    ) {
      let allow = false;

      if (course.finished === true) {
        allow = true;
      }

      if (!allow) {
        history.push(INTERNAL_LINKS.LANDING_PAGUE);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="certificate-page">
      { course.finished === true ? <>
        <div className="certificate-page-wrapper" id="certificate-panel">
          <div className="certificate">
            <div className="certificate-top">
              <div className="certificate-logo">
                <img src={ImgHHRLogo} alt="sidebar-logo" />
              </div>
              <h3 className="certificate-title">
                Hacking HR Presents This Certificate of Participation To
            </h3>
              <h1 className="certificate-username">{`${user.firstName} ${user.lastName}`}</h1>
            </div>
            <div className="certificate-center">
              <h5 className="certificate-text1 organizer">
                For participating in Hacking HR’s Micro-Class
            </h5>
              <h4 className="certificate-text2">{course.title}</h4>
            </div>
            <div className="certificate-bottom">
              <div className="certificate-bottom-sign">
                <h5 className="certificate-text1 date">{`${moment(course.finishDate).format("MMMM DD, YYYY")}`}</h5>
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
                  HHR director signature
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
      </>
      : history.push(INTERNAL_LINKS.LANDING_PAGUE)
      }
    </div>
  );
};

MicroClassCertificatePage.propTypes = {
  title: PropTypes.string,
};

MicroClassCertificatePage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  user: homeSelector(state).userProfile,
  course: courseSelector(state).course,
});

const mapDispatchToProps = {
  setLoading,
  getCourse,
};

export default connect(mapStateToProps, mapDispatchToProps)(MicroClassCertificatePage);
