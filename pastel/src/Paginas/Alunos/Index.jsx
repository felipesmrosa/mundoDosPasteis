import React, { useEffect, useState } from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Alunos() {
  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/produtos/cadastrar")}
        titulo={"Produtos"}
        botao={"Cadastrar"}
      />

      <div className="filtro">
        <label htmlFor="pesquisar">Filtro</label>
        <input
          type="text"
          placeholder="Pesquisar por Nome ou Ingrediente"
          id="pesquisar"
        />
        <select>
          <option value="">Todos</option>
          <option value="Bebidas">Bebida</option>
          <option value="Pizzas">Pizza</option>
          <option value="Frangos">Frango</option>
          <option value="Pastéis">Pastel</option>
        </select>
      </div>

      <div className="cardPadrao">
        <div className="cardPadrao__card">
          <b className="cardPadrao__card__informacaoPrincipal">
            Pastel de Ovo
          </b>
          {/* <BotoesDeAcao
            onEdit={() => navigate(`/produtos/editar/${aluno.id}`)}
            onDelete={() => {
              setSelectedAluno(aluno.id);
              setIsModalOpen(true);
            }}
          /> */}
        </div>
      </div>

      {/* {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="fundoPadrao__carregarMais"
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      )} */}

      {/* <Modal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedAluno && handleDelete(selectedAluno)}
        message="Você tem certeza que deseja excluir este aluno?"
      /> */}
    </div>
  );
}
