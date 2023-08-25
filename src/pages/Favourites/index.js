import React, { useState } from "react";
import PropTypes from "prop-types";

import { LibraryCard, CustomButton } from "components";

import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const Library = {
  title: "How to improve your soft skills",
  image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  description:
    "Praesent eu dolor eu orci vehicula euismod. Vivamus sed sollicitudin libero, vel malesuada velit. Nullam et maximus lorem. Suspendisse maximus dolor quis el malesuada velit sollicitudin vehicula sollicitudin libero vel malesuada velit",
  article: 1,
};

const LibraryData = Array.from(Array(12).keys()).map((item) => ({
  id: item,
  ...Library,
}));

const FavouritesPage = () => {
  const [data, setData] = useState(LibraryData);
  const [loading, setLoading] = useState(false);

  const onShowMore = () => {
    setLoading(true);
    setTimeout(() => {
      setData([...data, ...LibraryData]);
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="favourites-page">
      <div className="favourites-page-list">
        {data.map((item, index) => (
          <LibraryCard key={index} data={item} />
        ))}
      </div>
      <div className="d-flex justify-center items-center">
        {loading && <img src={IconLoadingMore} alt="loading-more-img" />}
        {!loading && (
          <CustomButton
            text="Show more"
            type="primary outlined"
            size="lg"
            onClick={onShowMore}
          />
        )}
      </div>
    </div>
  );
};

FavouritesPage.propTypes = {
  title: PropTypes.string,
};

FavouritesPage.defaultProps = {
  title: "",
};

export default FavouritesPage;
