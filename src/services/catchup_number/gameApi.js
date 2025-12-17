import axios from "axios";
import { API_URL } from "../../config/config";

export const validateMove = (payload) =>
    axios.post(`${API_URL}/validate`, payload);

export const getAiMove = (payload) =>
    axios.post(`${API_URL}/ai-move`, payload);
