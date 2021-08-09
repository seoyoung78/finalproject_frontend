import React from "react";

function RegisterTimeScheduleItems(props) {
  // 상속된 props
  const {patient_name, user_name, register_state} = props;
  return (
    <>
      {patient_name}<br></br>{register_state}
      
      <span className={register_state === "대기" ? "balloon_ready" : "" 
                    || register_state === "완료" ? "balloon_success" : "" 
                    || register_state === "취소" ? "balloon_cancel" : "" }>
        <div>
          환자명:{patient_name}
        </div>
        <div>
          담당의:{user_name}
        </div>
      </span>
    </>
  );
}
export default React.memo(RegisterTimeScheduleItems);
