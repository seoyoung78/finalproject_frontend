import { getDoctorList } from "apis/register";
import { useEffect, useRef, useState } from "react";
import RegisterList from "./RegisterList";
import RegisterRead from "./RegisterRead";
import RegisterTimeSchedule from "./RegisterTimeSchedule";
import RegisterUpdateForm from "./RegisterUpdateForm";
import Paho from "paho-mqtt";
import { sendMqttMessage } from "apis/mqtt";

function Register(props) {


  ///////////////////////////////////////////////////////////////
  // MQTT 설정 
  ///////////////////////////////////////////////////////////////

  //-------------------------------------------------------------  
  //메시지 종류
  //-------------------------------------------------------------

  // 1. 리스트 호출 - nurse -> nurse
  // { topic: "/138010/nurse", content: "refreshRegisters"}
  // 2. 진료 추가   - nurse -> doctor
  // { topic: "/138010/doctor", content: "addTreatments"}
  // 3. To Do List 추가
  // { topic: "/138010/doctor", content: "refreshToDoList"}
  

  //-------------------------------------------------------------  
  //MQTT상태 선언
  //-------------------------------------------------------------

  const [subTopic, setSubTopic] = useState("/138010/nurse");  // 병원코드/간호사
  const [prevSubTopic, setPrevSubTopic] = useState("/138010/nurse"); // 병원코드/간호사
  const [pubMessage, setPubMessage] = useState([
    { topic: "/138010/nurse", content: "refreshRegisters"}, 
    { topic: "/138010/nurse/doctor", content: "addTreatments"},
    { topic: "/138010/nurse", content: "refreshToDoList"}
  ]);
  const [message, setMessage] = useState("");

  //-------------------------------------------------------------
  //MQTT 연결 함수
  //-------------------------------------------------------------
  
  let client = useRef(null);
  const connectMqttBroker = () => {
    // Paho.Mqtt.Client x
    client.current = new Paho.Client("kosa3.iptime.org", 50012, "client-" + new Date().getTime());
    //client.current = new Paho.Client("localhost", 61614, "client-" + new Date().getTime());

    client.current.onConnectionLost = () => {
      console.log("Mqtt 접속 끊김");
    };

    client.current.onMessageArrived = (msg) => {
      console.log("메시지 수신");
      var Jmessage = JSON.parse(msg.payloadString);
      console.log(Jmessage);
      setMessage(() => {
        return Jmessage;
      });
    };

    client.current.connect({
      
      onSuccess: () => {
        console.log("mqtt 들어옴");
        sendSubTopic();
        console.log("Mqtt 접속 성공");
      }
    });
  };

  const disconnectMqttBroker = () => {
    client.current.disconnect(); // onConnectionLost 실행됨
  };
  const sendSubTopic = () => {
    client.current.unsubscribe(prevSubTopic);
    client.current.subscribe(subTopic);
    setPrevSubTopic(subTopic);
  };

  const publishTopic = async (num) => {
    await sendMqttMessage(pubMessage[num]);
  };

  useEffect(() => {
    //sendSubTopic();
    connectMqttBroker();
  },[]);

  //-------------------------------------------------------------  
  //상태 선언
  //-------------------------------------------------------------

  // 접수 DB 컬럼 REGISTERS TABLE
  // REGISTER_ID, REGISTER_PATIENT_ID, REGISTER_USER_ID, 
  // REGISTER_REGDATE, REGISTER_DATE, REGISTER_TIME, 
  // REGISTER_MEMO, REGISTER_COMMUNICATION, REGISTER_STATE

  // 공통 날짜
  const [registerDate, setRegisterDate] = useState(new Date());

  // 접수 내역 배열 
  //const [registerList, setRegisterList] = useState();

  // 선택된 환자 내용
  const [selectedPatient, setSelectedPatient] = useState({});

  // 접수 상세 내역 & 접수 수정 체인지
  const [registerRead, setRegisterRead] = useState(true);

  // 등록된 의사들 배열
  const [doctors, setDoctors] = useState([]);

  //-------------------------------------------------------------
  //버튼 이벤트 처리
  //-------------------------------------------------------------
  
  const changeRegister = (event) => {
    if (registerRead === true) {
      setRegisterRead(false);
    } else {
      setRegisterRead(true);
    }
  };

  const cancelRegister = (event) => {
    if (registerRead === true) {
      setRegisterRead(false);
    } else {
      setRegisterRead(true);
    }
  };

  //-------------------------------------------------------------
  //마운트 및 언마운트에 실행할 내용
  //-------------------------------------------------------------

  const getDoctorLists = async () => {
    try {
      var list = await getDoctorList();
      setDoctors(list.data.doctorList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(()=>{
    getDoctorLists();
  },[]);


  //-------------------------------------------------------------
  //렌더링 내용
  //-------------------------------------------------------------
  return (
    <div className="Register">
      {/* 상단 */}
      <div className="Register_1">
        {/* 접수 내역 */}
        <div className="RegisterList">
          <RegisterList
            setSelectedPatient={setSelectedPatient} 
            registerDate={registerDate}
            setRegisterDate={setRegisterDate}
            message={message}
            publishTopic={publishTopic}
            />
        </div>
        {/* 접수 상세 내역 or 접수 수정*/}
        <div className="RegisterRead">
          {registerRead ?
            <RegisterRead
              registerRead={registerRead}
              changeRegister={changeRegister}
              registerDate={registerDate}
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
            />
            :
            <RegisterUpdateForm
              registerRead={registerRead}
              changeRegister={changeRegister}
              cancelRegister={cancelRegister}
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
              doctors={doctors}
              publishTopic={publishTopic}
            />
          }
        </div>
      </div>
      {/* 하단 */}
      <div className="Register_2">
        <div className="Register_2_header">
          진료 예정표
        </div>
        <div className="Register_Components border">
          <div className="RegisterTimeSchedule">
            <RegisterTimeSchedule 
              registerDate={registerDate}
              setRegisterDate={setRegisterDate}
              message={message}
              publishTopic={publishTopic}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;