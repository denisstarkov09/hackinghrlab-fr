import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";

const SEO = (...seo) => {

  const [metaTags, setMetaTags] = useState(undefined)
  const [data, setData] = useState(undefined)
  const [defaultSeo, setDefaultSeo] = useState({})
  const newSeo = seo[0];
  let location = useLocation();

  useEffect(() => {
    setData(newSeo.data)

    let currentUrl = window.location.origin + location.pathname;
    let quote = newSeo.quote !== undefined ? newSeo.quote : "";
    let title = newSeo.title !== undefined ? newSeo.title : "Hacking HR";
    let metaTitle = newSeo.title !== undefined ? newSeo.title : "Hacking HR";
    let metaDescription =
      newSeo.description !== undefined
        ? newSeo.description
        : "We are a community of business and HR leaders, HR practitioners, technologists, entrepreneurs, consultants.";
    let image =
      newSeo.image !== undefined
        ? newSeo.image
        : "images/img-certificate-logo.svg";
    let description =
      newSeo.description !== undefined
        ? newSeo.description
        : "We are a community of business and HR leaders, HR practitioners, technologists, entrepreneurs, consultants.";
    let hashtag = newSeo.hashtag !== undefined ? newSeo.hashtag : "#hackinglab"; // Merge default and page-specific SEO values
    setDefaultSeo({
      currentUrl,
      quote,
      title,
      image,
      description,
      hashtag,
      metaTitle,
      metaDescription,
    })

    setMetaTags(getMetaTags())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setData, newSeo])

  const getMetaTags = () => {
    const fullSeo = { ...defaultSeo };
    const tags = [];

    if (fullSeo.metaTitle) {
      tags.push(
        {
          property: "og:title",
          content: fullSeo.metaTitle,
        },
        {
          name: "twitter:title",
          content: fullSeo.metaTitle,
        },
        { property: "og:url", content: fullSeo.currentUrl },
        { property: "twitter:url", content: fullSeo.currentUrl }
      );
    }
    if (fullSeo.metaDescription) {
      tags.push(
        {
          name: "description",
          content: fullSeo.metaDescription,
        },
        {
          property: "og:description",
          content: fullSeo.metaDescription,
        },
        {
          name: "twitter:description",
          content: fullSeo.metaDescription,
        }
      );
    }
    if (fullSeo.image) {
      tags.push(
        {
          name: "image",
          content: fullSeo.image,
        },
        {
          property: "og:image",
          content: fullSeo.image,
        },
        {
          name: "twitter:image",
          content: fullSeo.image,
        }
      );
    }
    if (fullSeo.article) {
      tags.push({
        property: "og:type",
        content: "article",
      });
    }
    tags.push({ name: "twitter:card", content: "summary_large_image" });

    return tags;
  };

  // const metaTags = getMetaTags();

  return (
    <Helmet
      title={defaultSeo.metaTitle}
      titleTemplate={`%s | Hacking HR LAB`}
      link={[
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Staatliches",
        },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/css/uikit.min.css",
        },
      ]}
      script={[
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/js/uikit.min.js",
        },
        {
          src: "https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/js/uikit-icons.min.js",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/js/uikit.js",
        },
      ]}
      meta={metaTags}
    >
      {/* {data?.metadata && <head dangerouslySetInnerHTML={data?.metadata}></head>} */}
    </Helmet>
  );
};

export default SEO;

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
};

SEO.defaultseo = {
  title: null,
  description: null,
  image: null,
  article: false,
};
