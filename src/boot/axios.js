import { boot } from "quasar/wrappers";
import axios from "axios";

const baseURL = process.env.API;

const api = axios.create({
  baseURL,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
    common: {
      token: "RG9uYXRpb24gdXNlciBhZG1pbg==",
    },
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
