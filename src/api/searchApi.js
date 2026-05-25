import api from "./axios";

export const searchApi = {
  async semanticSearch(query, filters = {}) {
    const { data } = await api.post("/search/semantic", { query, filters });
    return data;
  },
};

