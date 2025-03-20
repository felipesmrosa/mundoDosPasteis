import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthListener = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está autenticado, você pode fazer algo aqui se necessário
        // localStorage.setItem("emailAutenticado", user.email); // Salve o email no localStorage
      } else {
        // O usuário não está autenticado
        // localStorage.removeItem("emailAutenticado"); // Remova o email do localStorage se necessário
        navigate("/"); // Redirecione para o login
      }
    });

    return () => unsubscribe(); // Limpeza do listener
  }, [auth, navigate]);

  return null; // Não renderiza nada
};

export default AuthListener;
