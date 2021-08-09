import axios from "axios";

export function login(user){
  //공통경로 생략
  const promise = axios.post("/auth/login", user);
  return promise;
}

export function getUser(user_id) {
  const promise = axios.get("/auth/read", {params: {user_id}});
  return promise;
}

export function updateUserInfo(user) {
  const promise = axios.put("/auth/update", user);
  return promise;
}