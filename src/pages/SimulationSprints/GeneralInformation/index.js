import React from "react";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";

const GeneralInformation = ({ userProfile }) => {
  return (
    <>
      <div className="simulation-sprints-information">
        <h3>Hi {userProfile.firstName}</h3>
        <p>
          Welcome to Hacking HR’s <strong>Simulation Sprint!</strong>
        </p>
        <p>
          {" "}
          Thank you for checking out this page to find out more about one of our
          flagship learning programs.
        </p>
      </div>

      <div className="simulation-sprints-information">
        <h2>Simulation Sprints</h2>
        <p>
          <strong>Simulation Sprint</strong> is one of our most exciting
          learning and community offerings at Hacking HR.
        </p>

        <p>
          Over the past few years we have been carefully scrutinizing the world
          of HR certifications. We acknowledge that while a few of them are
          helpful to understand foundational concepts important for your work,
          we also recognize the gigantic gap that exists between "consuming"
          online, self-pace content through pre-recorded videos and the "how" to
          put those concepts, insights, ideas and theory into meaningful and
          relatable action
        </p>

        <p>
          That's why we are launching <strong>Simulation Sprint</strong>.
        </p>

        <p>
          We want you to have a meaningful and applicable alternative to
          existing certifications and we are focusing on equipping you with the
          relevant tools and insights that you can apply immediately in your
          work
        </p>
      </div>

      <div className="simulation-sprints-information">
        <h2>How it works</h2>
        <p>
          Each <strong> Simulation Sprint </strong>will last four weeks and will
          be focused on themes that you can quickly apply in your day to day
          work. Some Simulation Sprints will be more relevant than others and we
          will make sure to have a large portfolio of options available.
        </p>
        <p>
          The <strong>Simulation Sprints</strong> are synchronous. While we will
          be sharing a lot of resources that you can read, watch or listen at
          your own pace, the foundation of the{" "}
          <strong>Simulation Sprint</strong> is working in teams to solve a
          complex and real business challenge that we will provide. Your
          solutions will be presented to your peers in the{" "}
          <strong>Simulation Sprint</strong> cohort
        </p>
        <p>
          The purpose of the <strong> Simulation Sprint</strong> is not to cram
          a bunch of concepts or theory in your brain, or share unrelatable
          stories from speakers who work in companies that are too different
          from yours.
        </p>
        <p>
          Instead, we are aiming for you to learn concepts and put them into
          practice immediately during the sprint. The{" "}
          <strong>Simulation Sprint</strong> rely heavily on simulating and
          resolving for real cases of organizational challenges and
          opportunities
        </p>
        <p>
          After each <strong>Simulation Sprint</strong> you will be equipped
          with the theory and the how-to put it into practice. More
          specifically, you will be ready to apply the knowledge and expertise
          right away in your own context and your HR practice.
        </p>
      </div>

      <div className="simulation-sprints-information">
        <h2>The Conditions</h2>
        <p>
          Please note: you MUST complete all the requirements of the{" "}
          <strong>Simulation Sprint</strong> to receive your digital
          certification at the end of the program.
        </p>
        <p>Thank you! </p>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);
