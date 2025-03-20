// import * as XLSX from "xlsx";

// const gerarDadosExportados = (alunos, alunoSelecionado, anoSelecionado) => {
//     let dados = alunos;
//     const role = localStorage.getItem('role') || '';

//     // Filtrar por aluno selecionado
//     if (alunoSelecionado !== "todos") {
//         dados = dados.filter(aluno => aluno.id === alunoSelecionado);
//     } else {
//         // Se for "todos", filtra somente os alunos de acordo com o role
//         dados = dados.filter(aluno => {
//             return aluno.modalidade.some(mod => {
//                 const modalidadeLower = mod.label.toLowerCase(); // Normaliza para minúsculas
//                 console.log("Modalidades do aluno:", aluno.nome, modalidadeLower);

//                 switch (role) {
//                     case "karate":
//                         // Verifica se a modalidade contém qualquer variação de "karatê"
//                         return modalidadeLower.includes("karatê");
//                     case "taekwondo":
//                         return modalidadeLower.includes("taekwondo");
//                     case "pilates":
//                         return modalidadeLower.includes("pilates");
//                     case "ginastica":
//                         return modalidadeLower.includes("ginastica");
//                     case "boxechines":
//                         return modalidadeLower.includes("boxe chinês");
//                     case "jiujitsu":
//                         return modalidadeLower.includes("jiu jítsu");
//                     default:
//                         return true; // Se não houver role definido, retorna todos
//                 }
//             });
//         });
//     }

//     console.log("Alunos após filtro de modalidade:", dados);

//     // Definição dos meses para acessar corretamente os dados
//     const meses = [
//         "janeiro", "fevereiro", "março", "abril", "maio", "junho",
//         "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
//     ];

//     return dados.map(aluno => {
//         const mensalidadesAno = aluno.mensalidades?.[anoSelecionado] || {};

//         console.log(`Mensalidades para ${aluno.nome} no ano ${anoSelecionado}:`, mensalidadesAno);

//         const mensalidadesSeparadas = meses.reduce((acc, mes) => {
//             acc[mes.charAt(0).toUpperCase() + mes.slice(1)] = mensalidadesAno[mes] || "Não especificado";
//             return acc;
//         }, {});

//         return {
//             ID: aluno.id,
//             Aluno: aluno.nome,
//             CPF: aluno.cpf,
//             Ano: anoSelecionado,
//             "Valor Mensalidade": aluno.valorMensalidade || "Não especificado",
//             ...mensalidadesSeparadas,
//         };
//     });
// };

// export const exportarExcel = (alunoSelecionado, anoSelecionado, alunos) => {
//     const role = localStorage.getItem('role') || '';

//     console.log("Parâmetros para exportarExcel:", alunoSelecionado, anoSelecionado, role);

//     const dadosFiltrados = gerarDadosExportados(alunos, alunoSelecionado, anoSelecionado);

//     console.log("Dados para exportação:", dadosFiltrados);

//     if (dadosFiltrados.length === 0) {
//         console.error("Nenhum dado encontrado para exportação.");
//         return;
//     }

//     const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Relatório");

//     let nomeArquivo;

//     if (alunoSelecionado !== "todos") {
//         const aluno = alunos.find(aluno => aluno.id === alunoSelecionado);
//         nomeArquivo = `relatorio_${aluno ? aluno.nome : 'aluno_inexistente'}_${anoSelecionado}.xlsx`;
//     } else {
//         nomeArquivo = `relatorio_todos_${anoSelecionado}.xlsx`;
//     }

//     XLSX.writeFile(wb, nomeArquivo);
// };
