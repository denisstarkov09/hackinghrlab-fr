import React from "react";
import PropTypes from "prop-types";

import { Select, Tag } from "antd";

import "./style.scss";

const CategoriesSelect = ({ options, maxValues, ...rest }) => {
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    const selectedCategory = options.find((item) => item.value === value);

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {selectedCategory ? (
          <div className="category-select-tag">
            <h6>{selectedCategory.title}</h6>
          </div>
        ) : (
          label
        )}
      </Tag>
    );
  };

  return (
    <Select
      {...rest}
      className="category-select"
      mode="multiple"
      tagRender={tagRender}
      value={rest.value?.slice(0, maxValues)}
      filterOption={(inputValue, option) => {
        if (inputValue) {
          const selectedCategory = options.find(
            (item) => item.value === option.value
          );

          return (
            selectedCategory &&
            selectedCategory.value
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          );
        }

        return true;
      }}
    >
      {(options || []).map((categorie) => (
        <Select.Option
          className="category-select-option"
          key={categorie.id}
          value={categorie.value}
        >
          <h6 className="category-title">{categorie.title}</h6>
        </Select.Option>
      ))}
    </Select>
  );
};

CategoriesSelect.propTypes = {
  options: PropTypes.array,
  maxValues: PropTypes.number,
};

CategoriesSelect.defaultProps = {
  options: [],
  maxValues: 2,
};

export default CategoriesSelect;
