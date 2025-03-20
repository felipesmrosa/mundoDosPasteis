import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false); // Para gerenciar o estado de carregamento
  const [error, setError] = useState(""); // Para gerenciar erros de login
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async () => {
    const { email, senha } = formData;

    // Verificando se os campos não estão vazios
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true); // Começa o carregamento

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      // Sempre salvar o email e a senha no localStorage
      localStorage.setItem("emailAutenticado", email);
      localStorage.setItem("senhaAutenticada", senha);

      // Redireciona para o dashboard
      navigate("/mesas");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      // Tratando o erro de autenticação
      if (error.code === "auth/user-not-found") {
        setError("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        setError("Senha incorreta.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__formulario">
          <div className="login__formulario__input">
            <label id="required"> Email </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="login__formulario__input">
            <label id="required"> Senha </label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  senha: e.target.value,
                }))
              }
            />
          </div>
          {error && <div className="login__error">{error}</div>} {/* Exibe o erro, se houver */}
          <br />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Carregando..." : "LOGAR"}
          </button>
        </div>
      </div>
    </div>
  );
}
