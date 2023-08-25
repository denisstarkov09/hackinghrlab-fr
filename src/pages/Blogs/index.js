import React, {
  useEffect,
  // useState 
} from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import {
  // Col, 
  Pagination,
  // Row 
} from "antd";
import { blogPostSelector } from "redux/selectors/blogPostSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import {
  searchBlogPosts,
  setCurrentPage,
} from "redux/actions/blog-post-action";
// import BlogsFilterPanel from "./BlogsFilterPanel";
// import FilterDrawer from "./FilterDrawer";
// import Emitter from "services/emitter";
import BlogCard from "components/BlogCard";

import "./style.scss";
// import { EVENT_TYPES } from "enum";

const Blogs = ({
  blogsPosts,
  searchBlogPosts,
  currentPage,
  setCurrentPage,
  totalBlogPosts,
}) => {
  // const [filters, setFilters] = useState({});

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
    <div className="blogs-page">
      {/* <BlogsFilterPanel onChange={onFilterChange} /> */}
      {/* <FilterDrawer onChange={onFilterChange} /> */}

      <div className="blogs-page__container">
        <div className="search-results-container">
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
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Blogs);
