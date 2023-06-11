import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import axios from "axios";

const useApi = () => {
  const { apiUrl } = useContext(GlobalContext);
  const api = axios.create({
    baseURL: apiUrl,
  });

  return api;
};

export default useApi;
