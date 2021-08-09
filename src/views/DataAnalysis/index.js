import { getDatas } from "apis/data";
import { useEffect, useState } from "react";
import Data1 from "./Data1";
import Data2 from "./Data2";
import Data3 from "./Data3";
import Data4 from "./Data4";
import style from "./DataAnalysis.module.css";
import Spinner from "components/common/Spinner";

function DataAnalysis(props) {

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);

  // spinner 
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      var response = await getDatas();

      calcData1(response.data.data1);
      calcData2(response.data.data2);
      calcData3(response.data.data3);
      calcData4(response.data.data4);

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const calcData1 = (datalist) => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    for (var data of datalist) {
      if (new Date(data.register_starttime).getMonth() === new Date().getMonth()) {
        count1++;
      } else if (new Date(data.register_starttime).getMonth() === new Date().getMonth() - 1) {
        count2++;
      } else if (new Date(data.register_starttime).getMonth() === new Date().getMonth() - 2) {
        count3++
      }
    }
    const newDataList = [
      {
        "month": "전전달",
        "진료수": count3
      },
      {
        "month": "전달",
        "진료수": count2
      },
      {
        "month": "이번달",
        "진료수": count1
      }
    ]
    setData1(newDataList);
  };
  const calcData2 = (datalist) => {
    let count1 = 0, count2 = 0, count3 = 0;
    for (var data of datalist) {
      if (data.register_state === "취소") {
        count1++;
      } else if (data.register_state === "대기") {
        count2++;
      } else if (data.register_state === "완료") {
        count3++;
      }
    }
    const registerState = [
      {
        id: "취소",
        label: "취소",
        value: count1,
      },
      {
        id: "대기",
        label: "대기",
        value: count2,
      },
      {
        id: "완료",
        label: "완료",
        value: count3,
      }
    ];
    setData2(registerState);
  };
  const calcData3 = (datalist) => {
    let countA1 = 0, countA2 = 0, countA3 = 0, countA4 = 0, countA5 = 0, countA6 = 0, countA7 = 0, countA8 = 0, countA9 = 0;
    let countB1 = 0, countB2 = 0, countB3 = 0, countB4 = 0, countB5 = 0, countB6 = 0, countB7 = 0, countB8 = 0, countB9 = 0;
    let countC1 = 0, countC2 = 0, countC3 = 0, countC4 = 0, countC5 = 0, countC6 = 0, countC7 = 0, countC8 = 0, countC9 = 0;
    let countD1 = 0, countD2 = 0, countD3 = 0, countD4 = 0, countD5 = 0, countD6 = 0, countD7 = 0, countD8 = 0, countD9 = 0;
    let countE1 = 0, countE2 = 0, countE3 = 0, countE4 = 0, countE5 = 0, countE6 = 0, countE7 = 0, countE8 = 0, countE9 = 0;

    let pAge = 0;
    let yearToday = new Date().getFullYear();
    yearToday *= 1;
    for (var data of datalist) {
      // 월요일
      if (new Date(data.register_starttime).getDay() === 1) {
        if ((data.patient_ssn.slice(7, 8) === "3") || (data.patient_ssn.slice(7, 8) === "4")) {
          var newAge = "20" + (data.patient_ssn.slice(0, 2));
          newAge *= 1;
          pAge = yearToday - newAge;
        } else {
          var newAge2 = "19" + (data.patient_ssn.slice(0, 2));
          newAge2 *= 1;
          pAge = yearToday - newAge2;
        }
        if (pAge >= 10 && pAge < 20) {
          countA1++;
        } else if (pAge >= 20 && pAge < 30) {
          countA2++;
        } else if (pAge >= 30 && pAge < 40) {
          countA3++;
        } else if (pAge >= 40 && pAge < 50) {
          countA4++;
        } else if (pAge >= 50 && pAge < 60) {
          countA5++;
        } else if (pAge >= 60 && pAge < 70) {
          countA6++;
        } else if (pAge >= 70 && pAge < 80) {
          countA7++;
        } else if (pAge >= 80 && pAge < 90) {
          countA8++;
        } else if (pAge >= 90) {
          countA9++;
        }
      }
      // 화요일
      else if (new Date(data.register_starttime).getDay() === 2) {
        if ((data.patient_ssn.slice(7, 8) === "3") || (data.patient_ssn.slice(7, 8) === "4")) {
          var newAge = "20" + (data.patient_ssn.slice(0, 2));
          newAge *= 1;
          pAge = yearToday - newAge;
        } else {
          var newAge2 = "19" + (data.patient_ssn.slice(0, 2));
          newAge2 *= 1;
          pAge = yearToday - newAge2;
        }
        if (pAge >= 10 && pAge < 20) {
          countB1++;
        } else if (pAge >= 20 && pAge < 30) {
          countB2++;
        } else if (pAge >= 30 && pAge < 40) {
          countB3++;
        } else if (pAge >= 40 && pAge < 50) {
          countB4++;
        } else if (pAge >= 50 && pAge < 60) {
          countB5++;
        } else if (pAge >= 60 && pAge < 70) {
          countB6++;
        } else if (pAge >= 70 && pAge < 80) {
          countB7++;
        } else if (pAge >= 80 && pAge < 90) {
          countB8++;
        } else if (pAge >= 90) {
          countB9++;
        }
      }
      // 수요일
      else if (new Date(data.register_starttime).getDay() === 3) {
        if ((data.patient_ssn.slice(7, 8) === "3") || (data.patient_ssn.slice(7, 8) === "4")) {
          var newAge = "20" + (data.patient_ssn.slice(0, 2));
          newAge *= 1;
          pAge = yearToday - newAge;
        } else {
          var newAge2 = "19" + (data.patient_ssn.slice(0, 2));
          newAge2 *= 1;
          pAge = yearToday - newAge2;
        }
        if (pAge >= 10 && pAge < 20) {
          countC1++;
        } else if (pAge >= 20 && pAge < 30) {
          countC2++;
        } else if (pAge >= 30 && pAge < 40) {
          countC3++;
        } else if (pAge >= 40 && pAge < 50) {
          countC4++;
        } else if (pAge >= 50 && pAge < 60) {
          countC5++;
        } else if (pAge >= 60 && pAge < 70) {
          countC6++;
        } else if (pAge >= 70 && pAge < 80) {
          countC7++;
        } else if (pAge >= 80 && pAge < 90) {
          countC8++;
        } else if (pAge >= 90) {
          countC9++;
        }
      }
      // 목요일
      else if (new Date(data.register_starttime).getDay() === 4) {
        if ((data.patient_ssn.slice(7, 8) === "3") || (data.patient_ssn.slice(7, 8) === "4")) {
          var newAge = "20" + (data.patient_ssn.slice(0, 2));
          newAge *= 1;
          pAge = yearToday - newAge;
        } else {
          var newAge2 = "19" + (data.patient_ssn.slice(0, 2));
          newAge2 *= 1;
          pAge = yearToday - newAge2;
        }
        if (pAge >= 10 && pAge < 20) {
          countD1++;
        } else if (pAge >= 20 && pAge < 30) {
          countD2++;
        } else if (pAge >= 30 && pAge < 40) {
          countD3++;
        } else if (pAge >= 40 && pAge < 50) {
          countD4++;
        } else if (pAge >= 50 && pAge < 60) {
          countD5++;
        } else if (pAge >= 60 && pAge < 70) {
          countD6++;
        } else if (pAge >= 70 && pAge < 80) {
          countD7++;
        } else if (pAge >= 80 && pAge < 90) {
          countD8++;
        } else if (pAge >= 90) {
          countD9++;
        }
      }
      // 금요일
      else if (new Date(data.register_starttime).getDay() === 5) {
        if ((data.patient_ssn.slice(7, 8) === "3") || (data.patient_ssn.slice(7, 8) === "4")) {
          var newAge = "20" + (data.patient_ssn.slice(0, 2));
          newAge *= 1;
          pAge = yearToday - newAge;
        } else {
          var newAge2 = "19" + (data.patient_ssn.slice(0, 2));
          newAge2 *= 1;
          pAge = yearToday - newAge2;
        }
        if (pAge >= 10 && pAge < 20) {
          countE1++;
        } else if (pAge >= 20 && pAge < 30) {
          countE2++;
        } else if (pAge >= 30 && pAge < 40) {
          countE3++;
        } else if (pAge >= 40 && pAge < 50) {
          countE4++;
        } else if (pAge >= 50 && pAge < 60) {
          countE5++;
        } else if (pAge >= 60 && pAge < 70) {
          countE6++;
        } else if (pAge >= 70 && pAge < 80) {
          countE7++;
        } else if (pAge >= 80 && pAge < 90) {
          countE8++;
        } else if (pAge >= 90) {
          countE9++;
        }
      }
    }
    const patient_data = [
      {
        "dayOfWeek": "월",
        "10대": countA1,
        "20대": countA2,
        "30대": countA3,
        "40대": countA4,
        "50대": countA5,
        "60대": countA6,
        "70대": countA7,
        "80대": countA8,
        "90대": countA9,
      },
      {
        "dayOfWeek": "화",
        "10대": countB1,
        "20대": countB2,
        "30대": countB3,
        "40대": countB4,
        "50대": countB5,
        "60대": countB6,
        "70대": countB7,
        "80대": countB8,
        "90대": countB9,
      },
      {
        "dayOfWeek": "수",
        "10대": countC1,
        "20대": countC2,
        "30대": countC3,
        "40대": countC4,
        "50대": countC5,
        "60대": countC6,
        "70대": countC7,
        "80대": countC8,
        "90대": countC9,
      },
      {
        "dayOfWeek": "목",
        "10대": countD1,
        "20대": countD2,
        "30대": countD3,
        "40대": countD4,
        "50대": countD5,
        "60대": countD6,
        "70대": countD7,
        "80대": countD8,
        "90대": countD9,
      },
      {
        "dayOfWeek": "금",
        "10대": countE1,
        "20대": countE2,
        "30대": countE3,
        "40대": countE4,
        "50대": countE5,
        "60대": countE6,
        "70대": countE7,
        "80대": countE8,
        "90대": countE9,
      }
    ];
    setData3(patient_data);
  };
  const calcData4 = (datalist) => {
    let countQ1 = 0;
    let countQ2 = 0;
    let countQ3 = 0;
    let countQ4 = 0;
    for (var data of datalist) {
      if (new Date(data.register_starttime).getMonth() >= 0 && new Date(data.register_starttime).getMonth() < 3) {
        countQ1++;
      } else if (new Date(data.register_starttime).getMonth() >= 3 && new Date(data.register_starttime).getMonth() < 6) {
        countQ2++;
      } else if (new Date(data.register_starttime).getMonth() >= 6 && new Date(data.register_starttime).getMonth() < 9) {
        countQ3++
      } else if (new Date(data.register_starttime).getMonth() >= 9 && new Date(data.register_starttime).getMonth() < 12) {
        countQ4++
      }
    }
    const newDataList = [
      {
        "id": "1분기",
        "label": "1분기",
        "value": countQ1,
      },
      {
        "id": "2분기",
        "label": "2분기",
        "value": countQ2,
      },
      {
        "id": "3분기",
        "label": "3분기",
        "value": countQ3,
      },
      {
        "id": "4분기",
        "label": "4분기",
        "value": countQ4,
      }
    ]
    setData4(newDataList);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={style.DataAnalysis}>
      {loading ? <Spinner /> :
        <>
          <div className={style.DataAnalysis_row1}>
            <div className={style.DataAnalysis_col}>
              <Data1 data1={data1} />
            </div>
            <div className={style.DataAnalysis_col}>
              <Data2 data2={data2} />
            </div>
          </div>
          <div className={style.DataAnalysis_row2}>
            <div className={style.DataAnalysis_col}>
              <Data3 data3={data3} />
            </div>
            <div className={style.DataAnalysis_col}>
              <Data4 data4={data4} />
            </div>
          </div>
        </>}
    </div>
  );
}
export default DataAnalysis;
