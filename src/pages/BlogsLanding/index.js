import React, {
  useEffect, useState,
  // useState 
} from "react";
import { connect } from "react-redux";
import {
  // Col, 
  Pagination,
  // Row ,
  Modal
} from "antd";
import { blogPostSelector } from "redux/selectors/blogPostSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import {
  searchBlogPosts,
  setCurrentPage,
} from "redux/actions/blog-post-action";
import { useHistory } from "react-router-dom";
import Login from "../Login2";
import moment from "moment-timezone";
// import BlogsFilterPanel from "./BlogsFilterPanel";
// import FilterDrawer from "./FilterDrawer";
// import Emitter from "services/emitter";
import BlogCard from "components/BlogCard";

import "./style.scss";
import { INTERNAL_LINKS } from "enum";

const BlogsLanding = ({
  blogsPosts,
  searchBlogPosts,
  currentPage,
  setCurrentPage,
  totalBlogPosts,
}) => {
  // const [filters, setFilters] = useState({});
  const [bulModal, setBulModal] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [idBlog, setIdBlog] = useState(-1)

  const history = useHistory();

  // const onFilterChange = (filter) => {
  //   setFilters(filter);
  // };

  const handlePaginate = (value) => {
    setCurrentPage(value);
  };

  // const showFilterPanel = () => {
  //   Emitter.emit(EVENT_TYPES.OPEN_BLOGS_POST_FILTER_PANEL);
  // };

  useEffect(() => {
    if (redirect) {
      setRedirect(false)
      history.push(`${INTERNAL_LINKS.BLOGS}/${idBlog}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect])

  useEffect(() => {
    searchBlogPosts({}, currentPage);
  }, [searchBlogPosts, currentPage]);

  const orderBlogPostConfirm = (blogs) => {

    let arrayOrderTime = blogs.sort((a, b) => {

      let aTime = moment(a.createdAt, "YYYYMMDDHHmm").format("YYYYMMDDHHmm")
      let bTime = moment(b.createdAt, "YYYYMMDDHHmm").format("YYYYMMDDHHmm")

      return Number(bTime) - Number(aTime)

    })

    return arrayOrderTime
  }

  return (
    <div className="blogs-page-2">
      {/* <BlogsFilterPanel onChange={onFilterChange} /> */}
      {/* <FilterDrawer onChange={onFilterChange} /> */}

      <div className="blogs-page__container">
        <div className="search-results-container">
          <div className="container-father">
            {/* <Row>
              <Col span={24}>
                <div className="search-results-container-mobile-header">
                  <h3 className="filters-btn" onClick={() => showFilterPanel()}>
                    Filters
                  </h3>
                </div>
              </Col>
            </Row> */}

            <div className="blogs-list">
              {orderBlogPostConfirm(blogsPosts
                ?.filter((blogPost) => blogPost.status === "published"))
                ?.map((blogPost) => (
                  <BlogCard
                    data={blogPost}
                    key={blogPost.id}
                    id={blogPost.id}
                    image={blogPost.imageUrl}
                    date={blogPost.createdAt}
                    title={blogPost.title}
                    summary={blogPost.summary}
                    categories={blogPost.categories}
                    onAdd={(idD) => {
                      if (localStorage.getItem("community") === null) {
                        setIdBlog(idD)
                        setBulModal(true)
                      } else {
                        history.push(`${INTERNAL_LINKS.BLOGS}/${idD}`)
                      }
                    }}
                  />
                ))}
            </div>

            <div className="blogs-pagination">
              <Pagination
                defaultPageSize={20}
                defaultCurrent={1}
                current={currentPage}
                pageSize={20}
                showSizeChanger={false}
                pageSizeOptions={[]}
                total={totalBlogPosts > 0 ? totalBlogPosts : totalBlogPosts + 1}
                onChange={(value) => handlePaginate(value)}
              />
            </div>
          </div>
          <div className="container-space"></div>
        </div>
      </div>
      <Modal
        visible={bulModal}
        footer={null}
        width={400}
        bodyStyle={{ overflow: "auto", padding: "20px" }}
        className="modal-container-login"
        onCancel={() => setBulModal(false)}
      >
        <Login
          login={true}
          signup={false}
          type={'ladingPague'}
          history={null}
          confirm={() => {
            setTimeout(() => {
              setRedirect(true)
            }, 100);
          }}
          match={{ params: {} }}
          modal={setBulModal}
          onClose={() => setBulModal(false)}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  currentPage: blogPostSelector(state).currentPage,
  blogsPosts: blogPostSelector(state).blogsPosts,
  totalBlogPosts: blogPostSelector(state).totalBlogPosts,
});

const mapDispatchToProps = {
  searchBlogPosts,
  setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogsLanding);
