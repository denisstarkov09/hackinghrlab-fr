import { createSelector } from "reselect";

const certificateSelectorr = (state) => state.certificate;

const resultSelector = createSelector(certificateSelectorr, (payload) => {
    return {
        userCertificate: payload.get("userCertificate"),
        certificate: payload.get("certificate"),
        certificateLearning: payload.get("certificateLearning"),
    }
});

export const certificateSelector = (state) => ({
  ...resultSelector(state),
});
