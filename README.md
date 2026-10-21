# cifra-cesar

Atividade sobre Cifra de César desenvolvida na disciplina Segurança em Sistemas de Informação.

## Requisitos

- [Node.js](https://nodejs.org/) instalado.

O projeto não possui dependências externas, então não é necessário executar `npm install`.

## Como executar

No terminal, acesse a pasta do projeto e execute:

```bash
node main.js
```

O programa executa uma demonstração no terminal: cifra uma mensagem de exemplo com a chave `45` e, em seguida, exibe a análise de frequência do texto cifrado e o texto recuperado pelo método Qui-Quadrado.

## O que o programa faz

- Aplica a Cifra de César a letras maiúsculas e minúsculas, preservando espaços, números e pontuação.
- Normaliza acentos e cedilha para trabalhar com o alfabeto de 26 letras (`A-Z`).
- Analisa a frequência das letras e estima a chave por dois métodos: hipóteses baseadas na letra mais frequente e comparação Qui-Quadrado com frequências do português.

A mensagem e a chave usadas na demonstração estão definidas em `main.js`; para testar outros valores, edite essas constantes no arquivo antes de executar novamente.

## Como foi implementado

Código gerado com o `Gemini AI`, da Google. O modelo utilizado foi o `Argon` com nível de raciocínio no máximo.

Prompt usado:

```
"Você é um especialista em Segurança em Sistemas de Computação. Você me ajudará com atividades práticas da disciplina na universidade. Preciso que me explique didaticamente o que cada atividade pede e depois implemente o que é pedido em JAVA SCRIPT.

Atividade 3 - Cifra de César

1) Exercício com Cifra de Cesar. Implementar um algoritmo da cifra de César, em qualquer linguagem. O deslocamento (chave k) pode variar de 1 a N. Pode contemplar somente a encriptação (a decriptação não é obrigatória)

2)  Implementar uma criptoanálise com relação à ocorrência de letras do exercício anterior https://pt.wikipedia.org/wiki/Frequ%C3%AAncia_de_letras"
```
