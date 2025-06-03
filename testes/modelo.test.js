const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastrar e verificar get_pergunta', () => {
  const id = modelo.cadastrar_pergunta('Qual a cor do céu?');
  const pergunta = modelo.get_pergunta(id);
  expect(pergunta.texto).toBe('Qual a cor do céu?');
  expect(pergunta.id_pergunta).toBe(id);
});

test('Testando cadastrar resposta e verificar get_respostas', () => {
  const id = modelo.cadastrar_pergunta('O que é um teste de fumaça (smoke test)?');
  const idResp = modelo.cadastrar_resposta(id, 'É um teste de sistema, porém rápido e superficial. O objetivo é garantir que não existe um erro grave no funcionamento do sistema. Ou seja, se não existe um incêndio (ou problema) de grandes proporções e que está gerando uma grande quantidade de fumaça. Por exemplo, um teste de fumaça pode verificar se algumas telas da aplicação estão abrindo ou se determinadas APIs respondem a solicitações básicas. Mas, complementando, um teste de fumaça é um teste automático.');
  const respostas = modelo.get_respostas(id);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('É um teste de sistema, porém rápido e superficial. O objetivo é garantir que não existe um erro grave no funcionamento do sistema. Ou seja, se não existe um incêndio (ou problema) de grandes proporções e que está gerando uma grande quantidade de fumaça. Por exemplo, um teste de fumaça pode verificar se algumas telas da aplicação estão abrindo ou se determinadas APIs respondem a solicitações básicas. Mas, complementando, um teste de fumaça é um teste automático.');
  expect(respostas[0].id_resposta).toBe(idResp);
});

test('Testando cadastrar múltiplas respostas para a mesma pergunta', () => {
  const id = modelo.cadastrar_pergunta('No contexto de testes, o que significam os termos falso positivo/negativo e verdadeiro positivo/negativo? ');
  modelo.cadastrar_resposta(id, 'Seguem as definições: Falso positivo: um teste que falha, embora o código testado esteja correto. Falso negativo: um teste que passa, apesar de o código testado ter um bug. Verdadeiro positivo: um teste que falha e o código testado, de fato, tem um bug. Verdadeiro negativo: um teste que passa e o código testado, de fato, está correto.');
  modelo.cadastrar_resposta(id, 'Ainda para ficar mais claro: verdadeiro = teste cujo resultado é confiável; falso = teste cujo resultado não é confiável; positivo = teste que falha, isto é, emite um alerta; negativo = teste que passa.');
  const respostas = modelo.get_respostas(id);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('Seguem as definições: Falso positivo: um teste que falha, embora o código testado esteja correto. Falso negativo: um teste que passa, apesar de o código testado ter um bug. Verdadeiro positivo: um teste que falha e o código testado, de fato, tem um bug. Verdadeiro negativo: um teste que passa e o código testado, de fato, está correto.');
  expect(respostas[1].texto).toBe('Ainda para ficar mais claro: verdadeiro = teste cujo resultado é confiável; falso = teste cujo resultado não é confiável; positivo = teste que falha, isto é, emite um alerta; negativo = teste que passa.');
});