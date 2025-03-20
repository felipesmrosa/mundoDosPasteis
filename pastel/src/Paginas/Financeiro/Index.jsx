import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
// import { bancoDeDados } from "@/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { Loading } from "@/Componentes/Loading/Index";
import ExportarModal from "./ExportarModal/Index";

const getCurrentYear = () => new Date().getFullYear();

const buscarAlunosPorModalidade = async () => {
  const modalidades = {};
  let totalPago = 0;
  let totalPendente = 0;
  const anoAtual = getCurrentYear();
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const mesAtual = meses[new Date().getMonth()];

  try {
    const snapshot = await getDocs(collection(bancoDeDados, "alunos"));
    snapshot.forEach((doc) => {
      const aluno = doc.data();
      let mensalidades = aluno.mensalidades || {};
      const mensalidadeAtual = mensalidades[anoAtual]?.[mesAtual] || "pendente";

      aluno.modalidades.forEach((modalidade) => {
        let nomeModalidade = modalidade.label;

        const nomesPadronizados = {
          "pilates": "Pilates", "karatê": "Karatê", "judô": "Judô",
          "taekwondo": "Taekwondo", "ginastica ritmica": "Ginastica",
          "jiu jítsu": "Jiu Jítsu", "boxe chinês": "Boxe Chinês", "kung fu": "Kung Fu"
        };

        Object.keys(nomesPadronizados).forEach((chave) => {
          if (nomeModalidade.toLowerCase().includes(chave)) {
            nomeModalidade = nomesPadronizados[chave];
          }
        });

        const valorModalidade = Number(modalidade.value);
        if (mensalidadeAtual.toLowerCase() === "pago") {
          totalPago += valorModalidade;
        } else {
          totalPendente += valorModalidade;
        }

        if (!modalidades[nomeModalidade]) {
          modalidades[nomeModalidade] = {
            nome: nomeModalidade,
            precoTotal: 0,
            alunos: new Set(),
            statusAlunos: {},
          };
        }

        modalidades[nomeModalidade].precoTotal += valorModalidade;
        modalidades[nomeModalidade].alunos.add(aluno.nomeCompleto);
        modalidades[nomeModalidade].statusAlunos[aluno.nomeCompleto] = mensalidadeAtual;
      });
    });

    return {
      modalidades: Object.values(modalidades).map((modalidade) => ({
        ...modalidade,
        totalAlunos: modalidade.alunos.size,
        alunosFormatados: Array.from(modalidade.alunos).map((aluno) => ({
          nome: aluno,
          status: modalidade.statusAlunos[aluno] || "pendente"
        })).sort((a, b) => (a.status === "pago" ? -1 : 1)),
      })),
      totalPago,
      totalPendente,
    };
  } catch (error) {
    console.error("Erro ao buscar alunos: ", error);
    return { modalidades: [], totalPago: 0, totalPendente: 0 };
  }
};

export function Financeiro() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [modalidades, setModalidades] = useState([]);
  const [totalPago, setTotalPago] = useState(0);
  const [totalPendente, setTotalPendente] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const userRole = localStorage.getItem("role");

  const abrirModal = () => setModal(true);
  const fecharModal = () => setModal(false);

  // Função que verifica e filtra as modalidades com base na role
  const filtrarModalidadesPorRole = (modalidades) => {
    if (userRole === "admin") {
      return modalidades; // Admin vê todas as modalidades
    }

    if (userRole === "karate") {
      return modalidades.filter((modalidade) => {
        return (
          modalidade.nome.toLowerCase().includes("karatê") ||
          modalidade.nome.toLowerCase().includes("2x karatê") ||
          modalidade.nome.toLowerCase().includes("3x karatê")
        );
      });
    }

    if (userRole === "pilates") {
      return modalidades.filter((modalidade) => {
        return (
          modalidade.nome.toLowerCase().includes("pilates") ||
          modalidade.nome.toLowerCase().includes("2x pilates") ||
          modalidade.nome.toLowerCase().includes("3x pilates")
        );
      });
    }

    if (userRole === "boxechines") {
      return modalidades.filter((modalidade) => {
        return (
          modalidade.nome.toLowerCase().includes("boxe")
        );
      });
    }

    if (userRole === "jiujitsu") {
      return modalidades.filter((modalidade) => {
        const nomeNormalizado = modalidade.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return nomeNormalizado.includes("jiu jitsu");
      });
    }

    // Para outras roles, ajuste o filtro conforme necessário
    return modalidades.filter((modalidade) => modalidade.nome.toLowerCase().includes(userRole.toLowerCase()));
  };

  useEffect(() => {
    const fetchData = async () => {
      const { modalidades, totalPago, totalPendente } = await buscarAlunosPorModalidade();
      const modalidadesFiltradas = filtrarModalidadesPorRole(modalidades);
      setModalidades(modalidadesFiltradas);
      setTotalPago(totalPago);
      setTotalPendente(totalPendente);
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/financeiro/controlar")}
        titulo={"Financeiro"}
        botao={"Controlar"}
        userRole={userRole}
      />

      {loading ? (
        <Loading />
      ) : (
        <div className="modalidades">
          {modalidades.map((modalidade, index) => (
            <div key={index} className="modalidades__modalidade">
              <h4 className="modalidades__modalidade--title" onClick={() => toggleOpen(index)}>
                {modalidade.nome} | {modalidade.totalAlunos} aluno{modalidade.totalAlunos > 1 ? "s" : ""} |
                R$ {modalidade.precoTotal.toFixed(2)}
                <FontAwesomeIcon size="lg" icon={openIndex === index ? faChevronUp : faChevronDown} />
              </h4>
              <div className={`modalidades__modalidade__content ${openIndex === index ? "open" : ""}`}>
                {modalidade.alunosFormatados.map((aluno, idx) => (
                  <p key={idx} className={`status ${aluno.status.toLowerCase()}`}>{aluno.nome}</p>
                ))}
              </div>
            </div>
          ))}
          <br />
        </div>
      )}
      {userRole === "admin" && (
        <div className="precoGeral">
          <h3>TOTAL PENDENTE: R$ {totalPendente.toFixed(2)}</h3>
          <h3>TOTAL PAGO: R$ {totalPago.toFixed(2)}</h3>
        </div>
      )}
      <button className="exportar" onClick={abrirModal}>EXPORTAR RELATÓRIO</button>
      {modal && (
        <ExportarModal fecharModal={fecharModal} />
      )}
    </div>
  );
}

