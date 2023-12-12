import { useState } from "react";
import Visible from "./../Images/show.png";
import hidden from "./../Images/hide.png";
const TextInput = ({
  label,
  value,
  type,
  name,
  placeholder,
  handleChange,
  showPassword,
  setShowPassword,
  error,
  helperText,
  readonly,
  max,
 step,
 pattern,
 style,
 autoComplete
}) => {
  const handleKeyPress = (e) => {
    // Get the pressed key
    if (type === "number") {
      const pressedKey = e.key;

      // Check if the pressed key is "e" or "i"
      if (pressedKey === "e" || pressedKey === "i" || pressedKey === '+' || pressedKey === "E" || pressedKey === "." || pressedKey === '-') {
        // Prevent the keypress from being added to the input value
        e.preventDefault();
      }
    }
  };
  return (
    <div class="input-field">
      <label for="exampleFormControlInput1" class="form-label">
        {label}
      </label>
      <input
        type={type}
        step={type === 'number' ? step : null}
        pattern={type === 'number' ? pattern : null}
        maxLength={max}
        name={name}
        value={value}
        style={{...style, backgroundColor:readonly ? "#E5E4E2" : "white", paddingRight: setShowPassword ? "40px" : "0px"}}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        // onPaste={(e) =>{
        //   e.preventDefault()
        //   return true
        // }}
        class="form-control"
        id="exampleFormControlInput1"
        placeholder={placeholder}
        autoComplete="on"
        
        readOnly={readonly}
        
      />
      {setShowPassword && (
        <img
          className="visible-icon"
          src={type ==="password" ? hidden: Visible}
          alt=""
          style={{ cursor: "pointer", height:"25px", marginBottom:"25px" }}
          onClick={() => setShowPassword(!showPassword)}
        />
      )}
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "left",
            marginLeft: "9px",
            fontSize: "13px",
            marginBottom: "-4px",
            marginTop: "3px",
          }}
        >
          <span>{helperText}</span>
        </div>
      )}
    </div>
  );
};
export default TextInput;
