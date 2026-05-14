/**
 * Servidor Node.js que:
 * 1. Serve os arquivos HTML/CSS/JS
 * 2. Inicia o servidor Python automaticamente quando necessário
 * 3. Funciona como proxy para o servidor Python
 */

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 3000;
const PYTHON_PORT = 5000;

// Variável para controlar a instância do servidor Python
let pythonProcess = null;

function waitForPythonServerReady(timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://127.0.0.1:${PYTHON_PORT}/plot.png`, () => {
        resolve(true);
      });

      req.on('error', () => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error('Servidor Python não respondeu dentro do tempo esperado.'));
          return;
        }

        setTimeout(check, 250);
      });

      req.setTimeout(1000, () => {
        req.destroy();
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error('Servidor Python não respondeu dentro do tempo esperado.'));
          return;
        }

        setTimeout(check, 250);
      });
    };

    check();
  });
}

function fetchPythonPlot(queryString = '') {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${PYTHON_PORT}/plot.png${queryString ? `?${queryString}` : ''}`, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Servidor Python respondeu com status ${response.statusCode}`));
        response.resume();
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error('Tempo limite ao buscar o gráfico.'));
    });
  });
}

// Função para verificar se o servidor Python está rodando
async function isPythonServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PYTHON_PORT}/plot.png`, () => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
    req.setTimeout(2000, () => {
      req.abort();
      resolve(false);
    });
  });
}

// Função para iniciar o servidor Python
function startPythonServer() {
  return new Promise((resolve, reject) => {
    if (pythonProcess) {
      resolve('Servidor Python já está rodando');
      return;
    }

    const pythonScriptPath = path.join(__dirname, 'python', 'serve_plot.py');
    // Usar o Python do ambiente virtual
    const pythonExe = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
    console.log('Iniciando servidor Python em:', pythonScriptPath);

    pythonProcess = spawn(pythonExe, [pythonScriptPath], {
      cwd: __dirname,
      stdio: 'inherit',
    });

    pythonProcess.on('error', (err) => {
      console.error('Erro ao iniciar servidor Python:', err);
      pythonProcess = null;
      reject(err);
    });

    pythonProcess.on('exit', (code) => {
      console.log(`Servidor Python encerrou com código ${code}`);
      pythonProcess = null;
    });

    // Aguarda até o Flask realmente ficar pronto para receber a requisição da imagem.
    waitForPythonServerReady()
      .then(() => resolve('Servidor Python iniciado'))
      .catch((err) => reject(err));
  });
}

// Endpoint para iniciar o servidor Python (se não estiver rodando)
app.get('/api/start-python-server', async (req, res) => {
  try {
    const isRunning = await isPythonServerRunning();
    if (isRunning) {
      res.json({ status: 'already_running', message: 'Servidor Python já está rodando' });
      return;
    }

    await startPythonServer();
    res.json({ status: 'started', message: 'Servidor Python iniciado com sucesso' });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Endpoint para verificar status do servidor Python
app.get('/api/python-server-status', async (req, res) => {
  const isRunning = await isPythonServerRunning();
  res.json({ running: isRunning });
});

app.get('/api/generate-plot', async (req, res) => {
  try {
    const isRunning = await isPythonServerRunning();
    if (!isRunning) {
      await startPythonServer();
    }

    const queryString = new URLSearchParams(req.query).toString();
    const imageBuffer = await fetchPythonPlot(queryString);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(imageBuffer);
  } catch (err) {
    console.error('Erro ao gerar gráfico:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Servir arquivos estáticos (serve da pasta src/)
app.use(express.static(path.join(__dirname, 'src')));

// Rotas para páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'html', 'index.html'));
});

app.get('/calculadora.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'html', 'calculadora.html'));
});

app.get('/computacao.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'html', 'computacao.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor Node.js rodando em http://localhost:${PORT}`);
  console.log('  Abra o navegador em http://localhost:3000');
});

// Encerrar servidor Python ao encerrar Node.js
process.on('SIGINT', () => {
  console.log('\nEncerrando...');
  if (pythonProcess) {
    pythonProcess.kill();
  }
  process.exit(0);
});
