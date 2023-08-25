import React, { useEffect, useState } from "react";
import { Space, Tooltip, Table } from "antd";
import moment from "moment-timezone";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { CustomButton } from "components";
import { EditOutlined } from "@ant-design/icons";

import AdvertisementDrawer from "containers/AdvertisementDrawer";
import MatchmakingDrawer from "containers/MatchmakingDrawer";
import AdvertisementPaymentModal from "containers/AdvertiserPaymentModal";

import {
  getAdvertisementsByAdvertiser,
  getAdvertisementsTodayByPage,
  getAllActiveAdvertisements,
} from "redux/actions/advertisment-actions";
import { advertisementSelector } from "redux/selectors/advertisementsSelector";

import { homeSelector } from "redux/selectors/homeSelector";

import "./styles.scss";

const Advertiser = ({
  getAdvertisementsByAdvertiser,
  advertisementsByAdvertiser,
  userProfile,
  createAdvertisement,
  getAllActiveAdvertisements,
}) => {
  const [visible, setVisible] = useState(false);
  const [matchmakingVisible, setMatchmakingVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [advertisement, setAdvertisement] = useState({});
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const handleEdit = (id) => {
    setIsEdit(true);

    const _advertisement = advertisementsByAdvertiser.find(
      (ad) => ad.id === id
    );

    setAdvertisement(_advertisement);
    setVisible(true);
  };

  const clearEditAndAdvertisement = () => {
    setIsEdit(false);
    setAdvertisement({});
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      width:100,
      render: (_, __, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Campaign Name",
      dataIndex: "title",
      key: "title",
      align: "center",
      width:250,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width:150,
    },
    {
      title: "Page",
      dataIndex: "page",
      key: "page",
      align: "center",
      width:150,
    },
    {
      title: "Impressions",
      dataIndex: "impressions",
      key: "impressions",
      width:150,
      align: "center",
      render: (_, data) => <div>{data.AdvertisementImpressions.length}</div>,
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width:150,
      align: "center",
      render: (_, data) => <div>{data.AdvertisementClicks.length}</div>,
    },
    {
      title: "Ad Link",
      dataIndex: "advertisementLink",
      key: "advertisementLink",
      width:200,
      align: "center",
      ellipsis: true,
      render: (text) => {
        return (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        );
      },
    },
    {
      title: "Ad Content Link",
      dataIndex: "adContentLink",
      key: "adContentLink",
      width:250,
      ellipsis: true,
      align: "center",
      render: (text) => {
        return (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        );
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width:200,
      align: "center",
      render: (text) => {
        return moment.tz(text, "America/Los_Angeles").format("LL");
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width:200,
      align: "center",
      render: (text) => {
        return moment.tz(text, "America/Los_Angeles").format("LL");
      },
    },
    {
      title: "Total credits",
      dataIndex: "adCostPerDay",
      key: "adCostPerDay",
      align: "center",
      width:200,
      render: (text, record) => {
        return (Number(text) * Number(record.adDurationByDays));
      },
    },
    {
      title: "Ad Campaign Days",
      dataIndex: "adDurationByDays",
      key: "adDurationByDays",
      align: "center",
      width:150,
    },
    {
      title: "Ad Preview Link",
      dataIndex: "adPreviewLink",
      key: "adPreviewLink",
      align:"center",
      ellipsis: true,
      width:300,
      render: (_, record) => {
        const url = `${process.env.REACT_APP_DOMAIN_URL}/ad/${record.page}/preview/${record.id}`;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 150,
      align: "center",
      render: (_, data) => {
        if (moment().isAfter(moment(data.startDate))) {
          return (
          <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title="Edit">
                <CustomButton
                  style={{ marginRight: "0.5rem", padding: "0 8px" }}
                  type="primary outlined"
                  size="xs"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(data.id)}
                  disabled={true}
                />
              </Tooltip>
            </div>);
        } else {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title="Edit">
                <CustomButton
                  style={{ marginRight: "0.5rem", padding: "0 8px" }}
                  type="primary outlined"
                  size="xs"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(data.id)}
                />
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (!isEmpty(userProfile) && userProfile.id) {
      getAdvertisementsByAdvertiser(userProfile.id);
    }

    getAllActiveAdvertisements();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  return (
    <div className="advertiser-dashboard-wrapper">
      <Space direction="vertical">
        <h3>{`Available Credits: ${
          userProfile.advertisementCredits || 0
        } Credits`}</h3>
        <Space>
          <CustomButton
            text="Buy credits"
            type="primary"
            onClick={() => setPaymentModalVisible(true)}
          />
          <CustomButton
            text="New campaign"
            type="primary outlined"
            onClick={() => setVisible(true)}
          />
        </Space>
      </Space>
      <div className="advertiser-content">
        <h3>How it works</h3>
        <p>
          You can create a marketing campaign that includes an image and link.
          This marketing campaign can be to promote an event, content, your
          company or anything you want. We have found that the most appealing
          marketing campaigns are those in which members are invited to join an
          event or access content, rather than just plain sales pitches.
        </p>
        <p>
          You can create a campaign lasting minimum one day and as long as you
          want. The marketing campaigns can be created for the Home, Events,
          ProjectX (General Information) and Conference Library pages, which are
          the most visited pages in the Hacking HR LAB.
        </p>
        <p>
          The amount of credits per marketing campaign depends on the duration
          of your campaign and the page in which you are posting the campaign
          (if you want to create a marketing campaign in separate pages you will
          have to create separate marketing campaigns).
        </p>
        <p>These are the credits required:</p>
        <p>
          <b>Home page</b>
        </p>
        <p>Less than 7 days: 7 credits per day</p>
        <p>Between 8 and 14 days: 6 credits per day</p>
        <p>Over 15 days: 5 credits per day</p>
        <p>
          <b>Conference Library</b>
        </p>
        <p>Less than 7 days: 7 credits per day</p>
        <p>Between 8 and 14 days: 6 credits per day</p>
        <p>Over 15 days: 5 credits per day</p>
        <p>
          <b>Events </b>
        </p>
        <p>Less than 7 days: 5 credits per day</p>
        <p>Between 8 and 14 days: 4 credits per day</p>
        <p>Over 15 days: 3 credits per day</p>
        <p>
          <b>ProjectX – General Information Tab</b>
        </p>
        <p>Less than 7 days: 5 credits per day</p>
        <p>Between 8 and 14 days: 4 credits per day</p>
        <p>Over 15 days: 3 credits per day</p>
      </div>
      <div className="advertiser-content">
        <h3>How much it cost</h3>
        <p>These are the credit packages:</p>
        <p>
          <b>Credit packages: </b>
        </p>
        <p>
          <b>
            10 credits = $150 | 20 credits = $260 | 30 credits = $360 | 50
            credits = $500
          </b>
        </p>
      </div>
      {/* <Space direction="vertical">
        <h3>Matchmaking</h3>
        <CustomButton
          text="Matchmaking"
          type="primary"
          onClick={() => setMatchmakingVisible(true)}
        />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Space> */}
      <Space direction="vertical" style={{ marginBottom: "1rem" }}>
        <h3>Campaigns</h3>
        <CustomButton
          text="New campaign"
          type="primary"
          onClick={() => setVisible(true)}
        />
      </Space>
      <Table
        dataSource={advertisementsByAdvertiser}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ y: 500, x: "100vw" }}
        style={{testAlign:"center"}}
      />
      <AdvertisementDrawer
        visible={visible}
        setVisible={setVisible}
        createAdvertisement={createAdvertisement}
        onDashboard={true}
        advertisement={advertisement}
        isEdit={isEdit}
        clearEditAndAdvertisement={clearEditAndAdvertisement}
      />
      <MatchmakingDrawer
        visible={matchmakingVisible}
        setVisible={setMatchmakingVisible}
      />
      <AdvertisementPaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        userProfile={userProfile}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...advertisementSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getAdvertisementsByAdvertiser,
  getAdvertisementsTodayByPage,
  getAllActiveAdvertisements,
};

export default connect(mapStateToProps, mapDispatchToProps)(Advertiser);
