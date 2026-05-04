import './InputField.css'

export default function InputField({
  label,
  placeholder = '',
  value,
  onChange,
  icon,
  type = 'text',
  ...props
}) {
  return (
    <div className="input-field">
      {label && (
        <label className="input-field__label text-label-light">{label}</label>
      )}
      <div className="input-field__wrap glass-recessed">
        {icon && (
          <span className="material-symbols-outlined input-field__icon">{icon}</span>
        )}
        <input
          className="input-field__input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    </div>
  )
}
