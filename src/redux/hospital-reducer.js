//상태 조건값 선언
const initialState = {
  hid: "",
  hname: "", //병원 이름
  haddress: "",
  hurl: "",
  hlat: "37.52684965592309",
  hlong: "127.10834881127674",
};

//액션 타입 선언
const SET_HID = "hospital/setHid";
const SET_HNAME = "hospital/setHname";
const SET_HADDRESS = "hospital/setHaddress";
const SET_HURL = "hospital/setHURL";
const SET_HLAT = "hospital/setHLAT";
const SET_HLONG = "hospital/setHLONG";

//액션 생성 함수 선언
export const createSetHidAction = (hid) => {
  return {
    type: SET_HID,
    hid: hid,
  };
};

export const createSetHnameAction = (hname) => {
  return {
    type: SET_HNAME,
    hname: hname,
  };
};

export const createSetHaddressAction = (haddress) => {
  return {
    type: SET_HADDRESS,
    haddress: haddress,
  };
};

export const createSetHurlAction = (hurl) => {
  return {
    type: SET_HURL,
    hurl: hurl,
  };
};

export const createSetHLATAction = (hlat) => {
  return {
    type: SET_HLAT,
    hlat: hlat,
  };
};

export const createSetHLONGAction = (hlong) => {
  return {
    type: SET_HLONG,
    hlong: hlong,
  };
};

//리듀스 선언
const hospitalReducer = (state = initialState, action) => { //default값 넣어줌 initialState
  if (action.type === SET_HID) {
    return { ...state, hid: action.hid };
  } else if(action.type === SET_HNAME){
    return { ...state, hname: action.hname };
  } else if(action.type === SET_HADDRESS){
    return { ...state, haddress: action.haddress };
  } else if(action.type === SET_HURL){
    return { ...state, hurl: action.hurl };
  } else if(action.type === SET_HLAT){
    return { ...state, hlat: action.hlat };
  } else if(action.type === SET_HLONG){
    return { ...state, hlong: action.hlong };
  } else {
    return state;
  }
};

export default hospitalReducer;