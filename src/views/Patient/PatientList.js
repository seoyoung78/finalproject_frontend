import React, { useEffect, useState } from "react";
import { AutoSizer, List } from "react-virtualized";
import { getPatientList } from "apis/patient";
import moment from "moment";
import Spinner from "components/common/Spinner";
import Nodata from "components/common/NoData";

function PatientList(props) {
  // 환자 목록 상태
  const [patients, setPatients] = useState([]);

  // 검색 상태
  const [keyword, setKeyword] = useState("");

  // 환자 코드 비교를 위한 상태
  const [id, setId] = useState("");

  // Spinner
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  // 검색
  const handleSearch = async (event) => {
    setLoading(true);
    try {
      event.preventDefault();
      const response = await getPatientList(keyword);
      setPatients(response.data.patientList);
    } catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };  

  // 환자 선택
  const handleClick = (patient) => {
    setId(patient.patient_id);
    props.changePatient(patient);
  };

  useEffect(() => {
    const work = async () => {
      setLoading(true);
      try {
        const response = await getPatientList();
        setPatients(response.data.patientList);
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    work();
  }, []);

  useEffect(() => {
    // console.log("받습니다", props.message);
    const work = async () => {
      try {
        if (props.message.content === "updatePatient" || props.message.content === "addPatient") {
           const response = await getPatientList();
          setPatients(response.data.patientList);
          setLoading(true);
        }        
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    work();
  }, [props.message])
    
  const rowRenderer = ({index, key, style}) => {
    return (
      <div className="PatientList_tr" key={key} style={style} onClick={() => handleClick(patients[index])}>
        <div style={{width: "3%"}} key={patients.patient_id}><input type="checkbox" name="patientCheck" checked={id === patients[index].patient_id? true : false} width={50} readOnly></input></div>
        <div style={{width: "8%"}}>{patients[index].patient_id}</div>
        <div style={{width: "10%"}}>{patients[index].patient_name}</div>
        <div style={{width: "8%"}}>{patients[index].patient_ssn1}</div>
        <div style={{width: "5%"}}>{patients[index].patient_sex === "M"? "남" : "여"}</div>
        <div style={{width: "12%"}}>{patients[index].patient_tel1}-{patients[index].patient_tel2}-{patients[index].patient_tel3}</div>
        <div style={{width: "41%"}}>{patients[index].patient_address} {patients[index].patient_detailaddress1} {patients[index].patient_detailaddress2}</div>
        <div style={{width: "13%"}}>{moment(patients[index].patient_regdate).format("yyyy-MM-DD")}</div>
      </div>
    );
  };

  // useEffect(() => {
  //   console.log("받습니다", props.message);
  // },[props])

  return (    
    <div className="PatientList">
      <div className={`Patient_title`}>환자 목록</div>
      <div className={`PatientList_content border`}>
        <div className="mb-2">
          <input type="text" className="col-3" name="search" value={keyword} placeholder="이름/생년월일을 입력하세요." onChange={handleChange}></input>
          <button className="button_team2_fill" onClick={handleSearch}>검색</button>
        </div>
        <div className="text-center">
            <div className={`PatientList_Table`}>
              <div style={{width: "3%"}}></div>
              <div style={{width: "9%"}}>환자 코드</div>
              <div style={{width: "8%"}}>환자명</div>
              <div style={{width: "10%"}}>생년월일</div>
              <div style={{width: "4%"}}>성별</div>
              <div style={{width: "15%"}}>전화번호</div>
              <div style={{width: "39%"}}>주소</div>
              <div style={{width: "13%"}}>등록일</div>
              <div style={{width: "2%"}}></div>
            </div>
          <div>
            {loading ? <Spinner /> 
            : 
            patients.length === 0 ?
            <React.Fragment>
              <Nodata />
            </React.Fragment>
            :
            <>
              <AutoSizer disableHeight>
                {({width, height}) => {
                  return <List width={width} height={675} list={patients} rowCount={patients.length} rowHeight={44} rowRenderer={rowRenderer} overscanRowCount={5}></List>
                }}
              </AutoSizer>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientList;