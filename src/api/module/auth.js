import httpClient from "./httpClient";

export const signIn = ({ email, password }) => {
  return httpClient.post("/public/login", {
    email,
    password,
  });
};

export const signUp = ({
  firstName,
  lastName,
  email,
  password,
  password2,
  recaptcha,
  location,
  recentJobLevel,
  recentWorkArea,
  sizeOfOrganization,
  titleProfessions,
  company,
  languages,
  city,
}) => {
  return httpClient.post("/public/register", {
    firstName,
    lastName,
    email,
    password,
    password2,
    recaptcha,
    location,
    recentJobLevel,
    recentWorkArea,
    sizeOfOrganization,
    titleProfessions,
    company,
    languages: [languages],
    city,
  });
};

export const passwordRecovery = (email) => {
  return httpClient.post("/public/auth/password-recovery", {
    email,
  });
};

export const verifyToken = (token) => {
  return httpClient.post("/public/auth/verify-token", {
    token,
  });
};

export const resetPassword = (token, password) => {
  return httpClient.patch("/public/auth/reset-password", {
    token,
    password,
  });
};
