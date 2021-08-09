import style from "./ToDoList.module.css";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { createToDoLists, deleteToDoLists, getToDoLists, updateToDoLists } from "apis/register";
import { useSelector } from "react-redux";

function ToDoList(props) {
  const { selectedDoctor, selectDate, setSelectDate, publishTopic } = props;
  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------
  const globalUid = useSelector((state) => state.authReducer.uid);

  const [inputText, setInputText] = useState("");
  const [toDoList, setToDoList] = useState([]);
  
  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------

  const inputTextHandler = (event) => {
    setInputText(
      event.target.value
    );
  };
  const addToDoList = async () => {
    const newSchedule = {
      schedule_id: "",
      schedule_user_id: selectedDoctor.user_id,
      schedule_content: inputText,
      schedule_state: "대기",
      schedule_regdate: moment(selectDate).format("yyyy-MM-DD"),
    };

    try {
      var list = await createToDoLists(newSchedule);
      publishTopic(2);
    } catch (e) {
      console.log(e);
    }
    setInputText("");
  };

  const changeYet = async (id) => {

    if (globalUid === selectedDoctor.user_id) {
      const updateSchedule = {
        schedule_id: id,
        schedule_state: "완료",
      };
      try {
        var list = await updateToDoLists(updateSchedule);
        publishTopic(2);
      } catch (e) {
        console.log(e);
      }
    } else {

    }

  };
  const changeDone = async (id) => {
    if (globalUid === selectedDoctor.user_id) {
      const updateSchedule = {
        schedule_id: id,
        schedule_state: "대기",
      };
      try {
        var list = await updateToDoLists(updateSchedule);
        publishTopic(2);
      } catch (e) {
        console.log(e);
      }
    } else {

    }
  };
  const deleteToDo = async (id) => {

    try {
      var list = await deleteToDoLists(id);
      publishTopic(2);
    } catch (e) {
      console.log(e);
    }
  };

  const getToDoList = async (schedule_regdate, schedule_user_id) => {
    try {
      var list = await getToDoLists(schedule_regdate, schedule_user_id);
      setToDoList(list.data.todolist);
    } catch (e) {
      console.log(e);
    }
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------

  useEffect(() => {
    getToDoList(selectDate, selectedDoctor.user_id);
    return () => {
      setSelectDate(moment().format("yyyy-MM-DD"));
    };
  }, [selectDate, selectedDoctor.user_id, setSelectDate]);

  useEffect(() => {
    setSelectDate(selectDate ? selectDate : new Date());
    getToDoList(selectDate, selectedDoctor.user_id);
  }, [props, selectDate, selectedDoctor.user_id, setSelectDate]);

  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <div className={style.ToDoList}>
      <div className={style.ToDoList_header}>
        <div className={style.ToDoList_header_name}>
          <h2>To Do List</h2>
        </div>
        <div className={style.ToDoList_header_date}>
          {selectDate}
        </div>
        <div className={style.ToDoList_header_inputLabel}>
          <div className={style.ToDoList_header_inputLabel_input}>
            {globalUid === selectedDoctor.user_id ?
              <input type="text" value={inputText} onChange={inputTextHandler} placeholder="할 일을 입력해주세요."></input>
              :
              false
            }
          </div>
          <div className={style.ToDoList_header_inputLabel_button}>
            {globalUid === selectedDoctor.user_id ?
              <button className="button_team2_fill" onClick={addToDoList}>+</button>
              :
              false
            }
          </div>
        </div>
      </div>
      <div className={style.ToDoList_content}>
        <div className={style.ToDoList_content_header}>

        </div>
        <div className={style.ToDoList_content_items}>
          <div className={style.ToDoList_content_items_yet_header}>
            <div className={style.ToDoList_content_items_yet_header_1}>
              Doing
            </div>
            <div className={style.ToDoList_content_items_yet_header_2}>
              {toDoList.filter(toDo => {
                if (toDo.schedule_state === "대기") {
                  return toDo;
                }
              }).length}
            </div>
          </div>
          <div className={style.ToDoList_content_items_yet_itmes}>
            {toDoList.map(toDo => {
              if (toDo.schedule_state === "대기") {
                return (
                  <div className={style.ToDoList_content_items_yet_item} key={toDo.schedule_id} onDoubleClick={() => changeYet(toDo.schedule_id)} >
                    <div className={style.ToDoList_content_items_yet_item_content}>
                      {toDo.schedule_content}
                    </div>
                    <div className={style.ToDoList_content_items_yet_item_btns}>
                      <div className={style.ToDoList_content_items_yet_item_btns_btn}>
                        {globalUid === selectedDoctor.user_id ?
                          <button className={style.ToDoList_btn_X} onClick={() => deleteToDo(toDo.schedule_id)}>X</button>
                          :
                          false
                        }
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <div className={style.ToDoList_content_items_done_header}>
            <div className={style.ToDoList_content_items_done_header_1}>
              Done
            </div>
            <div className={style.ToDoList_content_items_done_header_2}>
              {toDoList.filter(toDo => {
                if (toDo.schedule_state === "완료") {
                  return toDo;
                }
              }).length}
            </div>
          </div>
          <div className={style.ToDoList_content_items_done_itmes}>
            {toDoList.map(toDo => {
              if (toDo.schedule_state === "완료") {
                return (
                  <div className={style.ToDoList_content_items_done_item} key={toDo.schedule_id} onDoubleClick={() => changeDone(toDo.schedule_id)}>
                    <div className={style.ToDoList_content_items_done_item_content}>
                      {toDo.schedule_content}
                    </div>
                    <div className={style.ToDoList_content_items_done_item_btns}>
                      <div className={style.ToDoList_content_items_done_item_btns_btn}>
                        {globalUid === selectedDoctor.user_id ?
                          <button className={style.ToDoList_btn_X2} onClick={() => deleteToDo(toDo.schedule_id)}>X</button>
                          :
                          false
                        }
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ToDoList;
