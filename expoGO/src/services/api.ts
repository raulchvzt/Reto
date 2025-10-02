import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const baseURL =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
