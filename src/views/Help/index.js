import "./Help.css";
import { RiCustomerServiceLine } from "react-icons/ri";

function Help(props) {
  return (
    <div className={`Help`}>
      <div className={`user_guide`}>
        <a  className="user_guide_a" href="/resources/pdf/사용자가이드.pdf" download>
        <div>사용자 가이드</div>
        <div className={`icon mt-3`}><i className="bi bi-question-circle"></i></div> 
        <div className="user_guide_explain">※ 클릭 시 사용자 가이드가 <br/>다운로드 됩니다.</div>
        </a>       
      </div>
      <div className={`online_center`}>        
        <div>온라인 고객센터</div>
          <a href="https://help.douzone.com/support/voice.jsp" target="_blank" rel="noreferrer">
            <div className={`icon icon1 mt-3`}><i className="bi bi-globe"></i></div>
          </a>
        <div className="user_guide_explain">※ 클릭 시 온라인 고객센터 페이지로 <br/>이동됩니다.</div>
      </div>
      <div className={`as`}>
        <div>원격 A/S</div>
        {/* <div className={`icon`}><i className="bi bi-laptop"></i></div> */}
        <div className="icon"><RiCustomerServiceLine/></div>
        <div></div>
        <div className="text-center"><i className="bi bi-telephone mr-1" style={{"fontSize":"1.6rem"}}></i>1688-6000</div>
      </div>
    </div>
  );
}

export default Help;