"""Servidor simples que gera e retorna um gráfico Matplotlib sob demanda.

Rode:
    python python/serve_plot.py

Acesse http://localhost:5000/plot.png para obter a imagem gerada.
"""
from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import Iterable

from flask import Flask, Response, request
import numpy as np


def make_plot(seed: int | None = None) -> bytes:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    if seed is not None:
        np.random.seed(seed)

    setores = ['N1', 'N2', 'N3', 'N4', 'C1', 'C2', 'C3', 'C4', 'S1', 'S2', 'S3', 'S4']
    valores = np.random.normal(loc=68, scale=6, size=len(setores)).clip(min=40)

    fig, ax = plt.subplots(figsize=(10, 4.5))
    bars = ax.bar(setores, valores, color=['#4a9d61' if v >= valores.mean() else '#c9a227' for v in valores])
    ax.set_title('Produtividade por setor (sacas/ha) — Gerado com Matplotlib', fontsize=12)
    ax.set_ylabel('Sacas/ha')
    ax.set_ylim(0, max(valores) * 1.2)
    ax.grid(axis='y', alpha=0.25)
    for bar in bars:
        h = bar.get_height()
        ax.annotate(f'{h:.0f}', xy=(bar.get_x() + bar.get_width() / 2, h), xytext=(0, 4),
                    textcoords='offset points', ha='center', va='bottom', fontsize=9)

    fig.tight_layout()
    buf = BytesIO()
    fig.savefig(buf, format='png', dpi=150)
    plt.close(fig)
    buf.seek(0)
    return buf.read()


def make_plot_from_values(values: Iterable[float], labels: Iterable[str] | None = None) -> bytes:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    value_list = [float(value) for value in values]
    label_list = list(labels) if labels is not None else [f'P{i + 1}' for i in range(len(value_list))]

    if len(label_list) != len(value_list):
        label_list = [f'P{i + 1}' for i in range(len(value_list))]

    fig, ax = plt.subplots(figsize=(10, 4.5))
    average = sum(value_list) / len(value_list)
    bars = ax.bar(label_list, value_list, color=['#4a9d61' if value >= average else '#c9a227' for value in value_list])
    ax.set_title('Produtividade informada pelos talhões (sacas/ha)', fontsize=12)
    ax.set_ylabel('Sacas/ha')
    ax.set_ylim(0, max(value_list) * 1.2)
    ax.grid(axis='y', alpha=0.25)

    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.0f}', xy=(bar.get_x() + bar.get_width() / 2, height), xytext=(0, 4),
                    textcoords='offset points', ha='center', va='bottom', fontsize=9)

    fig.tight_layout()
    buf = BytesIO()
    fig.savefig(buf, format='png', dpi=150)
    plt.close(fig)
    buf.seek(0)
    return buf.read()


app = Flask(__name__)


@app.route('/plot.png')
def plot_png():
    # aceita ?values= para usar os dados informados no formulário
    values = request.args.get('values')
    labels = request.args.get('labels')

    if values:
        try:
            parsed_values = [float(item) for item in values.split(',') if item.strip()]
        except ValueError:
            parsed_values = []

        if parsed_values:
            parsed_labels = [item.strip() for item in labels.split(',')] if labels else None
            img = make_plot_from_values(parsed_values, parsed_labels)
            resp = Response(img, mimetype='image/png')
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp

    # aceita ?seed= para variar a imagem quando não houver dados do formulário
    seed = request.args.get('seed')
    try:
        seed_val = int(seed) if seed is not None else None
    except ValueError:
        seed_val = None

    img = make_plot(seed_val)
    resp = Response(img, mimetype='image/png')
    # permitir acesso desde file:// ou qualquer origem local
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


if __name__ == '__main__':
    # cria pasta assets/plots caso queira salvar versão estática opcional
    output_path = Path('assets/plots/agro_plot.png')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(make_plot_from_values([62, 58, 71, 65, 70, 80, 75, 68, 55, 60, 58, 63]))
    
    # Iniciar servidor Flask
    app.run(host='127.0.0.1', port=5000, debug=False)
