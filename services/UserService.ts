import api from "./API"

export default {
  getUserByEmail(data: any) {
    let data1 = JSON.stringify(data);
    return api.post('/users',data1)
  },
}