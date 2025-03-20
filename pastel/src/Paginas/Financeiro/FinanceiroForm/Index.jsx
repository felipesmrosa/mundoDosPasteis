import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import { bancoDeDados } from "@/firebase";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "@/Componentes/Modal/ConfirmarDelete";
import { Loading } from "@/Componentes/Loading/Index";

export function FinanceiroForm() {
  const [alunosPendentes, setAlunosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.toLocaleString("pt-BR", { month: "long" }).toLowerCase();

  useEffect(() => {
    const fetchAlunosPendentes = async () => {
      try {
        // const alunosCollection = collection(bancoDeDados, "alunos");
        const querySnapshot = await getDocs(alunosCollection);

        const alunos = querySnapshot.docs.map((doc) => {
          const aluno = { id: doc.id, ...doc.data() };
          const mensalidades = aluno.mensalidades || {};

          // Verifica o status de mensalidade para o mês atual
          const statusMesAtual = mensalidades[anoAtual]?.[mesAtual] || "pendente";

          return {
            ...aluno,
            statusMesAtual,
          };
        });

        // Filtra alunos com mensalidade pendente no mês atual
        const alunosPendentes = alunos.filter((aluno) => aluno.statusMesAtual !== "pago");

        // Modalidades Permitidas
        const modalidadesPermitidas = {
          karate: "Karatê",
          taekwondo: "Taekwondo",
          pilates: "Pilates",
          ginastica: "Ginastica Ritmica",
          boxechines: "Boxe Chinês",
          jiujitsu: "Jiu Jítsu",
        };

        const alunosFiltrados = alunosPendentes.filter((aluno) => {
          if (role === "admin") return true; // Se for admin, vê todos os alunos

          if (Array.isArray(aluno.modalidades)) {
            return role
              ? aluno.modalidades.some((mod) =>
                mod.label?.includes(modalidadesPermitidas[role])
              )
              : true;
          }

          return true; // Caso a modalidade não exista ou não seja um array, incluir no filtro
        });

        setAlunosPendentes(alunosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar alunos pendentes: ", error);
        toast.error("Erro ao buscar alunos pendentes. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunosPendentes();
  }, [role]);

  if (loading) {
    return <Loading />;
  }

  const marcarComoPago = async (alunoId, alunoMensalidades) => {
    try {
      const alunoRef = doc(bancoDeDados, "alunos", alunoId);
      const mensalidadesAtualizadas = {
        ...alunoMensalidades,
        [anoAtual]: {
          ...(alunoMensalidades[anoAtual] || {}),
          [mesAtual]: "pago",
        },
      };

      await updateDoc(alunoRef, {
        mensalidades: mensalidadesAtualizadas,
        ultimoPagamento: dataAtual.toISOString(),
      });

      toast.success(`Mensalidade de ${mesAtual} marcada como paga!`);
      setAlunosPendentes((prev) => prev.filter((aluno) => aluno.id !== alunoId));
    } catch (error) {
      toast.error("Erro ao atualizar o status. Tente novamente.");
    }
  };



  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/financeiro")}
        titulo="Pendentes"
        botao="Voltar"
      />
      <div className="cardPadrao">
        {alunosPendentes.length === 0 ? (
          <p>Todos os alunos pagaram a mensalidade deste mês!</p>
        ) : (
          alunosPendentes.map((aluno) => (
            <div key={aluno.id} className="cardPadrao__card" id="mensalidade">
              <span>
                <p className="cardPadrao__card__informacaoPrincipal">
                  <strong>Nome:</strong> {aluno.nomeCompleto}
                </p>
                <p className="cardPadrao__card__informacaoAdicional">
                  <strong>Status Pagamento ({mesAtual}):</strong> {aluno.statusMesAtual}
                </p>
                <p className="cardPadrao__card__informacaoAdicional">
                  <strong>Mensalidade:</strong> R$ {parseFloat(aluno.mensalidade).toFixed(2)}
                </p>
                {Array.isArray(aluno.modalidades) &&
                  aluno.modalidades.map((modalidade, index) => (
                    <p key={index} className="cardPadrao__card__informacaoAdicional">
                      <strong>Modalidade:</strong> {modalidade.label}
                    </p>
                  ))}
              </span>
              <button
                onClick={() => {
                  setSelectedAluno(aluno);
                  setIsModalOpen(true);
                }}
                className="cardPadrao__card__marcarComoPago"
              >
                <FontAwesomeIcon icon={faCheckSquare} size="2xl" />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Confirmar pagamento"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (selectedAluno) {
            marcarComoPago(selectedAluno.id, selectedAluno.mensalidades);
            setIsModalOpen(false);
          }
        }}
        message="Você tem certeza que este aluno pagou?"
      />
    </div>
  );
}
