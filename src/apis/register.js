import axios from "axios";

/* Register  ------------------------------------------------------------- */

// register 불러오기 
export function getRegisterList(date, state=""){
  const promise = axios.get("/register", {params: {date, state}});
  return promise;
}

// register 등록하기
export function createRegister(register){
  const promise = axios.post("/register", register);
  return promise;
}

// register 업데이트
export function updateRegister(register){
  const promise = axios.put("/register", register);
  return promise;
}

// register 상태변경
export function changeRegisterState(register){
  const promise = axios.put("/register/state", register);
  return promise;
}

/* User ------------------------------------------------------------------ */

// 의사 불러오기
export function getDoctorList(date){
  const promise = axios.get("/register/doctors");
  return promise;
}

// 환자 불러오기
export function getPatientList(date){
  const promise = axios.get("/register/patients");
  return promise;
}

/* To Do List ------------------------------------------------------------- */

// ToDoList 불러오기
export function getToDoLists(date, user_id){
  const promise = axios.get("/register/todolists", {params: {date, user_id}});
  return promise;
}

// ToDoList 추가
export function createToDoLists(schedule){
  const promise = axios.post("/register/todolists", schedule);
  return promise;
}

// ToDoList 변경
export function updateToDoLists(schedule){
  const promise = axios.put("/register/todolists", schedule);
  return promise;
}

// ToDoList 삭제
export function deleteToDoLists(id){
  const promise = axios.delete("/register/todolists", {params: {id}});
  return promise;
}

// ToDoList 캘린더 의사별 월별 환자 예약수 불러오기
export function getRegisterByDoctor(user_id, date){
  const promise = axios.get("/register/calendar",{params: {user_id, date}});
  return promise;
}