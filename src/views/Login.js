import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createSetAuthTokenAction, createSetUidAction, cresteSetUauthorityAction } from "redux/auth-reducer";
import { useForm } from "react-hook-form";
import Help from "./Help";
import "./Login.css";
import { addAuthHeader } from "apis/axiosConfig";
import { login } from "apis/auth";
import { ValidationModal } from "../components/common/ValidationModal";
import { createSetHaddressAction, createSetHidAction, createSetHLATAction, createSetHLONGAction, createSetHnameAction, createSetHurlAction } from "redux/hospital-reducer";

function Login(props) {
  // 유저 상태
  const [user, setUser] = useState({
    userId: "",
    userPassword: ""
  });

  // Spinner
  const [loading, setLoading] = useState(false);

  // 바인딩할 상태함수
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  }

  // 로그인
  const loginUser = async (event) => {
    setLoading(true);
    try{
      // 로그인 요청
      const response = await login(user);
      // console.log(response.data);

      // 로그인 성공 시 JWT 저장 및 경로 이동
      if (response.data.result === "success") {
        // alert("로그인 성공");

        // 요청 헤더에 JWT 토큰 추가
        addAuthHeader(response.data.authToken);
        // // Redux에 인증 내용 저장      
        dispatch(createSetUidAction(response.data.uid));
        dispatch(createSetAuthTokenAction(response.data.authToken));
        dispatch(cresteSetUauthorityAction(response.data.uauthority));
        dispatch(createSetHnameAction(response.data.hname));
        dispatch(createSetHidAction(response.data.hid));
        dispatch(createSetHaddressAction(response.data.haddress));
        dispatch(createSetHLATAction(response.data.hlat));
        dispatch(createSetHLONGAction(response.data.hlong));
        dispatch(createSetHurlAction(response.data.hurl));

        // sessionStorage에 인증 내용 저장
        sessionStorage.setItem("uid", response.data.uid);
        sessionStorage.setItem("authToken", response.data.authToken);
        sessionStorage.setItem("uauthority", response.data.uauthority);
        sessionStorage.setItem("hname", response.data.hname);
        sessionStorage.setItem("hid", response.data.hid);
        sessionStorage.setItem("haddress", response.data.haddress);
        sessionStorage.setItem("hlat", response.data.hlat);
        sessionStorage.setItem("hlong", response.data.hlong);
        sessionStorage.setItem("hurl", response.data.hurl);
        
        // 로그인 아이디에 따른 경로 지정
        if(user.userId.slice(0,1) === "N") {
          props.history.push("/Register");}
        else if (user.userId.slice(0,1) === "D") {
          props.history.push("/Treatment");
        } else if (user.userId.slice(0,1) === "I") {      
          props.history.push("/Inspection");
        } 
      } else if (response.data.result === "notCorrectPW" || response.data.result === "notFindID") {
        openModal();
        // alert("로그인 실패 : 아이디 혹은 비밀번호가 맞지 않습니다.");
        setErrorMsg({
          ...errorMsg,
          content: "올바른 아이디/비밀번호를 입력해주세요."
        })        
      }  else if (response.data.result === "notEnabled") {
        openModal();
        setErrorMsg({
          ...errorMsg,
          content: "비활성화된 계정입니다."
        });      
      } 
    } catch(error) {
      console.log(error);      
    } finally {
      setLoading(false);
    }  
  };
  
  //---------------------------------------------------------------------------------------
  // 공지사항
  const [bid, setBid] = useState("0");

  const boardClick = (id) => {
    if (bid !== id) {
      setBid(id);
    } else {
      setBid("0");
    }
  };

  
  //---------------------------------------------------------------------------------------
  // 유효성 검사를 위한 함수 사용
  const { handleSubmit, register, errors } = useForm({ mode: "onChange" });
  // 모달 상태(open일 떄 true로 바뀌어 열림)
  const [modalOpen, setModalOpen] = useState(false);
  // 유효성 검사 오류 메시지
  const [errorMsg, setErrorMsg] = useState({
    title : "로그인 실패",
    content: ""
  });

  const openModal = (event) => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  
  return (
    <div className="box">
      <div className="Login">
        <div className="back">
          <div className="d-flex justify-content-center align-items-center mb-5">
            <h2 className="text-center mr-4">의료정보 시스템</h2>
            <div>
              <img src="/resources/img/logo_blue.png" alt="" width={70}></img>
            </div>
          </div>
          <form onSubmit={handleSubmit(loginUser)}>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">아이디</label>
              <div className="col-sm">
                <input type="text" className="form-control" name="userId" ref={register({required: true})} onChange={handleChange}></input>
                <div className={errors.userId? "Login_error" : "Login_noterror"}>아이디를 입력해주세요.</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">비밀번호</label>
              <div className="col-sm">
                <input type="password" className="form-control Login_password" name="userPassword" ref={register({required:true})} onChange={handleChange}></input>
                <div className={errors.userPassword? "Login_error" : "Login_noterror"}>비밀번호를 입력해주세요.</div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {loading ? 
              <button className="button_team2_fill" disabled>
                <div className="spinner-border spinner-border-sm"></div>
                <span className="pl-1">LOADING</span>
              </button>              
              :
              <button className="button_team2_fill" type="submit">LOGIN</button> }
              <React.Fragment>
                <ValidationModal open={modalOpen} close={closeModal} errorMsg={errorMsg}></ValidationModal>
              </React.Fragment>
            </div>
          </form>
        </div>
      </div>
      <div>
        <div>
          <Help/>
        </div>
        <div className="Board">
          <div className="Board_title">공지사항</div>
          <div className="text-center border">
            <div className="Board_table">
              <div style={{width: "10%"}}>분류</div>
              <div style={{width: "75%"}}>제목</div>
              <div style={{width: "15%"}}>작성일</div>
            </div>
            <div className={bid === "1"? "Board_tr active" : "Board_tr"} onClick={() => boardClick("1")}>
              <div style={{width: "10%"}}>[공지]</div>
              <div style={{width: "75%"}}>서버 점검 관련 사항 공지</div>
              <div style={{width: "15%"}}>2021-06-01</div>
            </div>
            <div className={bid === "1"? 'show' : 'Board_content'}>
              <div>서버 점검으로 인해 2021-06-12 23시 00분부터 2021-06-13 04시 30분까지 프로그램 이용이 <br></br> 어려울 수 있습니다.</div>
            </div>
            <div className={bid === "2"? "Board_tr active" : "Board_tr"} onClick={() => boardClick("2")}>
              <div style={{width: "10%"}}>[공지]</div>
              <div style={{width: "75%"}}>사용자 가이드 외 이용사항 문의 공지</div>
              <div style={{width: "15%"}}>2021-06-01</div>
            </div>
            <div className={bid === "2"? 'show' : 'Board_content'}>
              <div>사용자 가이드 외의 문의사항은 온라인 고객센터 혹은 원격 A/S 1688-6000을 통해 문의해주세요.</div>
            </div>
            <div className={bid === "3"? "Board_tr active" : "Board_tr"} onClick={() => boardClick("3")}>
              <div style={{width: "10%"}}>[공지]</div>
              <div style={{width: "75%"}}>처음 사용하는 사용자를 위한 프로그램 이용 관련 문의</div>
              <div style={{width: "15%"}}>2021-06-01</div>
            </div>
            <div className={bid === "3"? 'show' : 'Board_content'}>
              <div>
                상단에 존재하는 사용자 가이드를 클릭하시면 사용설명서를 다운 받으실 수 있습니다. <br/>
                그 외의 문의 사항은 온라인 고객센터를 통해 문의 바랍니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;