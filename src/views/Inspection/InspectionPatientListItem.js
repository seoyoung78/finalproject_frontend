import { useEffect } from "react";
import { updateIstateI, updateIstateC, updateIstateW } from "apis/inspections";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";

function InspectionPatientListItem(props) {
  
  ////////////////////////////////////////////////////////////

  //총검사상태: 대기~>검사 변경
  const changeIStateInspection = async () => {
    try {
      if (props.patient.treatment_id === props.id) {
        if (props.patient.treatment_istate === "대기") {
          //props.patient.treatment_istate = "검사";
          await updateIstateI(props.id);
        }
      }
      props.handleIStateInspectionFalse();
    } catch (error) {
      console.log(error);
    }
  };

  //총검사상태: 검사~>완료 변경
  const changeIStateFinish = async () => {
    try {
      if (props.patient.treatment_id === props.id) {
        if (props.patient.treatment_istate === "검사") {
          //props.patient.treatment_istate = "완료";
          await updateIstateC(props.id);
          props.handleIStateFinishFalse();
          props.publishTopic(1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //총검사상태: 검사~>대기 변경
  const changeIStateWait = async () => {
    try {
      if (props.patient.treatment_id === props.id) {
        if (props.patient.treatment_istate === "검사") {
          //props.patient.treatment_istate = "대기";
          await updateIstateW(props.id);
        }
      }
      props.handleIStateWaitFalse();
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (props.iStateInspection === true) {
      changeIStateInspection();
    }
  }, [props.iStateInspection]);

  useEffect(() => {
    if (props.iStateFinish === true && props.message.content === "updateInspects") {
      changeIStateFinish();
    }
  }, [props.iStateFinish]);

  useEffect(() => {
    if (props.iStateWait === true) {
      changeIStateWait();
    }
  }, [props.iStateWait]);

  ////////////////////////////////////////////////////////////

  return (
    <>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
      <tr
        className="InspectionPatientListItem"
        key={props.patient.treatment_id}
        onClick={() => {props.handleChecked(props.patient.treatment_id);}}
      >
        <td>
          <input type="checkbox" name="treatmentCheck" checked={props.id === props.patient.treatment_id ? true : false} readOnly />
        </td>
        <td>{props.patient.treatment_id}</td>
        <td>{props.patient.patient_name}</td>
        <td>{props.patient.patient_ssn.split("-")[0]}</td>
        <td>{props.patient.patient_sex}</td>
        {props.patient.treatment_istate === "대기" ? (
          <td style={{ color: "#009900" }}>{props.patient.treatment_istate}</td>
        ) : props.patient.treatment_istate === "검사" ? (
          <td style={{ color: "#ff6600" }}>{props.patient.treatment_istate}</td>
        ) : (
          <td style={{ color: "#00AAF0" }}>{props.patient.treatment_istate}</td>
        )}

        <td>{props.patient.treatment_communication}</td>
      </tr>
    </>
  );
}

export default InspectionPatientListItem;
