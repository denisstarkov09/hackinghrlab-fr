import httpClient from "./httpClient";

export const createControlCertificateEndPoint = (payload) => {
    const {data} = payload
    return httpClient.post("private/certificate/add-certificate-control", {
        ...data,
    });
}

export const getCodeCertificateEndPoint = (payload) => {
    const {data} = payload
    return httpClient.post("private/certificate/get-code-certificate", {
        ...data,
    });
}

export const getControlCertificateEndPoint = (payload) => {
    const {code} = payload
    return httpClient.get(`public/certificate/get-certficate-control/${code}`)
}

export const getAllCertificateTypeEndPoint = (payload) => {
    const {type} = payload
    return httpClient.get(`private/certificate/get-all-certficate-type/${type}`)
}