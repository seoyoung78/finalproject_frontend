import { useEffect, useRef, useState } from "react";
import UserCreateForm from "./UserCreateForm";
import UserList from "./UserList";
import UserUpdateForm from "./UserUpdateForm";
import Paho from "paho-mqtt";
import { sendMqttMessage } from "apis/mqtt";

function User(props) {
  // 직원 상태
  const [user, setUser] = useState({});

  function changeUser(user) {
    setUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_authority: user.user_authority,
      user_ssn1: user.user_ssn1,
      user_ssn2: user.user_ssn2,
      user_sex: user.user_sex,
      user_tel1: user.user_tel1,
      user_tel2: user.user_tel2,
      user_tel3: user.user_tel3,
      user_email1: user.user_email1,
      user_email2: user.user_email2,
      user_zipcode: user.user_zipcode,
      user_address: user.user_address,
      user_detailaddress1: user.user_detailaddress1,
      user_detailaddress2: user.user_detailaddress2,
      user_regdate: user.user_regdate,
      user_enabled: user.user_enabled
    });
  };
  
  // MQTT
  const [subTopic, setSubTopic] = useState("/138010/master");
  const pubMessage = [
    {
    topic: "/138010/master",
    content: "updateUser"
    }, 
    {
      topic: "/138010/master",
      content: "addUser"
    },
    {
      topic: "/138010/master",
      content: "blockUser"
    },
    {
      topic: "/138010/master",
      content: "allowUser"
    }
  ]
  const [message, setMessage] = useState("");

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
    <div className="User">
      {/* 좌측 */}
      <div className="User_left">
        {/* 직원 목록 */}
        <UserList user={user} changeUser={changeUser} message={message}/>
      </div>

      {/* 우측 */}
      <div className="User_right">
        <div>
          {/* 직원 정보 수정 */}
          <UserUpdateForm user={user} publishTopic={publishTopic} message={message}/>
        </div>
        <div>
          {/* 직원 등록 */}
          <UserCreateForm publishTopic={publishTopic}/>
        </div>
      </div>
    </div>
  );
}

export default User;