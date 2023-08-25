import httpClient from "./httpClient";

export const getEditorSignature = () => {
  return httpClient.get("public/env/editor");
};
