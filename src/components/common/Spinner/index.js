import style from "./style.module.css";
function Spinner(props) {


  return (
    <div className={`${style.spinner2}`}>
      <div className={`spinner-border text-primary`} role="status">
        <span className="sr-only">loading...</span>
      </div>
    </div>
  );
}
export default Spinner;
