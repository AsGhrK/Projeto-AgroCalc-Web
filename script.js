// --- Gerenciador de tema (dark/light mode) ---
function initTheme() {
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('agro-theme') || 'dark';
  } catch (error) {
    // localStorage não disponível (modo privado, file://, etc.)
    // Usa 'dark' como padrão sem persistência
  }
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'light' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem('agro-theme', newTheme);
  } catch (error) {
    // localStorage não disponível (modo privado, file://, etc.)
    // Tema funciona na sessão atual sem persistência
  }
  updateThemeIcon(newTheme);
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function updateConverterResult(value, mode) {
  const decimalValue = Number.parseInt(value, 10);
  const resultBox = document.getElementById('converter-result');

  if (!Number.isFinite(decimalValue) || decimalValue < 0) {
    resultBox.textContent = 'Informe um número decimal válido maior ou igual a zero.';
    return;
  }

  const binaryValue = decimalValue.toString(2);
  const hexValue = decimalValue.toString(16).toUpperCase();
  const binaryLine = `Binário: ${binaryValue}`;
  const hexLine = `Hexadecimal: ${hexValue}`;

  if (mode === 'binary') {
    resultBox.textContent = binaryLine;
    return;
  }

  if (mode === 'hex') {
    resultBox.textContent = hexLine;
    return;
  }

  resultBox.innerHTML = `${binaryLine}<br>${hexLine}<br>Valor decimal: ${formatNumber(decimalValue)}`;
}

function updateLogicResult(humidity, temperature) {
  const humidityValue = humidity === '1';
  const temperatureValue = temperature === '1';
  const irrigation = humidityValue && temperatureValue;
  const resultBox = document.getElementById('logic-result');

  resultBox.innerHTML = `
    <strong>Tabela avaliada:</strong><br>
    Umidade = ${humidityValue ? 1 : 0}<br>
    Temperatura = ${temperatureValue ? 1 : 0}<br>
    AND = ${irrigation ? 1 : 0}<br>
    Decisão: ${irrigation ? 'irrigar' : 'não irrigar'}
  `;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Calcula área de talhão em m² e hectares
function calculateAreaResult(length, width) {
  const resultBox = document.getElementById('area-result');
  const name = document.getElementById('area-name')?.value?.trim();
  const nameLabel = name ? `<strong>Talhão:</strong> ${name}<br>` : '';
  const areaM2 = length * width;
  const areaHa = areaM2 / 10000;

  resultBox.innerHTML = `
    ${nameLabel}
    <strong>Área:</strong> ${formatNumber(areaM2)} m²<br>
    <strong>Em hectares:</strong> ${areaHa.toFixed(4)} ha<br>
    <strong>Em alqueires (SP):</strong> ${(areaHa / 2.42).toFixed(4)} alq
  `;
}

function calculateCostResult(fixedCost, variableCost, salePrice, quantity) {
  const resultBox = document.getElementById('cost-result');
  const producerName = document.getElementById('producer-name')?.value?.trim();
  const nameLabel = producerName ? `<strong>Produtor/Fazenda:</strong> ${producerName}<br>` : '';
  const totalCost = fixedCost + variableCost * quantity;

  if (salePrice <= variableCost) {
    resultBox.textContent = 'O preço de venda deve ser maior que o custo variável para existir ponto de equilíbrio.';
    return;
  }

  const breakEven = fixedCost / (salePrice - variableCost);
  const estimatedRevenue = salePrice * quantity;
  const estimatedProfit = estimatedRevenue - totalCost;

  resultBox.innerHTML = `
    ${nameLabel}
    <strong>Custo total:</strong> ${formatCurrency(totalCost)}<br>
    <strong>Ponto de equilíbrio:</strong> ${breakEven.toFixed(1)} unidades<br>
    <strong>Receita estimada:</strong> ${formatCurrency(estimatedRevenue)}<br>
    <strong>Lucro/prejuízo estimado:</strong> ${formatCurrency(estimatedProfit)}
  `;
}

function calculateTalhoesResult(matriz) {
  const resultBox = document.getElementById('talhoes-result');
  const flat = matriz.flat();
  const media = flat.reduce((a, b) => a + b, 0) / flat.length;
  const maximo = Math.max(...flat);
  const linhas = matriz.map((row) => (row.reduce((a, b) => a + b, 0) / row.length).toFixed(1));
  const totalEstimado = (flat.reduce((a, b) => a + b, 0) * 300 / flat.length).toFixed(0);

  resultBox.innerHTML = `
    <strong>Média geral:</strong> ${media.toFixed(1)} sacas/ha<br>
    <strong>Melhor setor:</strong> ${maximo} sacas/ha<br>
    <strong>Média por linha:</strong> [${linhas.join(', ')}] sacas/ha<br>
    <strong>Total estimado (300 ha):</strong> ${totalEstimado} sacas
  `;
}

function getTalhoesDataset() {
  const values = [];

  for (let i = 1; i <= 3; i += 1) {
    for (let j = 1; j <= 4; j += 1) {
      const input = document.getElementById(`talh-${i}-${j}`);
      const value = Number.parseFloat(input?.value);
      if (!Number.isFinite(value)) {
        return null;
      }
      values.push(value);
    }
  }

  return {
    values,
    labels: ['N1', 'N2', 'N3', 'N4', 'C1', 'C2', 'C3', 'C4', 'S1', 'S2', 'S3', 'S4'],
  };
}

function calculateBlendResult(metaN, metaP, metaK) {
  const resultBox = document.getElementById('blend-result');

  const matriz = [
    [0.45, 0.10, 0.05],
    [0.00, 0.46, 0.00],
    [0.00, 0.00, 0.60],
  ];
  const metas = [metaN, metaP, metaK];

  const determinant = matriz[0][0] * (matriz[1][1] * matriz[2][2] - matriz[1][2] * matriz[2][1])
    - matriz[0][1] * (matriz[1][0] * matriz[2][2] - matriz[1][2] * matriz[2][0])
    + matriz[0][2] * (matriz[1][0] * matriz[2][1] - matriz[1][1] * matriz[2][0]);

  if (Math.abs(determinant) < 1e-10) {
    resultBox.textContent = 'Determinante ≈ 0. Sistema sem solução única.';
    return;
  }

  const adj = [
    [matriz[1][1] * matriz[2][2] - matriz[1][2] * matriz[2][1], -(matriz[0][1] * matriz[2][2] - matriz[0][2] * matriz[2][1]), matriz[0][1] * matriz[1][2] - matriz[0][2] * matriz[1][1]],
    [-(matriz[1][0] * matriz[2][2] - matriz[1][2] * matriz[2][0]), matriz[0][0] * matriz[2][2] - matriz[0][2] * matriz[2][0], -(matriz[0][0] * matriz[1][2] - matriz[0][2] * matriz[1][0])],
    [matriz[1][0] * matriz[2][1] - matriz[1][1] * matriz[2][0], -(matriz[0][0] * matriz[2][1] - matriz[0][1] * matriz[2][0]), matriz[0][0] * matriz[1][1] - matriz[0][1] * matriz[1][0]],
  ];

  const solucao = [
    (adj[0][0] * metas[0] + adj[0][1] * metas[1] + adj[0][2] * metas[2]) / determinant,
    (adj[1][0] * metas[0] + adj[1][1] * metas[1] + adj[1][2] * metas[2]) / determinant,
    (adj[2][0] * metas[0] + adj[2][1] * metas[1] + adj[2][2] * metas[2]) / determinant,
  ];

  resultBox.innerHTML = `
    <strong>Determinante:</strong> ${determinant.toFixed(4)}<br>
    <strong>Ureia:</strong> ${solucao[0].toFixed(1)} kg/ha<br>
    <strong>Superfosfato:</strong> ${solucao[1].toFixed(1)} kg/ha<br>
    <strong>KCl:</strong> ${solucao[2].toFixed(1)} kg/ha
  `;
}

function calculateFinanceResult(principal, monthlyRatePercent, installments) {
  const resultBox = document.getElementById('finance-result');
  const monthlyRate = monthlyRatePercent / 100;

  if (monthlyRate <= 0) {
    resultBox.textContent = 'A taxa mensal deve ser maior que zero.';
    return;
  }

  if (installments <= 0) {
    resultBox.textContent = 'O número de parcelas deve ser maior que zero.';
    return;
  }

  const factor = (monthlyRate * (1 + monthlyRate) ** installments) / ((1 + monthlyRate) ** installments - 1);
  const installmentValue = principal * factor;
  let balance = principal;
  const maxRows = Math.min(installments, 12);

  let tableHTML = '<table><thead><tr><th>Mês</th><th>Parcela</th><th>Juros</th><th>Amort.</th><th>Saldo</th></tr></thead><tbody>';

  for (let month = 1; month <= maxRows; month += 1) {
    const interest = balance * monthlyRate;
    const amortization = installmentValue - interest;
    balance -= amortization;
    const newBalance = Math.max(balance, 0);

    tableHTML += `<tr><td>${month}</td><td class="align-right">${formatCurrency(installmentValue)}</td><td class="align-right">${formatCurrency(interest)}</td><td class="align-right">${formatCurrency(amortization)}</td><td class="saldo-cell">${formatCurrency(newBalance)}</td></tr>`;
  }

  tableHTML += '</tbody></table>';

  const summaryHTML = `
    <div class="amort-summary">
      <strong>Parcela fixa:</strong> ${formatCurrency(installmentValue)}<br>
      <strong>Total pago:</strong> ${formatCurrency(installmentValue * installments)}<br>
      <strong>Juros totais:</strong> ${formatCurrency(installmentValue * installments - principal)}
    </div>
  `;

  const tableWrapper = `<div class="amort-table">${tableHTML}</div>`;
  const noteHTML = installments > 12 ? '<p class="amort-note">Mostrando os primeiros 12 meses.</p>' : '';

  resultBox.innerHTML = summaryHTML + tableWrapper + noteHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar tema ao carregar a página
  initTheme();

  // Listener: botão de alternar tema
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  const converterForm = document.getElementById('converter-form');
  if (converterForm) {
    converterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const decimalInput = document.getElementById('decimal-input');
      const baseSelect = document.getElementById('base-select');
      updateConverterResult(decimalInput.value, baseSelect.value);
    });
  }

  const logicForm = document.getElementById('logic-form');
  if (logicForm) {
    logicForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const humidityInput = document.getElementById('humidity-input');
      const temperatureInput = document.getElementById('temperature-input');
      updateLogicResult(humidityInput.value, temperatureInput.value);
    });
  }

  // Listener: área de talhão
  const areaForm = document.getElementById('area-form');
  if (areaForm) {
    areaForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const length = Number.parseFloat(document.getElementById('area-length').value);
      const width = Number.parseFloat(document.getElementById('area-width').value);
      calculateAreaResult(length, width);
    });
  }

  const costForm = document.getElementById('cost-form');
  if (costForm) {
    costForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const fixedCost = Number.parseFloat(document.getElementById('cost-fixed').value);
      const variableCost = Number.parseFloat(document.getElementById('cost-variable').value);
      const salePrice = Number.parseFloat(document.getElementById('sale-price').value);
      const quantity = Number.parseFloat(document.getElementById('quantity-produced').value);
      calculateCostResult(fixedCost, variableCost, salePrice, quantity);
    });
  }

  const financeForm = document.getElementById('finance-form');
  if (financeForm) {
    financeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const principal = Number.parseFloat(document.getElementById('finance-value').value);
      const rate = Number.parseFloat(document.getElementById('finance-rate').value);
      const installments = Number.parseInt(document.getElementById('finance-installments').value, 10);
      calculateFinanceResult(principal, rate, installments);
    });
  }

  const talhoesForm = document.getElementById('talhoes-form');
  if (talhoesForm) {
    talhoesForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = [];
      for (let i = 1; i <= 3; i += 1) {
        const row = [];
        for (let j = 1; j <= 4; j += 1) {
          const val = Number.parseFloat(document.getElementById(`talh-${i}-${j}`).value);
          row.push(val);
        }
        values.push(row);
      }
      calculateTalhoesResult(values);
      generatePlotFromServer();
    });
  }

  const blendForm = document.getElementById('blend-form');
  if (blendForm) {
    blendForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const metaN = Number.parseFloat(document.getElementById('blend-n').value);
      const metaP = Number.parseFloat(document.getElementById('blend-p').value);
      const metaK = Number.parseFloat(document.getElementById('blend-k').value);
      calculateBlendResult(metaN, metaP, metaK);
    });
  }

  const miniTable = document.querySelector('.mini-table');
  if (miniTable) {
    const spans = Array.from(miniTable.querySelectorAll('span'));
    const values = spans.map((s) => Number.parseInt(s.textContent, 10));
    const maxValue = Math.max(...values);
    spans.forEach((span) => {
      if (Number.parseInt(span.textContent, 10) === maxValue) {
        span.classList.add('mini-table-highlight');
      }
    });
  }

  // Botão para gerar gráfico via servidor Python
  const genPlotBtn = document.getElementById('generate-plot-btn');
  const plotImg = document.getElementById('agro-plot');
  let currentBlobUrl = null;

  async function generatePlotFromServer() {
    if (!genPlotBtn) return;
    genPlotBtn.disabled = true;
    const originalText = genPlotBtn.textContent;
    genPlotBtn.textContent = '⏳ Gerando gráfico...';
    
    // Adicionar classe visual de carregamento
    if (plotImg) {
      plotImg.style.opacity = '0.5';
      plotImg.style.pointerEvents = 'none';
    }

    try {
      const dataset = getTalhoesDataset();
      const params = new URLSearchParams();
      params.set('cache', String(Date.now() % 100000));

      if (dataset) {
        params.set('values', dataset.values.join(','));
        params.set('labels', dataset.labels.join(','));
      }

      const res = await fetch(`/api/generate-plot?${params.toString()}`);
      if (!res.ok) throw new Error('Falha ao gerar imagem (verificar servidor).');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = url;
      if (plotImg) {
        plotImg.src = url;
        plotImg.style.opacity = '1';
        plotImg.style.pointerEvents = 'auto';
      }
    } catch (err) {
      // mostra erro simples no console e em uma alerta
      console.error(err);
      alert('Não foi possível gerar o gráfico. Verifique se a aplicação foi iniciada com npm start.');
      if (plotImg) {
        plotImg.style.opacity = '1';
        plotImg.style.pointerEvents = 'auto';
      }
    } finally {
      genPlotBtn.disabled = false;
      genPlotBtn.textContent = originalText;
    }
  }

  if (genPlotBtn) {
    genPlotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generatePlotFromServer();
    });
  }

  if (plotImg) {
    plotImg.addEventListener('error', () => {
      if (!plotImg.dataset.autoFallbackTried && genPlotBtn) {
        plotImg.dataset.autoFallbackTried = '1';
        generatePlotFromServer();
      }
    });
  }
});
