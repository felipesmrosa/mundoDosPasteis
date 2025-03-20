import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { db } from "@/firebase.js"; // Configuração do Firebase
import { collection, addDoc, updateDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FormInputCard } from "@/Componentes/FundoPadrao/FormInputCard/Index";

// Modal para cadastrar um novo ingrediente
function ModalCadastroIngrediente({ isOpen, closeModal, addIngrediente }) {
  const [nomeIngrediente, setNomeIngrediente] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeIngrediente) {
      toast.error("Por favor, insira o nome do ingrediente.");
      return;
    }

    // Adicionar o ingrediente no banco de dados
    await addIngrediente(nomeIngrediente);
    setNomeIngrediente(""); // Limpar o campo após adicionar
    closeModal(); // Fechar o modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={closeModal}>&times;</span>
        <h2>Cadastrar Novo Ingrediente</h2>
        <form onSubmit={handleSubmit}>
          <FormInputCard
            label="Nome do Ingrediente"
            type="text"
            value={nomeIngrediente}
            onChange={(e) => setNomeIngrediente(e.target.value)}
          />
          <button type="submit" className="btn">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export function AlunoForm({ isEditMode, produtoId }) {
  const navigate = useNavigate();
  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    preco: "",
    descricao: "",
    imagem: "",
    ingredientes: [], // Novo estado para ingredientes
  });

  // Ingredientes carregados do banco de dados
  const [ingredientes, setIngredientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efeito para carregar os ingredientes do banco de dados
  useEffect(() => {
    const fetchIngredientes = async () => {
      const ingredientesRef = collection(db, "ingredientes");
      const ingredientesSnapshot = await getDocs(ingredientesRef);
      const ingredientesList = ingredientesSnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setIngredientes(ingredientesList);
    };

    fetchIngredientes();
  }, []);

  // Efeito para preencher os dados do produto caso seja edição
  useEffect(() => {
    if (isEditMode && produtoId) {
      const fetchProduto = async () => {
        const produtoRef = doc(db, "produtos", produtoId);
        const produtoSnapshot = await produtoRef.get();
        if (produtoSnapshot.exists()) {
          setProduto(produtoSnapshot.data());
        } else {
          toast.error("Produto não encontrado!");
        }
      };
      fetchProduto();
    }
  }, [isEditMode, produtoId]);

  // Função para lidar com o estado dos checkboxes de ingredientes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setProduto((prevProduto) => ({
      ...prevProduto,
      ingredientes: checked
        ? [...prevProduto.ingredientes, value]
        : prevProduto.ingredientes.filter((item) => item !== value),
    }));
  };

  // Função para abrir e fechar o modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Função para adicionar um novo ingrediente no banco de dados
  const addIngrediente = async (nomeIngrediente) => {
    try {
      const docRef = await addDoc(collection(db, "ingredientes"), {
        nome: nomeIngrediente,
      });
      const novoIngrediente = {
        id: docRef.id,
        nome: nomeIngrediente,
      };
      setIngredientes((prevIngredientes) => [...prevIngredientes, novoIngrediente]);
      toast.success("Ingrediente adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar ingrediente!");
      console.error("Erro ao adicionar ingrediente: ", error);
    }
  };

  // Função para cadastrar ou editar o produto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produto.nome || !produto.categoria || !produto.preco || !produto.descricao) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      if (isEditMode) {
        // Editando o produto
        const produtoRef = doc(db, "produtos", produtoId);
        await updateDoc(produtoRef, produto);
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Cadastrando um novo produto
        await addDoc(collection(db, "produtos"), produto);
        toast.success("Produto cadastrado com sucesso!");
      }

      navigate("/produtos"); // Redireciona para a lista de produtos
    } catch (error) {
      toast.error("Erro ao salvar o produto!");
      console.error("Erro ao salvar produto: ", error);
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={2000} />
      <Titulo
        voltarPagina={true}
        link="/produtos"
        titulo={isEditMode ? "Editar Produto" : "Novo Produto"}
        botao={isEditMode ? "Atualizar" : "Cadastrar"}
        click={handleSubmit}
      />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <form onSubmit={handleSubmit}>
              <FormInputCard
                label="Nome do Produto"
                type="text"
                name="nome"
                value={produto.nome}
                onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
              />

              <FormInputCard
                label="Categoria"
                type="text"
                name="categoria"
                value={produto.categoria}
                onChange={(e) => setProduto({ ...produto, categoria: e.target.value })}
              />

              <FormInputCard
                label="Preço"
                type="number"
                name="preco"
                value={produto.preco}
                onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
              />

              <FormInputCard
                label="Descrição"
                type="text"
                name="descricao"
                value={produto.descricao}
                onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
              />

              <FormInputCard
                label="Imagem (URL)"
                type="text"
                name="imagem"
                value={produto.imagem}
                onChange={(e) => setProduto({ ...produto, imagem: e.target.value })}
              />

              <div className="form-group">
                <label>Ingredientes:</label>
                {ingredientes.map((ingrediente) => (
                  <div key={ingrediente.id}>
                    <input
                      type="checkbox"
                      id={ingrediente.id}
                      value={ingrediente.id}
                      checked={produto.ingredientes.includes(ingrediente.id)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={ingrediente.id}>{ingrediente.nome}</label>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-add-ingrediente"
                  onClick={openModal}
                >
                  +
                </button>
              </div>

              <div className="cardPadrao__card__formulario__actions">
                <button type="submit" className="btn">{isEditMode ? "Atualizar" : "Cadastrar"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal para adicionar ingrediente */}
      <ModalCadastroIngrediente
        isOpen={isModalOpen}
        closeModal={closeModal}
        addIngrediente={addIngrediente}
      />
    </div>
  );
}
