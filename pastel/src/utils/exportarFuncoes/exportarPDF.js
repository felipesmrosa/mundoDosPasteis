// import { jsPDF } from "jspdf";
// import footerrosatech from "@/Complementos/Imagens/footerrosatech.png";
// import headerrosatech from "@/Complementos/Imagens/headerrosatech.png";

// export const exportarPDF = (alunoSelecionado, anoSelecionado, alunos, role) => {
//     let dados = alunos;

//     // Se não for admin, filtra os alunos pela modalidade
//     if (role !== "admin") {
//         dados = dados.filter((aluno) => {
//             return aluno.modalidade.some((mod) => {
//                 if (role === "karate") return mod.label.includes("Karatê");
//                 if (role === "taekwondo") return mod.label.includes("Taekwondo");
//                 if (role === "pilates") return mod.label.includes("Pilates");
//                 if (role === "ginastica") return mod.label.includes("Ginastica");
//                 if (role === "boxechines") return mod.label.includes("Boxe Chinês");
//                 if (role === "jiujitsu") return mod.label.includes("Jiu Jítsu");
//                 return false; 
//             });
//         });
//     }

//     // Aplicando filtro de alunoSelecionado se não for "todos"
//     if (alunoSelecionado !== "todos") {
//         dados = dados.filter((aluno) => aluno.id === alunoSelecionado);
//     }

//     const anoAtual = new Date().getFullYear();
//     const anoFinal = anoSelecionado !== "todos" ? parseInt(anoSelecionado) : anoAtual;

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const footerHeight = 30;
//     const headerHeight = 40;
//     let yPosition = headerHeight + 20;

//     const meses = [
//         "janeiro", "fevereiro", "março", "abril", "maio", "junho",
//         "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
//     ];

//     const adicionarCabecalho = () => {
//         doc.addImage(headerrosatech, "PNG", 0, 0, pageWidth, headerHeight);
//         yPosition = headerHeight + 20;
//     };

//     const adicionarRodape = () => {
//         doc.addImage(footerrosatech, "PNG", 0, pageHeight - footerHeight, pageWidth, footerHeight);
//     };

//     dados.forEach((item, index) => {
//         if (index > 0) {
//             doc.addPage();
//         }

//         adicionarCabecalho();

//         const mensalidadesAnoSelecionado = item.mensalidades[anoFinal];
//         if (!mensalidadesAnoSelecionado) return;

//         const nomeAluno = item.nomeCompleto || item.nome || "Nome não disponível";

//         doc.text(`Aluno: ${nomeAluno}`, 20, yPosition);
//         yPosition += 8;
//         doc.text(`CPF: ${item.cpf}`, 20, yPosition);
//         yPosition += 8;
//         doc.text(`Valor Mensalidade: ${item.valorMensalidade}`, 20, yPosition);
//         yPosition += 16;
//         doc.text(`Ano Selecionado: ${anoFinal}`, 20, yPosition);
//         yPosition += 16;

//         meses.forEach((mes) => {
//             const mensalidadeMes = mensalidadesAnoSelecionado[mes] || "Pendente";
//             doc.text(`${mes}: ${mensalidadeMes}`, 20, yPosition);
//             yPosition += 6;

//             if (yPosition > pageHeight - footerHeight - 10) {
//                 adicionarRodape();
//                 doc.addPage();
//                 adicionarCabecalho();
//                 yPosition = headerHeight + 20;
//             }
//         });

//         adicionarRodape();
//     });

//     const primeiroAluno = dados.length > 0 ? dados[0] : {};
//     const nomeAlunoArquivo = (primeiroAluno && primeiroAluno.nome) || "aluno";
//     const nomeArquivo = `relatorio_${nomeAlunoArquivo.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')}_${anoFinal}.pdf`;

//     doc.save(nomeArquivo);
// };
