import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FroalaEditor from "react-froala-wysiwyg";

import "froala-editor/js/froala_editor.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/char_counter.min.js";
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/fullscreen.min";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/quick_insert.min.js";
import "froala-editor/js/plugins/url.min.js";
import "froala-editor/js/plugins/video.min.js";

import "./style.scss";

const FroalaEdit = ({
  s3Hash,
  value,
  onChange,
  additionalConfig,
  className,
  ...rest
}) => {
  const [editorConfig, setEditorConfig] = useState({});
  const [htmlNote, setHtmlNote] = useState("");

  const handleChange = (html) => {
    setHtmlNote(html);
    onChange({ html });
  };

  useEffect(() => {
    setHtmlNote(value ? value.html || "" : "");
  }, [value]);

  useEffect(() => {
    setEditorConfig({
      key: process.env.REACT_APP_FROALA_EDITOR_KEY,
      attribution: false,
      charCounterCount: false,
      imageUploadToS3: s3Hash,
    });
  }, [s3Hash]);

  return editorConfig.imageUploadToS3 && editorConfig.imageUploadToS3.bucket ? (
    <FroalaEditor
      className="froala-editor"
      config={{ ...editorConfig, ...additionalConfig }}
      tag="textarea"
      model={htmlNote}
      onModelChange={handleChange}
      {...rest}
    />
  ) : null;
};

FroalaEdit.propTypes = {
  s3Hash: PropTypes.object,
  value: PropTypes.object,
  onChange: PropTypes.func,
  additionalConfig: PropTypes.object,
};

FroalaEdit.defaultProps = {
  s3Hash: {},
  value: {},
  onChange: () => {},
  additionalConfig: {},
};

export default FroalaEdit;
