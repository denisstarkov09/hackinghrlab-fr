import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { CustomModal, CustomCheckbox, CustomButton } from "components";

import "./style.scss";

const PodcastClaimModal = ({ data, onClaim, ...rest }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [rest.visible]);

  return (
    <CustomModal width={500} maskClosable={false} {...rest}>
      <div className="podcast-claim-modal">
        <p>
          Thank you for joining the Podcast Series:{" "}
          <strong>{data.title}</strong>
        </p>
        <p>
          Please check the box below to receive your Hacking HR Certificate and
          the HR Recertification Credits. This is the attestation that you
          watched or listened to the podcasts of this podcast series.
        </p>
        <p>
          Notice that you can be audited by SHRM or HRCI based on their
          regulations. You will receive an email confirming your participation
          in the Podcast Series. The email will contain the Hacking HR
          Certificate as an attachment and the SHRM and HRCI recertification
          codes. Please save that email.
        </p>
        <CustomCheckbox
          size="sm"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        >
          Confirm here
        </CustomCheckbox>
        <div className="podcast-claim-modal-footer">
          <CustomButton
            disabled={!checked}
            text="Confirm"
            size="md"
            onClick={onClaim}
          />
        </div>
      </div>
    </CustomModal>
  );
};

PodcastClaimModal.propTypes = {
  data: PropTypes.object,
  onClaim: PropTypes.func,
};

PodcastClaimModal.defaultProps = {
  data: {},
  onClaim: () => {},
};

export default PodcastClaimModal;
