import React, { useState, useEffect } from "react";
import { db } from "@/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const PedidoModal = ({ mesa, onClose }) => {
  const [saboresPizza, setSaboresPizza] = useState([]);
  const [saboresPastel, setSaboresPastel] = useState([]);
  const [tamanhoPastel, setTamanhoPastel] = useState([]);
  const [tamanhoPizza, setTamanhoPizza] = useState([]);
  const [molhos, setMolhos] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [bordasRecheadas, setBordasRecheadas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [combos, setCombos] = useState([]);
  const [comboSelecionado, setComboSelecionado] = useState(null);

  const [quantidadeBebidas, setQuantidadeBebidas] = useState({});

  const [pedido, setPedido] = useState({
    tipoProduto: "", // Vazio para "Escolher"
    tamanho: "", // Vazio para "Escolher"
    saboresEscolhidos: [],
    bebidasEscolhidas: [],
    frituras: "",
    molhos: [],
    molhoAcompanhamento: "",
    bordaRecheada: "", // Adicionando borda ao pedido
  });

  // Supondo que você tenha um efeito que busca os dados assíncronos, como uma requisição de API
  useEffect(() => {
    // Exemplo de simulação de carregamento
    const fetchData = async () => {
      // Simula o tempo de carregamento dos dados
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Aqui você definiria seus dados
      setLoading(false); // Após o carregamento, define o loading como false
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchSabores = async () => {
      const pizzaSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const saboresPizzaData = pizzaSnapshot.docs
        .filter(doc => doc.id === "ygZsEzVb6ZfSmsa5W2a7")
        .map(doc => doc.data().itens)
        .flat();

      const pastelSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const saboresPastelData = pastelSnapshot.docs
        .filter(doc => doc.id === "gVX7NsTOuCooFyf4aOza")
        .map(doc => doc.data().itens)
        .flat();

      const bordasSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const bordasData = bordasSnapshot.docs
        .filter(doc => doc.id === "dADScTdH9YGkvbG1EYFC")
        .map(doc => doc.data().itens)
        .flat();

      const tamanhoPastelSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const tamanhoPastelData = tamanhoPastelSnapshot.docs
        .filter(doc => doc.id === "aveoQ3ZqSJ5QAC0kMweY")
        .map(doc => doc.data().itens)
        .flat();

      const tamanhoPizzaSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const tamanhoPizzaData = tamanhoPizzaSnapshot.docs
        .filter(doc => doc.id === "KanetyQpLqE84zfszwR4")
        .map(doc => doc.data().itens)
        .flat();

      const bebidasSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const bebidasData = bebidasSnapshot.docs
        .filter(doc => doc.id === "pes5y0OljhFeHKq4ta1M")
        .map(doc => doc.data().itens)
        .flat();

      const molhosSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const molhosData = molhosSnapshot.docs
        .filter(doc => doc.id === "t0YpqVAtzm33d5BlmPdq")
        .map(doc => doc.data().itens)
        .flat();

      const idsCombo = ["2GN3YvV6eRchxe58g4Wv", "71XdhkYcxT5LpRgJmyrt", "AeqIXiq488KDo1NIKFxu", "bD5snzbwJTFNww1jXl6H", "u9uNb7E8Sxkz8t86GMNy"];
      const combosSnapshot = await getDocs(collection(db, "tabelavirtual"));
      const combosData = combosSnapshot.docs
        .filter(doc => idsCombo.includes(doc.id)) // Filtra apenas os IDs desejados
        .map(doc => ({ id: doc.id, ...doc.data() })); // Retorna os objetos completos

      setCombos(combosData);

      setBebidas(bebidasData);
      setMolhos(molhosData);
      setTamanhoPastel(tamanhoPastelData);
      setTamanhoPizza(tamanhoPizzaData);
      setSaboresPizza(saboresPizzaData);
      setSaboresPastel(saboresPastelData);
      setBordasRecheadas(bordasData);

      // Define a primeira borda como padrão se houver bordas disponíveis
      if (bordasData.length > 0) {
        setPedido((prev) => ({ ...prev, bordaRecheada: bordasData[0].nome }));
      }
    };

    fetchSabores();
  }, []);

  const handleProdutoChange = (e) => {
    setPedido({ ...pedido, tipoProduto: e.target.value, tamanho: "", saboresEscolhidos: [] });
  };

  const handleTamanhoChange = (e) => {
    setPedido({ ...pedido, tamanho: e.target.value, saboresEscolhidos: [] }); // Reset sabores ao trocar tamanho
  };

  const handleSaborChange = (e) => {
    const { value, checked } = e.target;

    // Verificar se o limite de sabores foi atingido
    const limite = limiteSabores();
    const saboresSelecionados = [...pedido.saboresEscolhidos];

    if (checked) {
      if (saboresSelecionados.length < limite) {
        saboresSelecionados.push(value);
      } else {
        toast.error(`Limite de sabores atingido!`);
      }
    } else {
      const index = saboresSelecionados.indexOf(value);
      if (index > -1) {
        saboresSelecionados.splice(index, 1);
      }
    }

    setPedido({ ...pedido, saboresEscolhidos: saboresSelecionados });
  };

  const handleComboChange = (e) => {
    const comboEscolhido = combos.find(combo => combo.nomeDaTabela === e.target.value);
    setPedido({ ...pedido, frituras: e.target.value });
    setComboSelecionado(comboEscolhido); // Atualiza o combo selecionado
  };

  const handleItemChange = (e) => {
    const itemSelecionado = comboSelecionado.itens.find(item => item.nome === e.target.value);
    const pedidoFormatado = `${comboSelecionado.nomeDaTabela} | ${itemSelecionado.nome}`;

    setPedido({ ...pedido, frituras: pedidoFormatado });
  };

  const handleMolhos = (e) => {
    const { value, checked } = e.target;

    // Se o molho for marcado, adiciona ele ao array de molhos selecionados
    if (checked) {
      setPedido((prevPedido) => ({
        ...prevPedido,
        molhos: [...prevPedido.molhos, value], // Adiciona molho selecionado
      }));
    } else {
      // Se o molho for desmarcado, remove ele do array de molhos selecionados
      setPedido((prevPedido) => ({
        ...prevPedido,
        molhos: prevPedido.molhos.filter((molho) => molho !== value), // Remove molho desmarcado
      }));
    }
  };


  // Função para aumentar a quantidade da bebida
  const aumentarQuantidade = (bebida) => {
    setQuantidadeBebidas((prev) => {
      const novaQuantidade = (prev[bebida] || 0) + 1;
      const novoEstado = { ...prev, [bebida]: novaQuantidade };

      // Atualiza bebidasEscolhidas no formato "quantidade bebida"
      const bebidasAtualizadas = Object.entries(novoEstado)
        .filter(([_, quantidade]) => quantidade > 0)
        .map(([nome, quantidade]) => `${quantidade} ${nome}`);

      setPedido((prevPedido) => ({
        ...prevPedido,
        bebidasEscolhidas: bebidasAtualizadas,
      }));

      return novoEstado;
    });
  };

  // Função para diminuir a quantidade da bebida
  const diminuirQuantidade = (bebida) => {
    setQuantidadeBebidas((prev) => {
      const novaQuantidade = Math.max((prev[bebida] || 0) - 1, 0);
      const novoEstado = { ...prev, [bebida]: novaQuantidade };

      // Atualiza bebidasEscolhidas no formato "quantidade bebida"
      const bebidasAtualizadas = Object.entries(novoEstado)
        .filter(([_, quantidade]) => quantidade > 0)
        .map(([nome, quantidade]) => `${quantidade} ${nome}`);

      setPedido((prevPedido) => ({
        ...prevPedido,
        bebidasEscolhidas: bebidasAtualizadas,
      }));

      return novoEstado;
    });
  };



  const limiteSabores = () => {
    if (pedido.tipoProduto === "Pizza") {
      switch (pedido.tamanho) {
        case "Broto":
        case "Pequena":
          return 1;
        case "Média":
        case "Grande":
          return 2;
        case "Gigante":
          return 3;
        case "Mundo":
        case "Super":
        case "Big":
          return 4;
        default:
          return 0;
      }
    } else if (pedido.tipoProduto === "Pastel") {
      switch (pedido.tamanho) {
        case "P":
        case "M":
          return 1;
        case "G":
          return 2;
        case "GG":
          return 3;
        default:
          return 0;
      }
    }
    return 0;
  };

  const resetModal = () => {
    setPedido({
      tipoProduto: "", // Vazio para "Escolher"
      tamanho: "", // Vazio para "Escolher"
      saboresEscolhidos: [],
      bebidasEscolhidas: [],
      frituras: "",
      molhos: [],
      molhoAcompanhamento: "",
      bordaRecheada: "", // Adicionando borda ao pedido
    });
  };

  const salvarPedido = async () => {
    try {
      // Obter o documento da mesa
      const mesaRef = doc(db, "mesas", mesa.id); // Mesa com ID da mesa
      const mesaDoc = await getDoc(mesaRef);

      if (mesaDoc.exists()) {
        const mesaData = mesaDoc.data();
        let pedidos = mesaData.pedido || []; // Verifica se pedido existe, senão cria um array vazio

        // Adicionar a bordaRecheada apenas se ela não for vazia
        const pedidoComBorda = {
          ...pedido,
          bordaRecheada: pedido.bordaRecheada || null, // Se borda for vazia, define como null
        };

        // Adiciona o novo pedido ao array de pedidos
        pedidos.push(pedidoComBorda);

        // Atualiza o campo de pedido na coleção de mesas
        await updateDoc(mesaRef, {
          pedido: pedidos
        });

        toast.success('Pedido salvo com sucesso!');

        // Resetar o modal após salvar
        resetModal();
      } else {
        toast.error('Mesa não encontrada!');
      }
    } catch (error) {
      console.error("Erro ao salvar o pedido:", error);
      toast.error('Erro ao salvar o pedido');
    }
  };
  return (
    <div className="modal">
      <div className="modal__content">

        <ToastContainer autoClose={1000} />
        <div className="titulo">
          <div className="titulo__tituloEIcone">
            <h2>{mesa.nome}</h2>
          </div>
          <button id="FecharModal" onClick={onClose} className="titulo__botao">
            <FontAwesomeIcon icon={faX} />
          </button>

        </div>


        {loading ? (
          <div className="loading">Carregando...</div> // Aqui você pode colocar um spinner ou mensagem de carregamento
        ) : (
          <>
            <div className="modal__content__selectForm">
              <label>Tipo de Produto:</label>
              <select onChange={handleProdutoChange} value={pedido.tipoProduto}>
                <option value="">Escolher</option>
                <option value="Pizza">Pizza</option>
                <option value="Pastel">Pastel</option>
                <option value="Fritura">Fritura</option>
                <option value="Bebida">Bebida</option>
                <option value="Molho">Molho</option>
              </select>
            </div>
            {pedido.tipoProduto && !["Bebida", "Molho", "Fritura"].includes(pedido.tipoProduto) && (
              <div className="modal__content__selectForm">
                <label>Tamanho:</label>
                <select value={pedido.tamanho} onChange={handleTamanhoChange}>
                  <option value="">Escolher</option>
                  {pedido.tipoProduto === "Pizza" ? (
                    <>
                      {tamanhoPizza.map((tamanho, index) => (
                        <option key={index} value={tamanho.descricao}>
                          {tamanho.nome}
                        </option>
                      ))}
                    </>
                  ) : (
                    <>
                      {tamanhoPastel.map((tamanho, index) => (
                        <option key={index} value={tamanho.descricao}>
                          {tamanho.nome}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            )}

            {pedido.tipoProduto === "Pizza" && (
              <div className="modal__content__selectForm">
                <label>Borda Recheada:</label>
                <select onChange={(e) => setPedido({ ...pedido, bordaRecheada: e.target.value })}>
                  {bordasRecheadas.map((borda, index) => (
                    <option key={index} value={borda.nome}>
                      {borda.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {pedido.tipoProduto === "Fritura" && (
              <>
                <div className="modal__content__selectForm">
                  <label>Combo:</label>
                  <select onChange={handleComboChange}>
                    {combos.map((combo, index) => (
                      <option key={index} value={combo.nomeDaTabela}>
                        {combo.nomeDaTabela}
                      </option>
                    ))}
                  </select>
                  {comboSelecionado && (
                    <div className="modal__content__selectForm">
                      <label>Variação: </label>
                      <select onChange={handleItemChange}>
                        {comboSelecionado.itens.map((item, index) => (
                          <option key={index} value={item.nome}>
                            {item.nome} - R${item.valor}
                          </option>
                        ))}
                      </select>
                      <label>Molho (Acompanhamento):</label>
                      <select onChange={(e) => setPedido({ ...pedido, molhoAcompanhamento: e.target.value })}>
                        {molhos.map((molho, index) => (
                          <option key={index} value={molho.nome}>
                            {molho.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {pedido.molhoAcompanhamento && (
                  <div className="modal__content__sabores">
                    <label className="modal__content__sabores__titulo">Molhos:</label>
                    <div className="modal__content__sabores__lista">
                      {molhos.map((molho, index) => (
                        <div className="modal__content__sabores__sabor" key={index}>
                          <input
                            className="modal__content__sabores__sabor--input"
                            type="checkbox"
                            value={molho.nome}
                            checked={pedido.molhos.includes(molho.nome)}
                            onChange={handleMolhos}
                          />
                          <label>{molho.nome} + R${molho.valor}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {pedido.tipoProduto === "Bebida" && (
              <div className="modal__content__selectForm">
                <div className="modal__content__sabores">
                  <label className="modal__content__sabores__titulo">Bebidas:</label>
                  <div className="modal__content__sabores__lista">
                    {pedido.tipoProduto === "Bebida" &&
                      bebidas.map((bebida, index) => (
                        <div className="modal__content__sabores__sabor" key={index}>
                          <label>{bebida.nome}</label>
                          <div className="contador">
                            <button onClick={() => diminuirQuantidade(bebida.nome)}>-</button>
                            <span>{quantidadeBebidas[bebida.nome] || 0}</span>
                            <button onClick={() => aumentarQuantidade(bebida.nome)}>+</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {pedido.tipoProduto && pedido.tamanho && (
              <div className="modal__content__sabores">
                <label className="modal__content__sabores__titulo">Sabores:</label>
                <div className="modal__content__sabores__lista">
                  {pedido.tipoProduto === "Pizza" &&
                    saboresPizza.map((sabor, index) => (
                      <div className="modal__content__sabores__sabor" key={index}>
                        <input
                          className="modal__content__sabores__sabor--input"
                          type="checkbox"
                          value={sabor.nome}
                          checked={pedido.saboresEscolhidos.includes(sabor.nome)}
                          onChange={handleSaborChange}
                        />
                        <label>{sabor.nome}</label>
                      </div>
                    ))}
                  {pedido.tipoProduto === "Pastel" &&
                    saboresPastel.map((sabor, index) => (
                      <div className="modal__content__sabores__sabor" key={index}>
                        <input
                          type="checkbox"
                          className="modal__content__sabores__sabor--input"
                          value={sabor.nome}
                          checked={pedido.saboresEscolhidos.includes(sabor.nome)}
                          onChange={handleSaborChange}
                        />
                        <label>{sabor.nome}</label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}


        <button onClick={salvarPedido} className="modal__content--button">Salvar pedido</button>
      </div>
    </div>
  );
};


export default PedidoModal;
