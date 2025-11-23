import '../../styles/ButtonPrimary.css'
const ButtonPrimary = ({ btnType, isDisabled, text }) => {
  return (
    <div>
      <button type={btnType} className="btn-auth-main w-100 mb-2" disabled={isDisabled}>
        {text}
      </button>
    </div>
  )
}

export default ButtonPrimary
