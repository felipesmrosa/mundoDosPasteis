import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles = [] }) => {
  const email = localStorage.getItem("emailAutenticado");

  // Mapeamento de e-mails para roles
  const emailRoleMapping = {
    "guilherme@barossi.com": "admin",
    "karate@barossi.com": "karate",
    "pilates@barossi.com": "pilates",
    "taekwondo@barossi.com": "taekwondo",
    "ginastica@barossi.com": "ginastica",
    "jiujitsu@barossi.com": "jiujitsu",
    "boxechines@barossi.com": "boxechines",
  };

  const tipoUsuario = emailRoleMapping[email]; // Mapeando o tipo de usuário com base no e-mail

  useEffect(() => {
    if (tipoUsuario) {
      localStorage.setItem("role", tipoUsuario); // Atualiza o localStorage apenas uma vez
    }
  }, [tipoUsuario]);

  // Verifique se o usuário está autenticado e se o tipo de usuário é permitido
  if (email && tipoUsuario && allowedRoles.includes(tipoUsuario)) {
    return element; // Renderiza o componente caso tenha permissão
  }

  // Se o usuário não estiver autenticado ou não tiver permissão, redireciona
  return <Navigate to="/mesas" />;
};

export default PrivateRoute;
