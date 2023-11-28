import { useState } from "react";
import Visible from "./../Images/visible.svg";
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
  max
 
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
        maxLength={max}
        name={name}
        value={value}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        class="form-control"
        id="exampleFormControlInput1"
        placeholder={placeholder}
        autoComplete="on"
        
        readOnly={readonly}
        
        style={{ paddingRight: setShowPassword ? "40px" : "0px" }}
      />
      {setShowPassword && (
        <img
          className="visible-icon"
          src={Visible}
          alt=""
          style={{ cursor: "pointer" }}
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
