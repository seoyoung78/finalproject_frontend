import React, { useEffect, useState } from "react";
import moment from "moment";
import style from "./MonthTimeTable.module.css";
import { getRegisterByDoctor } from "apis/register";
import Spinner from "components/common/Spinner";

function MonthTimeTable(props) {

  const { selectedDoctor } = props;

  let selectToday = new Date();
  let selectTodayYear = selectToday.getFullYear();
  let selectTodayMonth = selectToday.getMonth() + 1;
  let selectTodayDate = selectToday.getDate();
  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------
  const [today, setToday] = useState(new Date());
  const [tMonth, setTMonth] = useState(moment().startOf('month'));

  const [registerListByDoctor, setRegisterListByDoctor] = useState([]);
  
  // spinner 
  const [loading, setLoading] = useState(false);
  //-------------------------------------------------------------  
  //달력 렌더 함수
  //-------------------------------------------------------------
  let todayYear = today.getFullYear();
  let todayMonth = (today.getMonth() + 1);

  const thisYaerAndMonth = todayYear + " 년 " + todayMonth + " 월";

  const calCalender = (today) => {
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;

    const prevLast = new Date(thisYear, thisMonth - 1, 0);
    const thisLast = new Date(thisYear, thisMonth, 0);

    const prevLastDate = prevLast.getDate();
    const prevLastDay = prevLast.getDay();

    const todayLastDate = thisLast.getDate();
    const todayLastDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(todayLastDate + 1).keys()].slice(1);
    const nextDates = [];

    if (prevLastDay !== 6) {
      for (let i = 0; i < prevLastDay + 1; i++) {
        prevDates.unshift(prevLastDate - i);
      }
    }

    for (let i = 1; i < 7 - todayLastDay; i++) {
      nextDates.push(i);
    }
    const dates = prevDates.concat(thisDates, nextDates);

    return dates;
  };
  const [dates, setDates] = useState(calCalender(today));

  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------

  const prevMonth = () => {
    today.setMonth(today.getMonth() - 1);
    setToday(today);
    setTMonth(moment(tMonth).subtract("1","M"));
    setDates(calCalender(today));
  };
  const nextMonth = () => {
    today.setMonth(today.getMonth() + 1);
    setToday(today);
    setTMonth(moment(tMonth).add("1","M"));
    setDates(calCalender(today));
  };
  const goToday = () => {
    setToday(new Date());
    setTMonth(moment().startOf('month'));
  };

  const updateSelectDate = (date) => {
    today.setDate(date);
    props.setSelectDate(moment(today).format("yyyy-MM-DD"));
    setToday(today);
    //setDate(calCalender(today));
  };

  const getRegisterCount = async (date) => {
    setLoading(true);
    try {
      const response = await getRegisterByDoctor(selectedDoctor.user_id, moment(date).format("yyyy-MM-DD H:mm"));
      setRegisterListByDoctor(response.data.registerList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------

  useEffect(() => {
    getRegisterCount(tMonth);
  }, []);

  useEffect(() => {
    getRegisterCount(tMonth);
  }, [tMonth]);

  useEffect(() => {
    setDates(calCalender(today));
  }, [today]);
  //-------------------------------------------------------------
  //렌더링 내용
  //------------------------------------------------------------- 
  return (
    <div className={style.MonthTimeTable}>
      <div className={style.MonthTimeTable_btns}>
        <button className={`button_team2_empty ${style.MonthTimeTable_btn}`}
          onClick={prevMonth}
        >
          &lt;
        </button>
        <button className={`button_team2_fill ${style.MonthTimeTable_btnToday}`}
          onClick={goToday}
        >
          오 늘
        </button>
        <button className={`button_team2_empty ${style.MonthTimeTable_btn}`}
          onClick={nextMonth}
        >
          &gt;
        </button>
      </div>
      <div className={style.yearAndMonth}>
        {thisYaerAndMonth}
      </div>
      <div className={style.days}>
        <div className={style.day}>일</div>
        <div className={`${style.day} ${style.dayN}`}>월</div>
        <div className={`${style.day} ${style.dayN}`}>화</div>
        <div className={`${style.day} ${style.dayN}`}>수</div>
        <div className={`${style.day} ${style.dayN}`}>목</div>
        <div className={`${style.day} ${style.dayN}`}>금</div>
        <div className={style.day}>토</div>
      </div>
      <div className={style.dates}>
      {loading ? <Spinner /> : <>
        {dates.map((date, index) => {
          if (todayYear === selectTodayYear
            && todayMonth === selectTodayMonth
            && date === selectTodayDate
            && date < index) {
            return (
              <div className={style.date} onClick={() => updateSelectDate(date)} key={index}>
                <div className={style.thisDate}>
                  {date}
                </div>
                <div className={style.count}>
                  {registerListByDoctor.map((Rdate,index) => {
                    if ((Rdate.date *= 1) === (date *= 1)) {
                      return (<div key={index} className={style.count_font}>진료수: {Rdate.count}명</div>)
                    }
                  })}
                </div>
              </div>
            )
          } else {
            if (index < 7 && date > 7) {
              return (
                <div className={style.date} onDoubleClick={prevMonth} key={index}>
                  <div className={style.otherDate1}>
                    {date}
                  </div>
                  <div>

                  </div>
                </div>
              )
            }
            else if (index > 28 && date < 7) {
              return (
                <div className={style.date} onDoubleClick={nextMonth} key={index}>
                  <div className={style.otherDate2}>
                    {date}
                  </div>
                  <div>

                  </div>
                </div>
              )
            } else {
              return (
                <div className={style.date} onClick={() => updateSelectDate(date)} key={index}>
                  <div className={style.otherDate}>
                    {date}
                  </div>
                  <div className={style.count}>
                    {registerListByDoctor.map((Rdate, index) => {
                      if ((Rdate.date *= 1) === (date *= 1)) {
                        return (<div className={style.count_font} key={index}>진료수: {Rdate.count}명</div>)
                      }
                    })}
                  </div>
                </div>
              )
            }
          }
        })}
        </>}
      </div>
    </div>
  );
}
export default MonthTimeTable;
