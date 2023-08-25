import React, { useState, useEffect } from "react";
import { CustomModal } from "components";
import { loadStripe } from "@stripe/stripe-js";
import { CustomButton } from "components";
import { Alert, Form, Select } from "antd";
import { STRIPE_PRICES } from "enum";

import { getCheckoutSession } from "api/module/stripe";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const Option = Select;

const AdvertisementPaymentModal = ({ visible, onClose, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [checkoutSessionError, setCheckoutSessionError] = useState(false);
  const [checkoutSessionErrorMsg, setCheckoutSessionErrorMsg] = useState("");
  const [stripe, setStripe] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    instanceStripe();
  }, []);

  const instanceStripe = async () => {
    setStripe(await stripePromise);
  };

  const requestCheckoutSessionTable = async ({
    isAdvertiser = false,
    isBuyingCredits = false,
    credits = 0,
  }) => {
    setLoading(true);
    setCheckoutSessionError(false);
    setCheckoutSessionErrorMsg("");

    try {
      let sessionData = {};

      if (isAdvertiser) {
        sessionData = await getCheckoutSession({
          prices: [STRIPE_PRICES.ADVERTISER_PRICE.priceId],
          isAdvertisement: true,
          callback_url: `${process.env.REACT_APP_DOMAIN_URL}/sponsor-dashboard`,
        });
      }

      if (isBuyingCredits) {
        if (credits) {
          const prices = STRIPE_PRICES.ADVERTISEMENT_CREDITS_STRIPE_PRICES.find(
            (p) => p.credits === credits
          );

          sessionData = await getCheckoutSession({
            isBuyingCredits: true,
            credits: credits,
            prices: [prices.priceId],
            callback_url: `${process.env.REACT_APP_DOMAIN_URL}/sponsor-dashboard`,
          });
        }
      }

      return stripe.redirectToCheckout({ sessionId: sessionData.data.id });
    } catch (error) {
      setLoading(false);
      setCheckoutSessionError(true);
      setCheckoutSessionErrorMsg(error.response.data.msg);
    }
  };

  const handleOnFinish = (values) => {
    setLoading(true);
    let { advertisementCredits } = values;

    requestCheckoutSessionTable({
      isBuyingCredits: true,
      credits: advertisementCredits,
    });
  };

  return (
    <CustomModal
      visible={visible}
      onCancel={onClose}
      title={
        userProfile.isAdvertiser ? "Buy more credits!" : "Upgrade to Advertiser"
      }
      width={350}
    >
      {userProfile.isAdvertiser ? (
        <>
          <Form layout="vertical" onFinish={handleOnFinish} form={form}>
            <Form.Item
              label="Advertisement Credits"
              name="advertisementCredits"
              rules={[{ required: true }]}
            >
              <Select style={{ width: "100%" }}>
                {STRIPE_PRICES.ADVERTISEMENT_CREDITS_STRIPE_PRICES.map(
                  (prices) => (
                    <Option value={prices.credits} key={prices.price}>
                      {prices.credits} credits = {`$${prices.price}`}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
            <Form.Item>
              <CustomButton text="Buy" htmlType="submit" loading={loading} />
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          <CustomButton
            type="primary"
            block
            loading={loading}
            onClick={() =>
              requestCheckoutSessionTable({
                isAdvertiser: true,
              })
            }
            text="PAY HERE = $500"
          />
        </>
      )}
      {checkoutSessionError && (
        <Alert
          message="Error"
          description={checkoutSessionErrorMsg}
          type="error"
          showIcon
        />
      )}
    </CustomModal>
  );
};

export default AdvertisementPaymentModal;
