import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CustomModal from "../../Modal";
import CustomCheckbox from "../../Checkbox";
import CustomButton from "../../Button";

import "./style.scss";

const LibraryClaimModal = ({ data, onClaim, ...rest }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [rest.visible]);

  return (
    <CustomModal width={500} maskClosable={false} {...rest}>
      <div className="library-claim-modal">
        <p>
          Thank you for joining the library: <strong>{data.title}</strong>
        </p>
        <p>
          Please check the box below to receive your HR Recertification Credits.
          This is the attestation that you watched, listened or read the content
          piece.
        </p>
        <p>
          Notice that you can be audited by SHRM or HRCI based on their
          regulations. You will receive an email confirming your attestation.
          The email will contain the SHRM and HRCI recertification codes. Please
          save that email.
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

LibraryClaimModal.propTypes = {
  data: PropTypes.object,
  onClaim: PropTypes.func,
};

LibraryClaimModal.defaultProps = {
  data: {},
  onClaim: () => {},
};

export default LibraryClaimModal;
