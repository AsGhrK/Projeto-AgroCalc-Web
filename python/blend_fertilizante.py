"""Resolve um sistema linear 3x3 para mistura de fertilizantes.

O script modela a quantidade de três insumos para atingir uma meta de NPK,
mostrando o determinante da matriz e a solução do sistema quando existir.
"""

from __future__ import annotations

import numpy as np


def main() -> None:
    """Calcula a composição de fertilizantes para uma meta de nutrientes.
    
    Coleta do usuário:
    - Percentuais de N, P, K para Ureia, Superfosfato e KCl
    - Metas de nitrogênio, fósforo e potássio (kg/ha)
    """
    try:
        print('=== BLEND DE FERTILIZANTE ===')
        print()

        # --- Entrada da composição dos fertilizantes ---
        print('=== COMPOSIÇÃO DOS FERTILIZANTES ===')
        print('(pressione Enter para usar o valor padrão entre colchetes)')
        print()
        ureia_n = float(input('Ureia — % nitrogênio [45]: ') or '45') / 100
        ureia_p = float(input('Ureia — % fósforo [10]: ') or '10') / 100
        ureia_k = float(input('Ureia — % potássio [5]: ') or '5') / 100
        superfosfato_p = float(input('Superfosfato — % fósforo [46]: ') or '46') / 100
        kcl_k = float(input('KCl — % potássio [60]: ') or '60') / 100
        print()

        # --- Entrada das metas de NPK ---
        print('=== METAS DE NUTRIENTES ===')
        meta_n = float(input('Meta de nitrogênio (kg/ha) [padrão 90]: ') or '90')
        meta_p = float(input('Meta de fósforo (kg/ha) [padrão 60]: ') or '60')
        meta_k = float(input('Meta de potássio (kg/ha) [padrão 60]: ') or '60')
        print()

        # --- Matriz de composição: cada linha = um nutriente, cada coluna = um fertilizante ---
        # Cada valor representa a fração do nutriente em cada fertilizante
        matriz = np.array(
            [
                [ureia_n, ureia_p, 0.0],           # Ureia:        N%  P%  0%K
                [0.0, superfosfato_p, 0.0],        # Superfosfato:  0%N  P%  0%K
                [0.0, 0.0, kcl_k],                 # KCl:           0%N  0%P  K%
            ]
        )
        metas = np.array([meta_n, meta_p, meta_k])

        # --- Verifica solução única pelo determinante ---
        determinante = np.linalg.det(matriz)
        print(f'Determinante: {determinante:.4f}')

        # Determinante próximo de zero indica sistema sem solução única
        if abs(determinante) < 1e-10:
            print('Sistema sem solução única.')
            return

        # --- Resolve o sistema linear A·x = b ---
        solucao = np.linalg.solve(matriz, metas)

        # --- Exibe os resultados em kg/ha ---
        print(f'Ureia:        {solucao[0]:.1f} kg/ha')
        print(f'Superfosfato: {solucao[1]:.1f} kg/ha')
        print(f'KCl:          {solucao[2]:.1f} kg/ha')
    except Exception as error:
        print(f'Erro ao resolver o sistema: {error}')


if __name__ == '__main__':
    main()
