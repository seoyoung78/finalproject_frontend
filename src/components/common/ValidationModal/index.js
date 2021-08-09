import style from "./style.module.css";

export const ValidationModal = (props) => {
  const {open, close, errorMsg } = props;

  return (
    <div className={`${style.ValidationModal}`}>
      <div className={open ? `${style.openModal} ${style.modal}`: `${style.modal}`}>
        {open? (
          <section>
            <div className={`${style.ValidationModal_header}`}>
              <div>{errorMsg.title}</div>
              <button className="close" onClick={close}>
                {" "}
                &times;{" "}
              </button>
            </div>
            <main>
              {errorMsg.content}
            </main>
          </section>
        ):null}
      </div>
    </div>
  )
}