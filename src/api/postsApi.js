import api from "./axios";

export const postsApi = {
  async getPosts() {
    const { data } = await api.get("/posts");
    return data;
  },

  async getPost(id) {
    const { data } = await api.get(`/posts/${id}`);
    return data;
  },

  async createPost(payload) {
    const { data } = await api.post("/posts", payload);
    return data;
  },
};

