import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { CustomCheckbox, CustomInput } from "components";

import "./style.scss";

const CreditSelect = ({ value, onChange }) => {
  const [credit, setCredit] = useState({
    HRCI: {
      selected: false,
      money: 0,
    },
    SHRM: {
      selected: false,
      money: 0,
    },
  });

  useEffect(() => {
    if (value) {
      const newCredit = {
        HRCI: {
          selected: (value.HRCI || {}).selected || false,
          money: parseInt((value.HRCI || {}).money, 10) || 0,
        },
        SHRM: {
          selected: (value.SHRM || {}).selected || false,
          money: parseInt((value.SHRM || {}).money, 10) || 0,
        },
      };
      setCredit(newCredit);
    }
  }, [value]);

  const onFieldChange = (field, innerField, value) => {
    setCredit((prev) => {
      prev[field][innerField] = value;
      onChange(prev);
      return { ...prev };
    });
  };

  return (
    <div className="credit-select">
      <div className="credit-select-option">
        <CustomCheckbox
          checked={credit.HRCI.selected}
          onChange={(e) => onFieldChange("HRCI", "selected", e.target.checked)}
        >
          HRCI
        </CustomCheckbox>
        {credit.HRCI.selected && (
          <React.Fragment>
            How many?
            <CustomInput
              size="xs"
              value={credit.HRCI.money}
              onChange={(value) => onFieldChange("HRCI", "money", value)}
            />
          </React.Fragment>
        )}
      </div>
      <div className="credit-select-option">
        <CustomCheckbox
          checked={credit.SHRM.selected}
          onChange={(e) => onFieldChange("SHRM", "selected", e.target.checked)}
        >
          SHRM
        </CustomCheckbox>
        {credit.SHRM.selected && (
          <React.Fragment>
            How many?
            <CustomInput
              size="xs"
              value={credit.SHRM.money}
              onChange={(value) => onFieldChange("SHRM", "money", value)}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

CreditSelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

CreditSelect.defaultProps = {
  onChange: () => {},
  value: {},
};

export default CreditSelect;
