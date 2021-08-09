import axios from "axios";


export function getTreatmentPatientList(date,globalUid,state="") {
  const promise = axios.get("/treatment/treatmentlist", {params: {date, state, globalUid}});
  return promise;
}

export function getTreatmentHistoryList(treatment_patient_id) {
  const promise = axios.get("/treatment/historyList", {params: {treatment_patient_id}});
  return promise;
}

export function getTreatmentHistoryRead(treatment_id) {
  const promise = axios.get("/treatment/historyRead", {params: {treatment_id}});
  return promise;
  
}

export function updateTreatment(treatment) {
  const promise = axios.put("/treatment",treatment);
  return promise;
  
}

export function getSearchDurg(keyword="", condition="") {
  const promise = axios.get("/treatment/keyword", {params: {keyword, condition}});
  return promise;
}

export function getCategoryInspectionList() {
  const promise = axios.get("/treatment/categoryValue");
  return promise;
}
// drugsInjections 등록하기
export function createDruglist(selectedDrug){
  const promise = axios.post("/treatment/drugsInjections", selectedDrug);
  return promise;
}
