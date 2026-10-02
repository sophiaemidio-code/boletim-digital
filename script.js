//
c
     // DADOS ATUALIZADOS DO 8º ANO
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: "6,2", tri2: "6,0", tri3: null, faltas: [4, 0, 0] },
  { disciplina: "Matemática", tri1: "5,7", tri2: "6,9", tri3: null, faltas: [4, 0, 0] },
  { disciplina: "Ciências", tri1: "8,6", tri2: "6,0", tri3: null, faltas: [5, 0, 0] },
  { disciplina: "História", tri1: "8,7", tri2: "9,0", tri3: null, faltas: [3, 0, 0] },
  { disciplina: "Geografia", tri1: "4,4", tri2: "5,0", tri3: null, faltas: [1, 0, 0] },
  { disciplina: "Língua Inglesa", tri1: "6,9", tri2: "6,0", tri3: null, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: "6,0", tri2: "6,8", tri3: null, faltas: [2, 0, 0] },
  { disciplina: "Educação Física", tri1: "9,4", tri2: "8,5", tri3: null, faltas: [1, 0, 0] },
  { disciplina: "Educação Digital", tri1: "4,4", tri2: "9,0", tri3: null, faltas: [3, 0, 0] },
  { disciplina: "Educação Financeira", tri1: "8,5", tri2: "7,8", tri3: null, faltas: [3, 0, 0] },
  { disciplina: "Estudo Orientado", tri1: "7,7", tri2: "9,0", tri3: null, faltas: [4, 0, 0] },
  { disciplina: "Redação e Leitura", tri1: "7,3", tri2: "8,6", tri3: null, faltas: [3, 0, 0] },
  { disciplina: "Pensamento Lógico", tri1: "9,0", tri2: "8,5", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,3", tri2: "7,6", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Práticas Experimentais", tri1: "8,3", tri2: "6,7", tri3: null, faltas: [2, 0, 0] }
];

// NOTA SOBRE A FREQUÊNCIA:
// O percentual de 92% exibido nos cards é apenas demonstrativo/fictício nesta versão.
// Ele não deve ser calculado a partir das faltas acumuladas.

/**
 * Função para normalizar notas para a escala de 0 a 10.
 * Converte strings com vírgula e ajusta notas na escala 0-100.
 */
function normalizarNota(valor) {
  // Trata valores ausentes (vazio, null ou undefined)
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se o valor for string (ex: "7,8"), troca vírgula por ponto e converte para número
  let num = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : Number(valor);

  // Se a conversão falhou ou o número for inválido/negativo, retorna null
  if (isNaN(num) || num < 0) {
    return null;
  }

  // Ajusta notas na escala de 0 a 100 para a escala de 0 a 10
  if (num > 10 && num <= 100) {
    num = num / 10;
  }

  // Valida se a nota final está no intervalo permitido (0 a 10)
  if (num >= 0 && num <= 10) {
    return num;
  }

  return null; // Caso esteja fora das regras
}

/**
 * Função principal para processar os dados e preencher a interface do site (DOM)
 */
function carregarBoletim() {
  const corpoTabela = document.getElementById('corpo-tabela');
  corpoTabela.innerHTML = ''; // Limpa a tabela antes de preencher

  let somaMedias = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Itera por cada disciplina da lista (forEach)
  dadosDisciplinas.forEach((item) => {
    // Normaliza as notas dos três trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Calcula soma e quantidade de notas válidas disponíveis
    let somaNotas = 0;
    let qtdNotasValidas = 0;

    if (n1 !== null) { somaNotas += n1; qtdNotasValidas++; }
    if (n2 !== null) { somaNotas += n2; qtdNotasValidas++; }
    if (n3 !== null) { somaNotas += n3; qtdNotasValidas++; }

    // Soma das faltas da disciplina
    const totalFaltasDisciplina = item.faltas.reduce((acc, f) => acc + f, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    // Cálculo da Média e definição da Situação
    let mediaTexto = "—";
    let situacaoTexto = "Nota ainda não disponível";
    let classeSituacao = "situacao-indisponivel";

    if (qtdNotasValidas > 0) {
      const media = somaNotas / qtdNotasValidas;
      mediaTexto = media.toFixed(1).replace('.', ',');
      
      somaMedias += media;
      qtdDisciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        classeSituacao = "situacao-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        classeSituacao = "situacao-atencao";
        qtdAtencao++;
      }
    }

    // Função auxiliar para formatar a exibição individual das notas
    const formatarExibicao = (nota) => nota !== null ? nota.toFixed(1).replace('.', ',') : "—";

    // Cria a linha da tabela no HTML
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarExibicao(n1)}</td>
      <td>${formatarExibicao(n2)}</td>
      <td>${formatarExibicao(n3)}</td>
      <td><strong>${mediaTexto}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td class="${classeSituacao}">${situacaoTexto}</td>
    `;

    corpoTabela.appendChild(linha);
  });

  // Atualiza os Cards de Resumo no topo da página
  const mediaGeralGlobal = qtdDisciplinasComMedia > 0 
    ? (somaMedias / qtdDisciplinasComMedia).toFixed(1).replace('.', ',') 
    : "—";

  document.getElementById('card-media').innerText = mediaGeralGlobal;
  document.getElementById('card-faltas').innerText = totalFaltasGeral;
  document.getElementById('card-bom-desempenho').innerText = qtdBomDesempenho;
  document.getElementById('card-atencao').innerText = qtdAtencao;
}

// Executa a função assim que a página carrega
document.addEventListener('DOMContentLoaded', carregarBoletim);   