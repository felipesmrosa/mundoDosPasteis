import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { useNavigate } from "react-router-dom";
import { BotoesDeAcao } from "@/Componentes/FundoPadrao/BotoesDeAcao/Index";
import { collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase.js";
import { Loading } from "@/Componentes/Loading/Index";
import Modal from "@/Componentes/Modal/ConfirmarDelete";

export function TabelaVirtual() {
  const tabelaBD = collection(db, "tabelavirtual");
  const [tabelas, setTabelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTabela, setSelectedTabela] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTabelas = async () => {
      setLoading(true);
      try {
        const q = query(tabelaBD); // Consulta simples sem filtros
        const data = await getDocs(q);
        const alunosData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTabelas(alunosData);
      } catch (error) {
        console.error("Erro ao buscar alunos: ", error);
        toast.error("Erro ao buscar alunos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchTabelas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tabelavirtual", id));
      setTabelas((prevTabelas) => prevTabelas.filter((aluno) => aluno.id !== id));
      toast.success("Aluno excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir aluno: ", error);
      toast.error("Erro ao excluir aluno. Tente novamente.");
    } finally {
      setIsModalOpen(false);
      setSelectedTabela(null);
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/sabores/adicionar")}
        titulo={"Sabores"}
        botao={"Adicionar"}
      />

      <div className="filtro">
        <label htmlFor="pesquisar">Filtro</label>
        <input
          type="text"
          placeholder="Pesquisar tabela virtual"
          id="pesquisar"
        />
      </div>

      <div className="cardPadrao">
        {loading && tabelas.length === 0 ? (
          <Loading />
        ) : (
          tabelas.map((tabela) => (
            <div key={tabela.id} className="cardPadrao__card">
              <b className="cardPadrao__card__informacaoPrincipal">
                {tabela.nomeDaTabela}
              </b>
              <p className="cardPadrao__card__informacaoAdicional">
                {tabela.descricao}
              </p>
              <BotoesDeAcao
                onEdit={() => navigate(`/sabores/editar/${tabela.id}`)}
                onDelete={() => {
                  setSelectedTabela(tabela.id);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedTabela && handleDelete(selectedTabela)}
        message="Você tem certeza que deseja excluir este aluno?"
      />
    </div>
  );
}
