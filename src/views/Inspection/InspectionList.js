import InspectionBarcodeModal from "./components/modal/InspectionBarcodeModal";
import React, { useEffect, useState } from "react";
import ReactExport from "react-export-excel";
import InspectionListItem from "./InspectionListItem";
import { readInspection } from "apis/inspections";
import { useSelector } from "react-redux";
import Nodata from "components/common/NoData";

let inspectionsList = [];

function InspectionList(props) {
  //검사 상세 내역 전체 목록
  const [inspections, setInspections] = useState(inspectionsList);
  //검사 상세 내역 필터된(로그인한 검사자만) 목록
  const [filterInspections, setFilterInspections] = useState([]);
  //true 일때, 검사상태: 대기~>검사
  const [stateInspection, setStateInspection] = useState(false);
  //true 일때, 검사상태: 검사~>대기
  const [stateWait, setStateWait] = useState(false);
  //true 일때, 검사상태: ~>완료
  const [stateFinish, setStateFinish] = useState(false);
  //검사상태가 완료인 검사의 갯수
  const [stateFinishCount, setStateFinishCount] = useState(0);
  //검사상태가 대기인 검사의 갯수
  const [stateWaitCount, setStateWaitCount] = useState(0);
  //true 일때, 바코드 모달 열림
  const [modalOpen, setModalOpen] = useState(false);
  //검사번호
  const [id, setId] = useState("");
  //Spinner
  const [loading, setLoading] = useState(false);
  //로그인한 User의 id
  const globalUid = useSelector((state) => state.authReducer.uid);
  //로그인한 User의 권한
  const authorityRole = useSelector((state) => state.authReducer.uauthority);

  ////////////////////////////////////////////////////////////
  //엑셀 저장
  ////////////////////////////////////////////////////////////
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  let dataSet = [];
  //{
  //   columns: [{title:""}],
  //   data: [],
  // };
  function getDataSet() {
    // dataSet.columns.push({title:"진단검사명"});
    // dataSet.columns.push({title:"검체명"});
    // dataSet.columns.push({title:"검사명"});
    // dataSet.columns.push({title:"결과"});
    // dataSet.columns.push({title:"참고치"});
    // dataSet.columns.push({title:"검사시간"});
    // dataSet.columns.push({title:"용기"});
    // dataSet.columns.push({title:"담당의"});
    // dataSet.columns.push({title:"검사자"});
    // dataSet.columns.push({title:"검사실"});
    for (var i = 0; i <= inspections.length - 1; i++) {
      dataSet.push({
        category: inspections[i].inspection_list_category,
        specimen: inspections[i].inspection_list_specimen,
        name: inspections[i].inspection_list_name,
        result: inspections[i].inspection_result,
        reference: inspections[i].inspection_list_reference,
        date: inspections[i].inspection_date,
        container: inspections[i].inspeciton_list_container,
        doctor: inspections[i].inspection_doctor_name,
        inspector: inspections[i].inspeciton_list_container,
        lab: inspections[i].inspection_lab,
      });
    }
    return dataSet;
  }

  ////////////////////////////////////////////////////////////

  //DB Inspections 에서 해당 진료번호를 가지고, 전체 검사 목록 가져옴
  //로그인한 검사자의 검사 목록만 filter, 권한이 master일때는 전체 목록
  const getInspections = async (treatmentId) => {
    setLoading(true);
    try {
      const response = await readInspection(treatmentId);
      inspectionsList = response.data.inspectionList;
      if(authorityRole !== "ROLE_MASTER"){
      const iList = inspectionsList.filter((inspection) => {
        if(inspection.inspection_inspector_id === globalUid){
          return inspection;
        }
      });
      setFilterInspections(iList);
      } else {
        setFilterInspections(inspectionsList);
      }
      setInspections(inspectionsList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //검사상태가 바뀔 때(검사시작, 검사취소, 검사완료)
  //DB Inspections 에서 해당 진료번호를 가지고, 전체 검사 목록 가져옴
  //로그인한 검사자의 검사 목록만 filter, 권한이 master일때는 전체 목록
  const getInspectionsWhenStateChange = async (treatmentId) => {
    try {
      const response = await readInspection(treatmentId);
      inspectionsList = response.data.inspectionList;
      if(authorityRole !== "ROLE_MASTER"){
      const iList = inspectionsList.filter((inspection) => {
        if(inspection.inspection_inspector_id === globalUid){
          return inspection;
        }
      });
      setFilterInspections(iList);
      } else {
        setFilterInspections(inspectionsList);
      }
      setInspections(inspectionsList);
    } catch (error) {
      console.log(error);
    }
  };

  //검사들의 검사상태가 완료인 갯수를 센 후, stateFinishCount상태에 저장
  function getStateFinishCount() {
    let finishCount = 0;
    for (var i = 0; i <= inspections.length - 1; i++) {
      if (inspections[i].inspection_state === "완료") {
        finishCount++;
      }
    }
    setStateFinishCount(finishCount);
  }

  function getStateWaitCount() {
    let waitCount = 0;
    for (var i = 0; i <= inspections.length - 1; i++) {
      if (inspections[i].inspection_state === "대기") {
        waitCount++;
      }
    }
    setStateWaitCount(waitCount);
  }

  //검사취소 버튼 클릭 (검사결과: 검사 ~> 대기)
  const cancelBtn = () => {
    setStateWait(true);
    getStateWaitCount();
  };

  //엑셀저장 버튼 클릭
  const excelBtn = () => {
    dataSet = [];
  };

  //검사완료 버튼 클릭 (검사결과: 검사 ~> 완료)
  const completeBtn = () => {
    if (window.confirm("검사완료 시, 결과 수정이 불가합니다")) {
      setStateFinish(true);
      getStateFinishCount();
    } else {
      return;
    }
  };

  //검사상태를 완료로 바꾼 후, stateFinishCount + 1
  const plusStateFinishCount = () => {
    getStateFinishCount();
    setStateFinishCount(stateFinishCount + 1);
  };

  //검사상태를 대기로 바꾼 후, stateWaitCount + 1
  const plusStateWaitCount = () => {
    getStateWaitCount();
    setStateWaitCount(stateWaitCount + 1);
    setStateWaitCount(stateWaitCount - 1);
  };

  //검사시작 버튼 클릭 시,
  //혈액검사면 바코드 모달 열림, 영상검사면 검사상태 검사로 바뀜 + 총검사상태 검사로 바뀜
  const openModal = () => {
    inspections.find((ins) => {
      if (ins.inspection_id === id) {
        if (ins.inspection_list_category === "혈액검사") {
          setModalOpen(true);
          return ins;
        } else {
          setStateInspection(true);
          props.handleIStateInspectionTrue();
          props.publishTopic(0);
          return false;
        }
      }
    });
  };
  //바코드 모달 안에서 확인 버튼 클릭
  const closeCheckModal = () => {
    setModalOpen(false);
    setStateInspection(true);
    props.handleIStateInspectionTrue();
  };
  //바코드 모달 안에서 취소 버튼 클릭
  const closeCancelModal = () => {
    setModalOpen(false);
  };

  //검사 체크(선택)
  const handleChecked = (inspectionId) => {
    setId(inspectionId);
  };

  //검사시작 후(검사상태: 대기~>검사)
  const handleStateInspectionFalse = () => {
    setStateInspection(false);
  };

  //검사취소 후(검사상태: 검사~>대기)
  const handleStateWaitFalse = () => {
    setStateWait(false);
  };

  //검사완료 후(검사상태: 검사~>완료)
  const handleStateFinishFalse = () => {
    setStateFinish(false);
  };

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (props.treatmentId) {
      getInspections(props.treatmentId);
    } else {
      setInspections([]);
      setFilterInspections([]);
    }
    getStateFinishCount();
    getStateWaitCount();
  }, [props.treatmentId]);

  useEffect(() => {
    if (props.treatmentId) {
      getInspectionsWhenStateChange(props.treatmentId);
    }
    getStateFinishCount();
    getStateWaitCount();
  }, [props]);

  //진료번호가 바뀔 때,
  //stateFinishCount를 0으로 바꿔 누적되지 않고, 다시 세도록 함
  useEffect(() => {
    setStateFinishCount(0);
    setStateWaitCount(0);
  }, [props.treatmentId]);

  //stateFinishCount 바뀔 때,
  //검사목록 갯수와 검사상태가 완료인 갯수가 같으면
  //총검사결과: 검사~>완료 true
  useEffect(() => {
    if (inspections.length !== 0 && inspections.length === stateFinishCount) {
      props.handleIStateFinishTrue();
    } else {
      props.handleIStateFinishFalse();
    }
  }, [stateFinishCount]);

  //stateWaitCount 바뀔 때,
  //검사목록 갯수와 검사상태가 대기인 갯수가 같으면
  //총검사결과: 검사~>대기 true
  useEffect(() => {
    if (inspections.length !== 0 && inspections.length === stateWaitCount) {
      props.handleIStateWaitTrue();
    } else {
      props.handleIStateWaitFalse();
    }
  }, [stateWaitCount]);

  ////////////////////////////////////////////////////////////
  //바코드 모달에 props으로 전달할 검사 정보
  ////////////////////////////////////////////////////////////
  var inspection_list_specimen = " ";
  var inspeciton_list_container = " ";
  var inspection_list_name = " ";
  var patient_name = " ";
  var inspection_inspector_name = " ";
  inspections.find((ins) => {
    if (ins.inspection_id === id) {
      inspection_list_specimen = ins.inspection_list_specimen;
      inspeciton_list_container = ins.inspeciton_list_container;
      inspection_list_name = ins.inspection_list_name;
      patient_name = ins.patient_name;
      inspection_inspector_name = ins.inspection_inspector_name;
    }
  });

  ////////////////////////////////////////////////////////////

  return (
    <div className="InspectionList">
      <div className="InspectionList_title">검사 상세 내역</div>
      <div className="InspectionList_1 border">
        <div className="InspectionList_1_1">
          <React.Fragment>
            <button className="button_team2_fill InspectionList_1_2" onClick={openModal}>
              검사 시작
            </button>
            <InspectionBarcodeModal
              id={id}
              tid={props.treatmentId}
              open={modalOpen}
              closeCheck={closeCheckModal}
              closeCancel={closeCancelModal}
              inspectionListSpecimen={inspection_list_specimen}
              inspectionListContainer={inspeciton_list_container}
              inspectionListName={inspection_list_name}
              patientName={patient_name}
              inspectionInspectorName={inspection_inspector_name}
            />
          </React.Fragment>
          <button className="button_team2_empty InspectionList_1_2" onClick={cancelBtn}>
            검사 취소
          </button>

          <ExcelFile
            filename={props.treatmentId+" 검사 상세 내역"}
            element={
              <button className="button_team2_fill InspectionList_1_2" onClick={excelBtn}>
                엑셀 저장
              </button>
            }
          >
            <ExcelSheet data={getDataSet} name="inspectionsExcel">
              <ExcelColumn label="진단검사명" value="category"/>
              <ExcelColumn label="검체명" value="specimen" />
              <ExcelColumn label="검사명" value="name" />
              <ExcelColumn label="결과" value="result" />
              <ExcelColumn label="참고치" value="reference" />
              <ExcelColumn label="검사시간" value="date" />
              <ExcelColumn label="용기" value="container" />
              <ExcelColumn label="담당의" value="doctor" />
              <ExcelColumn label="검사자" value="inspector" />
              <ExcelColumn label="검사실" value="lab" />
            </ExcelSheet>
          </ExcelFile>

          <button className="button_team2_empty InspectionList_1_2" onClick={completeBtn}>
            검사 완료
          </button>
        </div>

        <div className="InspectionList_list ">
          <table className="table InspectionList_2_1" style={{ height: "10px" }}>
            <thead className="InspectionList_2_2">
              <tr>
                <th style={{ width: "1%" }}></th>
                <th style={{ width: "9%" }}>진단검사명</th>
                <th style={{ width: "10%" }}>검체명</th>
                <th style={{ width: "10%" }}>검사명</th>
                <th style={{ width: "15%" }}>결과</th>
                <th style={{ width: "10" }}>참고치</th>
                <th style={{ width: "9%" }}>검사 시간</th>
                <th style={{ width: "7%" }}>용기</th>
                <th style={{ width: "7%" }}>담당의</th>
                <th style={{ width: "7%" }}>검사자</th>
                <th style={{ width: "8%" }}>검사실</th>
                <th style={{ width: "7%" }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <div className="spinner2">
                  <div className={`spinner-border text-primary`} role="status">
                    <span className="sr-only">loading...</span>
                  </div>
                </div>
              ) : filterInspections.length === 0 ? (
                <td colSpan="12">
                  <React.Fragment>
                    <Nodata />
                  </React.Fragment>
                </td>
              ) : (
                <>
                  {filterInspections.map((inspection) => {
                    return (
                      <InspectionListItem
                        key={inspection.inspection_id}
                        inspection={inspection}
                        id={id}
                        handleChecked={(inspectionId) => handleChecked(inspectionId)}
                        stateInspection={stateInspection}
                        handleStateInspectionFalse={handleStateInspectionFalse}
                        stateWait={stateWait}
                        handleStateWaitFalse={handleStateWaitFalse}
                        stateFinish={stateFinish}
                        handleStateFinishFalse={handleStateFinishFalse}
                        plusStateFinishCount={plusStateFinishCount}
                        plusStateWaitCount={plusStateWaitCount}
                        publishTopic={props.publishTopic}
                        iStateFinish={props.iStateFinish}
                        iStateWait={props.iStateWait}
                        message={props.message}
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

export default InspectionList;
