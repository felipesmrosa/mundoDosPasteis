export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "1px solid #borda-card", // Certifique-se de substituir $borda-card pelo valor hexadecimal ou pela variável correta
    width: "100%",
    height: "auto",
    outline: "none",
    fontSize: "16px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#borda-card",
    },
    color: "#000",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: state.isMulti ? "0" : provided.padding,
    paddingLeft: "10px",
  }),
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#0052CC"
      : state.isFocused
      ? "#E3E3E3"
      : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: "#E3E3E3",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#666666",
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

export const maiorDeIdadeData = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
];