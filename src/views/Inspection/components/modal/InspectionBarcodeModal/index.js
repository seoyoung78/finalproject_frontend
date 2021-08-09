import React from "react";
import style from "./InspectionBarcodeModal.module.css";
import Barcode from "react-barcode";

function InspectionBarcodeModal(props) {
  const { open, closeCheck, closeCancel, inspectionListName, patientName, inspectionInspectorName } = props;

  const barcode = props.tid + props.inspectionListSpecimen + props.id + props.inspectionListContainer;

  return (
    <div className={style.InspectionModal}>
      <div className={open ? `${style.openModal} ${style.modal}` : `${style.modal}`}>
        {open ? (
          <section>
            <div className={style.InspectionBarcodePop}>
              <div className={style.InspectionBarcodePop_title}>바코드 출력</div>
              <div className={`${style.InspectionBarcodePop_1} border`}>
                <div className={`${style.InspectionBarcodePop_1_1} m-3`}>
                  <Barcode value={barcode} renderer={"img"} />
                </div>
                <div className={`${style.InspectionBarcodePop_1_2} border`}>
                  <div className="mr-3 ml-3">
                    <div className="mb-3">검사번호 :</div>
                    <div className="mb-3">검사명 :</div>
                    <div className="mb-3">피검사자 :</div>
                    <div>검사자 :</div>
                  </div>
                  <div>
                    <div className="mb-3">{props.id}</div>
                    <div className="mb-3">{inspectionListName}</div>
                    <div className="mb-3">{patientName}</div>
                    <div>{inspectionInspectorName}</div>
                  </div>
                </div>
              </div>
              <div className={`${style.InspectionBarcodePop_1_3} mb-3 mt-3`}>
                <button className="button_team2_fill" onClick={closeCheck}>
                  확인
                </button>
                <button className="button_team2_empty" onClick={closeCancel}>
                  취소
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default InspectionBarcodeModal;
