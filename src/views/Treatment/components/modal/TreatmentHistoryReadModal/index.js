import React, { useState, useEffect } from "react";

import style from "./style.module.css";
import { getTreatmentHistoryRead } from "apis/treatments";
import InspectionImgFormModal from "views/Inspection/components/modal/InspectionImgFormModal";
import moment from "moment";
import Spinner from "components/common/Spinner";

function TreatmentHistoryRead(props) {
  //historylist에서 클릭한 진료 번호 가져오기
  const { open, close, selectedTreatmentId } = props;

  //soap 상태
  const [soap, setSoap] = useState([]);

  //검사 리스트 상태
  const [inspectionlists, setInspectionlists] = useState([]);

  //약 리스트 상태
  const [druglists, setDrugLists] = useState([]);

  //true 일때, 이미지 모달 열림
  const [modalOpen, setModalOpen] = useState(false);

  // spinner
  const [loading, setLoading] = useState(false);

  //임시 진료 번호
  var tempTreatmentId = "";

  //진료기록리스트에서 선택한 진료번호 가져오기 -> selectedTreatmentId == readTreatmentId
  var readTreatmentId;
  if (selectedTreatmentId) {
    readTreatmentId = selectedTreatmentId;
  } else {
    readTreatmentId = tempTreatmentId;
  }

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  //DB treatments 에서 treatment_id에 맞는 해당 진료기록 가져오기(soap, 검사, 처방)
  const getRead = async (treatment_id) => {
    setLoading(true);
    try {
      var list = await getTreatmentHistoryRead(treatment_id);
      setSoap(list.data.treatmentSoaplist);
      setInspectionlists(list.data.treatmentInspectionlist);
      setDrugLists(list.data.treatmentDrugsInjectionlist);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //console.log("asasasas",checkedPatientlist.treatment_patient_id);
    if(readTreatmentId){
      getRead(readTreatmentId);
    }
  }, [props, readTreatmentId]);

  return (
    <div className={style.TreatmentHistorymodal}>
      <div className={open ? `${style.openModal} ${style.modal}` : `${style.modal}`}>
        {open ? (
          <section>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <div className={style.TreatmentHistoryRead}>
                  <div className={style.TreatmentHistoryRead_title}> 진료번호 : {readTreatmentId} . 진료상세 </div>
                  <div className={`${style.TreatmentHistoryRead_border} border`}>
                    <div className={style.TreatmentHistoryRead_1}>
                      <table className={`${style.TreatmentHistoryRead_1_table} table table-bordered`}>
                        <tbody>
                          {soap.map((soap) => {
                            return (
                              <tr key={soap.treatment_id}>
                                <th className={`text-center border`} bgcolor="lightgrey">
                                  Subjective
                                </th>
                                {/* <td width="80%">목 아픔</td> */}
                                <td className={`text-left`} width="80%">
                                  {soap.treatment_smemo}
                                </td>
                              </tr>
                            );
                          })}
                          {soap.map((soap) => {
                            return (
                              <tr key={soap.treatment_id}>
                                <th className={`text-center border`} bgcolor="lightgrey">
                                  Objective
                                </th>
                                {/* <td width="80%">인후염</td> */}
                                <td className={`text-left`} width="80%">
                                  {soap.treatment_omemo}
                                </td>
                              </tr>
                            );
                          })}
                          {soap.map((soap) => {
                            return (
                              <tr key={soap.treatment_id}>
                                <th className={`text-center border`} bgcolor="lightgrey">
                                  Assessment
                                </th>
                                {/* <td width="80%">온열찜질기 실행</td> */}
                                <td className={`text-left`} width="80%">
                                  {soap.treatment_amemo}
                                </td>
                              </tr>
                            );
                          })}
                          {soap.map((soap) => {
                            return (
                              <tr key={soap.treatment_id}>
                                <th className={`text-center border`} bgcolor="lightgrey">
                                  {" "}
                                  Plan
                                </th>
                                {/* <td width="80%">다음 내원시 Lab test</td> */}
                                <td className={`text-left`} width="80%">
                                  {soap.treatment_pmemo}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className={style.TreatmentHistoryRead_2}>
                      <div className={style.TreatmentHistoryRead_2_title}>검사목록</div>
                      <div className={`${style.TreatmentHistoryRead_2_Totaltable} border`}>
                        <table className={`${style.TreatmentHistoryRead_2_table} table`}>
                          <thead className={style.TreatmentHistoryRead_2_table_thead}>
                            <tr className={style.TreatmentHistoryRead_2_table_tbody}>
                              <th>진단검사명</th>
                              <th>검사 날짜</th>
                              <th>검사자</th>
                              <th>검사명</th>
                              <th>참고치</th>
                              <th>검사 결과</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inspectionlists.map((inspections) => {
                              return (
                                <tr key={inspections.inspection_id}>
                                  <td>{inspections.inspection_list_category}</td>
                                  <td>{moment(inspections.inspection_date).format("yyyy-MM-DD HH:mm")}</td>
                                  <td>{inspections.inspection_inspector_name}</td>
                                  <td>{inspections.inspection_list_name}</td>
                                  <td>{inspections.inspection_list_reference}</td>
                                  {/* <td>{inspections.inspection_state}</td> */}
                                  {inspections.inspection_list_category === "영상검사" ? (
                                    inspections.inspection_result === "img" ? (
                                      <td>
                                        <React.Fragment>
                                          {" "}
                                          <button className="button_team2_empty" onClick={openModal}>
                                            보기
                                          </button>
                                          <InspectionImgFormModal id={inspections.inspection_id} open={modalOpen} close={closeModal} inspection={inspections} />
                                        </React.Fragment>
                                      </td>
                                    ) : (
                                      <td></td>
                                    )
                                  ) : (
                                    <td>{inspections.inspection_result}</td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className={style.TreatmentHistoryRead_3}>
                      <div className={style.TreatmentHistoryRead_3_title}>처방목록</div>
                      <div className={`${style.TreatmentHistoryRead_3_Totaltable} border`}>
                        <table className={`${style.TreatmentHistoryRead_3_table} table`}>
                          <thead className={style.TreatmentHistoryRead_3_table_thead}>
                            <tr>
                              <th>처방 날짜</th>
                              <th>담당의</th>
                              <th>약품/주사코드</th>
                              <th>약품/주사명</th>
                              <th>구분</th>
                            </tr>
                          </thead>
                          <tbody>
                            {druglists.map((drugInjections) => {
                              return (
                                <tr key={drugInjections.drug_injection_drug_injection_list_id}>
                                  <th>{moment(drugInjections.treatment_date).format("yyyy-MM-DD HH:mm")}</th>
                                  <th>{drugInjections.user_name}</th>
                                  <th>{drugInjections.drug_injection_drug_injection_list_id}</th>
                                  <th>{drugInjections.drug_injection_list_name}</th>
                                  <th>{drugInjections.drug_injection_list_category}</th>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className={style.TreatmentHistoryReadClose}>
                    <button className="button_team2_fill" onClick={close}>
                      {" "}
                      확인
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
export default TreatmentHistoryRead;
