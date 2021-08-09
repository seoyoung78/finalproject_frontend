import { removeAuthHeader } from "apis/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createSetAuthTokenAction, createSetUidAction, cresteSetUauthorityAction } from "redux/auth-reducer";
import React, { useState } from "react";
import Auth from "./views/Auth";
import { RiCalendarCheckLine, RiStethoscopeFill, RiTestTubeFill } from "react-icons/ri";
import { IoBarChart } from "react-icons/io5";
import WeatherAPI from "components/common/WeatherAPI";
import { createSetHaddressAction, createSetHidAction, createSetHLATAction, createSetHLONGAction, createSetHnameAction, createSetHurlAction } from "redux/hospital-reducer";

function Header(props) {  
  const globalUid = useSelector((state) => state.authReducer.uid);
  const hname = useSelector((state) => state.hospitalReducer.hname);
  const hospital_url = useSelector((state) => state.hospitalReducer.hurl);
  const hlat = useSelector((state) => state.hospitalReducer.hlat);
  const hlong = useSelector((state) => state.hospitalReducer.hlong);

  const dispatch = useDispatch();

  const logout = (event) => {
    dispatch(createSetUidAction(""));
    dispatch(createSetAuthTokenAction(""));
    dispatch(cresteSetUauthorityAction(""));
    dispatch(createSetHnameAction(""));
    dispatch(createSetHidAction(""));
    dispatch(createSetHaddressAction(""));
    dispatch(createSetHurlAction(""));
    dispatch(createSetHLATAction(""));
    dispatch(createSetHLONGAction(""));
    removeAuthHeader();
    
    // SessionStorage에 인증 내용 제거
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("uauthority");
    sessionStorage.removeItem("hname");
    sessionStorage.removeItem("hid");
    sessionStorage.removeItem("haddress");
    sessionStorage.removeItem("hurl");
    sessionStorage.removeItem("hlat");
    sessionStorage.removeItem("hlong");
  };

  //---------------------------------------------------------------------------------------
  // 모달 상태(open일 떄 true로 바뀌어 열림)
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="header">
      <div className="header1">
        <div className="header1_1">
          <span className="logo">TEAM2<img className="ml-1" src="/resources/img/logo_white_bold.png" alt="" width={30}></img></span>
        </div>
        <div className="header1_2">
          {globalUid?
          <WeatherAPI hlat={hlat} hlong={hlong}/>
          :
          false
          }
        </div>
        <div className="header1_3">
          {globalUid !== ""?
            <div className="header1_3_1">
              <div>
                <a className="header_url" href={hospital_url} target="_blank" rel="noreferrer">{hname}</a>
              </div>
              <div className="header_auth" >         
                <React.Fragment>
                  <span onClick={openAuthModal}>
                  {globalUid} 님
                  </span>
                  <Auth openModal={authModalOpen} closeModal={closeAuthModal}></Auth>
                </React.Fragment>
              </div>
              <div><Link to="/"><button className="button_team2_empty" onClick={logout}>LOGOUT</button></Link></div>
            </div>
          :
            <div className="d-flex justify-content-end"><Link to="/" className="button_team2_empty">LOGIN</Link></div>
          }
        </div>
      </div>
      {globalUid === ""? "":
        <div className="header2 row no-gutters">
          <div className="col-4 row d-flex justify-content-between ml-1">
            <div><Link to="/Register" className="link_team2"><RiCalendarCheckLine className="mr-1"/>접수</Link></div>
            <div><Link to="/Treatment" className="link_team2"><RiStethoscopeFill className="mr-1"/>진료</Link></div>
            <div><Link to="/Inspection" className="link_team2"><RiTestTubeFill className="mr-1"/>검사 및 치료</Link></div>
            <div><Link to="/DataAnalysis" className="link_team2"><IoBarChart className="mr-1"/>데이터분석</Link></div>
          </div>
          <div className="col-7"></div>
          <div className="col-1 row d-flex justify-content-end">
            <div><Link to="/User" className="link_team2 mr-2"><i className="bi bi-people-fill mr-1"></i>직원관리</Link></div>
          </div>
        </div>
      }
    </div>
  );
}

export default Header;