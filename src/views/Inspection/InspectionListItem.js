import React, { useEffect, useState } from "react";
import InspectionImgFormModal from "./components/modal/InspectionImgFormModal";
import InspectionImgCreateFormModal from "./components/modal/InspectionImgCreateFormModal";
import InspectionImgModifyFormModal from "./components/modal/InspectionImgModifyFormModal";
import moment from "moment";
import { updateState, updateResult } from "apis/inspections";

function InspectionListItem(props) {
  //검사 결과
  const [inspectionR, setInspectionR] = useState(props.inspection.inspection_result);
  //true 일때, 영상검사 보기 모달 열림
  const [imgModalOpen, setImgModalOpen] = useState(false);
  //true 일때, 영상검사 수정 모달 열림
  const [imgModifyModalOpen, setImgModifyModalOpen] = useState(false);
  //true 일때, 영상검사 등록 모달 열림
  const [imgCreateModalOpen, setImgCreateModalOpen] = useState(false);

  ////////////////////////////////////////////////////////////

  //혈액검사 검사결과 입력
  const handleResultChange = (event) => {
    setInspectionR(event.target.value);
  };

  //혈액검사 등록 버튼
  //DB Inspections 에서 해당 검사번호의 검사결과 수정
  const inspectionRRegister = async (event) => {
    if (inspectionR === "") {
      alert("검사결과를 입력해주세요.");
    } else {
      try {
        props.inspection.inspection_result = inspectionR;
        await updateResult(props.id, inspectionR);
        setInspectionR();
      } catch (error) {
        console.log(error);
      }
    }
  };

  //혈액검사 수정 버튼
  //DB Inspections 에서 해당 검사번호의 검사결과 수정
  const inspectionRModify = async (event) => {
    if (inspectionR === "") {
      alert("검사결과를 입력해주세요.");
    } else {
      try {
        props.inspection.inspection_result = inspectionR;
        await updateResult(props.id, inspectionR);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //영상검사 보기 버튼
  const openImgModal = (event) => {
    setImgModalOpen(true);
  };
  //영상검사 보기 모달 안에서 닫기 버튼 클릭
  const closeImgModal = (event) => {
    setImgModalOpen(false);
  };

  //영상검사 수정 버튼
  const openImgModifyModal = (event) => {
    setImgModifyModalOpen(true);
  };
  //영상검사 수정 모달 안에서 수정 버튼 클릭
  const closeMImgModifyModal = (event) => {
    setImgModifyModalOpen(false);
  };
  //영상검사 수정 모달 안에서 닫기 버튼 클릭
  const closeImgModifyModal = (event) => {
    event.preventDefault();
    setImgModifyModalOpen(false);
  };

  //영상검사 등록 버튼
  const openImgCreateModal = (event) => {
    setImgCreateModalOpen(true);
  };
  //영사검사 등록 모달 안에서 등록 버튼 클릭
  //영상검사의 경우, 등록 시 검사결과를 img로 수정 
  const closeRImgCreateModal = async (event) => {
    try {
      setImgCreateModalOpen(false);
      props.inspection.inspection_result = "img";
      await updateResult(props.id, "img");
      setInspectionR();
      props.publishTopic(0);
    } catch (error) {
      console.log(error);
    }
  };
  //영상검사 등록 모달 안에서 닫기 버튼 클릭
  const closeImgCreateModal = (event) => {
    event.preventDefault();
    setImgCreateModalOpen(false);
  };

  //검사상태(대기~>검사) 변경
  //DB Inspections 에서 해당 검사번호의 검사결과 수정
  const changeStateInspection = async () => {
    try {
      if (props.inspection.inspection_id === props.id) {
        if (props.inspection.inspection_state === "대기") {
          //props.inspection.inspection_state = "검사";
          await updateState(props.id, "검사");
          props.handleStateInspectionFalse();
          props.publishTopic(0);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //검사상태(검사~>대기) 변경
  //DB Inspections 에서 해당 검사번호의 검사결과 수정
  const changeStateWait = async () => {
    try {
      if (props.inspection.inspection_id === props.id) {
        if (props.inspection.inspection_state === "검사") {
          //props.inspection.inspection_state = "대기";
          props.inspection.inspection_result = "";
          props.inspection.inspection_state = "대기";
          await updateResult(props.id, "");
          await updateState(props.id, "대기");
          setInspectionR();
          props.handleStateWaitFalse();
          props.publishTopic(0);
          props.plusStateWaitCount();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //검사상태(검사~>완료) 변경
  //DB Inspections 에서 해당 검사번호의 검사결과 수정
  const changeStateFinish = async () => {
    try {
      if (props.inspection.inspection_id === props.id) {
        if (props.inspection.inspection_state === "검사") {
          if (inspectionR === "") {
            alert("검사결과를 입력해주세요.");
          } else {
            //props.inspection.inspection_state = "완료";
            await updateState(props.id, "완료");
            props.handleStateFinishFalse();
            props.publishTopic(0);
            props.plusStateFinishCount();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (props.stateInspection === true) {
      changeStateInspection();
    }
    if (props.stateWait === true) {
      changeStateWait();
    }
    if (props.stateFinish === true) {
      changeStateFinish();
    }
  }, [props]);

  ////////////////////////////////////////////////////////////

  return (
    <>
      <tr
        className="InspectionListItem"
        key={props.inspection.inspection_id}
        onClick={() => {
          props.handleChecked(props.inspection.inspection_id);
        }}
      >
        <td className="align-middle">
          <input type="checkbox" name="inspectionCheck" checked={props.id === props.inspection.inspection_id ? true : false} readOnly />
        </td>
        <td className="align-middle">{props.inspection.inspection_list_category}</td>
        <td className="align-middle">{props.inspection.inspection_list_specimen}</td>
        <td className="align-middle">{props.inspection.inspection_list_name}</td>

        {props.inspection.inspection_list_category === "혈액검사" ? (
          props.inspection.inspection_result === "" ? (
            props.inspection.inspection_state === "대기" ? (
              <td></td>
            ) : props.inspection.inspection_state === "완료" ? (
              <td></td>
            ) : (
              <td className="align-middle">
                <div>
                  <input type="text" value={inspectionR} onChange={handleResultChange} style={{ width: "70px" }} />
                  <button className="button_team2_fill" onClick={inspectionRRegister}>
                    등록
                  </button>
                </div>
              </td>
            )
          ) : props.inspection.inspection_state === "완료" ? (
            <td className="align-middle">{props.inspection.inspection_result}</td>
          ) : (
            <td className="align-middle">
              <div>
                <input type="text" value={inspectionR} onChange={handleResultChange} style={{ width: "70px" }} />
                <button className="button_team2_fill" onClick={inspectionRModify}>
                  수정
                </button>
              </div>
            </td>
          )
        ) : props.inspection.inspection_result === "" ? (
          props.inspection.inspection_state === "대기" ? (
            <td></td>
          ) : props.inspection.inspection_state === "완료" ? (
            <td></td>
          ) : (
            <td className="InspectionListItem_1 align-middle">
              <div>
                <React.Fragment>
                  <button className="button_team2_empty" onClick={openImgCreateModal}>
                    등록
                  </button>
                  <InspectionImgCreateFormModal id={props.id} open={imgCreateModalOpen} closeR={closeRImgCreateModal} close={closeImgCreateModal} inspection={props.inspection} />
                </React.Fragment>
              </div>
            </td>
          )
        ) : props.inspection.inspection_state === "완료" ? (
          <td className="align-middle">
            <React.Fragment>
              <button className="button_team2_fill" onClick={openImgModal}>
                보기
              </button>
              <InspectionImgFormModal id={props.id} open={imgModalOpen} close={closeImgModal} inspection={props.inspection} />
            </React.Fragment>
          </td>
        ) : (
          <td className="align-middle">
            <div className="InspectionListItem_1">
              <React.Fragment>
                <button className="button_team2_fill" onClick={openImgModal}>
                  보기
                </button>
                <InspectionImgFormModal id={props.id} open={imgModalOpen} close={closeImgModal} inspection={props.inspection} />
                <button className="button_team2_empty" onClick={openImgModifyModal}>
                  수정
                </button>
                <InspectionImgModifyFormModal id={props.id} open={imgModifyModalOpen} closeM={closeMImgModifyModal} close={closeImgModifyModal} inspection={props.inspection} />
              </React.Fragment>
            </div>
          </td>
        )}

        <td className="align-middle">{props.inspection.inspection_list_reference}</td>
        <td className="align-middle">{props.inspection.inspection_date !== undefined ? moment(props.inspection.inspection_date).format("HH:mm") : ""}</td>
        {props.inspection.inspeciton_list_container === "EDTA" ? (
          <td className="align-middle" style={{ color: "#8041D9" }}>
            ●{props.inspection.inspeciton_list_container}
          </td>
        ) : props.inspection.inspeciton_list_container === "SST" ? (
          <td className="align-middle" style={{ color: "#FFE400" }}>
            ●{props.inspection.inspeciton_list_container}
          </td>
        ) : (
          <td className="align-middle">{props.inspection.inspeciton_list_container}</td>
        )}
        <td className="align-middle">{props.inspection.inspection_doctor_name}</td>
        <td className="align-middle">{props.inspection.inspection_inspector_name}</td>
        <td className="align-middle">{props.inspection.inspection_lab}</td>
        {props.inspection.inspection_state === "대기" ? (
          <td className="align-middle" style={{ color: "#009900" }}>
            {props.inspection.inspection_state}
          </td>
        ) : props.inspection.inspection_state === "검사" ? (
          <td className="align-middle" style={{ color: "#ff6600" }}>
            {props.inspection.inspection_state}
          </td>
        ) : (
          <td className="align-middle" style={{ color: "#00AAF0" }}>
            {props.inspection.inspection_state}
          </td>
        )}
      </tr>
    </>
  );
}

export default InspectionListItem;
