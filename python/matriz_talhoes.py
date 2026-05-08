"""Analisa uma matriz de produtividade por talhão.

O script usa NumPy para representar setores da fazenda e extrair média, valor
máximo e médias por linha, o que ajuda a comparar áreas de cultivo.
"""

from __future__ import annotations

import numpy as np


def main() -> None:
    """Exibe estatísticas de produtividade de uma matriz 3x4."""
    try:
        print('=== MAPA DE PRODUÇÃO ===')
        print('Digite a produtividade (sacas/ha) para cada talhão.')
        print('Matriz 3 linhas x 4 setores')
        print()

        # --- Entrada de dados: lê linha a linha, setor a setor ---
        talhoes = []
        for linha in range(3):
            row = []
            for setor in range(4):
                valor = float(
                    input(f'Linha {linha + 1}, Setor {setor + 1} (padrão 65): ') or '65'
                )
                row.append(valor)
            talhoes.append(row)

        # --- Converte para array NumPy para operações matriciais ---
        talhoes = np.array(talhoes)

        # --- Calcula e exibe estatísticas de produtividade ---
        print('=== MAPA DE PRODUÇÃO (sacas/ha) ===')
        print(talhoes)
        print(f'Média geral:            {talhoes.mean():.1f} sacas/ha')
        print(f'Melhor setor:           {talhoes.max()} sacas/ha')
        print(f'Média por linha:        {talhoes.mean(axis=1)}')

        # --- Estimativa total para uma área de 300 ha ---
        print(f'Total estimado (300ha): {talhoes.sum() * 300 / talhoes.size:.0f} sacas')
    except Exception as error:
        print(f'Erro ao processar a matriz: {error}')


if __name__ == '__main__':
    main()
