# Projeto Módulo 5 — Globotech

**Projeto Fase 5 - Sistema de Controle de Tarefas (To‑Do List)**

> **Status do módulo:** Front‑End estático (HTML + CSS).
> Neste módulo, os dados são *mockados* (escritos diretamente no HTML) e o foco é na **estruturação das páginas**, **estilo** e **responsividade**. A manipulação dinâmica dos dados será feita no módulo seguinte (*FE‑JS‑002*).

---

## Objetivo

Construir a interface de um sistema que permita **criar usuários**, **gerenciar múltiplas listas por usuário** e **controlar tarefas** dentro de cada lista. Todas as telas necessárias devem existir e possuir navegação entre si.

---

## Funcionalidades esperadas (escopo do módulo)

As telas e fluxos abaixo estão implementados com navegação entre páginas:

1. **Criar novo usuário**
2. **Criar nova lista para um usuário**
3. **Remover uma lista de um usuário** (com tela de confirmação)
4. **Adicionar tarefas a uma lista**
5. **Listar todas as listas de um usuário**
6. **Listar todas as tarefas de uma lista**
7. **Marcar tarefa como concluída** (checkbox/estilo visual)
8. **Remover uma tarefa de uma lista**

> **Observação:** As “operações” acima são **simuladas visualmente**. Os dados exibidos na interface estão escritos no próprio HTML, apenas para efeito de protótipo funcional.

---

## Mapa de Navegação

* **`index.html`** → Hub inicial com os principais acessos
* **`forms.html`** / **`forms.html`** → Tela de **Cadastro da conta principalgit add.**
* **`forms.html`** / **`FormUser.html`** → Tela de **Cadastro de Usuário**
* **`listas.html`** / **`FormLista.html`** → **Listas do Usuário** (criar, listar, excluir)
* **`display-usuarios.html`** / **`display-usuarios.html`** → **Usuários cadastrados** (criar, listar, excluir)
* **`exibe-listas-usuarios.html`** / **`exibe-listas-usuario.html`** → **Listas de Usuário** (criar, listar, excluir)
* **`display-conta.html`** / **`display-conta.html`** → **Conta principal** (editar, listar, excluir)
* **`tarefas.html`** / **`FormListaChecked.html`** → **Tarefas da Lista** (adicionar, marcar como concluída, remover)

---

## Estrutura sugerida do repositório

```
Projeto-Modulo-5---Globotech/ GloboTascks
├── index.html                  # Hub / menu de navegação
├── forms.html | forms.html     # Nessa etapa vocÊ cadastra a conta principal
├── FormUser.html | FormUser.html   # aqui você cria o usuário e as listas dele
├── listas.html | FormLista.html# Listas de um usuário
├── display-usuarios.html | display-usuarios.html# Exibe os usuários criados e suas listas
├── exibe-listas-usuario.html | exibe-listas-usuario.html# Exibe todas as listas do usuário selecionado
├── display-conta.html | display-conta.html# Exite os dados da conta principal
├── tarefas.html                # Tarefas de uma lista
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos principais (layout, tipografia, responsivo)
│   └── img/                    # Ícones e imagens (opcional)
└── README.md
```

---

## Padrões de UI e Acessibilidade

* **Semântica HTML**: uso de `header`, `main`, `section`, `nav`, `form`, `label`, `ul/li`, etc.
* **Acessibilidade**: `label` associado a `input`, foco visível, `aria-label` quando necessário.
* **Design Responsivo**: layout fluido com **Flexbox / Grid**, `meta viewport` e *breakpoints* simples.
* **Consistência visual**: escala tipográfica, espaçamentos, cores e estados (`:hover`, `:focus`, `:disabled`).
* **Componentização leve em CSS**: classes utilitárias e componentes (ex.: `.card`, `.btn`, `.input`, `.list`).

---

## Como executar localmente

1. **Clone** seu fork ou baixe o `.zip` do repositório.
2. Abra o arquivo **`index.html`** no navegador (duplo‑clique ou via servidor local do VS Code/Live Server).

> Dica: ative a extensão **Live Server** (VS Code) para *hot reload* durante o desenvolvimento.

---

## Equipe

* André Carioca
* Mirra Bernardo
* Tales Honorio

> Este projeto dá continuidade às fases anteriores do Projeto Unificado Globotech (Módulos 1 a 4) e prepara o terreno para o módulo seguinte com JavaScript.

---
