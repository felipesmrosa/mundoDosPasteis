export const exportarCSV = (alunoSelecionado, mesSelecionado, alunos) => {
    // Filtra os alunos de acordo com a seleção
    let dados = alunos;
    if (alunoSelecionado !== "todos") {
        dados = dados.filter((aluno) => aluno.id === alunoSelecionado);
    }

    // Filtra os dados com base no mês selecionado
    if (mesSelecionado !== "todos") {
        dados = dados.filter((aluno) =>
            aluno.mensalidades.some(
                (mensalidade) => mensalidade.mes === mesSelecionado
            )
        );
    }

    // Criando o conteúdo do CSV com as informações do aluno
    const csvContent = [
        ["Nome", "Status Pagamento", "Mensalidade", "Mês"],  // Adicionando o mês na tabela CSV
        ...dados.map((item) => {
            const mensalidadeAtual = item.mensalidades.find(
                (mensalidade) => mensalidade.mes === mesSelecionado
            );
            const statusPagamento = mensalidadeAtual ? mensalidadeAtual.status : "Não especificado";
            return [
                item.nome, // Nome do aluno
                statusPagamento, // Status do pagamento
                item.valorMensalidade, // Mensalidade
                mensalidadeAtual ? mensalidadeAtual.mes : "Não especificado", // Mês
            ];
        }),
    ]
        .map((e) => e.join(","))
        .join("\n");

    // Criando o arquivo CSV e fazendo o download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "relatorio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
