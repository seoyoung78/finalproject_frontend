import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import style from "./RegisterCreateForm.module.css";
import moment from "moment";

registerLocale("ko", ko);

function RegisterCreateForm(props) {
  //빈 객체
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

    // 추가된 DTO 
    patient_name: "",
    patient_ssn: "",
    patient_sex: "",
    patient_tel: "",

    user_name: "",
  };
  var register;
  if (props.register) {
    register = props.register;
  } else {
    register = noneRegister;
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
  var doctors;
  if (props.doctors) {
    doctors = props.doctors;
  } else {
    doctors = noneDoctor;
  }


  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------
  const [startDate, setStartDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [minTime, setMinTime] = useState(setHours(setMinutes(new Date(), 0), 9));
  const [maxTime, setMaxTime] = useState(setHours(setMinutes(new Date(), 45), 17));
  const [showTimeSelect, setShowTimeSelect] = useState(true);

  // 담당의 상태
  const [doctorsList, setDoctorsList] = useState(doctors);

  const [newDoctor, setNewDoctor] = useState(register.register_user_id ? register.register_user_id : "doctor");

  const changeNewDoctor = (event) => {
    setNewDoctor(event.target.value);
    props.setNewRegister({ ...props.newRegister, register_user_id: event.target.value });
  };

  // 메모 상태 
  const [newMemo, setNewMemo] = useState(register.register_memo);

  const changeMemo = (event) => {
    setNewMemo(event.target.value);
    props.setNewRegister({ ...props.newRegister, register_memo: event.target.value });
  };

  // 의사소통 메모 상태 
  const [newCMemo, setNewCMemo] = useState(register.register_communication);

  const changeCMemo = (event) => {
    setNewCMemo(event.target.value);
    props.setNewRegister({ ...props.newRegister, register_communication: event.target.value });
  };

  // datepicker 옵션
  let handleColor = (time) => {
    return (time.getHours() > 8 && time.getHours() < 18 ? "hourStyle" : "");
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------
  useEffect(() => {
    if (props.selectedTime) {
      //console.log("bububu", props.selectedTime);
      setStartDate(props.selectedTime);
    }
  }, [props.selectedTime]);

  useEffect(() => {
    //console.log("ttet",props.register.register_date)
    //setStartDate(props.register ? new Date(props.register.register_date) : new Date());
    setDoctorsList(doctors);
  }, [doctors]);

  useEffect(() => {
    // if(props.selectedTime){
    //   setStartDate(props.selectedTime? props.selectedTime : new Date());
    // }
    setStartDate(props.register ? new Date(props.register.register_date) : new Date());
    setShowTimeSelect(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && (startDate.getHours() >= 18))
        ? false : true
    );
    setMinDate(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && (startDate.getHours() >= 18))
        ? startDate.setDate(new Date().getDate() + 1) : new Date()
    );
    if (new Date().getHours() >= 18) {
      setMinTime(new Date());
      setMaxTime(new Date());
    } else {
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
          ? new Date() : setHours(setMinutes(new Date(), 45), 17)
      );
    }
  }, []);

  useEffect(() => {
    setShowTimeSelect(() =>
      ((startDate.getFullYear() === new Date().getFullYear())
        && (startDate.getMonth() === new Date().getMonth())
        && (startDate.getDate() === new Date().getDate())
        && (startDate.getHours() >= 18))
        ? false : true
    );
    // setMinDate(() =>
    //   ((startDate.getFullYear() === new Date().getFullYear())
    //     && (startDate.getMonth() === new Date().getMonth())
    //     && (startDate.getDate() === new Date().getDate())
    //     && (startDate.getHours() >= 18))
    //     // || (startDate.getHours() <= 18)))
    //     ? new Date().setDate(new Date().getDate() + 1) : new Date()
    // );
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

  }, [startDate]);

  useEffect(() => {
    setNewDoctor(props.newRegister.register_user_id);
  }, [props.newRegister]);

  useEffect(() => {
    //console.log("hihihi", props.selectedTime);
    if (props.selectedTime) {
      setStartDate(props.selectedTime ? props.selectedTime : new Date());
    }
  }, [props.selectedTime])

  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <div className={`${style.RegisterCreateForm_content} border`}>
      {/* 달력 */}
      <div className={style.RegisterCreateForm_cal}>
        <DatePicker
          locale="ko"
          showTimeSelect={showTimeSelect}
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            props.setNewRegister({ ...props.newRegister, register_date: moment(date).format("yyyy-MM-DD H:mm") });
          }
          }
          timeIntervals={15}
          timeCaption="시간"
          minDate={minDate}
          minTime={minTime}
          maxTime={maxTime}
          dateFormat="yyyy-MM-dd h:mm"
          timeClassName={handleColor}
          inline
        />
      </div>
      {/* content */}
      <div className={style.RegisterCreateForm_input}>
        <form>
          <div>
            <div>의사 이름</div>
            <div>
              <select className={style.RegisterCreateForm_input_select} value={newDoctor} onChange={changeNewDoctor}>
                <option disabled value="doctor">담당의를 선택해주세요</option>
                {/* 임의의 데이터 넣어서 출력 해보기 */}
                {doctorsList.map(doctor => {
                  return (
                    <option key={doctor.user_id} value={doctor.user_id}>{doctor.user_name}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <div>접수 메모</div>
            <textarea className={style.RegisterCreateForm_input_textarea} value={newMemo} onChange={changeMemo}></textarea>
          </div>
          <div>
            <div>의사소통 메모</div>
            <textarea className={style.RegisterCreateForm_input_textarea} value={newCMemo} onChange={changeCMemo}></textarea>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RegisterCreateForm;
