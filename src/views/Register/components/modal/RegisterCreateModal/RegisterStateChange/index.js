import { changeRegisterState } from "apis/register";
import { useEffect, useState } from "react";
import style from "./RegisterStateChange.module.css";

function RegisterStateChange(props) {
  const { register, publishTopic, close } = props;
  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------

  // 선택된 환자 상태
  const [selectedPatient, setSelectedPatient] = useState();
  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------
  // 진료 상태 대기 -> 완료로 
  const changeRegisterStateToFinish = async (register) => {
    try {
      var finishValidation = true;

      if (register.register_state==="대기") {
        if (finishValidation) {
          register.register_state = "완료";
          var list = await changeRegisterState(register);
          publishTopic(0);
          publishTopic(1);
          close();
        }
      } 
    } catch (e) {
      console.log(e);
    }
  };

  // 진료 상태 대기 -> 취소로 
  const changeRegisterStateToCancel = async (register) => {
    try {
      if (register.register_state==="대기") {
        register.register_state = "취소";
        var list = await changeRegisterState(register);
        publishTopic(0);
        close();
      } 
    } catch (e) {
      console.log(e);
    }
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------

  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <div className={style.RegisterStateChange}>
      <div className={style.RegisterStateChange_content_table}>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>환자 코드</th>
              <th>환자명</th>
              <th>생년월일</th>
              <th>성별</th>
              <th>전화번호</th>
            </tr>
          </thead>
          <tbody>
            <tr className={style.RegisterStateChange_content_table_tr}>
              <td><input type="checkbox" name="chk" checked readOnly /></td>
              <td>{register.register_patient_id}</td>
              <td>{register.patient_name}</td>
              <td>{(register.patient_ssn).substring(0, 6)}</td>
              <td>{register.patient_sex}</td>
              <td>{register.patient_tel}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={style.RegisterStateChange_content_stateBtn}>
        {register.register_state === "대기" ?
          <>
            <div className={style.RegisterStateChange_content_stateBtn_item}>
              <button className={style.RegisterStateChange_content_stateBtn_item_1} onClick={()=>changeRegisterStateToCancel(register)}>접수 취소</button>
            </div>
            <div className={style.RegisterStateChange_content_stateBtn_item}>
              <button className={style.RegisterStateChange_content_stateBtn_item_2} onClick={()=>changeRegisterStateToFinish(register)}>진료 시작</button>
            </div>
          </>
          :
          <div className={style.RegisterStateChange_content_stateBtn_item}>
            <button className={style.RegisterStateChange_content_stateBtn_item_3}> 진료 {register.register_state} </button>
          </div>
        }
      </div>
    </div>
  );
}
export default RegisterStateChange;
