import axios from "axios";

export function getPatientList(keyword="") {
  const promise = axios.get("/patient", {params: {keyword}});
  return promise;
}

export function updatePatient(patient) {
  const promise = axios.put("/patient", patient);
  return promise;
}

export function createPatient(patient) {
  const promise = axios.post("/patient", patient);
  return promise;
}