import React from "react";

export const FormInputCard = ({
  label,
  type,
  component,
  value,
  onChange,
  min,
  max,
  step,
  error,
  name,
  required = true,
}) => (
  <div className="cardPadrao__card__formulario__input">
    <label id={required ? "required" : undefined}>{label}</label>
    {component || (
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        name={name}
      />
    )}
    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>
);
