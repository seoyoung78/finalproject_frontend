import "./Inspection.css";
import InspectionPatientList from "./InspectionPatientList";
import InspectionList from "./InspectionList";
import { useEffect, useRef, useState } from "react";
import Paho from "paho-mqtt";
import { sendMqttMessage } from "apis/mqtt";

function Inspection(props) {
  ////////////////////////////////////////////////////////////
  //MQTT
  // 1. 검사 대기 추가   - doctor -> inspector
  // { topic: "/138010/nurse/doctor/inspector", content: "addInspections"}
  // 2. 검사 수정   - inspector -> inspector
  // { topic: "/138010/nurse/doctor/inspector", content: "updateInspects"}
  // 3. 총검사 상태 완료   - inspector -> inspector
  // { topic: "/138010/nurse/doctor/inspector", content: "iStateInspections"}
  ////////////////////////////////////////////////////////////
  const [subTopic, setSubTopic] = useState("/138010/nurse/doctor/inspector"); // 병원코드/검사자
  const [pubMessage, setPubMessage] = useState([
    {
      topic: "/138010/nurse/doctor/inspector",
      content: "updateInspects",
    },
    {
      topic: "/138010/nurse/doctor/inspector",
      content: "iStateInspections",
    },
  ]);
  const [message, setMessage] = useState("");

  let client = useRef(null);

  const connectMqttBroker = () => {
    client.current = new Paho.Client("kosa3.iptime.org", 50012, "client-" + new Date().getTime());
    // client.current = new Paho.Client("localhost", 61614, "client-" + new Date().getTime());

    client.current.onConnectionLost = () => {
      console.log("Mqtt 접속 끊김");
    };

    client.current.onMessageArrived = (msg) => {
      //console.log("메시지 수신");
      var Jmessage = JSON.parse(msg.payloadString);
      setMessage(() => {
        return Jmessage;
      });
    };

    client.current.connect({
      onSuccess: () => {
        client.current.subscribe(subTopic);
        console.log("Mqtt 접속 성공");
      },
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
  }, []);

  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////

  //진료번호
  const [treatmentId, setTreatmentId] = useState("");
  //true 일때, 총검사상태: 대기~>검사
  const [iStateInspection, setIStateInspection] = useState(false);
  //true 일때, 총검사상태: 검사~>대기
  const [iStateWait, setIStateWait] = useState(false);
  //true 일때, 총검사상태: 검사~>완료
  const [iStateFinish, setIStateFinish] = useState(false);

  //검사대기 목록에서 체크된 진료번호
  const checkedtId = (id) => {
    setTreatmentId(id);
  };

  //검사시작 시(총검사상태: 대기~>검사)
  const handleIStateInspectionTrue = () => {
    setIStateInspection(true);
  };

  //검사시작 후(총검사상태: 대기~>검사)
  const handleIStateInspectionFalse = () => {
    setIStateInspection(false);
  };

  //모든 검사상태가 대기 시(총검사상태: 검사~>대기)
  const handleIStateWaitTrue = () => {
    setIStateWait(true);
  };

  //모든 검사상태가 대기 후(총검사상태: 검사~>대기)
  const handleIStateWaitFalse = () => {
    setIStateWait(false);
  };

  //모든 검사상태가 완료 시(총검사상태: 검사~>완료)
  const handleIStateFinishTrue = () => {
    setIStateFinish(true);
  };

  //모든 검사상태가 완료 후(총검사상태: 검사~>완료)
  const handleIStateFinishFalse = () => {
    setIStateFinish(false);
  };

  ////////////////////////////////////////////////////////////

  return (
    <>
      <div className="Inspection">
        <div className="Inspection_1">
          {/* 검사대기환자 */}
          <InspectionPatientList
            treatmentId={treatmentId}
            checkedtId={(id) => checkedtId(id)}
            iStateInspection={iStateInspection}
            handleIStateInspectionFalse={handleIStateInspectionFalse}
            iStateFinish={iStateFinish}
            handleIStateFinishFalse={handleIStateFinishFalse}
            iStateWait={iStateWait}
            handleIStateWaitFalse={handleIStateWaitFalse}
            message={message}
            publishTopic={publishTopic}
          />
        </div>
        <div className="Inspection_2">
          {/* 검사상세내역 */}
          <InspectionList
            treatmentId={treatmentId}
            handleIStateInspectionTrue={handleIStateInspectionTrue}
            iStateFinish={iStateFinish}
            handleIStateFinishTrue={handleIStateFinishTrue}
            handleIStateFinishFalse={handleIStateFinishFalse}
            iStateWait={iStateWait}
            handleIStateWaitTrue={handleIStateWaitTrue}
            handleIStateWaitFalse={handleIStateWaitFalse}
            publishTopic={publishTopic}
          />
        </div>
      </div>
    </>
  );
}

export default Inspection;
