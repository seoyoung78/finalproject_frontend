import axios from "axios";

export function getAllUserList(){
  const promise = axios.get("/user");
  return promise;
}

export function getUserList(keyword="", condition="all"){
  const promise = axios.get("/user/select", {params: {keyword, condition}});
  return promise;
}

export function updateUser(user) {
  const promise = axios.put("/user", user);
  return promise;
}

export function updateUserEnabled(user) {
  return axios.put("/user/enabled", user);
}

export function createUser(user) {
  const promise = axios.post("/user", user);
  return promise;
}