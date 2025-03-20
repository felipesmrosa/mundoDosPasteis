import React from "react";
import { useNavigate } from "react-router-dom";

export function PaginaDeErro() {
  const navigate = useNavigate();

  const voltarPagina = () => {
    navigate(-1);
  };

  return (
    <div className="erro">
      <span>
        <h1>ERRO</h1>
        <h1 id="erro404">404</h1>
      </span>
      <button className="return" onClick={voltarPagina}>Voltar</button>
    </div>
  );
}
