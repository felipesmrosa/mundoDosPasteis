import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function BotoesDeAcao({ onDelete, onEdit }) {
  return (
    <div className="cardPadrao__card__acoes">
      <span onClick={onEdit} className="cardPadrao__card__acoes__spanEdit">
        <FontAwesomeIcon
          className="cardPadrao__card__acoes__spanEdit--edit"
          icon={faPenToSquare}
        />
      </span>
      <span onClick={onDelete} className="cardPadrao__card__acoes__spanDel">
        <FontAwesomeIcon
          className="cardPadrao__card__acoes__spanDel--del"
          icon={faTrash}
        />
      </span>
    </div>
  );
}
