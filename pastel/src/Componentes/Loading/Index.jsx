import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function Loading() {
  return (
    <div className="loading">
      <FontAwesomeIcon icon={faSpinner} spin size="xl" />
      Carregando...
    </div>
  );
}
