import moment from "moment";
import { useEffect, useState } from "react";

function RegisterRead(props) {
  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------
  const {selectedPatient, changeRegister} = props;

  const noneRegister = {
    register_id: "",
    register_patient_id: "",
    register_user_id: "",
    register_regdate: "",
    register_date: "",
    register_starttime: "",
    register_memo: "",
    register_communication: "",
    register_state: "",

    // Add Data
    patient_name: "",
    patient_ssn: "",
    patient_sex: "",
    patient_tel: "",

    user_name: ""
  };
  const [selectPatient, setSelectPatient] = useState(noneRegister);

  const showUpdateForm = (event) => {
    changeRegister();
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------

  useEffect(() => {
    setSelectPatient(selectedPatient);
  }, [props]);

  useEffect(() => {
    //setSelectPatient(noneRegister);
  },[props.registerDate]);
  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <>
      {/* 상단 메뉴 이름 */}
      <div className="RegisterRead_header">
        접수 상세 내역
      </div>
      {/* 하단 내용 */}
      <div className="RegisterRead_content border">
        {/* 접수 상세 내역 내용 */}
        <div className="RegisterRead_content_form">
          <form>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                환자명:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.patient_name} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                생년월일:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.patient_ssn ? selectPatient.patient_ssn.substring(0, 6) : selectPatient.patient_ssn} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                성별:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.patient_sex} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                전화번호:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.patient_tel} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                담당의:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.user_name} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                진료 날짜:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.register_date ? moment(selectPatient.register_date).format("yyyy-MM-DD H:mm") : ""} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                접수 메모:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.register_memo} readOnly />
              </div>
            </div>
            <div className="RegisterRead_content_list">
              <div className="RegisterRead_content_list_label">
                의사소통 메모:
              </div>
              <div className="RegisterRead_content_list_input">
                <input className="RegisterRead_content_list_input_readOnly" type="text" value={selectPatient.register_communication} readOnly />
              </div>
            </div>
          </form>
          {/* 수정 취소 버튼 */}
          <div className="RegisterRead_content_button">
            {selectPatient.register_state === "대기" ? <button className="button_team2_fill" onClick={showUpdateForm}>수정</button> : false}
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterRead;
