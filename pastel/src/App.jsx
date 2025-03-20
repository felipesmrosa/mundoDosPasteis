import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Componentes/Layout/Index";
import { Dashboard } from "./Paginas/Dashboard/Index";
import { Login } from "./Paginas/Home/Index";
import { PaginaDeErro } from "./Componentes/PaginaDeErro/Index";
import { Alunos } from "./Paginas/Alunos/Index";
import { ToastContainer } from "react-toastify";
import { AlunoForm } from "./Paginas/Alunos/AlunoForm/Index";
import AuthListener from "./utils/Autenticador";
import { TabelaVirtual } from "./Paginas/TabelaVirtual/Index";
import { TabelaForm } from "./Paginas/TabelaVirtual/TabelaForm/Index";
import { Financeiro } from "./Paginas/Financeiro/Index";
import { FinanceiroForm } from "./Paginas/Financeiro/FinanceiroForm/Index";
import { MesasForm } from "./Paginas/Dashboard/MesasForm/Index";

export function App() {
  return (
    <>
      <AuthListener />
      <ToastContainer autoClose={500} />
      <Routes>
        <Route path="*" element={<PaginaDeErro />} />
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/mesas" element={<Dashboard />} />
          <Route path="/mesas/cadastrar" element={<MesasForm />} />
          <Route path="/sabores" element={<TabelaVirtual />} />
          <Route path="/sabores/adicionar" element={<TabelaForm />} />
          <Route path="/sabores/editar/:id" element={<TabelaForm />} />
        </Route>
      </Routes>
    </>
  );
}
