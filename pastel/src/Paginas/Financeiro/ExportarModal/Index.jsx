import React, { useState, useEffect } from "react";
// import { bancoDeDados } from "@/firebase"; // Importando o banco de dados
import { collection, getDocs } from "firebase/firestore";
// import { exportarCSV } from "@/utils/exportarFuncoes/exportarCSV"; // Funções para exportação
// import { exportarExcel } from "@/utils/exportarFuncoes/exportarExcel"; // Funções para exportação
// import { exportarPDF } from "@/utils/exportarFuncoes/exportarPDF"; // Funções para exportação

const ExportarModal = ({ fecharModal }) => {
    const [alunos, setAlunos] = useState([]);
    const [anos, setAnos] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState("todos");
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear()); // Ano atual como padrão

    // Buscar dados dos alunos no Firestore
    useEffect(() => {
        const fetchAlunos = async () => {
            try {
                // const alunosRef = collection(bancoDeDados, "alunos");
                const alunoSnapshot = await getDocs(alunosRef);

                if (alunoSnapshot.empty) {
                    return;
                }

                const alunosList = alunoSnapshot.docs.map((doc) => {
                    const aluno = doc.data();
                    const alunoId = doc.id;

                    // Verifique se mensalidades é um objeto ou array válido
                    const mensalidades = aluno.mensalidades || {}; // Assume que mensalidades é um objeto por ano

                    // Extraindo os anos das mensalidades
                    const anosUnicos = Object.keys(mensalidades); // Usamos Object.keys para pegar os anos como chave
                    const anosFiltrados = anosUnicos; // Os anos já são únicos, então podemos usá-los diretamente

                    return {
                        id: alunoId,
                        nome: aluno.nomeCompleto,
                        cpf: aluno.cpf,
                        telefone: aluno.whatsapp,
                        valorMensalidade: parseFloat(aluno.mensalidade) || 0, // Convertendo mensalidade para número
                        mensalidades: mensalidades,
                        anos: anosFiltrados,
                        modalidade: aluno.modalidades,
                    };
                });
                setAlunos(alunosList);

                // Unificando anos de todos os alunos
                const anosSet = new Set();
                alunosList.forEach(aluno => {
                    aluno.anos.forEach(ano => anosSet.add(ano));
                });
                setAnos([...anosSet]); // Definindo os anos únicos
            } catch (error) {
                console.error("Erro ao buscar alunos: ", error);
            }
        };

        fetchAlunos();
    }, []);

    const handleExportar = (tipoExportacao) => {
        let alunosFiltrados = alunos;

        if (alunoSelecionado !== "todos") {
            alunosFiltrados = alunos.filter((aluno) => aluno.id === alunoSelecionado);
        }

        // Se "todos" os anos forem escolhidos, incluir todas as mensalidades
        if (anoSelecionado !== "todos") {
            alunosFiltrados = alunosFiltrados.map((aluno) => ({
                ...aluno,
                mensalidades: {
                    [anoSelecionado]: aluno.mensalidades[anoSelecionado] || {},
                },
            }));
        }

        // Chama a função correspondente
        if (tipoExportacao === "csv") {
            exportarCSV(alunoSelecionado, anoSelecionado, alunosFiltrados, role);
        } else if (tipoExportacao === "excel") {
            exportarExcel(alunoSelecionado, anoSelecionado, alunosFiltrados, role);
        } else if (tipoExportacao === "pdf") {
            exportarPDF(alunoSelecionado, anoSelecionado, alunosFiltrados, role);
        }

        fecharModal();
    };

    const role = localStorage.getItem('role') || '';

    // Filtra os alunos com base na modalidade e na role
    const alunosFiltrados = alunos.filter((aluno) => {
        return aluno.modalidade.some((mod) => {
            if (role === "karate") {
                return mod.label === "2x Karatê" || mod.label === "3x Karatê";
            } else if (role === "taekwondo") {
                return mod.label.includes("Taekwondo");
            } else if (role === "pilates") {
                return mod.label.includes("Pilates");
            } else if (role === "ginastica") {
                return mod.label.includes("Ginastica");
            } else if (role === "boxechines") {
                return mod.label.includes("Boxe Chinês");
            } else if (role === "jiujitsu") {
                return mod.label.includes("Jiu Jítsu");
            } else {
                return true; // Caso a role não esteja definida ou seja diferente das listadas, exibe todos os alunos
            }
        });
    });

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Dados para Exportação</h2>
                <div className="select--modal">
                    <label htmlFor="aluno">Aluno:</label>
                    <select
                        id="aluno"
                        value={alunoSelecionado}
                        onChange={(e) => setAlunoSelecionado(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {alunosFiltrados.map((aluno) => (
                            <option key={aluno.id} value={aluno.id}>
                                {aluno.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="select--modal">
                    <label htmlFor="ano">Ano:</label>
                    <select
                        id="ano"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(e.target.value)}
                    >
                        {anos.map((ano) => (
                            <option key={ano} value={ano}>
                                {ano}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-buttons">
                    <button className="excel-button" onClick={() => handleExportar("excel")}>Exportar Excel</button>
                    <button className="pdf-button" onClick={() => handleExportar("pdf")}>Exportar PDF</button>
                    <button className="close-button" onClick={fecharModal}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default ExportarModal;
