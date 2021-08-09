import moment from "moment";
import React from "react";

function RegisterListItem(props) {
  const {index , register, selectedRegister, checkboxHandler} = props;
  return (
    <tr key={index} className="RegisterList_content_2_tr" onClick={(event) => checkboxHandler(register.register_id)}>
      <td><input type="checkbox" name="chk" checked={selectedRegister === register.register_id ? true : false} readOnly /></td>
      <td>{index + 1}</td>
      <td>{moment(register.register_date).format("yyyy-MM-DD HH:mm")}</td>
      <td>{register.register_id}</td>
      <td>{register.patient_name}</td>
      <td>{(register.patient_ssn).substring(0, 6)}</td>
      <td>{register.patient_sex}</td>
      <td>{register.user_name}</td>
      <td>{register.register_memo}</td>
      <td>{register.register_communication}</td>
      <td className={
        register.register_state === "완료" ? "RegisterList_content_2_tr_td_finish" : "" ||
          register.register_state === "취소" ? "RegisterList_content_2_tr_td_cancel" : "" ||
            register.register_state === "대기" ? "RegisterList_content_2_tr_td_ready" : ""
      }>
        {register.register_state}
      </td>
    </tr>
  );
}
export default React.memo(RegisterListItem);
