import axios from "axios";

export function readPatient(treatmentDate, state="") {
  const promise = axios.get("/inspection", {params:{treatmentDate, state}});
  return promise;
}

export function updateIstateW(treatmentId) {
  const promise = axios.put("/inspection/istateW", null, {params:{treatmentId}});
  return promise;
}

export function updateIstateI(treatmentId) {
  const promise = axios.put("/inspection/istateI", null, {params:{treatmentId}});
  return promise;
}

export function updateIstateC(treatmentId) {
  const promise = axios.put("/inspection/istateC", null, {params:{treatmentId}});
  return promise;
}

export function readInspection(treatmentId) {
  const promise = axios.get("/inspection/inspections", {params:{treatmentId}});
  return promise;
}

export function updateState(inspectionId, state) {
  const promise = axios.put("/inspection/state", null, {params:{inspectionId, state}});
  return promise;
}

export function updateResult(inspectionId, inspectionResult) {
  const promise = axios.put("/inspection/result", null, {params:{inspectionId, inspectionResult}});
  return promise;
}

export function selectImgId(inspectionId) {
  const promise = axios.get("/inspection/imgId", {params:{inspectionId}});
  return promise;
}

export function downloadImg(inspectionImgId) {
  const promise = axios.get("/inspection/images/" + inspectionImgId, {responseType: "blob"});
  return promise;
}

export function readImage(inspectionId) {
  const promise = axios.get("/inspection/images", {params:{inspectionId}});
  return promise;
}

export function createImage(multipartFormData) {
  const promise = axios.post("/inspection/images", multipartFormData);
  return promise;
}

export function deleteImage(inspectionId) {
  const promise = axios.delete("/inspection/images", {params:{inspectionId}});
  return promise;
}