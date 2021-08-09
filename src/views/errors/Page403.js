import { FcInfo } from "react-icons/fc";
import { useHistory } from "react-router-dom";

function Page403(props) {
  const history = useHistory();

  const handleGoback = () => {
    history.goBack();
  };

  return (
    <div className="text-center" style={{fontSize: "1.8rem", height: "100%", marginTop: "15%"}}>
      <div><FcInfo/> 접근 제한된 페이지 입니다.</div>
      <button className="button_team2_fill mt-4" onClick={handleGoback}>뒤로 가기</button>
    </div>
  );
}

export default Page403;