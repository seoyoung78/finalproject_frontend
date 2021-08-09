import style from "./RegisterCreateModal.module.css";
import React, { useEffect, useState } from 'react';
import RegisterCreateForm from "./RegisterCreateForm";
import RegisterPatientList from "./RegisterPatientList";
import { createRegister, updateRegister } from "apis/register";
import moment from "moment";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import RegisterStateChange from "./RegisterStateChange";
function RegisterCreateModal(props) {
  // props 상속
  const { open, close, header, doctors, register, publishTopic, selectedTime, selectedRegisterDoctor } = props;
  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------
  const [newRegister, setNewRegister] = useState(register);
  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------
  const createNewRegister = async () => {
    try {
      var registerValidation = true;
      console.log("생성", newRegister);
      if (newRegister.register_patient_id === "") {
        registerValidation = false;
        ToastsStore.success("환자를 선택해 주세요.");
      }
      else if (newRegister.register_user_id === "" || newRegister.register_user_id === "doctor") {
        registerValidation = false;
        ToastsStore.success("담당의를 선택해 주세요.");
      }
      else if (newRegister.register_date < new Date() || moment(newRegister.register_date) < moment()) {
        registerValidation = false;
        ToastsStore.success("예약 시간을 선택해 주세요.");
      }
      // else if (new Date(newRegister.register_date).getHours() >= 18 
      // || new Date(newRegister.register_date).getHours() <= 9 ) {
      //   registerValidation = false;
      //   ToastsStore.success("예약 시간을 선택해 주세요.2");
      // }
      else if (newRegister.register_memo === "") {
        registerValidation = false;
        ToastsStore.success("메모를 입력해 주세요.");
      }
      // else if (newRegister.register_communication === "") {
      //   registerValidation = false;
      //   ToastsStore.success("의사소통 메모를 입력해 주세요.");
      // }
      if (registerValidation) {
        var list = await createRegister(newRegister);
        //console.log("결과값", list.data.result);
        if (list.data.result === "중복") {
          ToastsStore.success("이미 예약이 되어있습니다.");
        } else if (list.data.result === "성공") {
          publishTopic(0);
          close();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const updateNewRegister = async () => {
    try {
      console.log("갱신", newRegister);
      var registerValidation = true;
      if (newRegister.register_date < new Date() || moment(newRegister.register_date) < moment()) {
        registerValidation = false;
        ToastsStore.success("예약시간을 확인해 주세요.");
      } else if (new Date(newRegister.register_date).getHours() >= 18
        || new Date(newRegister.register_date).getHours() <= 9) {
        registerValidation = false;
        ToastsStore.success("예약 시간을 선택해 주세요.");
      }
      if (registerValidation) {
        var list = await updateRegister(newRegister);
        //console.log("결과값", list.data.result);
        if (list.data.result === "중복") {
          ToastsStore.success("이미 예약이 되어있습니다.");
        } else if (list.data.result === "성공") {
          publishTopic(0);
          close();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------  
  useEffect(() => {
    setNewRegister(register);
  }, [register]);

  useEffect(() => {
    //console.log("닥터1",selectedRegisterDoctor);
    if (selectedRegisterDoctor) {
      setNewRegister({
        ...register,
        register_user_id: selectedRegisterDoctor
      });
    }
  }, [open]);

  useEffect(() => {
    if (selectedTime) {
      if (selectedTime >= new Date()) {
        setNewRegister({ ...register, register_date: moment(selectedTime).format("yyyy-MM-DD H:mm") });
      }
    }
  }, [open, selectedTime]);

  useEffect(() => {
    //console.log("닥터2",selectedRegisterDoctor);
    if (selectedRegisterDoctor) {
      setNewRegister({
        ...register,
        register_date: moment(selectedTime).format("yyyy-MM-DD H:mm"),
        register_user_id: selectedRegisterDoctor
      });
    }
  }, [selectedRegisterDoctor]);

  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <div className={style.RegisterCreateModal}>
      <div className={open ? `${style.openModal} ${style.modal}` : `${style.modal}`}>
        {open ? (
          <section>
            <header>
              <div className={style.RegisterCreateModal1}>
                {header}
              </div>
            </header>
            <main>
              <div className={style.RegisterCreateModal_main}>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
                {register.register_state === "" || register.register_state === "취소" ?
                  <RegisterPatientList register={register} newRegister={newRegister} setNewRegister={setNewRegister} />
                  :
                  <RegisterStateChange register={register} publishTopic={publishTopic} close={close} />
                }
                <RegisterCreateForm doctors={doctors} register={register} newRegister={newRegister} setNewRegister={setNewRegister} open={open} selectedTime={selectedTime} />
              </div>
            </main>
            <footer>
              <div className={style.RegisterCreateModal_footer}>
                {register.register_state === "완료" ?
                  <>
                    <button className="button_team2_empty" onClick={close}>확인</button>
                  </>
                  :
                  <>
                    <button className="button_team2_empty" onClick={close}>취소</button>
                    {register.register_state === "대기" ?
                      <button className="button_team2_fill" onClick={updateNewRegister}>수정</button>
                      :
                      <button className="button_team2_fill" onClick={createNewRegister}>등록</button>
                    }
                  </>
                }
              </div>
            </footer>
          </section>
        ) : null}
      </div>
    </div>
  );
}
export default RegisterCreateModal;
