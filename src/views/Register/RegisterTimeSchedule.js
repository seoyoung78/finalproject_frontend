import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "./Register.css";
import moment from "moment";
import RegisterCreateModal from "./components/modal/RegisterCreateModal";
import { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import RegisterWeekTimeTableModal from "./components/modal/RegisterWeekTimeTableModal";
import { getDoctorList, getRegisterList } from "apis/register";
import RegisterTimeScheduleItems from "views/Register/components/items/RegisterTimeScheduleItems";

registerLocale("ko", ko);
// 타임테이블 - 진료 시간 
const hours = ["9", "10", "11", "12", "13", "14", "15", "16", "17"];
const mins = ["0", "15", "30", "45"];

function RegisterTimeSchedule(props) {
  // 빈 객체
  let noneRegister = {
    register_id: "",
    register_patient_id: "",
    register_user_id: "",
    register_regdate: "",
    register_date: new Date(),
    register_starttime: "",
    register_memo: "",
    register_communication: "",
    register_state: "",

    // 추가된 DTO 내용
    patient_name: "",
    patient_ssn: "",
    patient_sex: "",
    patient_tel: "",

    user_name: "",
  };

  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------
  const { registerDate, setRegisterDate, publishTopic, setPubMessage, message } = props;

  const [doctors, setDoctors] = useState([]);
  const [registers, setRegisters] = useState([]);
  //const [startDate, setStartDate] = useState(new Date());
  const [selectedRegister, setSelectedRegister] = useState(noneRegister);

  //신규 접수 등록 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [headerContent, setHeaderContent] = useState("신규");

  //신규 시간을 누른 모달
  const [selectTimeModalOpen, setSelectTimeModalOpen] = useState(false);

  //선택된 시간 상태
  const [selectedTime, setSelectedTime] = useState(new Date());

  //선택된 의사 상태
  const [selectedRegisterDoctor, setSelectedRegisterDoctor] = useState("");

  // 의사별 개인 타임 테이블 모달
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [registerWeekTimeTableOpen, setRegisterWeekTimeTableOpen] = useState(false);

  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------

  const openModal = () => {
    //setSelectedRegister(noneRegister);
    setSelectedRegisterDoctor("doctor");
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedRegister(noneRegister);
    setSelectedRegisterDoctor("doctor");
    setModalOpen(false);
  };

  const openSelectTimeModal = (h, m, d) => {
    //console.log(registerDate);
    setSelectedTime(new Date(registerDate.getFullYear(), registerDate.getMonth(), registerDate.getDate(), h, m));
    //console.log(selectedTime);
    setSelectedRegisterDoctor(d);
    setSelectTimeModalOpen(true);
  };

  const closeSelectTimeModal = () => {
    setSelectedRegisterDoctor("doctor");
    setSelectTimeModalOpen(false);
  };

  //기존 접수 수정 모달
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const openRegisterModal = (register) => {
    setHeaderContent(register.register_state);
    setSelectedRegister(register);
    setRegisterModalOpen(true);
  };
  const closeRegisterModal = () => {
    setSelectedRegister(noneRegister);
    setRegisterModalOpen(false);
  };

  // 의사 투두 리스트 모달
  const openRegisterWeekTimeTableOpen = (doctor) => {
    setSelectedDoctor(doctor);
    setRegisterWeekTimeTableOpen(true);
  };
  const closeRegisterWeekTimeTableOpen = () => {
    setRegisterWeekTimeTableOpen(false);
  };

  //-------------------------------------------------------------
  //실행 함수
  //-------------------------------------------------------------

  //해당 날짜에 맞는 리스트 가져오기
  const getRegisterLists = async (date) => {
    try {
      var list = await getRegisterList(date);
      //console.log(list.data.tableRegisterList);
      setRegisters(list.data.tableRegisterList);
    } catch (e) {
      console.log(e);
    }
  };
  const getDoctorLists = async () => {
    try {
      var list = await getDoctorList();
      setDoctors(list.data.doctorList);
    } catch (e) {
      console.log(e);
    }
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------

  useEffect(() => {
    getDoctorLists();
  }, []);

  useEffect(() => {
    getRegisterLists(moment(registerDate).format("yyyy-MM-DD HH:mm"));
  }, [registerDate]);

  useEffect(() => {
    //console.log("MESSAGE: ", message);
    const work = async () => {
      try {
        var list = await getRegisterList(moment(registerDate).format("yyyy-MM-DD HH:mm"), "");
        setRegisters(list.data.tableRegisterList);
      } catch (e) {
        console.log(e);
      }
    };
    if (message.content === "refreshRegisters") {
      work();
    }
  }, [message, registerDate]);
  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <>
      {/* 상단 버튼 */}
      <div className="RegisterTimeSchedule_header">
        <div className="RegisterTimeSchedule_header_btn">
          <button className="button_team2_fill" onClick={openModal}>신규 접수 등록</button>
        </div>
        <React.Fragment>
          <RegisterCreateModal
            open={modalOpen}
            close={closeModal}
            header="신규 접수 등록"
            doctors={doctors}
            register={selectedRegister}
            setPubMessage={setPubMessage}
            publishTopic={publishTopic}
            selectedRegisterDoctor={selectedRegisterDoctor}
          />
          <RegisterCreateModal
            open={selectTimeModalOpen}
            close={closeSelectTimeModal}
            header="신규 접수 등록"
            doctors={doctors}
            register={selectedRegister}
            setPubMessage={setPubMessage}
            publishTopic={publishTopic}
            selectedTime={selectedTime}
            selectedRegisterDoctor={selectedRegisterDoctor}
          />
          <RegisterCreateModal
            open={registerModalOpen}
            close={closeRegisterModal}
            header={headerContent + " 내역"}
            doctors={doctors}
            register={selectedRegister}
            setPubMessage={setPubMessage}
            publishTopic={publishTopic}
          />
          <RegisterWeekTimeTableModal
            open={registerWeekTimeTableOpen}
            close={closeRegisterWeekTimeTableOpen}
            header={"Dr. " + selectedDoctor.user_name}
            selectedDoctor={selectedDoctor}
            setPubMessage={setPubMessage}
            publishTopic={publishTopic}
          />
        </React.Fragment>
      </div>
      {/* 스케쥴 타임테이블 */}
      <div className="RegisterTimeSchedule_content">
        <div className="RegisterTimeSchedule_content_title">
          {/* 오늘 날짜 */}
          <div className="RegisterTimeSchedule_content_title_today">
            <ReactDatePicker
              locale="ko"
              selected={registerDate}
              onChange={(date) => setRegisterDate(date)}
              dateFormat="M/dd"
              readOnly
            />
          </div>
          {/* 9시~18시 */}
          <div className="RegisterTimeSchedule_content_title_hours">
            {hours.map(hour => {
              return (
                <div className="RegisterTimeSchedule_content_title_hours_hour" key={hour}>
                  <div className="RegisterTimeSchedule_content_title_hours_hour_upside">
                    {hour}시
                  </div>
                  <div className="RegisterTimeSchedule_content_title_hours_hour_downside">
                    {mins.map((min, index) => {
                      let currentTime = moment().format("YYYY-MM-DD H:m");
                      let minCurrentTime = moment(registerDate).format("YYYY-MM-DD") + " " + hour + ":" + min;
                      let maxCurrentTime = moment(minCurrentTime).add(15, "m");
                      if (moment(currentTime).isBetween(minCurrentTime, maxCurrentTime, undefined, '[)')) {
                        return (
                          <div className="RegisterTimeSchedule_content_title_hours_hour_downside_content_today" key={index}>
                            {min}
                          </div>
                        )
                      } else {
                        return (
                          <div className="RegisterTimeSchedule_content_title_hours_hour_downside_content" key={index}>
                            {min}
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="RegisterTimeSchedule_content_timetable">
          {doctors.map((doctor, index) => {
            return (
              <div className="RegisterTimeSchedule_content_timetable_doctors" key={index}>
                <div className="RegisterTimeSchedule_content_timetable_doctors_doctor" onDoubleClick={() => openRegisterWeekTimeTableOpen(doctor)}>
                  {doctor.user_name}님
                </div>
                <div className="RegisterTimeSchedule_content_timetable_doctors_registers">
                  {hours.map((hour, index1) => {
                    return (
                      <div className="RegisterTimeSchedule_content_timetable_doctors_registers_group" key={index1}>
                        {mins.map((min, index2) => {
                          return (
                            <div className="RegisterTimeSchedule_content_timetable_doctors_registers_register" onDoubleClick={() => openSelectTimeModal(hour, min, doctor.user_id)} key={index2}>
                              {registers.map((register, index3) => {
                                if ((register.register_user_id === doctor.user_id)
                                  && (moment(register.register_date).format("YYYY-MM-DD H:m") === (moment(registerDate).format("YYYY-MM-DD") + " " + hour + ":" + min))) {
                                  if (register.register_state === "대기") {
                                    if (index < 4 && index1 < 8) {
                                      return (
                                        <div
                                          className="RegisterTimeSchedule_content_timetable_doctors_registers_register_ready tip_normal"
                                          onClick={() => { openRegisterModal(register) }} key={index3}
                                        >
                                          <RegisterTimeScheduleItems
                                            patient_name={register.patient_name}
                                            register_state={register.register_state}
                                            user_name={register.user_name}
                                          />
                                        </div>
                                      )
                                    } else {
                                      if (index >= 4 && index1 < 8) {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_ready tip_upside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      } else if (index < 4 && index1 >= 8) {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_ready tip_rightside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_ready tip_uprightside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      }
                                    }
                                  } else if (register.register_state === "완료") {
                                    if (index < 4 && index1 < 8) {
                                      return (
                                        <div
                                          className="RegisterTimeSchedule_content_timetable_doctors_registers_register_success tip_normal"
                                          onClick={() => { openRegisterModal(register) }} key={index3}
                                        >
                                          <RegisterTimeScheduleItems
                                            patient_name={register.patient_name}
                                            register_state={register.register_state}
                                            user_name={register.user_name}
                                          />
                                        </div>
                                      )
                                    } else {
                                      if (index >= 4 && index1 < 8) {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_success tip_upside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      } else if (index < 4 && index1 >= 8) {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_success tip_rightside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_success tip_uprightside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      }
                                    }
                                  } else if (register.register_state === "취소") {
                                    if (index < 4 && index1 < 8) {
                                      return (
                                        <div
                                          className="RegisterTimeSchedule_content_timetable_doctors_registers_register_cancel tip_normal"
                                          onClick={() => { openRegisterModal(register) }} key={index3}
                                        >
                                          <RegisterTimeScheduleItems
                                            patient_name={register.patient_name}
                                            register_state={register.register_state}
                                            user_name={register.user_name}
                                          />
                                        </div>
                                      )
                                    } else {
                                      if (index >= 4 && index1 < 8) {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_cancel tip_upside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      } else if (index < 4 && index1 >= 8) {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_cancel tip_rightside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div
                                            className="RegisterTimeSchedule_content_timetable_doctors_registers_register_cancel tip_uprightside"
                                            onClick={() => { openRegisterModal(register) }} key={index3}
                                          >
                                            <RegisterTimeScheduleItems
                                              patient_name={register.patient_name}
                                              register_state={register.register_state}
                                              user_name={register.user_name}
                                            />
                                          </div>
                                        )
                                      }
                                    }
                                  }
                                }
                              })}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
export default RegisterTimeSchedule;
