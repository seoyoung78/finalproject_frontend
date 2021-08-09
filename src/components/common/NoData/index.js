import { FcSearch } from "react-icons/fc";

function Nodata(props) {
  return (
    <div className="d-flex align-items-center justify-content-center mt-5" style={{fontSize: "1.5rem", height: "100%"}}>
      <div><FcSearch/> 데이터가 없습니다.</div>
    </div>
  );
}

export default Nodata;