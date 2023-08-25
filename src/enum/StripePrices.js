export default {
  STRIPE_PRICES: [
    {
      price: "159",
      country: "GLOBAL",
      character: "&#36;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_USD_PRICE_ID,
    },
    {
      price: "3,499",
      country: "INDIA",
      character: "&#8377;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_INR_PRICE_ID,
    },
    {
      price: "11,999",
      country: "NIGERIA",
      character: "&#8358;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_NGN_PRICE_ID,
    },
  ],
  CHANNELS_STRIPE_PRICES: [
    {
      price: "250",
      country: "GLOBAL",
      character: "&#36;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_USD_PRICE_CHANNELS_ID,
    },
    {
      price: "18,798",
      country: "INDIA",
      character: "&#8377;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_INR_PRICE_CHANNELS_ID,
    },
    {
      price: "95,125",
      country: "NIGERIA",
      character: "&#8358;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_NGN_PRICE_CHANNELS_ID,
    },
  ],
  RECRUITER_STRIPE_PRICES: [
    {
      price: "250",
      country: "GLOBAL",
      character: "&#36;",
      priceId: process.env.REACT_APP_STRIPE_YEARLY_USD_PRICE_RECRUITER_ID,
    },
  ],
  ADVERTISER_PRICE: {
    price: "500",
    country: "GLOBAL",
    character: "&#36",
    priceId: process.env.REACT_APP_STRIPE_ONE_TIME_ADVERTISER_ID,
  },
  ADVERTISEMENT_CREDITS_STRIPE_PRICES: [
    {
      price: "150",
      credits: "10",
      country: "GLOBAL",
      character: "&#36",
      priceId: process.env.REACT_APP_STRIPE_ADVERTISEMENT_CREDITS_10,
    },
    {
      price: "260",
      credits: "20",
      country: "GLOBAL",
      character: "&#36",
      priceId: process.env.REACT_APP_STRIPE_ADVERTISEMENT_CREDITS_20,
    },
    {
      price: "360",
      credits: "30",
      country: "GLOBAL",
      character: "&#36",
      priceId: process.env.REACT_APP_STRIPE_ADVERTISEMENT_CREDITS_30,
    },
    {
      price: "500",
      credits: "50",
      country: "GLOBAL",
      character: "&#36",
      priceId: process.env.REACT_APP_STRIPE_ADVERTISEMENT_CREDITS_50,
    },
  ],
  SIMULATION_SPRINT_PRICES: [
    {
      price: "700",
      simulations: "1",
      country: "GLOBAL",
      character: "&#36;",
      priceId: process.env.REACT_APP_STRIPE_ONE_SIMULATION_SPRINT,
    },

    {
      price: "2500",
      simulations: "4",
      country: "GLOBAL",
      character: "&#36;",
      priceId: process.env.REACT_APP_STRIPE_FOUR_SIMULATION_SPRINT,
    },

    {
      price: "4000",
      simulations: "8",
      country: "GLOBAL",
      character: "&#36;",
      priceId: process.env.REACT_APP_STRIPE_EIGHT_SIMULATION_SPRINT,
    },
  ],
};
