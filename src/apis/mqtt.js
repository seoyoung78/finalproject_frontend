import axios from "axios";

export function sendMqttMessage({topic, content}) {
  const promise = axios.get("/sendMqttMessage", {params:{topic, content}});
  return promise;
}

