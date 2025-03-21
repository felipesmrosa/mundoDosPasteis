import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase.js";
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import PedidoModal from "./PedidoModal"; // Importando o modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function Dashboard() {
  const [mesas, setMesas] = useState([]);
  const [mesaSelecionada, setMesaSelecionada] = useState(null); // Controla o modal

  useEffect(() => {
    const q = query(collection(db, "mesas"), orderBy("nome"));

    // Usando onSnapshot para escutar mudanças em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mesasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        pedido: doc.data().pedido || [], // Certificando que 'pedido' é um array, mesmo que vazio
      }));
      setMesas(mesasData);
    });

    // Cleanup do listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const adicionarMesa = async () => {
    const ultimaMesa = mesas.length > 0
      ? Math.max(...mesas.map((mesa) => Number(mesa.nome.replace("Mesa ", "")))) : 0;

    const novaMesaNumero = ultimaMesa + 1;
    const nomeMesa = `Mesa ${novaMesaNumero.toString().padStart(2, "0")}`;

    try {
      const docRef = await addDoc(collection(db, "mesas"), { nome: nomeMesa, pedido: [] }); // Adicionando a mesa sem pedido
      toast.success(`Mesa ${novaMesaNumero} criada com sucesso!`);
    } catch (error) {
      toast.error("Erro ao criar mesa!");
      console.error("Erro ao adicionar mesa: ", error);
    }
  };

  // Função para limpar o pedido da mesa
  const limparPedido = async (mesaId) => {
    try {
      const mesaRef = doc(db, "mesas", mesaId);

      // Limpa o pedido da mesa
      await updateDoc(mesaRef, { pedido: [] });

      // Atualiza o estado local após a operação de limpar o pedido
      setMesas(prevMesas => prevMesas.map(mesa =>
        mesa.id === mesaId ? { ...mesa, pedido: [] } : mesa
      ));

      // Exibe a mensagem de sucesso
      toast.success("Pedido finalizado e limpo!");
    } catch (error) {
      toast.error("Erro ao limpar o pedido da mesa!");
      console.error("Erro ao limpar pedido: ", error);
    }
  };


  // Função chamada ao clicar no card da mesa
  const imprimirPedido = (mesa) => {
    // Verifique se há um pedido na mesa
    if (!mesa.pedido || mesa.pedido.length === 0) {
      toast.error("Não há pedidos para imprimir.");
      return;
    }

    // Formatar o pedido para a impressão
    let pedidoImpressao = `
      Pedido da ${mesa.nome}\n
      ----------------------\n
    `;

    mesa.pedido.forEach((pedido, index) => {
      pedidoImpressao += `
        Produto: ${pedido.tipoProduto}\n
      `;

      // Verificar Tamanho
      if (pedido.tamanho && pedido.tamanho !== "N/A") {
        pedidoImpressao += `Tamanho: ${pedido.tamanho}\n`;
      }

      // Verificar Borda
      if (pedido.tipoProduto === "Pizza" && pedido.bordaRecheada && pedido.bordaRecheada !== "N/A") {
        pedidoImpressao += `Borda: ${pedido.bordaRecheada}\n`;
      }

      // Verificar Sabores
      if (pedido.saboresEscolhidos && pedido.saboresEscolhidos.length > 0) {
        pedidoImpressao += `Sabores: ${pedido.saboresEscolhidos.join(' | ')}\n`;
      }

      // Verificar Bebidas
      if (pedido.bebidasEscolhidas && pedido.bebidasEscolhidas.length > 0) {
        pedidoImpressao += `Bebidas: ${pedido.bebidasEscolhidas.join(' | ')}\n`;
      }

      // Verificar Combo
      if (pedido.frituras && pedido.frituras !== "N/A") {
        pedidoImpressao += `Combo: ${pedido.frituras}\n`;
      }

      // Verificar Molho
      if (pedido.molhoAcompanhamento && pedido.molhoAcompanhamento !== "N/A") {
        pedidoImpressao += `Molho: ${pedido.molhoAcompanhamento}\n`;
      }

      // Verificar Molhos
      if (pedido.molhos && pedido.molhos.length > 0) {
        pedidoImpressao += `Molhos: ${pedido.molhos.join(' | ')}\n`;
      }

      pedidoImpressao += `----------------------\n`;
    });

    // Criar um elemento de janela de impressão
    const janelaImpressao = window.open('', '', 'width=600,height=600');
    janelaImpressao.document.write('<pre>' + pedidoImpressao + '</pre>');
    janelaImpressao.document.close();
    janelaImpressao.print();
  };

  // Função chamada ao clicar no card da mesa
  const handleCardClick = (mesa) => {
    setMesaSelecionada(mesa); // Sempre abre o modal, independentemente de a mesa ser paga ou não
  };


  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={adicionarMesa}
        titulo="Mesas"
        botao="Registrar Mesa"
      />

      <div className="mesas">
        {mesas.map((mesa) => (
          <div key={mesa.id} className="mesas_mesa" onClick={() => handleCardClick(mesa)}>
            <div className="titulo">
              <div className="titulo__tituloEIcone">
                <h3>{mesa.nome}</h3>
              </div>
              <span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no botão abra o modal
                    limparPedido(mesa.id); // Limpa o pedido da mesa
                  }}
                  id="limparPedido"
                  className="titulo__botao"
                >
                  Finalizar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no botão abra o modal
                    imprimirPedido(mesa); // Imprime o pedido da mesa
                  }}
                  id="limparPedido"
                  className="titulo__botao"
                >
                  Imprimir
                </button>
              </span>
            </div>

            <div className="mesas_mesa_pedido">
              {mesa.pedido && Array.isArray(mesa.pedido) && mesa.pedido.length > 0 ? (
                mesa.pedido.map((pedido, index) => (
                  <div className="mesas_mesa_pedido_infos" key={index}>
                    <div id="tipoProduto" className="titulo">
                      <div className="titulo__tituloEIcone">
                        <p><b>Produto:</b> {pedido.tipoProduto}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o clique no botão abra o modal
                          limparPedido(mesa.id); // Limpa o pedido da mesa
                        }}
                        id="excluirPedido"
                        className="titulo__botao"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>


                    {/* Exibe Tamanho apenas se existir */}
                    {pedido.tamanho && <p><b>Tamanho:</b> {pedido.tamanho}</p>}

                    {/* Se tipoProduto for Pizza, aparece a Borda: {pedido.bordaRecheada}, se não, não aparece*/}
                    {pedido.tipoProduto === "Pizza" && pedido.bordaRecheada && <p><b>Borda:</b> {pedido.bordaRecheada}</p>}

                    {/* Exibe Sabores apenas se existirem */}
                    {pedido.saboresEscolhidos && pedido.saboresEscolhidos.length > 0 && (
                      <p><b>Sabores:</b> {pedido.saboresEscolhidos.join(" | ")}</p>
                    )}

                    {pedido.bebidasEscolhidas && pedido.bebidasEscolhidas.length > 0 && (
                      <p><b>Bebidas:</b> {pedido.bebidasEscolhidas.join(" | ")}</p>
                    )}

                    {pedido.frituras && <p><b>Combo:</b> {pedido.frituras}</p>}
                    {pedido.molhoAcompanhamento && <p><b>Molho (Acompanhamento):</b> {pedido.molhoAcompanhamento}</p>}
                    {pedido.molhos && pedido.molhos.length > 0 && (
                      <p><b>Molhos:</b> {pedido.molhos.join(" | ")}</p>
                    )}
                  </div>
                ))
              ) : (
                <p>Não há pedidos nesta mesa.</p>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal de Pedido */}
      {mesaSelecionada && (
        <PedidoModal mesa={mesaSelecionada} onClose={() => setMesaSelecionada(null)} />
      )}
    </div>
  );
}
