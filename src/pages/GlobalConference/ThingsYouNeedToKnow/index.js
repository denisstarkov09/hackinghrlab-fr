import React from "react";
import { CustomModal } from "components";

import "./style.scss";

const ThingsYouNeedToKnow = ({ visible, onCancel }) => {
  return (
    <CustomModal
      visible={visible}
      title="Things You Need To Know"
      width={700}
      onCancel={onCancel}
    >
      <div className="message-wrapper">
        <h2>1.Profile</h2>

        <p>
          To join the conference and any of the sessions you have to fully
          complete your{" "}
          <a
            href="https://www.hackinghrlab.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hacking HR LAB profile
          </a>
          . You can go to the Hacking HR LAB's home page and a message will show
          letting you know what fields you are missing in your profile. This is
          not optional. You can't join sessions or the Global Conference
          environment if you don't complete your profile.
          {"\n"}
          {"\n"}
          This is not optional. You can't join sessions or the Global Conference
          environment if you don't complete your profile.
        </p>

        <h2>2. Time of the sessions</h2>

        <p>
          All the sessions in the conference schedule show in Pacific Time Zone.
          This time zone is only applicable to participants who reside in the
          west coast of Canada, the United States or Mexico. If you don’t reside
          in any these locations you will have to convert the time zone to your
          own time zone.
          {"\n"}
          {"\n"}
          You can use{" "}
          <a
            href="https://www.timeanddate.com/worldclock/converter.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            this time zone converter
          </a>
          . All you have to do is add “San Francisco” (as the one city located
          in Pacific Time Zone) and then your own city. For example, a session
          that is 9 a.m. Pacific Time Zone is: a) 5 p.m. in London; b) 6 p.m. in
          Lagos; c) 9 p.m. in Dubai; d) 10.30 p.m. in Bangalore; e) 1 a.m.
          Manila; f) 4 a.m. Sydney.
          {"\n"}
          {"\n"}
          Bottom line: if you are not in the west coast of Canada, the United
          States of Mexico, then 9 a.m. Pacific Time IS NOT your 9 a.m. Please
          convert to your time or download the calendar invites for each
          session, which should update automatically to your time zone.
        </p>

        <h2>3. How to join the sessions </h2>

        <p>
          All the sessions will show in the Conference Schedule in{" "}
          <a
            href="https://www.hackinghrlab.io/global-conference"
            target="_blank"
            rel="noopener noreferrer"
          >
            Global Conference
          </a>
          . Starting next week a countdown timer will show indicating when the
          sessions will start.
          {"\n"}
          {"\n"}
          When the sessions are five minutes away from starting a JOIN button
          will show to allow you to enter into that session. Please note that
          once you join a session, you won’t be able to join another one
          happening concurrently in the same time block (although you will have
          access to the videos of those sessions two weeks after the
          conference).
        </p>

        <p>Some notes about the sessions:</p>

        <p>
          1. Tracks: these are sessions that include 3 panels, each lasting one
          hour. Joining a track means joining the three panels. You can't switch
          to another track happening at a given time block once you have joined
          one at that same time block. These sessions were previously recorded.
        </p>

        <p>
          2. Roundtables: these are networking sessions for small groups. PLEASE
          join a roundtable ONLY if you can connect your video and audio.
          Otherwise we kindly ask you not to join these sessions. These are not
          "join-to-just-listen" sessions. They require your active
          participation.
        </p>

        <p>
          3. Presentations: these are live presentations lasting 15 minutes each
          one. You won't be able to chat with anyone in the online session or
          ask questions to the speakers.
        </p>

        <h2>4. How to earn the credits</h2>

        <p>
          The Hacking HR 2022 Global Online Conference offers almost 500 credits
          (between SHRM and HRCI). The credit codes corresponding to the
          sessions you are participating in will be ready two weeks after the
          conference.
          {"\n"}
          {"\n"}
          In two weeks you will receive an email notifying you that your
          personalized participation report is ready. The report will include
          all the sessions you joined and the codes for the corresponding
          credits, and also a digital certificate of participation.
        </p>

        <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
          Please note that you MUST be a PREMIUM member to see the codes in the
          personalized participation report. If you are not a PREMIUM member the
          credits will not be visible. To become a PREMIUM member, go to the
          Hacking HR LAB and click on UPGRADE on the top right to process your
          membership fees ($119 per year).
        </p>

        <p>
          You can also collect credits by watching the recorded sessions after
          the conference. The recorded sessions will be available two weeks
          after the conference and you can watch the replay and then claim the
          corresponding credits. You also have to be PREMIUM member to claim the
          credits of recorded sessions.
        </p>

        <h2>5. Emails and notifications</h2>

        <p>
          We will send you five emails during the week of the conference. One
          email a day with the agenda of the day. You can find that information
          in the Conference Schedule, so even if you don't receive my email you
          can still go to the Global Conference, click on Conference Schedule,
          select the day and see what's going on that day. Don't wait for our
          email to participate in the sessions during the conference.
        </p>

        <h2>6. Watch from computer and not phone</h2>
        <p>
          We recommend that you participate in the conference sessions from your
          computer and not phone. While we built all the responsive
          functionality for mobile devices, testing has been more limited and
          there are features unavailable in mobile devices.
        </p>

        <h2>7. Digital certificate</h2>

        <p>
          All participants in the conference (both premium members and free
          members) will be able to download a Digital Certificate of
          participation! This certificate will be available on Monday, March 14,
          and it will include: your name, the conference name and dates, and the
          total number of hours you participated in the conference. This digital
          certificate is a token of our appreciation to you for investing time
          in your learning!
        </p>

        <h2>A Request</h2>

        <p>
          Things happen. Technology bugs and glitches occur. Information that we
          thought was clear may not be that clear. We understand that. And we
          welcome your requests for additional information or your reports of
          tech glitches or bugs. But we do request that if you need something
          from us, your request comes with patience, care, understanding and
          grace. We are a tiny team, delivering the largest HR conference in the
          world. Please take this into account when you write us an email to
          request information or report a technical issue. We will have no
          tolerance for offensive emails and anyone sending us such an email
          will be removed from our conference and banned from participation in
          any Hacking HR events in the future. We appreciate this in more ways
          that you can imagine. Thank you.
        </p>
      </div>
    </CustomModal>
  );
};

export default ThingsYouNeedToKnow;
