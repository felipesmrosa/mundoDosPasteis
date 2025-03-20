import React, { useEffect, useState } from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { ToastContainer } from "react-toastify";
import { FormInputCard } from "@/Componentes/FundoPadrao/FormInputCard/Index";
import { db } from "@/firebase.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export function MesasForm() {
  const [mesas, setMesas] = useState([]);
  const [novaMesa, setNovaMesa] = useState("");

  // Buscar as mesas do Firebase
  useEffect(() => {
    const fetchMesas = async () => {
      const querySnapshot = await getDocs(collection(db, "mesas"));
      setMesas(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchMesas();
  }, []);

  // Adicionar nova mesa
  const adicionarMesa = async () => {
    if (novaMesa.trim() === "") return;
    const docRef = await addDoc(collection(db, "mesas"), { nome: novaMesa });
    setMesas([...mesas, { id: docRef.id, nome: novaMesa }]);
    setNovaMesa("");
  };

  // Atualizar nome da mesa
  const atualizarMesa = async (id, novoNome) => {
    const mesaRef = doc(db, "mesas", id);
    await updateDoc(mesaRef, { nome: novoNome });
    setMesas(mesas.map((m) => (m.id === id ? { ...m, nome: novoNome } : m)));
  };

  // Excluir mesa
  const excluirMesa = async (id) => {
    await deleteDoc(doc(db, "mesas", id));
    setMesas(mesas.filter((m) => m.id !== id));
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={2000} />
      <Titulo
        // voltarPagina={true}
        // link={"/alunos"}
        // titulo={isEditMode ? "Editar aluno" : "Novo aluno"}
        titulo="Registrar Mesa"
      // botao={isEditMode ? "Atualizar" : "Cadastrar"}
      // click={isEditMode ? editarAluno : cadastrarAluno}
      // click={registrarMesa}
      />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <FormInputCard
              label="Nome completo"
              type="text"
              name="nomeCompleto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}