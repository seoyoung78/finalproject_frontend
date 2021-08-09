import { useRef, useState } from "react";
import style from "./InspectionImgModifyModal.module.css";
import { createImage, deleteImage } from "apis/inspections";

function InspectionImgCreateFormModal(props) {
  //영상검사 이미지 결과
  const [inspectionImgResult, setInspecctionImgResult] = useState(props.inspection);
  //모달 열기, 수정, 닫기 props
  const { open, closeM, close } = props;
  //첨부파일
  const inputFile = useRef();

  ////////////////////////////////////////////////////////////

  //수정 버튼
  //유효성검사 후, DB Inspection_Imgs 에서 해당 검사번호를 가진 검사이미지 삭제 + 새로운 검사이미지 생성
  const inspectionImgResultBtn = async (event) => {
    event.preventDefault();

    var maxSize = 1 * 1024 * 1024;
    var sizeIndex = 0;
    var size = true;

    var typeIndex = 0;
    var type = true;

    //첨부파일들이 이미지파일인지, 파일사이즈가 1MB를 넘지 않는지 체크
    for (var i = 0; i <= inputFile.current.files.length - 1; i++) {
      if (inputFile.current.files[i].type.substring(0, inputFile.current.files[i].type.lastIndexOf("/")) !== "image") {
        type = false;
        typeIndex = i;
        break;
      }

      if (inputFile.current.files[i].size >= maxSize) {
        size = false;
        sizeIndex = i;
        break;
      }
    }

    if (inputFile.current.files.length === 0) {
      alert("첨부파일이 없습니다.");
    } else if (!type) {
      alert(typeIndex + 1 + "번째 첨부파일이 이미지파일이 아닙니다.");
    } else if (inputFile.current.files.length >= 5) {
      alert("첨부파일은 최대 4개까지 선택할 수 있습니다.");
    } else if (!size) {
      alert(sizeIndex + 1 + "번째 첨부파일의 크기가 1MB를 초과했습니다.");
    } else {
      try {
        //삭제
        await deleteImage(inspectionImgResult.inspection_id);
        const formData = new FormData();
        formData.append("inspection_img_inspection_id", inspectionImgResult.inspection_id);
        for (var i = 0; i <= inputFile.current.files.length - 1; i++) {
          formData.append("inspection_img_attach", inputFile.current.files[i]);
        }
        //생성
        await createImage(formData);
        // formData 콘솔 찍는 법
        // for (let value of formData.values()) {
        //   console.log(value);
        // }
      } catch (error) {
        console.log(error);
      }

      closeM();
    }
  };

  ////////////////////////////////////////////////////////////

  return (
    <div className={style.InspectionImgModifyModal}>
      <div className={open ? `${style.openModal} ${style.modal}` : `${style.modal}`}>
        {open ? (
          <section>
            <div className={style.InspectionImgCreateForm}>
              <div className={`${style.InspectionImgCreateForm_title} m-2`}>검사 결과 수정</div>
              <div className={`${style.InspectionImgCreateForm_1} border`}>
                <form encType="multipartFormData">
                  <div className={`${style.InspectionImgCreateForm_1_1} row m-3`}>
                    <div className={`${style.InspectionImgCreateForm_1_1_1} mr-3`}>
                      <div className="mb-1">진단검사명 :</div>
                      <div className="mb-1">검사명 :</div>
                      <div className="mb-1">검사번호 :</div>
                      <div className="mb-1">담당의 :</div>
                      <div className="mb-1">검사자 :</div>
                      <div className="mb-1">검사실 :</div>
                      <div>첨부파일 : </div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className={style.InspectionImgCreateForm_1_1_2}>
                      <div className="mb-1">{inspectionImgResult.inspection_list_category}</div>
                      <div className="mb-1">{inspectionImgResult.inspection_list_name}</div>
                      <div className="mb-1">{props.id}</div>
                      <div className="mb-1">{inspectionImgResult.inspection_doctor_name}</div>
                      <div className="mb-1">{inspectionImgResult.inspection_inspector_name}</div>
                      <div className="mb-1">{inspectionImgResult.inspection_lab}</div>
                      <div className="mb-1">
                        <input name="iattach" type="file" multiple style={{ width: "100%" }} ref={inputFile} accept="image/*" />
                      </div>
                      <div className={`font-weight-lighter font-italic`}>
                        <small>※최대 4개까지 선택 가능</small>
                      </div>
                      <div className={`font-weight-lighter font-italic`}>
                        <small>※이미지파일 크기는 1MB 초과 불과</small>
                      </div>
                    </div>
                  </div>
                  <div className={`${style.InspectionImgCreateForm_1_2} mb-3`}>
                    <button type="submit" className="button_team2_fill m-0" onClick={inspectionImgResultBtn}>
                      수정
                    </button>
                    <button className="button_team2_empty" onClick={close}>
                      닫기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default InspectionImgCreateFormModal;
