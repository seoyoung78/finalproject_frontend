import React from "react";
import DaumPostcode from 'react-daum-postcode';
import style from "./style.module.css";

export const Modal = (props) => {
  const {open, close, send} = props;

  // 다음 주소 API
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = ''; 
    
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    //console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    
    // 주소 데이터를 createForm으로 보냄
    send(data);
    return data;
  }

  return(
    <div className={`${style.AddressModal}`}>
      <div className={open ? `${style.openModal} ${style.modal}`: `${style.modal}`}>
        {open? (
          <section>
            <div className={`${style.AddressModal_header}`}>
              <div>우편번호 찾기</div>
              <button className="close" onClick={close}>
                {" "}
                &times;{" "}
              </button>
            </div>
            <main>
              <DaumPostcode
                onComplete={handleComplete} 
                { ...props }
              />
            </main>
          </section>
        ):null}
      </div>
    </div>
  )
}