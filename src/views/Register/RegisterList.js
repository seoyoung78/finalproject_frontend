import "./Register.css";
import DatePicker from "react-datepicker";
import { useEffect, useState, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import ko from 'date-fns/locale/ko';
import moment from "moment";
import { registerLocale } from "react-datepicker";
import { changeRegisterState, getRegisterList } from "apis/register";
import Spinner from "components/common/Spinner";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import Nodata from "components/common/NoData";
import React from "react";
import RegisterListItem from "./components/items/RegisterListItem";
registerLocale("ko", ko);

function RegisterList(props) {
  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------

  // 공통 날짜 상태 
  const { registerDate, setSelectedPatient, setRegisterDate, publishTopic, message } = props;
  // 접수 목록 상태
  const [registerList, setRegisterList] = useState([]);

  // 접수 날짜 검색
  const [startDate, setStartDate] = useState(registerDate);
  //const [dateForRegister2, setDateForRegister2] = useState(registerDate);

  // 접수 상태 (대기, 완료, 취소)
  const [registerStateReady, setRegisterStateReady] = useState(0);
  const [registerStateFinish, setRegisterStateFinish] = useState(0);
  const [registerStateCancel, setRegisterStateCancel] = useState(0);

  // 선택된 접수 상태
  const [selectedRegister, setSelectedRegister] = useState();

  // spinner 
  const [loading, setLoading] = useState(false);

  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------

  // 날짜 이동 버튼
  const searchDateBtn = (newDate) => {
    setRegisterDate(newDate);
  };

  // 체크박스 클릭시 체크 됨
  const checkboxHandler = (register_id) => {
    if (register_id === selectedRegister) {
      setSelectedRegister(register_id);
    } else {
      setSelectedRegister(register_id);
      const selectPatient = registerList.find(register => {
        // 해당 아이디의 정보를 찾아서 수정
        if (register.register_id === register_id) {
          return true;
        }
      });
      setSelectedPatient(selectPatient);
    }
  };

  // 진료 상태 대기 -> 완료로 
  const changeRegisterStateToFinish = async (register_id) => {
    try {
      var finishValidation = true;
      let selectRegister = registerList.find(register => {
        if (register.register_id === register_id) {
          if (register.register_state === "대기") {
            return register;
          }
        }
      });
      if (selectRegister) {
        if (finishValidation) {
          selectRegister.register_state = "완료";
          var list = await changeRegisterState(selectRegister);
          publishTopic(0);
          publishTopic(1);
        }
      } else {
        ToastsStore.success("대기 환자를 체크해 주세요.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 진료 상태 대기 -> 취소로 
  const changeRegisterStateToCancel = async (register_id) => {
    try {
      let selectRegister = registerList.find(register => {
        if (register.register_id === register_id) {
          if (register.register_state === "대기") {
            return register;
          }
        }
      });
      if (selectRegister) {
        selectRegister.register_state = "취소";
        var list = await changeRegisterState(selectRegister);
        publishTopic(0);
      } else {
        ToastsStore.success("대기 환자를 체크해 주세요.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 전체 보여주기
  const showTotal = async () => {
    setLoading(true);
    try {
      var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "");
      setRegisterList(list.data.registerList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 대기 보여주기
  const showReady = async () => {
    setLoading(true);
    try {
      var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "대기");
      setRegisterList(list.data.registerList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 완료 보여주기
  const showFinish = async () => {
    setLoading(true);
    try {
      var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "완료");
      setRegisterList(list.data.registerList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 취소 보여주기
  const showCancel = async () => {
    setLoading(true);
    try {
      var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "취소");
      setRegisterList(list.data.registerList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------------------------------
  //실행 함수
  //-------------------------------------------------------------

  //해당 날짜에 맞는 리스트 가져오기
  const getList = async (date) => {
    setLoading(true);
    try {
      var list = await getRegisterList(moment(date).format("yyyy-MM-DD HH:mm"), "");
      setRegisterList(list.data.registerList);
      getRegistersState(list.data.registerList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //리스트의 개수 새기
  const getRegistersState = (registerList) => {
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    for (var i = 0; i < registerList.length; i++) {
      if (registerList[i].register_state === "대기") {
        count1++;
      } else if (registerList[i].register_state === "완료") {
        count2++;
      } else if (registerList[i].register_state === "취소") {
        count3++;
      }
    }
    setRegisterStateReady(count1); // 대기
    setRegisterStateFinish(count2); // 완료
    setRegisterStateCancel(count3); // 취소
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------


  useEffect(() => {
    const work = async () => {
      setLoading(true);
      try {
        var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "");
        setRegisterList(list.data.registerList);
        getRegistersState(list.data.registerList);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    work();
  }, [registerDate]);

  useEffect(() => {
    //console.log("MESSAGE: ", message);
    const work = async () => {
      setLoading(true);
      try {
        var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "");
        setRegisterList(list.data.registerList);
        getRegistersState(list.data.registerList);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (message.content === "refreshRegisters") {
      ToastsStore.success("접수현황이 갱신 되었습니다.");
      work();
    }
  }, [message]);

  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <div>
      {/* 상단 메뉴 이름 + 버튼 */}
      <div className="RegisterList_header">
        <div className="RegisterList_header_content">
          접수 내역
        </div>
        <div className="RegisterList_header_button">
          <Link to="/Patient" ><button className="button_team2_fill">신규 환자 등록</button></Link>
        </div>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
      {/* 하단 내용 */}
      <div className="RegisterList_content border">
        {/* 달력 , 상태 , 완료 버튼 */}
        <div className="RegisterList_content_1">
          <div className="RegisterList_content_1_1">
            <div>
              <DatePicker locale="ko" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy.MM.dd" />
            </div>
            <div>
              <button className="button_team2_fill" onClick={() => searchDateBtn(startDate)}>이동</button>
            </div>
          </div>
          <div className="RegisterList_content_1_2">
            <div className="RegisterList_content_1_2_total" onClick={showTotal}>
              전체: {registerStateReady + registerStateFinish + registerStateCancel}명
            </div>
            <div className="RegisterList_content_1_2_ready" onClick={showReady}>
              대기: {registerStateReady}명
            </div>
            <div className="RegisterList_content_1_2_finish" onClick={showFinish}>
              완료: {registerStateFinish}명
            </div>
            <div className="RegisterList_content_1_2_cancel " onClick={showCancel}>
              취소: {registerStateCancel}명
            </div>
          </div>
          <div className="RegisterList_content_1_3">
            <button className="button_team2_empty" onClick={() => changeRegisterStateToCancel(selectedRegister)}>접수 취소</button>
            <button className="button_team2_fill" onClick={() => changeRegisterStateToFinish(selectedRegister)}>진료 시작</button>
          </div>
        </div>
        {/* 접수 내역 테이블 */}
        <div className="RegisterList_content_2">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>순번</th>
                <th>예약 시간</th>
                <th>접수 번호</th>
                <th>환자명</th>
                <th>생년월일</th>
                <th>성별</th>
                <th>담당의</th>
                <th>접수 메모</th>
                <th>의사소통 메모</th>
                <th>접수 상태</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <Spinner />
                : registerList.length === 0 ?
                  <tr>
                    <td colSpan="12">
                      <React.Fragment>
                        <Nodata />
                      </React.Fragment>
                    </td>
                  </tr>
                  : <>
                    {registerList.map((register, index) => {
                      return (
                        <RegisterListItem
                          key={index}
                          index={index}
                          register={register}
                          selectedRegister={selectedRegister}
                          checkboxHandler={checkboxHandler}
                        />
                      );
                    })} </>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default RegisterList;
