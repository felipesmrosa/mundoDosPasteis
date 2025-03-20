import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { useNavigate, useParams } from "react-router-dom";
import { FormInputCard } from "@/Componentes/FundoPadrao/FormInputCard/Index";
import { db } from "@/firebase.js";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { BotoesDeAcao } from "@/Componentes/FundoPadrao/BotoesDeAcao/Index";
import { ModalTabelaVirtual } from "@/Componentes/Modal/ModalTabelaVirtual";

export function TabelaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [items, setItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({ nome: "", descricao: "", valor: "" });
  const [form, setForm] = useState({ nomeDaTabela: "", descricao: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchTabela = async () => {
      if (isEditMode) {
        try {
          const tabelaDoc = doc(db, "tabelavirtual", id);
          const tabelaData = await getDoc(tabelaDoc);
          if (tabelaData.exists()) {
            const tabela = tabelaData.data();
            setForm({
              nomeDaTabela: tabela.nomeDaTabela,
              descricao: tabela.descricao,
            });
            setItems(tabela.itens || []); // Alteração aqui para usar 'itens'
          }
        } catch (error) {
          toast.error("Erro ao buscar dados da tabela!");
        }
      }
    };

    fetchTabela();
  }, [isEditMode, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.nomeDaTabela || !form.descricao) {
      toast.error("Preencha todos os campos obrigatórios!");
      return false;
    }
    return true;
  };

  const validateNewItem = () => {
    if (!newItem.nome || !newItem.descricao) {
      toast.error("Preencha todos os campos obrigatórios!");
      return false;
    }
    return true;
  };

  const openModal = () => {
    setModalIsOpen(true);
    setNewItem({ nome: "", descricao: "", valor: "" });
    setEditIndex(null);
  };

  const closeModal = () => setModalIsOpen(false);

  const addItem = () => {
    if (!validateNewItem()) return;

    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }
    setNewItem({ nome: "", descricao: "", valor: "" });
    closeModal();
  };

  const editItem = (index) => {
    setEditIndex(index);
    setNewItem(items[index]);
    setModalIsOpen(true);
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const adicionarTabela = async () => {
    if (!validateForm()) return;

    try {
      await addDoc(collection(db, "tabelavirtual"), {
        ...form,
        itens: items, // Adicionando os itens dentro da tabela
      });
      toast.success("Tabela adicionada com sucesso!");
      navigate("/sabores");
    } catch (error) {
      toast.error("Erro ao adicionar tabela!");
    }
  };

  const editarTabela = async () => {
    if (!validateForm()) return;

    try {
      const tabelaDoc = doc(db, "tabelavirtual", id);
      await updateDoc(tabelaDoc, {
        ...form,
        itens: items,
      });
      toast.success("Tabela atualizada com sucesso!");
      navigate("/sabores");
    } catch (error) {
      toast.error("Erro ao atualizar tabela!");
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={true}
        link={"/sabores"}
        titulo={isEditMode ? "Editar Tabela" : "Nova Tabela"}
        botao={isEditMode ? "Atualizar" : "Cadastrar"}
        click={isEditMode ? editarTabela : adicionarTabela}
      />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <FormInputCard
              label="Nome da Tabela"
              type="text"
              name="nomeDaTabela"
              value={form.nomeDaTabela}
              onChange={handleInputChange}
            />
            <FormInputCard
              label="Descrição"
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleInputChange}
            />
            <div
              id="separacao"
              className="cardPadrao__card__formulario--titulo"
            >
              <p>
                Itens
                <button
                  type="button"
                  className="cardPadrao__card__formulario--titulo--adicionar"
                  onClick={openModal}
                >
                  Adicionar Item
                </button>
              </p>
            </div>
            {items.map((item, index) => (
              <div
                key={index}
                className="cardPadrao__card"
              >
                <p className="cardPadrao__card__informacaoPrincipal">
                  <strong>Nome:</strong> {item.nome}
                </p>
                <p className="cardPadrao__card__informacaoPrincipal">
                  <strong>Descrição:</strong> {item.descricao}
                </p>
                <p className="cardPadrao__card__informacaoPrincipal">
                  <strong>Valor:</strong> {item.valor}
                </p>
                <BotoesDeAcao
                  onEdit={() => editItem(index)}
                  onDelete={() => deleteItem(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalTabelaVirtual
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Adicionar Item"
        editIndex={editIndex}
        newItem={newItem}
        setNewItem={setNewItem}
        addItem={addItem}
        closeModal={closeModal}
      />
    </div>
  );
}
