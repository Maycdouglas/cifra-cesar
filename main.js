/**
 * ============================================================================
 * ATIVIDADE 3 - SEGURANÇA EM SISTEMAS DE COMPUTAÇÃO
 * Parte 1: Cifra de César (Chave k de 1 a N)
 * Parte 2: Criptoanálise por Frequência de Letras (Língua Portuguesa)
 * ============================================================================
 */

// Tabela oficial de frequência de letras em Português (em %) - Fonte: Wikipédia
const FREQUENCIA_PT = {
  A: 14.63,
  B: 1.04,
  C: 3.88,
  D: 4.99,
  E: 12.57,
  F: 1.02,
  G: 1.3,
  H: 1.28,
  I: 6.18,
  J: 0.4,
  K: 0.02,
  L: 2.78,
  M: 4.74,
  N: 5.05,
  O: 10.73,
  P: 2.52,
  Q: 1.2,
  R: 6.53,
  S: 7.81,
  T: 4.34,
  U: 4.63,
  V: 1.67,
  W: 0.01,
  X: 0.21,
  Y: 0.01,
  Z: 0.47,
};

/**
 * Função auxiliar para remover acentos e cedilha (Ex: "Segurança" -> "Seguranca")
 * Essencial para manter o alfabeto estritamente nas 26 letras (A-Z).
 */
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ============================================================================
// EXERCÍCIO 1: ALGORITMO DA CIFRA DE CÉSAR
// ============================================================================

/**
 * Encripta (ou decripta) um texto usando a Cifra de César.
 * @param {string} texto - O texto de entrada.
 * @param {number} k - A chave de deslocamento (pode variar de 1 a N).
 * @returns {string} - O texto processado.
 */
function cifraDeCesar(texto, k) {
  const textoLimpo = normalizarTexto(texto);

  // Garante que qualquer chave k (de 1 a N, ou negativa para decriptação)
  // fique no intervalo válido [0, 25]
  const deslocamento = ((k % 26) + 26) % 26;

  let resultado = "";

  for (let i = 0; i < textoLimpo.length; i++) {
    const codigoAscii = textoLimpo.charCodeAt(i);

    // Letras Maiúsculas (ASCII 65 a 90: 'A' a 'Z')
    if (codigoAscii >= 65 && codigoAscii <= 90) {
      const novaPosicao = ((codigoAscii - 65 + deslocamento) % 26) + 65;
      resultado += String.fromCharCode(novaPosicao);
    }
    // Letras Minúsculas (ASCII 97 a 122: 'a' a 'z')
    else if (codigoAscii >= 97 && codigoAscii <= 122) {
      const novaPosicao = ((codigoAscii - 97 + deslocamento) % 26) + 97;
      resultado += String.fromCharCode(novaPosicao);
    }
    // Espaços, números e pontuações permanecem inalterados
    else {
      resultado += textoLimpo[i];
    }
  }

  return resultado;
}

/**
 * Função dedicada para decriptar usando a própria função de encriptação com -k
 */
function decifrarCesar(textoCifrado, k) {
  return cifraDeCesar(textoCifrado, -k);
}

// ============================================================================
// EXERCÍCIO 2: CRIPTOANÁLISE POR FREQUÊNCIA DE LETRAS
// ============================================================================

/**
 * Calcula a contagem e o percentual de cada letra (A-Z) em um texto.
 * @param {string} texto - Texto a ser analisado.
 */
function calcularFrequenciaObservada(texto) {
  const contagem = {};
  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let totalLetras = 0;

  // Inicializa o contador de A a Z com zero
  for (const letra of alfabeto) {
    contagem[letra] = 0;
  }

  // Conta apenas caracteres alfabéticos (ignorando espaços e pontuação)
  const textoMaiusculo = normalizarTexto(texto).toUpperCase();
  for (const char of textoMaiusculo) {
    if (contagem.hasOwnProperty(char)) {
      contagem[char]++;
      totalLetras++;
    }
  }

  // Converte a contagem absoluta em porcentagem (%) e ordena da mais frequente para a menos
  const frequencias = Object.keys(contagem).map((letra) => {
    const percentual =
      totalLetras > 0 ? (contagem[letra] / totalLetras) * 100 : 0;
    return {
      letra,
      ocorrencias: contagem[letra],
      percentual: Number(percentual.toFixed(2)),
    };
  });

  // Ordena em ordem decrescente de ocorrências
  frequencias.sort((a, b) => b.ocorrencias - a.ocorrencias);

  return { totalLetras, frequencias, mapaContagem: contagem };
}

/**
 * Realiza a criptoanálise completa de um texto cifrado.
 * Método 1: Heurística da letra mais frequente (comparando com 'A' e 'E').
 * Método 2: Ajuste estatístico completo via Qui-Quadrado com a tabela da Wikipédia.
 */
function criptoanaliseFrequencia(textoCifrado) {
  const analise = calcularFrequenciaObservada(textoCifrado);
  const letraMaisComumCifrada = analise.frequencias[0].letra;

  // --- MÉTODO 1: Comparação direta do pico com 'A' (14.63%) e 'E' (12.57%) ---
  const codigoMaisComum = letraMaisComumCifrada.charCodeAt(0) - 65;
  const chaveAssumindoA =
    (codigoMaisComum - ("A".charCodeAt(0) - 65) + 26) % 26;
  const chaveAssumindoE =
    (codigoMaisComum - ("E".charCodeAt(0) - 65) + 26) % 26;

  // --- MÉTODO 2: Teste Qui-Quadrado (Compara todas as 26 letras da tabela PT) ---
  let melhorChaveQuiQuadrado = 0;
  let menorQuiQuadrado = Infinity;

  for (let kTeste = 0; kTeste < 26; kTeste++) {
    const tentativaTexto = decifrarCesar(textoCifrado, kTeste);
    const analiseTentativa = calcularFrequenciaObservada(tentativaTexto);
    let somaQuiQuadrado = 0;

    for (const letra in FREQUENCIA_PT) {
      const observado = analiseTentativa.mapaContagem[letra];
      const esperado = (FREQUENCIA_PT[letra] / 100) * analise.totalLetras;

      if (esperado > 0) {
        somaQuiQuadrado += Math.pow(observado - esperado, 2) / esperado;
      }
    }

    if (somaQuiQuadrado < menorQuiQuadrado) {
      menorQuiQuadrado = somaQuiQuadrado;
      melhorChaveQuiQuadrado = kTeste;
    }
  }

  return {
    totalLetrasAnalisadas: analise.totalLetras,
    top5LetrasNoCifrado: analise.frequencias.slice(0, 5),
    metodoPicoSimples: {
      letraMaisFrequenteEncontrada: letraMaisComumCifrada,
      hipoteseLetraA: {
        chaveEstimada: chaveAssumindoA,
        textoDecifrado: decifrarCesar(textoCifrado, chaveAssumindoA),
      },
      hipoteseLetraE: {
        chaveEstimada: chaveAssumindoE,
        textoDecifrado: decifrarCesar(textoCifrado, chaveAssumindoE),
      },
    },
    metodoEstatisticasCompletas: {
      chaveDescoberta: melhorChaveQuiQuadrado,
      divergenciaQuiQuadrado: Number(menorQuiQuadrado.toFixed(2)),
      textoRecuperado: decifrarCesar(textoCifrado, melhorChaveQuiQuadrado),
    },
  };
}

// ============================================================================
// DEMONSTRAÇÃO E TESTE PRÁTICO
// ============================================================================

const mensagemOriginal =
  "A criptografia e uma ferramenta essencial para proteger a confidencialidade " +
  "e a integridade das informacoes em sistemas de computacao modernos. Entretanto, " +
  "cifras classicas de substituicao monoalfabetica, como a cifra de Cesar, podem " +
  "ser facilmente quebradas atraves da analise de frequencia de letras da lingua portuguesa.";

// Testando com uma chave alta (ex: k = 45, que equivale a 45 % 26 = 19 no alfabeto)
const chaveSecretaK = 45;

console.log("=== 1. TESTE DE ENCRIPTAÇÃO (CIFRA DE CÉSAR) ===");
console.log(
  `Chave escolhida (k): ${chaveSecretaK} (Deslocamento efetivo mod 26: ${
    chaveSecretaK % 26
  })`
);
console.log("\nTexto Original:\n" + mensagemOriginal);

const textoCifrado = cifraDeCesar(mensagemOriginal, chaveSecretaK);
console.log("\nTexto Cifrado:\n" + textoCifrado);

console.log("\n=== 2. TESTE DE CRIPTOANÁLISE POR FREQUÊNCIA ===");
const resultadoAtaque = criptoanaliseFrequencia(textoCifrado);

console.log(
  `\nTotal de letras analisadas: ${resultadoAtaque.totalLetrasAnalisadas}`
);
console.log("Top 5 letras mais frequentes no texto cifrado:");
console.table(resultadoAtaque.top5LetrasNoCifrado);

console.log(
  "\n--- Resultado pelo Método 1 (Assumindo que a mais frequente é 'A') ---"
);
console.log(
  `Letra mais repetida no cifrado: '${resultadoAtaque.metodoPicoSimples.letraMaisFrequenteEncontrada}'`
);
console.log(
  `Chave estimada (se '${resultadoAtaque.metodoPicoSimples.letraMaisFrequenteEncontrada}' = 'A'): k = ${resultadoAtaque.metodoPicoSimples.hipoteseLetraA.chaveEstimada}`
);
console.log(
  `Texto decifrado:\n${resultadoAtaque.metodoPicoSimples.hipoteseLetraA.textoDecifrado}`
);

console.log(
  "\n--- Resultado pelo Método 2 (Tabela Completa Wikipédia / Qui-Quadrado) ---"
);
console.log(
  `Chave descoberta com precisão: k = ${resultadoAtaque.metodoEstatisticasCompletas.chaveDescoberta}`
);
console.log(
  `Texto recuperado:\n${resultadoAtaque.metodoEstatisticasCompletas.textoRecuperado}`
);
