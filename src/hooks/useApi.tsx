import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import axios from "axios";

const useApi = () => {
  const { apiUrl, sessionId } = useContext(GlobalContext);
  const api = axios.create({
    baseURL: apiUrl,
  });

  api.interceptors.request.use(
    (config) => {
      config.headers["X-Session-ID"] = sessionId;
      return config;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );

  return api;
};

export default useApi;
