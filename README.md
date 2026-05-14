# AgroCalc Web 🌾

**Calculadora agrícola com gráficos interativos, cálculos de produtividade e ferramentas de apoio à decisão para o agronegócio.**

Um projeto full-stack que combina uma **aplicação web em HTML/CSS/JavaScript** com um **servidor Python** para gerar gráficos dinâmicos em tempo real.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Como Instalar](#como-instalar)
- [Como Iniciar](#como-iniciar)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Detalhes Técnicos](#detalhes-técnicos)

---

## Visão Geral

O AgroCalc Web é uma plataforma educacional e prática que oferece:

✅ **Calculadoras agrícolas** — Cálculo de área, custos, financiamento e blend de fertilizantes  
✅ **Gráficos em tempo real** — Visualização de produtividade por talhão  
✅ **Módulo de computação** — Conceitos técnicos, conversão de bases numéricas e lógica digital  
✅ **Interface responsiva** — Design dark/light com suporte mobile  
✅ **Integração Python/Node.js** — Backend robusto para cálculos complexos  

---

## Arquitetura

```
┌─────────────────────────────────┐
│   FRONTEND (HTML/CSS/JS)        │
│   - Página inicial              │
│   - Calculadoras                │
│   - Módulo Computação           │
│   - Tema dark/light             │
└──────────┬──────────────────────┘
           │ HTTP
           ▼
┌─────────────────────────────────┐
│   EXPRESS.JS (Node.js)          │
│   Porta 3000                    │
│   - Serve arquivos estáticos    │
│   - API para iniciar Py         │
│   - Proxy de gráficos           │
└──────────┬──────────────────────┘
           │ HTTP
           ▼
┌─────────────────────────────────┐
│   FLASK (Python)                │
│   Porta 5000                    │
│   - Gera gráficos Matplotlib    │
│   - Cálculos numéricos NumPy    │
└─────────────────────────────────┘
```

**Fluxo:**
1. Usuário acessa `http://localhost:3000` no navegador
2. Node.js serve o HTML/CSS/JS
3. Ao solicitar um gráfico, JavaScript faz requisição GET para `/api/generate-plot`
4. Node.js verifica se Flask está rodando; se não, inicia automaticamente
5. Flask gera gráfico PNG com Matplotlib e retorna para o navegador

---

## Estrutura do Projeto

```
Projeto-AgroCalc-Web/
├── server.js                     # Servidor Express (Node.js) principal
├── package.json                  # Dependências npm
├── requirements.txt              # Dependências Python
│
├── src/                          # Código frontend
│   ├── html/
│   │   ├── index.html           # Página inicial
│   │   ├── calculadora.html     # Seção de calculadoras
│   │   └── computacao.html      # Seção de computação
│   ├── css/
│   │   └── styles.css           # Estilos (dark/light theme)
│   └── js/
│       └── script.js            # JavaScript principal
│
├── python/                       # Código backend Python
│   ├── serve_plot.py            # ⭐ Servidor Flask (gerador de gráficos)
│   ├── matriz_talhoes.py        # Análise de produtividade com NumPy
│   ├── blend_fertilizante.py    # Cálculo de mistura de fertilizantes
│   ├── custo_producao.py        # Estimativa de custo de produção
│   └── financiamento.py         # Simulador de financiamento agrícola
│
├── public/                       # (Opcional) Arquivos publicados
└── assets/                       # Recursos adicionais
    └── plots/                    # Cache de gráficos gerados
```

---

## Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | HTML5, CSS3, JavaScript | ES6+ |
| **Backend Node.js** | Express.js | ^4.18.2 |
| **Backend Python** | Flask | (da requirements.txt) |
| **Cálculos** | NumPy | (da requirements.txt) |
| **Gráficos** | Matplotlib | (da requirements.txt) |
| **Tema** | CSS Variables | (Dark/Light) |
| **Runtime** | Node.js | v18+ recomendado |
| **Runtime** | Python | 3.10+ recomendado |

---

## Pré-requisitos

Antes de iniciar, certifique-se que você tem instalado:

### Node.js e npm
```bash
node --version  # v18.0.0 ou superior
npm --version   # 8.0.0 ou superior
```
**Download:** https://nodejs.org/

### Python e pip
```bash
python --version  # 3.10+ recomendado
pip --version
```
**Download:** https://www.python.org/

---

## Como Instalar

### Passo 1: Clonar o repositório
```bash
git clone https://github.com/seu-usuario/Projeto-AgroCalc-Web.git
cd Projeto-AgroCalc-Web
```

### Passo 2: Instalar dependências Node.js
```bash
npm install
```
Isso instalará o Express.js conforme definido em `package.json`.

### Passo 3: Criar ambiente virtual Python
```bash
# No Windows (PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# No Linux/macOS
python3 -m venv .venv
source .venv/bin/activate
```

### Passo 4: Instalar dependências Python
```bash
pip install -r requirements.txt
```

Isso instalará:
- **numpy** — operações numéricas
- **matplotlib** — geração de gráficos
- **flask** — servidor web Python

### Verificar instalação
```bash
# Node.js
npm list express

# Python (com .venv ativo)
pip list | findstr numpy  # Windows
pip list | grep numpy     # Linux/macOS
```

---

## Como Iniciar

### Opção 1: Iniciar com npm (Recomendado)

```bash
npm start
```

**O que acontece:**
1. Node.js inicia na porta **3000**
2. Serve os arquivos HTML/CSS/JS
3. Aguarda requisições do cliente
4. Ao receber pedido de gráfico, **inicia automaticamente o Flask** na porta 5000
5. Flask é mantido rodando para requisições posteriores

**Acesso:**
- Abra no navegador: **http://localhost:3000**

### Opção 2: Iniciar manualmente (Para debug)

**Terminal 1 — Node.js:**
```bash
npm start
# ou
node server.js
```

**Terminal 2 — Python (Opcional, será iniciado automaticamente):**
```bash
# Ative o venv primeiro
.\.venv\Scripts\Activate.ps1  # Windows
# ou
source .venv/bin/activate     # Linux/macOS

# Inicie o servidor Flask
python python/serve_plot.py
```

---

## Funcionalidades

### 📄 Páginas Principais

#### 1. **Página Inicial** (`/` ou `/index.html`)
- Descrição do projeto
- Navegação para calculadoras e módulo de computação
- Tema dark/light

#### 2. **Calculadoras** (`/calculadora.html`)
Conjunto de ferramentas práticas:

- **Cálculo de Área**
  - Entrada: comprimento e largura (metros)
  - Saída: m², hectares, alqueires
  
- **Matriz de Talhões**
  - Entrada: valores de produtividade (sacas/ha)
  - Saída: Gráfico com média, máximo e comparação visual
  - **Integração:** Comunica com Flask para gerar gráficos
  
- **Blend de Fertilizante**
  - Cálculo de mistura NPK (Nitrogênio, Fósforo, Potássio)
  - Sistema linear 3x3 com NumPy
  
- **Custo de Produção**
  - Estimativa de gastos por hectare
  - Insumos, mão de obra, máquinas
  
- **Financiamento Agrícola**
  - Simulação de empréstimos
  - Cálculo de parcelas e juros

#### 3. **Módulo Computação** (`/computacao.html`)
Conceitos técnicos aplicados:

- **Conversor Decimal ↔ Binário ↔ Hexadecimal**
  - Entrada: número decimal
  - Saída: representações em outras bases
  
- **Porta Lógica AND (Irrigação)**
  - Lógica digital aplicada à agricultura
  - Entrada: umidade (0/1), temperatura (0/1)
  - Saída: decisão de irrigação
  
- **Glossário Técnico**
  - Definições de termos computacionais
  - Aplicação ao agronegócio

---

## API Endpoints

### Endpoints Node.js (Express)

#### `GET /`
Retorna a página inicial.
```
Acesso: http://localhost:3000/
Resposta: HTML
```

#### `GET /calculadora.html`
Retorna a página de calculadoras.
```
Acesso: http://localhost:3000/calculadora.html
Resposta: HTML
```

#### `GET /computacao.html`
Retorna a página de computação.
```
Acesso: http://localhost:3000/computacao.html
Resposta: HTML
```

#### `GET /api/start-python-server`
Inicia o servidor Flask (se não estiver rodando).
```
Resposta JSON:
{
  "status": "started" ou "already_running",
  "message": "Descrição do status"
}
```

#### `GET /api/python-server-status`
Verifica se Flask está rodando.
```
Resposta JSON:
{
  "running": true ou false
}
```

#### `GET /api/generate-plot?values=65,72,58&labels=P1,P2,P3`
Gera gráfico PNG com dados customizados.
```
Parâmetros:
  - values: valores numéricos (vírgula separada)
  - labels: rótulos dos dados (vírgula separada)

Resposta: PNG image (binary)
```

### Endpoints Python (Flask)

#### `GET /plot.png`
Gera gráfico Matplotlib.
```
Parâmetros opcionais:
  - values: valores (vírgula separada)
  - labels: rótulos (vírgula separada)

Resposta: PNG image (binary)
```

---

## Detalhes Técnicos

### 📝 server.js — Servidor Node.js Principal

**Responsabilidades:**
1. ✅ Servir arquivos estáticos (HTML/CSS/JS)
2. ✅ Iniciar automaticamente o servidor Python quando necessário
3. ✅ Fazer proxy de requisições de gráficos
4. ✅ Gerenciar o ciclo de vida do processo Flask

**Funções principais:**

| Função | O que faz |
|--------|-----------|
| `waitForPythonServerReady()` | Aguarda Flask estar pronto (timeout: 15s) |
| `isPythonServerRunning()` | Verifica disponibilidade do Flask |
| `startPythonServer()` | Inicia processo Python com spawn |
| `fetchPythonPlot()` | Busca imagem PNG do Flask |

**Fluxo ao gerar gráfico:**
```javascript
Cliente → /api/generate-plot?values=...
    ↓
Node.js verifica se Flask está rodando
    ↓ (NÃO está)
Inicia Flask automaticamente
    ↓
Aguarda Flask ficar pronto (MAX 15s)
    ↓
Envia requisição para Flask /plot.png
    ↓
Retorna PNG para cliente
```

### 🐍 python/serve_plot.py — Servidor Flask

**Função `make_plot(seed)`:**
- Gera gráfico aleatório com barras de produtividade
- Cores: verde (#4a9d61) = acima da média, amarelo (#c9a227) = abaixo

**Função `make_plot_from_values(values, labels)`:**
- Gera gráfico com valores customizados do usuário
- Aceita dados via query string
- Exemplo: `/plot.png?values=65,72,58&labels=Setor1,Setor2,Setor3`

**Endpoint `/plot.png`:**
```python
@app.route('/plot.png')
def plot_png():
    # Lê valores do query string
    # Gera gráfico Matplotlib
    # Retorna PNG em memória (BytesIO)
```

### 🎨 script.js — JavaScript Principal

**Módulos:**

1. **Theme Manager**
   - `initTheme()` — carrega tema do localStorage
   - `toggleTheme()` — alterna dark/light
   - `updateThemeIcon()` — atualiza ícone (🌙/☀️)

2. **Conversores**
   - `updateConverterResult()` — decimal → binário/hex
   - Valida entrada

3. **Lógica Digital**
   - `updateLogicResult()` — porta AND para irrigação
   - Exibe tabela de decisão

4. **Cálculos Agrícolas**
   - `calculateAreaResult()` — m², hectares, alqueires
   - `calculateMatrizTalhoes()` — comunica com Flask

5. **Formadores**
   - `formatNumber()` — pt-BR (1000 → 1.000)
   - `formatCurrency()` — BRL (1000 → R$ 1.000,00)

### 🎨 styles.css — Estilos Responsivos

**Design Tokens:**
```css
/* Cores primárias */
--cor-primaria: #7ddc8b        /* Verde */
--cor-secundaria: #f6c85f      /* Amarelo */

/* Tema Dark (padrão) */
--cor-fundo: #0c1511           /* Preto agrícola */
--cor-texto: #edf5ef           /* Branco suave */

/* Tema Light */
html[data-theme="light"] {
  --cor-fundo: #eaf7ec         /* Branco */
  --cor-texto: #072b18         /* Verde escuro */
}
```

**Recursos:**
- Variáveis CSS para tema dinâmico
- Flexbox responsivo
- Media queries mobile-first
- Animações suaves

---

## 🔧 Troubleshooting

### Problema: "Servidor Python não respondeu"
**Solução:**
1. Verifique se Python/Flask estão instalados: `pip list | grep flask`
2. Aumente o timeout em `server.js` (linha ~20)
3. Inicie Flask manualmente em outro terminal

### Problema: "EADDRINUSE: address already in use :::3000"
**Solução:**
```bash
# Encontre o processo na porta 3000
netstat -ano | findstr :3000      # Windows
lsof -i :3000                     # Linux/macOS

# Mate o processo
taskkill /PID <PID> /F            # Windows
kill -9 <PID>                     # Linux/macOS
```

### Problema: Módulo Python não encontrado
**Solução:**
```bash
# Verifique se venv está ativado
which python                      # Linux/macOS
Get-Command python               # PowerShell Windows

# Reinstale dependências
pip install --upgrade pip
pip install -r requirements.txt
```

### Problema: Páginas não carregam CSS/JS
**Solução:**
1. Verifique se está em `http://localhost:3000` (não `file://`)
2. Verifique console do navegador (F12) para erros
3. Reinicie Node.js

---

## 📦 Scripts npm

```json
{
  "start": "node server.js",      // Inicia servidor Node.js
  "dev": "node server.js"         // Modo desenvolvimento
}
```

**Executar:**
```bash
npm start        # Inicia servidor
npm run dev      # Inicia em modo dev
```

---

## 🌍 Ambiente Local

**URLs Padrão:**
- Frontend: `http://localhost:3000`
- Backend Node.js: `http://localhost:3000` (mesmo servidor)
- Backend Python: `http://127.0.0.1:5000` (interno)

---

## 📄 Licença

MIT License — veja [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Desenvolvimento

### Para adicionar nova calculadora:
1. Adicione HTML em `src/html/calculadora.html`
2. Adicione lógica em `src/js/script.js`
3. Se precisar gráfico, use `/api/generate-plot`

### Para adicionar novo cálculo Python:
1. Crie arquivo em `python/novo_calculo.py`
2. Importe em `python/serve_plot.py` se necessário
3. Exponha via Flask endpoint

### Para modificar tema:
1. Edite variáveis CSS em `src/css/styles.css` (`:root` para dark, `html[data-theme="light"]` para light)
2. Teste alternando tema com botão 🌙/☀️

---

**🚀 Pronto para começar!**

```bash
npm install
pip install -r requirements.txt
npm start
# Acesse http://localhost:3000
```

---

*Desenvolvido com ❤️ para o agronegócio*
