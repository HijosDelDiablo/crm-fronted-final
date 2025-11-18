import '../../styles/ButtonPrimary.css'
const ButtonPrimary = ({btnType, isDisabled, text}) => {
  return (
    <div>
      <button type={btnType} className="btn-primary" disabled={isDisabled}>
           {text}
          </button>
    </div>
  )
}

export default ButtonPrimary
