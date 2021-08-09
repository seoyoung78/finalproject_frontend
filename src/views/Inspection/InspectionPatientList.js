import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import InspectionPatientListItem from "./InspectionPatientListItem";
import { readPatient } from "apis/inspections";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import Nodata from "components/common/NoData";

let patientsList = [];

function InspectionPatientList(props) {
  //DatePicker 날짜
  const [treatmentDate, setTreatmentDate] = useState(new Date());
  //이동 버튼 누를 때의 날짜
  const [treatmentDate2, setTreatmentDate2] = useState(new Date());
  //검사 대기 환자 목록
  const [patients, setPatients] = useState(patientsList);
  //총검사상태 대기 명 수
  const [istateWaiting, setIstateWaiting] = useState(getIstateWaiting(patients));
  //총검사상태 검사 명 수
  const [istateInspection, setIstateInspection] = useState(getIstateInspection(patients));
  //총검사상태 완료 명 수
  const [istateCompletion, setIstateCompletion] = useState(getIstateCompletion(patients));
  // 진료번호 비교를 위한 상태
  const [id, setId] = useState("");

  ////////////////////////////////////////////////////////////

  //DB Treatments 에서 해당 진료날짜에 진료완료된 환자 목록 가져옴
  const getPatient = async (treatmentDate2) => {
    try {
      const response = await readPatient(moment(treatmentDate2).format("yyyy-MM-DD HH:mm"), "");
      patientsList = response.data.treatmentList;
      setPatients(patientsList);
      checkIState(patientsList);
    } catch (error) {
      console.log(error);
    }
  };

  //날짜 이동 버튼
  const searchDateBtn = (treatmentDate) => {
    setTreatmentDate2(treatmentDate);
  };

  //진료완료된 환자 체크(선택)
  const handleChecked = (treatmentId) => {
    setId(treatmentId);
    props.checkedtId(treatmentId);
  };

  //총검사상태 (대기, 검사, 완료) 명 수 세기
  const checkIState = (patients) => {
    setIstateWaiting(getIstateWaiting(patients));
    setIstateInspection(getIstateInspection(patients));
    setIstateCompletion(getIstateCompletion(patients));
  };

  function getIstateWaiting(patients) {
    let countWaiting = 0;
    for (var i = 0; i < patients.length; i++) {
      if (patients[i].treatment_istate === "대기") {
        countWaiting++;
      }
    }
    return countWaiting;
  }

  function getIstateInspection(patients) {
    let countInspection = 0;
    for (var i = 0; i < patients.length; i++) {
      if (patients[i].treatment_istate === "검사") {
        countInspection++;
      }
    }
    return countInspection;
  }

  function getIstateCompletion(patients) {
    let countCompletion = 0;
    for (var i = 0; i < patients.length; i++) {
      if (patients[i].treatment_istate === "완료") {
        countCompletion++;
      }
    }
    return countCompletion;
  }

  //전체 명수 클릭 시, 해당 진료날짜에 진료완료된 모든 환자 목록 가져옴
  const showTotal = async (treatmentDate2) => {
    try {
      const response = await readPatient(moment(treatmentDate2).format("yyyy-MM-DD HH:mm"), "");
      patientsList = response.data.treatmentList;
      setPatients(patientsList);
    } catch (error) {
      console.log(error);
    }
  };

  //대기 명수 클릭 시, 해당 진료날짜에 진료완료된 환자들 중 총검사상태가 대기인 환자 목록 가져옴
  const showReady = async (treatmentDate2) => {
    try {
      const response = await readPatient(moment(treatmentDate2).format("yyyy-MM-DD HH:mm"), "대기");
      patientsList = response.data.treatmentList;
      setPatients(patientsList);
    } catch (error) {
      console.log(error);
    }
  };

  //검사 명수 클릭 시, 해당 진료날짜에 진료완료된 환자들 중 총검사상태가 검사인 환자 목록 가져옴
  const showInspection = async (treatmentDate2) => {
    try {
      const response = await readPatient(moment(treatmentDate2).format("yyyy-MM-DD HH:mm"), "검사");
      patientsList = response.data.treatmentList;
      setPatients(patientsList);
    } catch (error) {
      console.log(error);
    }
  };

  //완료 명수 클릭 시, 해당 진료날짜에 진료완료된 환자들 중 총검사상태가 대기인 완료 목록 가져옴
  const showFinish = async (treatmentDate2) => {
    try {
      const response = await readPatient(moment(treatmentDate2).format("yyyy-MM-DD HH:mm"), "완료");
      patientsList = response.data.treatmentList;
      setPatients(patientsList);
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    getPatient(treatmentDate2);
  }, [props]);

  useEffect(() => {
    getPatient(treatmentDate2);
  }, [treatmentDate2]);

  useEffect(() => {
    if (props.message.content === "iStateInspections") {
      ToastsStore.success("검사가 완료 되었습니다.");
      getPatient(treatmentDate2);
    }

    if (props.message.content === "addInspections") {
      ToastsStore.success("검사 대기 환자가 추가 되었습니다.");
      getPatient(treatmentDate2);
    }
  }, [props.message]);

  ////////////////////////////////////////////////////////////

  return (
    <div className="InspectionPatientList">
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
      <div className="InspectionPatientList_title">검사 대기 환자</div>
      <div className="InspectionPatientList_1 border">
        <div className="InspectionPatientList_1_1 mb-2">
          <div className="InspectionPatientList_1_2_1 p-0">
            <DatePicker locale="ko" dateFormat="yyyy.MM.dd" selected={treatmentDate} onChange={(date) => setTreatmentDate(date)} />
          </div>
          <div className="InspectionPatientList_1_2_2">
            <button className="button_team2_fill" onClick={() => searchDateBtn(treatmentDate)}>
              이동
            </button>
          </div>
          <div className="InspectionPatientList_1_2_3 p-0">
            <div className="InspectionPatientList_1_3_0" onClick={() => showTotal(treatmentDate2)}>
              전체:{istateWaiting + istateInspection + istateCompletion}명
            </div>
            <div className="InspectionPatientList_1_3_1" onClick={() => showReady(treatmentDate2)}>
              대기:{istateWaiting}명
            </div>
            <div className="InspectionPatientList_1_3_2" onClick={() => showInspection(treatmentDate2)}>
              검사:{istateInspection}명
            </div>
            <div className="InspectionPatientList_1_3_3" onClick={() => showFinish(treatmentDate2)}>
              완료:{istateCompletion}명
            </div>
          </div>
        </div>

        <div className="InspectionPatientList_list">
          <table className="table InspectionPatientList_2_1" style={{ height: "10px" }}>
            <thead className="InspectionPatientList_2_2">
              <tr>
                <th></th>
                <th>진료 번호</th>
                <th>환자명</th>
                <th>생년월일</th>
                <th>성별</th>
                <th>상태</th>
                <th>의사소통메모</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <td colSpan="7">
                  <React.Fragment>
                    <Nodata />
                  </React.Fragment>
                </td>
              ) : (
                <>
                  {patients.map((patient) => {
                    return (
                      <InspectionPatientListItem
                        key={patient.treatment_id}
                        patient={patient}
                        id={id}
                        handleChecked={(treatmentId) => handleChecked(treatmentId)}
                        iStateInspection={props.iStateInspection}
                        handleIStateInspectionFalse={props.handleIStateInspectionFalse}
                        iStateFinish={props.iStateFinish}
                        handleIStateFinishFalse={props.handleIStateFinishFalse}
                        iStateWait={props.iStateWait}
                        handleIStateWaitFalse={props.handleIStateWaitFalse}
                        message={props.message}
                        publishTopic={props.publishTopic}
                      />
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InspectionPatientList;
