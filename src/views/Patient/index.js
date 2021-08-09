import PatientCreateForm from "./PatientCreateForm";
import PatientList from "./PatientList";
import PatientUpdateForm from "./PatientUpdateForm";
import "./Patient.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import Paho from "paho-mqtt";
import { sendMqttMessage } from "apis/mqtt";

function Patient(props) {
  // 환자 상태
  const [patient, setPatient] = useState({});

  function changePatient(patient) {
    setPatient({
      patient_id: patient.patient_id,
      patient_name: patient.patient_name,
      patient_ssn1: patient.patient_ssn1,
      patient_ssn2: patient.patient_ssn2,
      patient_sex: patient.patient_sex,
      patient_tel1: patient.patient_tel1,
      patient_tel2: patient.patient_tel2,
      patient_tel3: patient.patient_tel3, 
      patient_zipcode: patient.patient_zipcode, 
      patient_address: patient.patient_address, 
      patient_detailaddress1: patient.patient_detailaddress1, 
      patient_detailaddress2: patient.patient_detailaddress2,
      patient_regdate: patient.patient_regdate
    })
  };
  
  //---------------------------------------------------------------------------------------
  // MQTT
  const [subTopic, setSubTopic] = useState("/138010/nurse");

  const pubMessage = [{
    topic: "/138010/nurse",
    content: "updatePatient"}, {
      topic: "/138010/nurse",
      content: "addPatient"
    }];

  const [message, setMessage] = useState("");

  let client = useRef(null);

  const connectMqttBroker = () => {
    // Paho.Mqtt.Client x
    client.current = new Paho.Client("kosa3.iptime.org", 50012, "client-" + new Date().getTime());
    // client.current = new Paho.Client("localhost", 61614, "client-" + new Date().getTime());

    client.current.onConnectionLost = () => {
      console.log("Mqtt 접속 끊김");
    };

    client.current.onMessageArrived = (msg) => {
      console.log("메시지 수신");
      var Jmessage = JSON.parse(msg.payloadString);
      setMessage(() => {
        return Jmessage;
      });
    };

    client.current.connect({
      onSuccess: () => {
        client.current.subscribe(subTopic);
        console.log("Mqtt 접속 성공");
      }
    });
  };

  const disconnectMqttBroker = () => {
    client.current.disconnect(); // onConnectionLost 실행됨
  };

  const publishTopic = async (num) => {
    await sendMqttMessage(pubMessage[num]);
  };

  useEffect(() => {
    connectMqttBroker();
    console.log("MESSAGE: ", message);
  });

  return (
    <div className={`row no-gutters Patient`}>
      {/* 좌측 */}
      <div className="Patient_left">
        {/* 환자 목록 */}
        <PatientList patient={patient} changePatient={changePatient} message={message}/>
      </div>

      {/* 우측 */}
      <div className="Patient_right">
        <div>
          {/* 환자 정보 수정 */}
          <PatientUpdateForm patient={patient} publishTopic={publishTopic}/>
        </div>
        <div>
          {/* 환자 등록 */}
          <PatientCreateForm publishTopic={publishTopic}/>
        </div>
      </div>
    </div>
  );
}

export default Patient;