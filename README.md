# Projeto Módulo 5 — Globotech

**Projeto Fase 5 - Sistema de Controle de Tarefas (To‑Do List)**

> **Status do módulo:** Front‑End estático (HTML + CSS).
> Neste módulo, os dados são *mockados* (escritos diretamente no HTML) e o foco é na **estruturação das páginas**, **estilo** e **responsividade**. A manipulação dinâmica dos dados será feita no módulo seguinte (*FE‑JS‑002*).

---

**Preview da Página Inicial:**  

![Página Inicial – GloboTasks](assets/home.png)


## Objetivo

Construir a interface de um sistema que permita **criar usuários**, **gerenciar múltiplas listas por usuário** e **controlar tarefas** dentro de cada lista. Todas as telas necessárias devem existir e possuir navegação entre si.

---

## Design no Figma

Antes de iniciar a implementação em HTML e CSS, a equipe estruturou a identidade visual e os fluxos de navegação no **Figma**, garantindo consistência e usabilidade desde o início.  

- **Mockups**: versão estática das telas, com foco em layout, cores, tipografia e responsividade.  
  🔗 [Acessar Mockups no Figma](https://www.figma.com/design/abxUxnAJlKjVKUY13O7fgc/To-Do-List?m=auto&t=LH53CpEkBl6XeD2r-1)  

- **Protótipo Navegável**: versão clicável que simula a navegação entre telas, permitindo validar fluxos antes da codificação.  
  🔗 [Acessar Protótipo no Figma](https://www.figma.com/proto/abxUxnAJlKjVKUY13O7fgc/To-Do-List?node-id=0-1&t=LH53CpEkBl6XeD2r-1)  

Essa etapa de design facilitou a transição para o desenvolvimento, servindo como guia visual para a construção das páginas em HTML e CSS.

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

## Mapa de Navegação – GloboTasks  

- **`index.html`** → Hub inicial com os principais acessos  
- **`conta.html`** → Tela de **Cadastro da Conta Principal**  
- **`cria-user.html`** → Tela de **Cadastro de Usuário**  
- **`usuarios.html`** → **Usuários cadastrados** (listar, excluir)  
- **`listas.html`** → **Listas do Usuário** (listar, excluir)  
- **`nova-lista.html`** → Criar nova lista para um usuário  
- **`tarefas.html`** → **Tarefas da Lista** (adicionar, concluir, remover)  


---

## Estrutura sugerida do repositório

```
Projeto-Modulo-5---Globotech/ GloboTasks
├── index.html            # Hub / menu de navegação
├── conta.html            # Cadastro da conta principal
├── cria-user.html        # Criação de usuários
├── usuarios.html         # Exibe os usuários criados
├── listas.html           # Exibe as listas de um usuário
├── nova-lista.html       # Criação de nova lista
│
├── assets/
│   └── globotask.png     # Logo do projeto
│
├── css/
│   └── style.css         # Estilos principais (layout, tipografia, responsivo)
│
├── LICENSE               # Licença do projeto
└── README.md             # Documentação do projeto
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

## Projetos Anteriores
> Este projeto dá continuidade às fases anteriores do Projeto Unificado Globotech (Módulos 1 a 4) e prepara o terreno para o módulo seguinte com JavaScript.


🔗 [Projeto‑Modulo‑1 — Globotech](https://github.com/mirrabernardo/Projeto-Modulo-1---Globotech)  
**Fase 1 – Análise de Engajamento com Python Puro**  
Projeto desenvolvido com Python padrão, sem dependências externas. Implementa scripts para leitura, limpeza e validação de interações em CSV.

🔗 [Projeto‑Modulo‑2 — Globotech](https://github.com/mirrabernardo/Projeto-Modulo-2---Globotech)  
**Fase 2 – Evolução com Programação Orientada a Objetos (POO)**  
Refatoração do sistema usando POO com lógica de processamento orquestrada pela classe SistemaAnaliseEngajamento.

🔗 [Projeto‑Modulo‑3 — Globotech](https://github.com/mirrabernardo/Projeto-Modulo-3---Globotech)  
**Fase 3 – Estruturas de Dados: Fila e Árvore Binária (BST)**  
Implementação de ingestão via fila FIFO e gerenciamento de dados através de árvores binárias de busca (BST) para armazenar e buscar usuários e conteúdos de forma eficiente.

🔗 [Projeto‑Modulo‑4 — Globotech](https://github.com/mirrabernardo/Projeto-Modulo-4---Globotech) 
**Fase 4 – Projeto Unificado com Banco de Dados Relacional**
Integração do sistema de análise de engajamento com persistência em banco de dados MySQL. Abrange modelagem conceitual e lógica (MER/DER), criação do schema relacional, carga de dados automatizada e execução de consultas SQL para análises otimizadas. O projeto consolida as fases anteriores em uma arquitetura escalável e estruturada, conectando Python e SQL de forma integrada.

## Equipe

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/mirrabernardo">
        <img src="https://github.com/user-attachments/assets/12e2f501-e8a0-41f6-9116-c99a9f579b24" width="96" height="96"><br>
        <strong>Mirra</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/TalesHonorio">
        <img src="https://github.com/user-attachments/assets/e046c0c6-42bf-454f-b26e-43ce558048a3" width="96" height="96"><br>
        <strong>Tales</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/andrelassis">
        <img src="https://github.com/user-attachments/assets/782a64f3-7569-4063-bd26-6e1c0353ca19" width="96" height="96"><br>
        <strong>André</strong>
      </a>
    </td>
  </tr>
</table>
