import { useEffect, useState } from "react";
import style from "./InspectionImgFormModal.module.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { readImage, selectImgId, downloadImg } from "apis/inspections";

function InspectionImgFormModal(props) {
  //영상검사 이미지 결과
  const [inspectionImgResult, setInspectionImgResult] = useState(props.inspection);
  //모달 열기, 닫기 props
  const { open, close } = props;
  //ImageGallery에 사용될 이미지 배열
  let images = [];

  ////////////////////////////////////////////////////////////

  //DB Inspection_Imgs에서 해당 검사번호를 가진 검사이미지 목록 가져옴
  const getInspectionImgs = async () => {
    try {
      if (props.id === props.inspection.inspection_id) {
        //해당 검사번호를 가진 검사이미지의 다운로드 url 가져와서 images 배열에 넣음
        const response = await readImage(props.id);
        for (var i = 0; i <= response.data.inspectionImgList.length - 1; i++) {
          images.push({
            original: response.data.inspectionImgList[i].inspection_img_path,
            thumbnail: response.data.inspectionImgList[i].inspection_img_path,
            originalHeight: 600,
          });
        }

        //해당 검사번호를 가진 검사이미지번호 목록 가져옴
        const responseImgId = await selectImgId(props.id);

        //검사이미지번호의 이미지 다운로드
        for (var i = 0; i <= responseImgId.data.inspectionImgList.length - 1; i++) {
          await downloadImg(responseImgId.data.inspectionImgList[i].inspection_img_id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if(open === true){
      getInspectionImgs();
    }
  }, [open]);

  ////////////////////////////////////////////////////////////

  return (
    <div className={style.InspectionImgModal}>
      <div className={open ? `${style.openModal} ${style.modal}` : `${style.modal}`}>
        {open ? (
          <section>
            <div className={`${style.InspectionImgForm_title} m-2`}>검사 사진</div>
            <div className={`${style.InspectionImgForm_1} border`}>
              <div className={`${style.InspectionImgForm_1_1} m-3`}>
                <div className={`${style.InspectionImgForm_1_1_1} mr-3 ml-3`}>
                  <div className="mb-1">진단검사명 :</div>
                  <div className="mb-1">검사명 :</div>
                  <div className="mb-1">검사번호 :</div>
                  <div className="mb-1">담당의 :</div>
                  <div className="mb-1">검사자 :</div>
                  <div className="mb-1">검사실 :</div>
                </div>
                <div className={style.InspectionImgForm_1_1_2}>
                  <div className="mb-1">{inspectionImgResult.inspection_list_category}</div>
                  <div className="mb-1">{inspectionImgResult.inspection_list_name}</div>
                  <div className="mb-1">{props.id}</div>
                  <div className="mb-1">{inspectionImgResult.inspection_doctor_name}</div>
                  <div className="mb-1">{inspectionImgResult.inspection_inspector_name}</div>
                  <div className="mb-1">{inspectionImgResult.inspection_lab}</div>
                </div>
              </div>
              <div className={`${style.InspectionImgForm_1_2} m-3`}>
                <ImageGallery items={images} />
              </div>
            </div>
            <div className={`${style.InspectionImgForm_2} m-2`}>
              <button className="button_team2_fill" onClick={close}>
                닫기
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default InspectionImgFormModal;