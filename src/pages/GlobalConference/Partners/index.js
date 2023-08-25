import React, { useEffect } from "react";
import { connect } from "react-redux";

import { categorySelector } from "redux/selectors/categorySelector";
import { partnerSelector } from "redux/selectors/partnersSelector";
import { getPartners } from "redux/actions/partner-actions";
import { MarketplaceCard } from "components";
import "./style.scss";
const Partners = ({ partners, allCategories, getPartners }) => {
  useEffect(() => {
    const getPartnersData = () => {
      getPartners();
    };

    getPartnersData();
  }, [getPartners]);

  return (
    <div className="partners-list">
      {partners.map((item) => (
        <MarketplaceCard
          key={item.id}
          name={item.name}
          description={item.description}
          url={item.url}
          logoUrl={item.logoUrl}
          contact_name={item.contact_name}
          contact_email={item.contact_email}
          contact_phone={item.contact_phone}
          contact_position={item.contact_position}
          demoUrl={item.demoUrl}
          twitter={item.twitter}
          facebook={item.facebook}
          linkedin={item.linkedin}
          instagram={item.instagram}
          categories={item.topics}
          allCategories={allCategories}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
  partners: partnerSelector(state).partners,
});

const mapDispatchToProps = {
  getPartners,
};

export default connect(mapStateToProps, mapDispatchToProps)(Partners);
