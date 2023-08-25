import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form, Checkbox, Radio } from "antd";

import {
  CustomInput,
  CustomCheckbox,
  CustomRadio,
  // CustomSelect,
  CustomButton,
  ImageUpload,
  UploadResumeModal,
} from "components";
import { SEARCH_FILTERS } from "enum";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { addLibrary } from "redux/actions/library-actions";
import { createCouncilResource } from "redux/actions/council-actions";
import {
  createBusinessPartnerResource,
  createBusinessPartnerDocument,
  updateBusinessPartnerResource,
  getBusinessPartnerResourceById,
} from "redux/actions/business-partner-actions";
import { librarySelector } from "redux/selectors/librarySelector";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";
import { useLocation } from "react-router-dom";
import { businessPartnerSelector } from "redux/selectors/businessPartnerSelector";

const SearchFilters = SEARCH_FILTERS.library;
// const Languages = LANGUAGES.ParsedLanguageData;

const LibraryShareForm = ({
  allCategories,
  onCancel,
  addLibrary,
  createCouncilResource,
  createBusinessPartnerResource,
  updateBusinessPartnerResource,
  createBusinessPartnerDocument,
  getBusinessPartnerResourceById,
  businessPartnerResource,
}) => {
  const history = useHistory();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [file, setFile] = useState();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const isCouncil = document.location.href.includes("council");
  const tab = query.get("tab");
  const edit = query.get("edit");
  const id = query.get("id");
  const isBusinessPartner =
    document.location.href.includes("business-partner") && tab === "2";
  const businessPartner = document.location.href.includes("business-partner");
  const formControl = useRef(null);
  useEffect(() => {
    if (id) {
      history.replace({
        pathname: window.location.pathname,
        search: `tab=1&edit=true&id=${id}`,
      });
    }
    getBusinessPartnerResourceById(id);
  }, [id, getBusinessPartnerResourceById, history]);

  useEffect(() => {
    businessPartnerResource &&
      formControl.current.setFieldsValue({ ...businessPartnerResource });
  }, [businessPartnerResource]);

  const onFinish = async (values) => {
    if (isCouncil) {
      onCancel();
      return createCouncilResource(values);
    } else if (businessPartner && tab === "2") {
      onCancel();
      createBusinessPartnerDocument({ values, file });
    } else if (businessPartner && tab === "1") {
      if (edit === "true") {
        history.replace({
          pathname: window.location.pathname,
          search: `tab=1`,
        });
        onCancel();
        return updateBusinessPartnerResource({id, ...values});
      }
      onCancel();
      return createBusinessPartnerResource(values);
    }
    onCancel();
    addLibrary(values);
  };
  const onFinishFailed = () => {};
  return (
    <div className="library-share-form">
      <h1 className="library-share-form-title">
        {isBusinessPartner
          ? "Share resources with your fellow HR Business Partners"
          : "Suggest new content to HHR community"}
        {/* Share Resource With Your Experts Council Peers */}
      </h1>
      {/* <h3 className="library-share-form-desc">
        Contribute with new content to the community. The content will be
        reviewed and analyzed by the lead member of HHR community. Thanks for
        sharing, we will let you know if your content is selected.
        </h3> */}
      <Form
        className="library-form"
        layout="vertical"
        name="basic"
        ref={formControl}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="title" label="Title">
          <CustomInput />
        </Form.Item>
        {isBusinessPartner || (
          <Form.Item name="link" label="URL">
            <CustomInput addonBefore="https://" />
          </Form.Item>
        )}
        <Form.Item name="description" label="Description">
          <CustomInput multiple={true} />
        </Form.Item>
        <Form.Item
          name={isBusinessPartner ? "categories" : "topics"}
          label={
            isBusinessPartner ? "Categories" : "What are the content topics?"
          }
        >
          <Checkbox.Group className="d-flex flex-column library-form-topics">
            {allCategories.map((topic, index) => (
              <CustomCheckbox key={index} value={topic.value}>
                {topic.title}
              </CustomCheckbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        {isBusinessPartner || (
          <Form.Item name="contentType" label="What is the content type?">
            <Radio.Group className="library-form-types">
              {SearchFilters["Content type"].map((type, index) => (
                <CustomRadio key={index} value={type.value}>
                  {type.text}
                </CustomRadio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}
        {isCouncil || isBusinessPartner ? (
          ""
        ) : (
          <Form.Item name="image" label="Upload image">
            <ImageUpload aspect={400 / 152} />
          </Form.Item>
        )}
        {/* <Form.Item name="language" label="Main language">
          <CustomSelect
            showSearch
            options={Languages}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item> */}
        {isBusinessPartner && (
          <Form.Item>
            <CustomButton
              size="xs"
              text="Upload file"
              onClick={() => setShowResumeModal(true)}
            />
            <UploadResumeModal
              visible={showResumeModal}
              onClose={() => setShowResumeModal(false)}
              setFile={setFile}
            />
          </Form.Item>
        )}
        <div className="library-share-form-footer">
          <CustomButton
            text="Cancel"
            type="third outlined"
            size="lg"
            onClick={onCancel}
          />
          <CustomButton
            htmlType="submit"
            text="Submit"
            type="secondary"
            size="lg"
          />
        </div>
      </Form>
    </div>
  );
};

LibraryShareForm.propTypes = {
  onCancel: PropTypes.func,
};

LibraryShareForm.defaultProps = {
  onCancel: () => {},
};

const mapStateToProps = (state) => ({
  allLibraries: librarySelector(state).allLibraries,
  allCategories: categorySelector(state).categories,
  businessPartnerResource:
    businessPartnerSelector(state).businessPartnerResource,
});

const mapDispatchToProps = {
  addLibrary,
  createCouncilResource,
  createBusinessPartnerResource,
  createBusinessPartnerDocument,
  updateBusinessPartnerResource,
  getBusinessPartnerResourceById,
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryShareForm);
