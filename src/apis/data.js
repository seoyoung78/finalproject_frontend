import axios from "axios";

export function getDatas(){
  const promise = axios.get("/data");
  return promise;
}