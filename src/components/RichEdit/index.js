import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichEdit = ({ data, readOnly, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (state) => {
    setEditorState(state);
    onChange(convertToRaw(editorState.getCurrentContent()));
  };

  useEffect(() => {
    if (data && data.blocks) {
      const content = convertFromRaw(data);
      const newEditorState = EditorState.createWithContent(content);
      setEditorState(newEditorState);
    }
  }, [data]);

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="rich-edit-toolbar"
      wrapperClassName="rich-edit-wrapper"
      editorClassName="rich-edit-editor"
      toolbarHidden={readOnly}
      readOnly={readOnly}
      onEditorStateChange={onEditorStateChange}
    />
  );
};

RichEdit.propTypes = {
  data: PropTypes.object,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

RichEdit.defaultProps = {
  data: EditorState.createEmpty(),
  readOnly: true,
  onChange: () => {},
};

export default RichEdit;
