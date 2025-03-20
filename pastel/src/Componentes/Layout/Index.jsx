import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "@/Complementos/Imagens/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBurger, faHouse, faMoneyBill, faPizzaSlice, faRightFromBracket, faTag, faUsers, faUtensils } from "@fortawesome/free-solid-svg-icons";

export function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Função para alternar a visibilidade do menu de notificações
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (menuAberto) {
      setMenuAberto(false); // Fecha o menu se ele estiver aberto
    }
  };

  // Função para fechar o menu quando um item for clicado
  const handleLinkClick = () => {
    setMenuAberto(!menuAberto);
    if (isOpen) {
      setIsOpen(false); // Fecha as notificações se já estiverem abertas
    }
  };

  const handleLogOut = () => {
    // Limpar os dados do localStorage (email, role, ou outros dados de autenticação)
    localStorage.clear();

    // Redirecionar para a página de login
    window.location.href = "/"; // Ou use o react-router para redirecionar, se necessário
  };

  return (
    <div className={`layout ${menuAberto ? "menu-aberto" : ""}`}>
      <header className="cabecalho">
        <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <img src={logo} alt="" />
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuAberto ? "open" : ""}`}>
        <nav>
          <ul>
            {/* Menu agora visível para todos os usuários */}
            <li>
              <Link to="/mesas" onClick={handleLinkClick}>
                <FontAwesomeIcon icon={faUtensils} />
                Mesas
              </Link>
            </li>
            <li>
              <Link to="/sabores" onClick={handleLinkClick}>
                <FontAwesomeIcon icon={faPizzaSlice} />
                Sabores
              </Link>
            </li>
            {/* <li>
              <Link to="/financeiro" onClick={handleLinkClick}>
                <FontAwesomeIcon icon={faMoneyBill} />
                Financeiro
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* Link Sair separado */}
        <div className="sidebar__logout">
          <Link onClick={handleLogOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="conteudo">
        <Outlet /> {/* Isso vai renderizar os componentes filhos aqui */}
      </main>
    </div>
  );
}
