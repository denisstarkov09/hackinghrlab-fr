import moment from "moment";
import { convertToCertainTime } from "utils/format";
import LogoHackingHR from "images/img-hhr-logo.png";
import { TIMEZONE_LIST } from "enum";

const formatAnnualConference = (userProfile, sessions, option) => {
  const sessionsOrdered = sessions
    .map((item) => {
      const sTime = convertToCertainTime(item.startTime, item.timezone);
      const eTime = convertToCertainTime(item.endTime, item.timezone);
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
        period: `From ${sTime.format("h:mm a")} to ${eTime.format("h:mm a")}`,
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

  const sData = [];

  for (let i = 0; i < sessionsOrdered.length; i++) {
    let isEmpty = true;
    for (let j = 0; j < sData.length; j++) {
      if (
        moment(sessionsOrdered[i]?.startTime).format("MMMM D") ===
        sData[j].period
      ) {
        sData[j].data.push(sessionsOrdered[i]);
        isEmpty = false;
      }
    }

    if (isEmpty) {
      sData.push({
        period: moment(sessionsOrdered[i].startTime).format("MMMM D"),
        data: [sessionsOrdered[i]],
      });
    }
  }

  const template = document.createElement("div");
  template.setAttribute("id", "template-agenda");

  template.style =
    "width: 800px; height: auto; display: flex; flex-direction: column;align-items: center";

  let content = `<div style="height: 1000px; width: 100%; display: flex; flex-direction: column; 
    align-items: center; justify-content: center; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 160px">
    <img src=${LogoHackingHR} style="width: 250px; height: 250px">
    <p style="font-weight: 800 !important; font-size: 3.5rem !important; text-align: center">2022</p>
    <p style="font-weight: 800 !important; font-size: 3.5rem !important; text-align: center; padding: 0px 150px">HR Innovation
    and Future of
    Work</p>
    <span style="font-weight: 800 !important; font-size: 1.5rem !important; text-align: center">Global Online Conference and Workshop </span>
    </div>
    
    <div style="height: 950px; width: 90%; display: flex; flex-direction: column; 
    align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 150px">
      <p style="font-size: 1.3rem">${
        option === "personal-agenda"
          ? "Personalized Agenda – Created on"
          : option === "conference-schedule"
          ? "Conference Schedule - Generated on"
          : "Personalized Participation Report - generated on"
      } ${moment().format("MM-DD-YYYY")} </p>
      <p style="font-size: 1.3rem">DOWNLOAD</p>
      <p style="font-size: 1.3rem">${userProfile.firstName} ${
    userProfile.lastName
  }</p>
    </div>

    <div style="height: 950px; width: 90%; display: flex; flex-direction: column; 
    align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 180px">
        <div style="display: flex; justify-content: space-between; width: 90%; padding: 0px 15px 10px 0px">
          <img src=${LogoHackingHR} style="width: 70px; height: 70px">
          <div>
            <p style="font-size: 1.2rem; font-weight: bolder">2022 HR Innovation and Future of Work</p>
            <p style="margin-top: -20px">Global Online Conference | ${
              option === "personal-agenda"
                ? "Personalized Agenda"
                : option === "conference-schedule"
                ? "Conference Schedule"
                : "Report sessions Joined"
            }</p>
          </div>
        </div>

        <div>
          <p style="font-weight: 800 !important; font-size: 2.5rem !important; text-align: center">Event Overview</p>
          <p style="font-size: 1.5rem; padding: 0px 2.5rem">
          This is ${option !== "conference-schedule" ? "your" : ""} ${
    option === "personal-agenda"
      ? "personalized agenda"
      : option === "conference-schedule"
      ? "Conference Schedule"
      : "report sessions joined"
  }. It includes
    ${
      option === "conference-schedule"
        ? "all sessions of Global Conference"
        : `
      the sessions 
          you ${
            option === "personal-agenda" ? "are planning to join" : "joined"
          }. 
          <br>
          <br>
          ${
            option === "personal-agenda"
              ? `  You can update your personalized agenda at any time 
          you want. Also, during conference weeki, you can join a 
          different session than the original one you added in your 
          personalized agenda. However, notice that during 
          conference week, once you click on “join” a session, you 
          won’t be able to join any other session happening at the 
          same time. 
          <br>
          <br>
          Regarding the HR certification credits: 1) you MUST be a 
          PREMIUM member in the Hacking HR LAB (click on 
          UPGRADE to become premium). There are no exceptions; 
          2) the codes will be sent to you two weeks after the 
          conference. We will ONLY send you the codes of the 
          sessions you actually JOINED; and 3) you can watch the 
          recordings later and still earn HR certification credits. 
          Thank you and enjoy! `
              : ""
          }
      `
    }  
          </p>
        </div>
    </div>

    </div>
    `;

  for (const day of sData) {
    let conferences = "";

    for (let i = 0; i < day.data.length; i++) {
      let categorieHTML = "";

      for (const categorie of day.data[i].categories) {
        categorieHTML += `    
          <div style="
          height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          border-radius: 0.25rem;
          border: 1px solid #438cef;;
          color: #438cef;
          max-width: 200px;
          overflow: hidden;">
          <span style="overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;">${categorie}</span>
         
          </div>`;
      }

      if (
        i % 2 === 0 &&
        day.data[i + 1] &&
        day.data[i].description?.length < 300
      ) {
        conferences += `
        <div style="background: #fff; 
        border: 1px solid #cfd3d6; 
        box-shadow: 4px 0px 14px #37215714; 
        border-radius: 0.5rem;
        opacity: 1;
        margin-top: -40px;
        padding: 2rem; margin-bottom: 30px;" class="conference">
             <div style="display: flex; flex-direction: column; flex-wrap: wrap">
                <h2 style="color: rgba(0, 0, 0, 0.85); font-weight: 500;">${
                  day.data[i].title
                }</h2>
                <span style="font-size: 14px; line-height: 19px; color: #697077;">Session type: ${
                  day.data[i].type
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">${
                  day.data[i].date
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">
                ${day.data[i].period} ${day.data[i].tz}
                </span>
    
                  <div style="  
                  display: flex;
                  width: 70%;
                  flex-wrap: wrap;
                  margin-top: 1rem;"
                  >
                  ${categorieHTML}
                  </div>
  
                  <div style="display: flex;
                  flex-direction: column;
                  padding-top: 1rem;
                  margin-top: 1rem;
                  border-top: 1px solid #e1e2ee">
  
                  <h4>Description</h4>
                  <p>
                  <p style="white-space: pre-line;">${
                    day.data[i].description
                  }<p>
                  </p>
  
                  </div>
             </div>
          </div>
          ${
            option === "report-sessions-joined" &&
            day.data[i].type === "Certificate Track and Panels"
              ? `
          <div style="margin-top: -25px;">
          <h3>HR Recertification Credits</h3>
          <p style="white-space: pre-line;"> ${
            userProfile.memberShip === "premium" &&
            option === "report-sessions-joined"
              ? day.data[i].recertification_credits
              : "HR Recertification Credits: Only available to PREMIUM"
          }</p>
          </div>
          `
              : ""
          }
        `;
      } else if (i % 2 !== 0 && day.data[i].description?.length < 300) {
        conferences += `
        <div style="background: #fff; border: 1px solid #cfd3d6; box-shadow: 4px 0px 14px #37215714; 
        border-radius: 0.5rem;
        opacity: 1;
        padding: 2rem; margin-bottom: 50px">
             <div style="display: flex; flex-direction: column; flex-wrap: wrap">
                <h2 style="color: rgba(0, 0, 0, 0.85); font-weight: 500;">${
                  day.data[i].title
                }</h2>
                <span style="font-size: 14px; line-height: 19px; color: #697077;">Session type: ${
                  day.data[i].type
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">${
                  day.data[i].date
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">
                ${day.data[i].period} ${day.data[i].tz}
                </span>
    
                  <div style="  
                  display: flex;
                  width: 70%;
                  flex-wrap: wrap;
                  margin-top: 1rem;"
                  >
                  ${categorieHTML}
                  </div>
  
                  <div style="display: flex;
                  flex-direction: column;
                  padding-top: 1rem;
                  margin-top: 1rem;
                  border-top: 1px solid #e1e2ee">
  
                  <h4>Description</h4>
                  <p>
                  <p>${day.data[i].description}<p>
                  </p>
  
                  </div>
             </div>
          </div>
          ${
            option === "report-sessions-joined" &&
            day.data[i].type === "Certificate Track and Panels"
              ? `
          <div style="margin-top: -35px;">
          <h3>HR Recertification Credits</h3>
          <p style="white-space: pre-line;"> ${
            userProfile.memberShip === "premium" &&
            option === "report-sessions-joined"
              ? day.data[i].recertification_credits
              : "HR Recertification Credits: Only available to PREMIUM"
          }</p>
          </div>
          `
              : ""
          }
       
        `;

        content += `
        <div style="height: 950px; width: 90%; display: flex; flex-direction: column;
            align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 180px">
            <div style="display: flex; justify-content: space-between; width: 90%; padding: 0px 10px 10px 0px">
              <img src=${LogoHackingHR} style="width: 70px; height: 70px">
              <div>
                <p style="font-size: 1.2rem; font-weight: bolder">2022 HR Innovation and Future of Work</p>
                <p style="margin-top: -20px">Global Online Conference | ${
                  option === "personal-agenda"
                    ? "Personalized Agenda"
                    : option === "conference-schedule"
                    ? "Conference Schedule"
                    : "Reported sessions joined"
                } </p>
              </div>
            </div>

               <p style="align-self: flex-start;font-weight: 800 !important; font-size: 2.5rem !important; margin-left: 40px">
               ${day.period}
               </p>

            <div style="width: 100%"> ${conferences}</div>
            </div>
            `;
        conferences = "";
      } else if (i % 2 !== 0 && day.data[i].description?.length > 300) {
        content += `
        <div style="height: 950px; width: 90%; display: flex; flex-direction: column;
            align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 180px">
            <div style="display: flex; justify-content: space-between; width: 90%; padding: 0px 10px 10px 0px">
              <img src=${LogoHackingHR} style="width: 70px; height: 70px">
              <div>
                <p style="font-size: 1.2rem; font-weight: bolder">2022 HR Innovation and Future of Work</p>
                <p style="margin-top: -20px">Global Online Conference | ${
                  option === "personal-agenda"
                    ? "Personalized Agenda"
                    : option === "conference-schedule"
                    ? "Conference Schedule"
                    : "Reported sessions joined"
                }</p>
              </div>
            </div>

               <p style="align-self: flex-start;font-weight: 800 !important; font-size: 2.5rem !important; margin-left: 40px">
               ${day.period}
               </p>

            <div style="width: 100%"> ${conferences}</div>
            </div>
            `;

        conferences = "";

        conferences += `
        <div style="background: #fff; border: 1px solid #cfd3d6; box-shadow: 4px 0px 14px #37215714; 
        border-radius: 0.5rem;
        opacity: 1;
        padding: 2rem; margin-bottom: 50px">
             <div style="display: flex; flex-direction: column; flex-wrap: wrap">
                <h2 style="color: rgba(0, 0, 0, 0.85); font-weight: 500;">${
                  day.data[i].title
                }</h2>
                <span style="font-size: 14px; line-height: 19px; color: #697077;">Session type: ${
                  day.data[i].type
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">${
                  day.data[i].date
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">
                ${day.data[i].period} ${day.data[i].tz}
                </span>
    
                  <div style="  
                  display: flex;
                  width: 70%;
                  flex-wrap: wrap;
                  margin-top: 1rem;"
                  >
                  ${categorieHTML}
                  </div>
  
                  <div style="display: flex;
                  flex-direction: column;
                  padding-top: 1rem;
                  margin-top: 1rem;
                  border-top: 1px solid #e1e2ee">
  
                  <h4>Description</h4>
                  <p>
                  <p>${day.data[i].description}<p>
                  </p>
  
                  </div>
             </div>
          </div>
          ${
            option === "report-sessions-joined" &&
            day.data[i].type === "Certificate Track and Panels"
              ? `
          <div>
          <h3>HR Recertification Credits</h3>
          <p style="white-space: pre-line;"> ${
            userProfile.memberShip === "premium" &&
            option === "report-sessions-joined"
              ? day.data[i].recertification_credits
              : "HR Recertification Credits: Only available to PREMIUM"
          }</p>
          </div>
          `
              : ""
          }
       
        `;

        content += `
        <div style="height: 950px; width: 90%; display: flex; flex-direction: column;
            align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 180px">
            <div style="display: flex; justify-content: space-between; width: 90%; padding: 0px 10px 10px 0px">
              <img src=${LogoHackingHR} style="width: 70px; height: 70px">
              <div>
                <p style="font-size: 1.2rem; font-weight: bolder">2022 HR Innovation and Future of Work</p>
                <p style="margin-top: -20px">Global Online Conference | ${
                  option === "personal-agenda"
                    ? "Personalized Agenda"
                    : option === "conference-schedule"
                    ? "Conference Schedule"
                    : "Reported sessions joined"
                }</p>
              </div>
            </div>

               <p style="align-self: flex-start;font-weight: 800 !important; font-size: 2.5rem !important; margin-left: 40px">
               ${day.period}
               </p>

            <div style="width: 100%"> ${conferences}</div>
            </div>
            `;

        conferences = "";
      } else {
        conferences += `
        <div style="background: #fff; border: 1px solid #cfd3d6; box-shadow: 4px 0px 14px #37215714; 
        border-radius: 0.5rem;
        opacity: 1;
        padding: 2rem; margin-bottom: 50px">
             <div style="display: flex; flex-direction: column; flex-wrap: wrap">
                <h2 style="color: rgba(0, 0, 0, 0.85); font-weight: 500;">${
                  day.data[i].title
                }</h2>
                <span style="font-size: 14px; line-height: 19px; color: #697077;">Session type: ${
                  day.data[i].type
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">${
                  day.data[i].date
                }</span>
                <span style="font-size: 14px; line-height: 19px; color: #697077; margin: 0.5rem 0">
                ${day.data[i].period} ${day.data[i].tz}
                </span>
    
                  <div style="  
                  display: flex;
                  width: 70%;
                  flex-wrap: wrap;
                  margin-top: 1rem;"
                  >
                  ${categorieHTML}
                  </div>
  
                  <div style="display: flex;
                  flex-direction: column;
                  padding-top: 1rem;
                  margin-top: 1rem;
                  border-top: 1px solid #e1e2ee">
  
                  <h4>Description</h4>
              
                  <p>${
                    day.data[i].description !== null
                      ? day.data[i].description
                      : ""
                  }<p>
                
  
                  </div>
             </div>
          </div>
          ${
            option === "report-sessions-joined" &&
            day.data[i].type === "Certificate Track and Panels"
              ? `
          <div>
          <h3>HR Recertification Credits</h3>
          <p style="white-space: pre-line;"> ${
            userProfile.memberShip === "premium" &&
            option === "report-sessions-joined"
              ? day.data[i].recertification_credits
              : "HR Recertification Credits: Only available to PREMIUM"
          }</p>
          </div>
          `
              : ""
          }
       
        `;
        content += `  
        <div style="height: 950px; width: 90%; display: flex; flex-direction: column; 
            align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 180px">
            <div style="display: flex; justify-content: space-between; width: 90%; padding: 0px 10px 10px 0px">
              <img src=${LogoHackingHR} style="width: 70px; height: 70px">
              <div>
                <p style="font-size: 1.2rem; font-weight: bolder">2022 HR Innovation and Future of Work</p>
                <p style="margin-top: -20px">Global Online Conference | ${
                  option === "personal-agenda"
                    ? "Personalized Agenda"
                    : option === "conference-schedule"
                    ? "Conference Schedule"
                    : "Reported sessions joined"
                }</p>
              </div>
            </div>
    
               <p style="align-self: flex-start;font-weight: 800 !important; font-size: 2.5rem !important; margin-left: 40px">
               ${day.period}
               </p>
    
            <div style="width: 100%"> ${conferences}</div>
            </div>
            `;
        conferences = "";
      }
    }
  }

  if (option === "personal-agenda" || option === "report-sessions-joined") {
    content += `
    <div style="height: 950px; width: 90%; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start; border-bottom: 1px solid #cfd3d6; padding-bottom: 3rem; margin-bottom: 180px">
    <div style="display: flex; justify-content: space-between; width: 90%; padding: 0px 10px 10px 0px">
      <img src=${LogoHackingHR} style="width: 70px; height: 70px">
      <div>
        <p style="font-size: 1.2rem; font-weight: bolder">2022 HR Innovation and Future of Work</p>
        <p style="margin-top: -20px">Global Online Conference | ${
          option === "personal-agenda"
            ? "Personalized Agenda"
            : option === "conference-schedule"
            ? "Conference Schedule"
            : "Reported sessions joined"
        } </p>
      </div>
    </div>
</div>


`;
  }

  template.innerHTML = content;

  return template;
};

export { formatAnnualConference };
