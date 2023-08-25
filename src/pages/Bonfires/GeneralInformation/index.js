import React from "react";
import { connect } from "react-redux";
import { homeSelector } from "redux/selectors/homeSelector";

const GeneralInformation = ({ userProfile }) => {
  return (
    <div style={{paddingBottom: '60px', paddingLeft: '10px', paddingRight: '10px'}}>
      <h3>Hi {userProfile.firstName}</h3>
      <p>Welcome to Hacking HR’s Bonfires!</p>
      <p>
        Bonfires are networking opportunities created by and for members of the
        Hacking HR community.
      </p>
      <p>
        We created this tool to promote collaboration, learning and networking!
      </p>

      <p>
        All our Hacking HR LAB Premium members can create Bonfires, and all
        members (premium and free) can participate
      </p>
      <p>
        Bonfires are excellent spaces for interesting discussions to help
        advance the HR profession and help you solve the most complex business
        challenges you may be dealing with!
      </p>

      <p>
        When you create a Bonfire we automatically invite up to 30 members of
        the Hacking HR LAB whose interests are aligned with the topics of the
        Bonfire. We can’t guarantee they will join and hope that you also
        promote the Bonfire and get people to join!
      </p>

      <p>
        Finally, Bonfires <strong>ARE NOT</strong> tools for sales or marketing
        pitches, focus groups or any other commercial use. We have ZERO
        TOLERANCE for misuse of the tools we are providing. If this happens
        during a Bonfire and the bonfire organizer is selling or marketing a
        product or service, or using you for any purpose other than networking,
        collaboration and learning, please report it to us
        (enrique@hackinghr.io). We will take immediate action!
      </p>

      <p>Thank you and happy networking!</p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);
