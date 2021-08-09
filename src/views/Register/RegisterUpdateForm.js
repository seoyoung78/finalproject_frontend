import DatePicker from "react-datepicker";
import { useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import { changeRegisterState, updateRegister } from "apis/register";
import moment from "moment";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
registerLocale("ko", ko);

function RegisterUpdateForm(props) {
  // props 상속
  const { selectedPatient, doctors, setSelectedPatient, changeRegister, cancelRegister, publishTopic } = props;

  // 빈 객체
  const noneRegister = {
    register_id: "",
    register_patient_id: "",
    register_user_id: "",
    register_regdate: "",
    register_date: new Date(),
    register_starttime: "",
    register_memo: "",
    register_communication: "",
    register_state: "",

    // 추가된 DTO
    patient_name: "",
    patient_ssn: "",
    patient_sex: "",
    patient_tel: "",

    user_name: ""
  };
  var selectPatient;
  if (selectedPatient) {
    selectPatient = selectedPatient;
  } else {
    selectPatient = noneRegister;
  }
  const noneDoctor = {
    user_id: "",
    user_hospital_id: "",
    user_password: "",
    user_name: "",
    user_ssn: "",
    user_tel: "",
    user_email: "",
    user_sex: "",
    user_zipcode: "",
    user_address: "",
    user_detailaddress1: "",
    user_detailaddress2: "",
    user_regdate: "",
    user_enabled: "",
    user_authority: "",
  };
  var doctorlist;
  if (doctors) {
    doctorlist = doctors;
  } else {
    doctorlist = noneDoctor;
  }

  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------

  // 진료 날짜 상태

  const [startDate, setStartDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [minTime, setMinTime] = useState(setHours(setMinutes(new Date(), 0), 9));
  const [maxTime, setMaxTime] = useState(setHours(setMinutes(new Date(), 45), 17));
  const [showTimeSelect, setShowTimeSelect] = useState(true);


  // 담당의 상태

  // 다른 의사들
  const [doctorsList, setDoctorsList] = useState(doctorlist);
  // 선택된 의사
  const [newDoctor, setNewDoctor] = useState(selectPatient.register_user_id);
  const changeNewDoctor = useCallback((event) => {
    setNewDoctor(event.target.value);
  },[]);

  // 접수 메모 상태
  const [newMemo, setNewMemo] = useState(selectPatient.register_memo);
  const changeNewMemo = useCallback((event) => {
    setNewMemo(event.target.value);
  },[]);

  // 의사소통 메모 상태
  const [newCommunication, setNewCommunication] = useState(selectPatient.register_communication);
  const changeNewCommunication = useCallback((event) => {
    setNewCommunication(event.target.value);
  },[]);
  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------
  const updateRegisterBtn = async (event) => {
    try {
      let new_doctor = doctorsList.find((doctor) => {
        if (doctor.user_id === newDoctor) {
          return true;
        }
      });
      let newRegister = {
        register_id: selectPatient.register_id,
        register_patient_id: selectPatient.register_patient_id,
        register_user_id: newDoctor,
        register_regdate: selectPatient.register_regdate,
        register_date: moment(startDate).format("yyyy-MM-DD HH:mm"),
        register_starttime: "",
        register_memo: newMemo,
        register_communication: newCommunication,
        register_state: selectPatient.register_state,
        patient_name: selectPatient.patient_name,
        patient_ssn: selectPatient.patient_ssn,
        patient_sex: selectPatient.patient_sex,
        patient_tel: selectPatient.patient_tel,
        user_name: new_doctor.user_name
      };
      var list = await updateRegister(newRegister);
      //console.log("업데이트",list.data.result);
      if (list.data.result === "중복") {
        ToastsStore.success("이미 예약이 되어있습니다.");
      } else if (list.data.result === "성공") {
        publishTopic(0);
        setSelectedPatient(newRegister);
        changeRegister();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const cancelRegisterForm = (event) => {
    cancelRegister();
  };

  // datepicker 옵션
  let handleColor = (time) => {
    return (time.getHours() > 8 && time.getHours() < 18 ? "hourStyle" : "");
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------
  useEffect(() => {
    setStartDate(props.selectedPatient ? new Date(props.selectedPatient.register_date) : new Date());
    return () => {
      changeRegister();
    }
  }, [props.selectedPatient]);
  useEffect(() => {
    setMinDate(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && (startDate.getHours() >= 18))
        // || (startDate.getHours() <= 18)))
        ? new Date().setDate(new Date().getDate() + 1) : new Date()
    );
  }, []);
  useEffect(() => {
    setShowTimeSelect(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && (startDate.getHours() >= 18))
        ? false : true
    );

    setMinTime(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && ((startDate.getHours() >= 9)
          || (startDate.getHours() <= 18)))
        ? new Date() : setHours(setMinutes(new Date(), 0), 9)
    );
    setMaxTime(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && ((startDate.getHours() >= 9)
          || (startDate.getHours() <= 18)))
        ? setHours(setMinutes(new Date(), 45), 17) : setHours(setMinutes(new Date(), 45), 17)
    );
  }, [props.selectedPatient.register_date, startDate]);
  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <>
      {/* 상단 메뉴 이름 */}
      <div className="RegisterUpdateForm_header">
        접수 수정
      </div>
      {/* 하단 내용 */}
      <div className="RegisterUpdateForm_content border">
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        {/* 접수 상세 내역 내용 */}
        <div className="RegisterUpdateForm_content_form">
          <form>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                환자명:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <input className="RegisterUpdateForm_content_list_input_readOnly" type="text" value={selectPatient.patient_name} readOnly />
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                생년월일:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <input className="RegisterUpdateForm_content_list_input_readOnly" type="text" value={selectPatient.patient_ssn ? selectPatient.patient_ssn.substring(0, 6) : selectPatient.patient_ssn} readOnly />
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                성별:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.patient_sex} readOnly />
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                전화번호:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <input className="RegisterUpdateForm_content_list_input_readOnly" type="text" value={selectPatient.patient_tel} readOnly />
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                담당의:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <select className="RegisterUpdateForm_input_select" value={newDoctor} onChange={changeNewDoctor}>
                  <option disabled>담당의를 선택해주세요</option>
                  {/* 임의의 데이터 넣어서 출력 해보기 */}
                  {doctorsList.map(doctor => {
                    return (
                      <option key={doctor.user_id} value={doctor.user_id}>{doctor.user_name}</option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                진료 날짜:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <DatePicker
                  locale="ko"
                  showTimeSelect={showTimeSelect}
                  selected={startDate}
                  onChange={(date) => { setStartDate(date); }}
                  timeIntervals={15}
                  timeCaption="시간"
                  minDate={minDate}
                  minTime={minTime}
                  maxTime={maxTime}
                  timeClassName={handleColor}
                  dateFormat="yyyy-MM-dd H:mm"
                />
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                접수 메모:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <input type="text" value={newMemo} onChange={changeNewMemo} />
              </div>
            </div>
            <div className="RegisterUpdateForm_content_list">
              <div className="RegisterUpdateForm_content_list_label">
                의사소통 메모:
              </div>
              <div className="RegisterUpdateForm_content_list_input">
                <input type="text" value={newCommunication} onChange={changeNewCommunication} />
              </div>
            </div>
          </form>
          {/* 수정 취소 버튼 */}
          <div className="RegisterUpdateForm_content_button">
            <button className="button_team2_empty" onClick={cancelRegisterForm} >취소</button>
            <button className="button_team2_fill" type="submit" onClick={updateRegisterBtn} >수정</button>
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterUpdateForm;
