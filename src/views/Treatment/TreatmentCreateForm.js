import React, { useState, useEffect } from "react";
import { updateTreatment, getSearchDurg, getCategoryInspectionList, createDruglist } from "apis/treatments";
import Spinner from "components/common/Spinner";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from "react-toasts";
import TreatmentHistoryRead from "./components/modal/TreatmentHistoryReadModal";
import { IoGitMerge } from "react-icons/io5";
import Nodata from "components/common/NoData";

function TreatmentCreateForm(props) {
  //----------------------
  //상태
  //----------------------
  const { publishTopic } = props;

  const [modalOpen, setModalOpen] = useState(false);

  // spinner
  const [loading, setLoading] = useState(false);

  //검사 checkbox 리스트
  const [inspectionlist, setInspectionlist] = useState([]);

  //검사 checkbox-category
  const [inspectionOption, setInspectionOption] = useState("진단 검사 선택");

  //검사 선택 저장상태
  const [inspectionForm, setInspectionForm] = useState({
    selectedInspection: [],
    selectedInspection2: []
  });

  //약 리스트
  const [druglists, setDrugLists] = useState([]);

  //약 선택 저장상태
  const [drugForm, setDrugForm] = useState({
    selectedDrug: []
  });

  //선택한 약id 상태
  const [selectDrugId, setSelectDrugId] = useState("");

  //약 키워드 검색을 위한 상태
  const [searchKeyword, setSearchKeyword] = useState();

  const [searchFilter, setSearchFilter] = useState();

  const [treatmentId, setTreatmentId] = useState("");

  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");

  //soap - Subjective 상태
  const [smemo, setSmemo] = useState("");

  //soap - Objective 상태
  const [omemo, setOmemo] = useState("");

  //soap - Assessment 상태
  const [amemo, setAmemo] = useState("");

  //soap - Plan 상태
  const [pmemo, setPmemo] = useState("");

  //soap - 의사소통 메모 상태
  const [cmemo, setCmemo] = useState("");

  // 모든 약품 리스트 
  const [totalDrug, setTotalDrug] = useState([]);

  // 약품 카테고리 선택
  const [selectedDrugCategory, setSelectedDrugCategory] = useState("검색");

  const [keywordDrugList, setKeywordDrugList] = useState([]);
  const [checkDrugList, setCheckDrugList] = useState([]);

  //임시 환자 리스트
  var tempPatientlist = {
    treatment_register_id: "",
    treatment_patient_id: "",
    patient_name: "",
    patient_ssn: "",
    patient_sex: "",
    register_communication: "",
    treatment_state: "",
  };

  //대기환자리스트에서 체크된 환자 리스트 가져오기 ->props.checkedpatient == checkedPatientlist
  var checkedPatientlist;
  if (props.checkedpatient) {
    checkedPatientlist = props.checkedpatient;
  } else {
    checkedPatientlist = tempPatientlist;
  }

  //검사 체크박스 관리를 위한 상태
  const [checkList, setCheckList] = useState([{ id: "", checked: false, name: "" }]);
  //검사 체크박스 관리함수
  const handleCheckClick = (id) => {
    let newChecklist = checkList.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      } else {
        return item;
      }
    });
    setCheckList(newChecklist);
  };

  //DB 에서 카테고리별 검사 리스트 가져오기
  const getTotalInspectionsList = async (categoryValue) => {
    try {
      var list = await getCategoryInspectionList(categoryValue);
      // console.log("hi",list.data.inspectionList);
      setInspectionlist(list.data.inspectionList);
      let cList = [];
      for (var iList of list.data.inspectionList) {
        cList.push({ id: iList.inspection_list_id, checked: false, name: iList.inspection_list_name });
      }
      // console.log("clist",cList);
      setCheckList(cList);
    } catch (e) {
      console.log(e);
    }
  };

  //DB 에서 약리스트 가져오기
  const getSearchDurgs = async () => {
    //setLoading(true);
    try {
      var list = await getSearchDurg();
      // console.log("dddddi",list.data.druglist);

      setDrugLists(list.data.druglist);

      let totalDrugList = [];
      let indexForDrug = 0;
      for (var drug of list.data.druglist) {
        totalDrugList.push(
          {
            indexId: indexForDrug,
            drug_injection_list_id: drug.drug_injection_list_id,
            drug_injection_list_name: drug.drug_injection_list_name,
            drug_injection_list_category: drug.drug_injection_list_category,
            checked: false,
          }
        );
        indexForDrug++;
      }
      // console.log("totalDrugList", totalDrugList);
      setTotalDrug(totalDrugList);
      setCheckDrugList(totalDrugList);
      setKeywordDrugList(totalDrugList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckDrugClick = (id) => {
    //console.log(id);
    
    let newCheckDruglist = checkDrugList.map((drug) => {
      if (drug.indexId === id) {
        if (drug.checked === false) {
          setDrugForm((prevDrugForm) => {
            return {
              ...prevDrugForm,
              selectedDrug: prevDrugForm.selectedDrug.concat(drug.drug_injection_list_id),
            };
          });
        } else {
          setDrugForm((prevDrugForm) => {
            return {
              ...prevDrugForm,
              selectedDrug: prevDrugForm.selectedDrug.filter((item) => item !== drug.drug_injection_list_id),
            };
          });
        }
        return { ...drug, checked: !drug.checked };
      } else {
        return drug;
      }
    });
    setCheckDrugList(newCheckDruglist);
    console.log(drugForm);
  };

  //검사 - 카테고리 바꾸기
  const changeCategory = (event) => {
    setInspectionOption(event.target.value);
  };

  //약 - 키워드 바꾸기
  const changeKeyword = (event) => {
    setSearchKeyword(event.target.value);
  };

  //검색 클릭 함수 -> DB에서 키워드에 해당하는 약리스트 가져오기
  const searchClick = async () => {
    setSelectedDrugCategory("검색");
    //setLoading(true);
    try {
      var list = await getSearchDurg(searchKeyword, "");
      let searchDrugList = [];
      for (var sDrug of list.data.druglist) {
        for (var drug of totalDrug) {
          if (drug.drug_injection_list_id === sDrug.drug_injection_list_id) {
            searchDrugList.push(drug);
          }
        }
      }
      console.log("searchDrugList", searchDrugList);
      setKeywordDrugList(searchDrugList);

      //setDrugLists(list.data.druglist);
    } catch (error) {
      console.log(error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  //필터 - 전체
  const totalFilter = async () => {
    setSelectedDrugCategory("");

  };
  //필터 - 내복약
  const innerFilter = async () => {
    setSelectedDrugCategory("약품(내복약)");

  };
  //필터 - 외용약
  const outerFilter = async () => {
    setSelectedDrugCategory("약품(외용약)");

  };
  //필터 - 주사
  const injectionFilter = async () => {
    setSelectedDrugCategory("주사");

  };

  //soap , 의사소통메모 상태 바꾸기
  const handleChangeSmemo = (event) => {
    setSmemo(event.target.value);
  };
  const handleChangeOmemo = (event) => {
    setOmemo(event.target.value);
  };
  const handleChangeAmemo = (event) => {
    setAmemo(event.target.value);
  };
  const handleChangePmemo = (event) => {
    setPmemo(event.target.value);
  };
  const handleChangeCmemo = (event) => {
    setCmemo(event.target.value);
  };

  //진료등록 버튼 클릭 함수 -> 진료 업데이트
  const updateTreatmentBtn = async (event) => {
    // publishTopic();
    // event.preventDefault();
    try {
      let newTreatment = {
        treatment_id: checkedPatientlist.treatment_id,
        treatment_user_id: checkedPatientlist.treatment_user_id,
        treatment_patient_id: checkedPatientlist.treatment_patient_id,
        treatment_smemo: smemo,
        treatment_omemo: omemo,
        treatment_amemo: amemo,
        treatment_pmemo: pmemo,
        treatment_communication: cmemo,
        selectedInspection: inspectionForm.selectedInspection,
        selectedInspection2: inspectionForm.selectedInspection2,
        selectedDrug: drugForm.selectedDrug,
      };

      if (checkedPatientlist.treatment_state === "대기" || checkedPatientlist.treatment_state === "") {
        if (newTreatment.treatment_id === "" || newTreatment.treatment_patient_id === "") {
          // alert("진료 아이디를 입력해주세요.");
          ToastsStore.success("환자를 클릭해주세요.");
        } else if (newTreatment.treatment_smemo === "" || newTreatment.treatment_omemo === "" || newTreatment.treatment_amemo === "" || newTreatment.treatment_pmemo === "") {
          // alert("soap를 입력해주세요.");
          ToastsStore.success("필수 정보를 입력해주세요.");
        } else {
          var list = await updateTreatment(newTreatment);
          if (list.data) {
            ToastsStore.success("진료 등록 완료");
            publishTopic(0);
            publishTopic(1);
            // console.log("list", list);
            setSmemo("");
            setOmemo("");
            setAmemo("");
            setPmemo("");
            setCmemo("");

            let cList = [];
            for (var iList of inspectionlist) {
              cList.push({ id: iList.inspection_list_id, checked: false, name: iList.inspection_list_name });
            }
            setCheckList(cList);
            setSelectedTreatmentId(newTreatment.treatment_id);
            setInspectionForm({ selectedInspection: [], selectedInspection2: [] });
            setDrugForm({ selectedDrug: [] });

            setModalOpen(true);
 
            let totalDrugList = [];
            let indexForDrug = 0;
            for (var drug of totalDrug) {
              totalDrugList.push(
                {
                  indexId: indexForDrug,
                  drug_injection_list_id: drug.drug_injection_list_id,
                  drug_injection_list_name: drug.drug_injection_list_name,
                  drug_injection_list_category: drug.drug_injection_list_category,
                  checked: false,
                }
              );
              indexForDrug++;
            }
            console.log("totalDrugList", totalDrugList);
            setCheckDrugList(totalDrugList);
          }
        }
      } else {
        setSmemo("");
        setOmemo("");
        setAmemo("");
        setPmemo("");
        setCmemo("");

        let cList = [];
        for (var iList of inspectionlist) {
          cList.push({ id: iList.inspection_list_id, checked: false, name: iList.inspection_list_name });
        }
        setCheckList(cList);
        ToastsStore.success("이미 완료된 진료입니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkedDrugId = (drug_injection_list_id) => {
    setSelectDrugId(drug_injection_list_id);
  };


  // Inspection - 혈액검사
  const handleChangeBloodInspections = (event) => {
    if (event.target.checked) {
      //체크되었는지 유무
      setInspectionForm((prevInspectionForm) => {
        return {
          ...prevInspectionForm,
          selectedInspection: prevInspectionForm.selectedInspection.concat(event.target.value),
        };
      });
    } else {
      setInspectionForm((prevInspectionForm) => {
        return {
          ...prevInspectionForm,
          selectedInspection: prevInspectionForm.selectedInspection.filter((item) => item !== event.target.value),
        };
      });
    }
  };

  // Inspection - 영상검사
  const handleChangeImgInspections = (event) => {
    if (event.target.checked) {
      //체크되었는지 유무
      setInspectionForm((prevInspectionForm) => {
        return {
          ...prevInspectionForm,
          selectedInspection2: prevInspectionForm.selectedInspection2.concat(event.target.value),
        };
      });
    } else {
      setInspectionForm((prevInspectionForm) => {
        return {
          ...prevInspectionForm,
          selectedInspection2: prevInspectionForm.selectedInspection2.filter((item) => item !== event.target.value),
        };
      });
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getTotalInspectionsList(inspectionOption);
  }, []);

  // 마운트될때 전체 출력이 된다
  useEffect(() => {
    getSearchDurgs();
  }, []);


  return (
    <div>
      <div className="TreatmentCreateForm_title">
        {/* 진료 등록<button type="submit" className="button_team2_fill">진료완료</button> */}
        <div className="TreatmentCreateForm_title_1"> {checkedPatientlist.patient_name} 님 진료 등록 </div>
        <div className="TreatmentCreateForm_title_2">
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
          <button type="submit" className="button_team2_fill" onClick={updateTreatmentBtn}>
            진료완료
          </button>
          <React.Fragment>
            {/* TreatmentHistoryRead에 선택한 진료 번호 보내기 selectedTreatmentId */}
            <TreatmentHistoryRead open={modalOpen} close={closeModal} selectedTreatmentId={selectedTreatmentId}></TreatmentHistoryRead>
          </React.Fragment>
        </div>
      </div>
      <div className="TreatmentCreateForm_border border">
        <div className="TreatmentCreateForm_1">
          <div className="TreatmentCreateForm_1_border">
            <div className="TreatmentCreateForm_1_1_title">Subjective</div>
            <textarea className="TreatmentCreateForm_1_1_content border" rows="6" cols="40" onChange={handleChangeSmemo} value={smemo}>
              당일 검사 요청
            </textarea>
            <div className="TreatmentCreateForm_1_1_title">Objective</div>
            <textarea className="TreatmentCreateForm_1_1_content border" rows="6" cols="40" onChange={handleChangeOmemo} value={omemo}>
              당일 검사 요청
            </textarea>
            <div className="TreatmentCreateForm_1_1_title">Assessment</div>
            <textarea className="TreatmentCreateForm_1_1_content border" rows="6" cols="40" onChange={handleChangeAmemo} value={amemo}>
              당일 검사 요청
            </textarea>
            <div className="TreatmentCreateForm_1_1_title">Plan</div>
            <textarea className="TreatmentCreateForm_1_1_content border" rows="6" cols="40" onChange={handleChangePmemo} value={pmemo}>
              당일 검사 요청
            </textarea>
            <div className="TreatmentCreateForm_1_1_title">의사소통 메모</div>
            <textarea className="TreatmentCreateForm_1_1_content border" rows="6" cols="40" onChange={handleChangeCmemo} value={cmemo}>
              당일 검사 요청
            </textarea>
          </div>
        </div>
        <div className="TreatmentCreateForm_2">
          <div className="TreatmentCreateForm_2_1_border border">
            <div className="TreatmentCreateForm_2_1_title">진단 검사</div>
            <div className="TreatmentCreateForm_2_1_content">
              <div className="TreatmentCreateForm_select">
                <select name="inspectioncategory" className="TreatmentCreateForm_select_1" onChange={changeCategory} value={inspectionOption}>
                  <option disabled>진단 검사 선택</option>
                  <option value="혈액검사">혈액검사</option>
                  <option value="영상검사">영상검사</option>
                </select>
              </div>
              {/* 검사별 상태 만들어서 전달, 조건문으로 맵 돌리기 */}

              <div className="TreatmentCreateForm_checkbox">
                {inspectionlist.map((inspection) => {
                  return (
                    <div key={inspection.inspection_list_id}>
                      {inspection.inspection_list_category === inspectionOption ? (
                        inspection.inspection_list_category === "혈액검사" ? (
                          <div className="TreatmentCreateForm_checkbox_1">
                            <input
                              type="checkbox"
                              checked={checkList[inspection.inspection_list_id - 1].checked}
                              name="selectedInspection"
                              value={inspection.inspection_list_id}
                              onClick={() => handleCheckClick(inspection.inspection_list_id)}
                              onChange={handleChangeBloodInspections}
                            />{" "}
                            {inspection.inspection_list_name}
                          </div>
                        ) : (
                          <div className="TreatmentCreateForm_checkbox_1">
                            <input
                              type="checkbox"
                              checked={checkList[inspection.inspection_list_id - 1].checked}
                              name="selectedInspection2"
                              value={inspection.inspection_list_id}
                              onClick={() => handleCheckClick(inspection.inspection_list_id)}
                              onChange={handleChangeImgInspections}
                            />{" "}
                            {inspection.inspection_list_name}
                          </div>
                        )
                      ) : (
                        false
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="TreatmentCreateForm_2_2_border border">
            <div className="TreatmentCreateForm_2_2_title">약품 목록</div>
            <div className="TreatmentCreateForm_2_2_content">
              <div className="TreatmentSearch_1">
                <div className="TreatmentSearch_1_1_1">
                  <input type="text" className="TreatmentSearch_1_1" placeholder="약품/주사명을 입력하세요." onChange={changeKeyword} value={searchKeyword} />

                  <button className="button_team2_fill" onClick={searchClick}>
                    검색
                  </button>

                  <div className="TreatmentSearch_1_2_1" onClick={totalFilter}>
                    전체
                  </div>
                  <div className="TreatmentSearch_1_2_2" onClick={innerFilter}>
                    내복
                  </div>
                  <div className="TreatmentSearch_1_2_3" onClick={outerFilter}>
                    외용
                  </div>
                  <div className="TreatmentSearch_1_2_4" onClick={injectionFilter}>
                    주사
                  </div>
                </div>
              </div>
              <div className="TreatmentSearch_2_Totaltable">
                <table className="table TreatmentSearch_2">
                  <thead className="TreatmentSearch_2_2">
                    <tr>
                      <th></th>
                      <th>약품/주사코드</th>
                      <th>약품/주사명</th>
                      <th>구분</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDrugCategory === "검색" ?
                      keywordDrugList.map((drug, index) => {
                        return (
                          <tr className="TreatmentSearch_2_2_tr" key={drug.drug_injection_list_id}
                            onClick={() => handleCheckDrugClick(drug.indexId)}

                          >
                            <td>
                              <input type="checkbox"
                                name="selectedDrug"
                                checked={checkDrugList[drug.indexId].checked}
                                value={drug.drug_injection_list_id}
                                readOnly
                              />
                            </td>
                            <th>{drug.drug_injection_list_id}</th>
                            <th>{drug.drug_injection_list_name}</th>
                            <th>{drug.drug_injection_list_category}</th>
                          </tr>
                        );
                      }
                      )
                      :
                      (selectedDrugCategory === "" ?
                        (totalDrug.map((drug, index) => {
                          return (
                            <tr className="TreatmentSearch_2_2_tr" key={drug.drug_injection_list_id}
                              onClick={() => handleCheckDrugClick(drug.indexId)}
                            >
                              <td>
                                <input type="checkbox"
                                  name="selectedDrug"
                                  checked={checkDrugList[drug.indexId].checked}
                                  value={drug.drug_injection_list_id}
                                  readOnly

                                />
                              </td>
                              <th>{drug.drug_injection_list_id}</th>
                              <th>{drug.drug_injection_list_name}</th>
                              <th>{drug.drug_injection_list_category}</th>
                            </tr>
                          );
                        })
                        )
                        :
                        (
                          totalDrug.map((drug, index) => {
                            if (drug.drug_injection_list_category === selectedDrugCategory) {
                              return (
                                <tr className="TreatmentSearch_2_2_tr" key={drug.drug_injection_list_id}
                                  onClick={() => handleCheckDrugClick(drug.indexId)}
                                >
                                  <td>
                                    <input type="checkbox"
                                      name="selectedDrug"
                                      checked={checkDrugList[drug.indexId].checked}
                                      value={drug.drug_injection_list_id}
                                      readOnly
                                    />
                                  </td>
                                  <th>{drug.drug_injection_list_id}</th>
                                  <th>{drug.drug_injection_list_name}</th>
                                  <th>{drug.drug_injection_list_category}</th>
                                </tr>
                              );
                            }
                          }
                          )
                        )


                      )
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TreatmentCreateForm;