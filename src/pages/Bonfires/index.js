import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { notification, Menu } from "antd";
import qs from "query-string";
import moment from "moment";
import { bonfireSelector } from "redux/selectors/bonfireSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { categorySelector } from "redux/selectors/categorySelector";
import {
  getBonfires,
  updateBonfire,
  createBonfire,
  deleteBonfire,
} from "redux/actions/bonfire-actions";
import { addBonfire, removeBonfire } from "redux/actions/home-actions";
import { setLoading } from "redux/actions/home-actions";
import { BonfireCard, CustomButton } from "components";
import { EVENT_TYPES, INTERNAL_LINKS, TIMEZONE_LIST } from "enum";
import { convertToLocalTime } from "utils/format";
import CreateBonfireModal from "./createBonfireModal";
import BonfiresFilterPanel from "./BonfiresFilterPanel";

import "./style.scss";
import Emitter from "services/emitter";
import FilterDrawer from "./FilterDrawer";
import { downloadCsvWithParticipants } from "api";
import GeneralInformation from "./GeneralInformation";

const BonfiresPage = ({
  getBonfires,
  addBonfire,
  removeBonfire,
  deleteBonfire,
  createBonfire,
  updateBonfire,
  bonfires,
  userProfile,
}) => {
  const [bonfiresData, setBonfiresData] = useState([]);
  const [bonfireToEdit, setBonfireToEdit] = useState(null);
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);
  const [firewallText, setFirewallText] = useState("");
  const [selectedKeys, setSelectedKeys] = useState("general-information");
  const [filters, setFilters] = useState({});

  const location = useLocation();

  const parsed = qs.parse(location.search);

  const onFilterChange = (filter) => {
    setFilters(filter);
  };

  const onAddBonfire = (bonfire) => {
    if (userProfile.percentOfCompletion !== 100) {
      setFirewallText("You need to have your profile complete to access");
      return setShowFirewall(true);
    }

    addBonfire({ ...bonfire, userTimezone: moment.tz.guess() });
  };

  const onRemoveBonfire = (bonfire) => {
    removeBonfire(bonfire);
  };

  const onEditBonfire = (bonfire) => {
    setBonfireToEdit({
      ...bonfire,
      time: moment(bonfire.startTime),
    });
    setModalFormVisible(true);
  };

  const onCancelModalForm = () => {
    setModalFormVisible(false);
    setBonfireToEdit(null);
  };

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const completeProfile = () => {
    Emitter.emit(EVENT_TYPES.EVENT_VIEW_PROFILE);
  };
  const showFilterPanel = () => {
    Emitter.emit(EVENT_TYPES.OPEN_FILTER_PANEL);
  };

  const handleBonfire = (data) => {
    const convertedStartTime = moment
      .utc(data.time.format("YYYY-MM-DD HH:mm"))
      .format();

    const convertedEndTime = moment
      .utc(data.time.format("YYYY-MM-DD HH:mm"))
      .add(1, "hour")
      .format();

    const timezoneFirstSliceIndex = data.timezone.indexOf("/");

    const bonfireInfo = {
      title: data.title,
      description: data.description,
      link: data.link,
      startTime: convertedStartTime,
      endTime: convertedEndTime,
      categories: data.categories,
      bonfireCreator: userProfile.id,
      timezone: data.timezone.slice(
        timezoneFirstSliceIndex + 1,
        data.timezone.length
      ),
      userTimezone: moment.tz.guess(),
    };
    if (bonfireToEdit) {
      updateBonfire(bonfireToEdit.id, bonfireInfo, (error) => {
        if (error) {
          notification.error({
            message: error || "Something went wrong. Please try again.",
          });
        } else {
          notification.success({
            message: "Bonfire updated succesfully",
          });
          onCancelModalForm();
          getBonfires(filters);
        }
      });
    } else {
      createBonfire(bonfireInfo, (error) => {
        if (error) {
          notification.error({
            message: error || "Something went wrong. Please try again.",
          });
        } else {
          notification.success({
            message: "Bonfire created successfully",
          });

          onCancelModalForm();
          getBonfires(filters);
        }
      });
    }
  };

  const onDeleteBonfire = (id) => {
    deleteBonfire(id, (error) => {
      if (error) {
        notification.error({
          message: error || "Something went wrong. Please try again.",
        });
      } else {
        setModalFormVisible(false);
        getBonfires();
        notification.success({
          message: "Bonfire deleted succesfully",
        });
      }
    });
  };

  const handleCreateBonfire = () => {
    if (userProfile.memberShip !== "premium") {
      setFirewallText(
        "Upgrade to a PREMIUM Membership and get unlimited access to the LAB features"
      );
      return setShowFirewall(true);
    }

    if (userProfile.percentOfCompletion !== 100) {
      setFirewallText("You need to have your profile complete to access");
      return setShowFirewall(true);
    }

    setModalFormVisible(true);
  };

  const onDownloadCsv = async (b) => {
    const buffer = await downloadCsvWithParticipants(b.id);

    let fileURL = window.URL.createObjectURL(
      new Blob([buffer.data], { type: "application/vnd.ms-excel" })
    );
    let fileLink = document.createElement("a");

    fileLink.href = fileURL;
    fileLink.setAttribute("download", `${b.title}.xlsx`);
    document.body.appendChild(fileLink);

    fileLink.click();
    document.body.removeChild(fileLink);
    window.URL.revokeObjectURL(fileURL);
  };

  useEffect(() => {
    setSelectedKeys(parsed.key || "general-information");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFirewallAction = () => {
    if (userProfile.memberShip !== "premium") {
      planUpgrade();
    }

    if (userProfile.percentOfCompletion !== 100) {
      completeProfile();
    }
  };

  useEffect(() => {
    window.history.replaceState(
      null,
      "Page",
      `${INTERNAL_LINKS.BONFIRES}?key=${selectedKeys}`
    );
  }, [selectedKeys]);

  useEffect(() => {
    const getAllBonfires = async () => {
      getBonfires({ ...filters, date: moment().utc().format() });
    };

    getAllBonfires();
  }, [getBonfires, filters]);

  useEffect(() => {
    if (bonfires) {
      const sData = (bonfires || [])
        .map((item) => {
          const sTime = convertToLocalTime(item.startTime, item.timezone);
          const eTime = convertToLocalTime(item.endTime, item.timezone);
          let tz = TIMEZONE_LIST.find((t) => t.value === item.timezone);
          if (tz) {
            if (tz.offset > 0) {
              tz = `${tz.abbr} (GMT+${tz.offset})`;
            } else if (tz.offset < 0) {
              tz = `${tz.abbr} (GMT-${-tz.offset})`;
            } else {
              tz = `${tz.abbr} (GMT)`;
            }
          } else {
            tz = "";
          }

          return {
            ...item,
            date: sTime.format("MMM, D, YYYY"),
            period: `${sTime.format("MMMM D")} | From ${sTime.format(
              "h:mm a"
            )} to ${eTime.format("h:mm a")}`,
            hours: `From ${sTime.format("h:mm a")} to ${eTime.format(
              "h:mm a"
            )}`,
            tz: `${tz}`,
          };
        })
        .sort((a, b) => {
          if (a.startTime > b.startTime) {
            return 1;
          } else if (b.startTime > a.startTime) {
            return -1;
          }
          return 0;
        });

      let filteredData = [];

      for (let i = 0; i < sData.length; i++) {
        let isEmpty = true;
        for (let j = 0; j <= filteredData.length; j++) {
          if (sData[i].period === filteredData[j]?.step) {
            filteredData[j].data.push(sData[i]);
            isEmpty = false;
          }
        }

        if (isEmpty) {
          filteredData.push({
            step: sData[i].period,
            data: [sData[i]],
          });
        }
      }

      setBonfiresData(filteredData);
    }
  }, [bonfires]);

  return (
    <>
      <div className="bonfires-page">
        <BonfiresFilterPanel onChange={onFilterChange} />
        <FilterDrawer onChange={onFilterChange} />

        <div className="bonfires-page-container">
          <Menu
            mode="horizontal"
            className="menu-bonfires"
            selectedKeys={selectedKeys}
          >
            <Menu.Item
              key="general-information"
              style={{textDecoration: 'none', border: "none"}}
              onClick={() => setSelectedKeys("general-information")}
            >
              <p className={(selectedKeys !== "general-information") ? "menu-bonfires-item" : "menu-bonfires-item-without"}>General information</p>
            </Menu.Item>
            <Menu.Item
              key="all-bonfires"
              style={{textDecoration: 'none', border: "none"}}
              onClick={() => setSelectedKeys("all-bonfires")}
            >
              <p className={(selectedKeys !== "all-bonfires") ? "menu-bonfires-item" : "menu-bonfires-item-without"}>All Bonfires</p>
            </Menu.Item>

            <Menu.Item
              key="my-bonfires"
              style={{textDecoration: 'none', border: "none"}}
              onClick={() => setSelectedKeys("my-bonfires")}
            >
              <p className={(selectedKeys !== "my-bonfires") ? "menu-bonfires-item" : "menu-bonfires-item-without"}>My Bonfires</p>
            </Menu.Item>
          </Menu>
          <CustomButton
            text="Filters"
            onClick={() => {
              showFilterPanel();
            }}
            className={"bonfire-filter-panel"}
          />
          <div className="bonfire-list">
            <div className="bonfire-list-container">
              {selectedKeys === "general-information" && <GeneralInformation />}
              {selectedKeys === "all-bonfires" && (
                <>
                  <CustomButton
                    type="primary"
                    size="md"
                    text="Create Bonfire"
                    style={{ marginBottom: "1rem" }}
                    onClick={() => handleCreateBonfire()}
                  />
                  {bonfiresData.map((bonfire, i) =>
                    bonfire.data.length > 0 ? (
                      <div key={i}>
                        <h3 className="session-step">{bonfire.step}</h3>
                        {bonfire.data.map((b, i) => (
                          <BonfireCard
                            key={i}
                            bonfire={b}
                            added={(userProfile.bonfires || []).includes(b.id)}
                            isBonfireCreator={
                              userProfile.id === b.bonfireCreator
                            }
                            isUserInvited={b.invitedUsers.includes(
                              userProfile.id
                            )}
                            editBonfire={() => onEditBonfire(b)}
                            deleteBonfire={() => onDeleteBonfire(b.id)}
                            onAddBonfire={() => onAddBonfire(b)}
                            onRemoveBonfire={() => onRemoveBonfire(b)}
                            onDownloadCsv={() => onDownloadCsv(b)}
                          />
                        ))}
                      </div>
                    ) : null
                  )}
                </>
              )}

              {selectedKeys === "my-bonfires" && (
                <>
                  {bonfiresData.map((bonfire, i) =>
                    bonfire.data.length > 0 &&
                    bonfire.data.some(
                      (b) =>
                        b.invitedUsers.includes(userProfile.id) ||
                        b.joinedUsers.includes(userProfile.id) ||
                        b.bonfireCreator === userProfile.id
                    ) ? (
                      <div key={i}>
                        <h3 className="session-step">{bonfire.step}</h3>
                        {bonfire.data
                          .filter(
                            (b) =>
                              b.invitedUsers.includes(userProfile.id) ||
                              b.joinedUsers.includes(userProfile.id) ||
                              b.bonfireCreator === userProfile.id
                          )
                          .map((b, i) => (
                            <BonfireCard
                              key={i}
                              bonfire={b}
                              added={(userProfile.bonfires || []).includes(
                                b.id
                              )}
                              isBonfireCreator={
                                userProfile.id === b.bonfireCreator
                              }
                              isUserInvited={b.invitedUsers.includes(
                                userProfile.id
                              )}
                              editBonfire={() => onEditBonfire(b)}
                              deleteBonfire={() => onDeleteBonfire(b.id)}
                              onAddBonfire={() => {
                                onAddBonfire(b);
                              }}
                              onRemoveBonfire={() => onRemoveBonfire(b)}
                              onDownloadCsv={() => onDownloadCsv(b)}
                            />
                          ))}
                      </div>
                    ) : null
                  )}
                </>
              )}
            </div>
          </div>

          {modalFormVisible && (
            <CreateBonfireModal
              visible={modalFormVisible}
              bonfireToEdit={bonfireToEdit}
              handleBonfire={handleBonfire}
              onCancel={onCancelModalForm}
            />
          )}
        </div>
      </div>
      {showFirewall && (
        <div
          className="sidebar-firewall"
          onClick={() => setShowFirewall(false)}
        >
          <div
            className="upgrade-notification-panel"
            onClick={handleFirewallAction}
          >
            <h3>{firewallText}</h3>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  ...bonfireSelector(state),
  userProfile: homeSelector(state).userProfile,
  bonfires: bonfireSelector(state).bonfires,
  allCategories: categorySelector(state).categories,
});

const mapDispatchToProps = {
  getBonfires,
  setLoading,
  addBonfire,
  removeBonfire,
  updateBonfire,
  createBonfire,
  deleteBonfire,
};

export default connect(mapStateToProps, mapDispatchToProps)(BonfiresPage);
