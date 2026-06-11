# AgroCalc Web

Uma aplicação web para suporte a decisões agrícolas — cálculos de produtividade, blend de fertilizantes e geração de gráficos via Python/Flask.

---

## Índice

- [Visão geral](#visão-geral)
- [Principais recursos](#principais-recursos)
- [Arquitetura e fluxo](#arquitetura-e-fluxo)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Instalação rápida](#instalação-rápida)
- [Execução](#execução)
- [Endpoints importantes](#endpoints-importantes)
- [Como contribuir](#como-contribuir)
- [Soluções para problemas comuns](#soluções-para-problemas-comuns)
- [Licença](#licença)

---

## Visão geral

AgroCalc Web combina um frontend leve (HTML/CSS/JavaScript) com um backend Python especializado em geração de gráficos (Matplotlib) e cálculos numéricos (NumPy). O servidor Node.js (Express) serve os arquivos estáticos e coordena o processo Python quando necessário.

## Principais recursos

- Calculadoras agrícolas: área, custos, financiamento e blend de fertilizantes
- Geração dinâmica de gráficos (PNG) a partir de dados informados
- Tema claro/escuro persistente por preferência do usuário
- Ferramentas didáticas: conversor de bases e lógica digital

## Arquitetura e fluxo

1. O cliente acessa o frontend servido por `server.js` na porta `3000`.
2. Requisições para gerar gráficos são encaminhadas para o Flask (porta `5000`).
3. Se o Flask não estiver rodando, o `server.js` inicia automaticamente o processo Python e aguarda até que o serviço responda.

Fluxo resumido:

Frontend → Express (3000) → Flask (5000) → Matplotlib → PNG

## Estrutura do repositório

```
Projeto-AgroCalc-Web/
├─ server.js
├─ package.json
├─ requirements.txt
├─ src/
│  ├─ html/
│  │  ├─ index.html
│  │  ├─ calculadora.html
│  │  └─ computacao.html
│  ├─ css/styles.css
│  └─ js/script.js
├─ python/
│  ├─ serve_plot.py
│  ├─ matriz_talhoes.py
│  ├─ blend_fertilizante.py
│  ├─ custo_producao.py
│  └─ financiamento.py
└─ README.md

## Documentos

Esta pasta contém documentos úteis relacionados ao projeto. Clique nos links abaixo para abrir cada arquivo:

- [Apresentação - AgroCalc Pro](Documentos/AgroCalc_Pro.pptx)
- [Relatório - DOCX](Documentos/Relatorio%20AgroCalcWeb.docx)
- [Relatório - PDF](Documentos/Relatorio%20AgroCalcWeb.pdf)
```

## Pré-requisitos

- Node.js (v16+ recomendado)
- Python 3.10+ com `venv`
- Conexão de rede local (para servir páginas)

### Dependências Python (listadas em `requirements.txt`)

- numpy
- matplotlib
- flask

## Instalação rápida

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/Projeto-AgroCalc-Web.git
cd Projeto-AgroCalc-Web

# Instalar dependências Node.js
npm install

# Criar e ativar ambiente virtual Python (Windows PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Instalar dependências Python
pip install -r requirements.txt
```

Importante: o arquivo `server.js` tenta iniciar automaticamente o servidor Python usando o executável
`.venv\Scripts\python.exe`. Portanto, crie o ambiente virtual chamado `.venv` e instale as dependências
Python antes de rodar `npm start`. Se preferir não usar o auto-start, inicie manualmente o Flask (exemplos abaixo).

## Execução

Inicie a aplicação principal:

```bash
npm start
```

Observações:

- O servidor Node (Express) roda na porta `3000`. Acesse `http://localhost:3000`.
- Quando necessário, o processo Python/Flask é iniciado automaticamente pelo `server.js` e escuta na porta `5000`.

Como iniciar o servidor Python/Flask manualmente (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python python/serve_plot.py
```

No Windows CMD (caso não use PowerShell):

```cmd
python -m venv .venv
.venv\Scripts\activate
python python/serve_plot.py
```

No Linux / macOS:

```bash
python -m venv .venv
source .venv/bin/activate
python python/serve_plot.py
```

Se você executar `npm start` sem ter criado/ativado o ambiente virtual `.venv`, o `server.js` pode falhar
ao tentar iniciar o Python. Nesse caso, crie o `.venv` e instale as dependências listadas em `requirements.txt`,
ou inicie o Flask manualmente antes de usar o frontend.

## Endpoints importantes

- `GET /` — Página inicial (`index.html`)
- `GET /calculadora.html` — Página de calculadoras
- `GET /computacao.html` — Módulo de computação
- `GET /api/start-python-server` — Inicia o servidor Python (retorna JSON)
- `GET /api/python-server-status` — Verifica se o servidor Python está rodando
- `GET /api/generate-plot?values=...&labels=...` — Gera e retorna um PNG de gráfico

Flask (direto):
- `GET /plot.png?values=...&labels=...` — Gera o gráfico com os parâmetros enviados

## Como contribuir

1. Abra uma issue descrevendo a melhoria ou bug.
2. Crie uma branch com o prefixo `feature/` ou `fix/`.
3. Faça commits pequenos e claros.
4. Envie um pull request explicando a mudança e testes realizados.

Boas práticas:

- Mantenha a interface clara e acessível.
- Evite dependências desnecessárias no frontend.

## Soluções para problemas comuns

- "Servidor Python não respondeu": verifique se o ambiente virtual está ativo e se os pacotes do `requirements.txt` foram instalados. Você pode iniciar o Flask manualmente:

- "Servidor Python não respondeu": verifique se o ambiente virtual está ativo e se os pacotes do `requirements.txt` foram instalados. Você pode iniciar o Flask manualmente:

```powershell
# PowerShell
.\.venv\Scripts\Activate.ps1
python python/serve_plot.py
```

- Se `npm start` falhar ao tentar iniciar o servidor Python: o `server.js` usa o caminho `.venv\Scripts\python.exe`. Verifique se o diretório `.venv` existe e contém o executável do Python. Se você optar por um nome diferente para o ambiente virtual, atualize `server.js` ou crie um `.venv` com esse conteúdo.

- Problema com execução de scripts no PowerShell: se ao tentar ativar o virtualenv você receber erro de execução de scripts, execute no PowerShell (como administrador ou no escopo do processo):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

- "Porta 3000 ocupada": identifique e finalize o processo que usa a porta (Windows):

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Licença

Este projeto está licenciado sob a licença MIT — consulte o arquivo `LICENSE` para os termos completos.

