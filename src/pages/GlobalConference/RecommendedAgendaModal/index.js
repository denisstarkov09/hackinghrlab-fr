import React, { useState } from "react";
import { useHistory } from "react-router";

import { connect } from "react-redux";
import { Modal, Form } from "antd";
import { categorySelector } from "redux/selectors/categorySelector";
import { recommendedAgenda } from "redux/actions/session-actions";
import { CustomButton } from "components";
import RecommendedAgendaForm from "./RecommendedAgendaForm";

const RecommendedAgendaModal = ({
  visible,
  onCancel,
  allCategories,
  recommendedAgenda,
}) => {
  const [recommendedAgendaStep, setRecommendedAgendaStep] = useState(0);
  const [recommendedAgendaForm, setRecommendedAgendaForm] = useState({});
  const history = useHistory();

  const handleSubmitRecommendedAgenda = (data) => {
    if (data.topics) {
      if (recommendedAgendaStep !== 1) {
        setRecommendedAgendaStep(recommendedAgendaStep + 1);
        setRecommendedAgendaForm({
          ...recommendedAgendaForm,
          ...data,
        });
      }
    } else if (recommendedAgendaForm.topics && data.time) {
      const newRecomendedAgendaValues = {
        ...recommendedAgendaForm,
        ...data,
      };
      recommendedAgenda(newRecomendedAgendaValues);
      onCancel();
      setRecommendedAgendaStep(0);
      history.push("/global-conference/recommended-agenda");
    }
  };

  return (
    <Modal
      centered
      visible={visible}
      onCancel={() => {
        onCancel();
        setRecommendedAgendaStep(0);
      }}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={(data) => handleSubmitRecommendedAgenda(data)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <RecommendedAgendaForm
          allCategories={allCategories}
          step={recommendedAgendaStep}
        />
        <CustomButton
          htmlType="submit"
          text={recommendedAgendaStep === 1 ? "Send" : "Next"}
          type="primary"
          size="md"
        />
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

const mapDispatchToProps = {
  recommendedAgenda,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecommendedAgendaModal);
