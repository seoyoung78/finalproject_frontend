import { FcInfo } from "react-icons/fc";
import { useHistory } from "react-router-dom";

function Page404(props) {
  const history = useHistory();

  const handleGoback = () => {
    history.goBack();
  };

  return (
    <div className="text-center" style={{fontSize: "1.8rem", height: "100%", marginTop: "15%"}}>
      <div><FcInfo/> 잘못된 경로의 페이지 입니다.</div>
      <button className="button_team2_fill mt-4" onClick={handleGoback}>뒤로가기</button>
    </div>
  );
}

export default Page404;