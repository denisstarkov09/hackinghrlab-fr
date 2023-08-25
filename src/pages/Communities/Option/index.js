import React from "react";
import { Image } from "antd";
import { useHistory } from "react-router-dom";

const CommunityOption = ({ title, subTitle, image, coomingSoon, link }) => {
  const history = useHistory();

  return (
    <div
      className="communitites-option"
      onClick={() => (link ? history.push(link) : {})}
    >
      <Image preview={false} src={image} width={200} height={200} />
      <h1>{title}</h1>
      {subTitle && <h2>{subTitle}</h2>}
      {coomingSoon && <h2>{coomingSoon}</h2>}
    </div>
  );
};

export default CommunityOption;
