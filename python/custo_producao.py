"""Calcula o custo total de produção e o ponto de equilíbrio de uma lavoura.

O script usa uma função afim para representar o custo e compara custo variável
com preço de venda para determinar a quantidade mínima necessária para não haver prejuízo.
"""

from __future__ import annotations


def custo_total(sacas: float, custo_fixo: float, custo_variavel: float) -> float:
    """Retorna C(x) = custo_fixo + custo_variavel * x."""
    # Função afim: parte fixa mais parte proporcional à produção
    return custo_fixo + custo_variavel * sacas


def ponto_equilibrio(custo_fixo: float, preco_venda: float, custo_variavel: float) -> float:
    """Calcula a quantidade mínima para lucro zero: x = CF / (PV - CV)."""
    # Valida que o preço de venda supera o custo variável
    if preco_venda <= custo_variavel:
        raise ValueError('O preço de venda deve ser maior que o custo variável.')
    # Margem de contribuição unitária = PV - CV
    return custo_fixo / (preco_venda - custo_variavel)


def main() -> None:
    """Executa a leitura de dados e mostra os resultados no terminal."""
    try:
        # --- Entrada de dados do usuário ---
        custo_fixo = float(input('Custo fixo (R$): '))
        custo_variavel = float(input('Custo variável por saca (R$): '))
        preco_venda = float(input('Preço de venda por saca (R$): '))
        quantidade = float(input('Sacas produzidas: '))

        # --- Cálculo do custo total e do ponto de equilíbrio ---
        total = custo_total(quantidade, custo_fixo, custo_variavel)
        equilibrio = ponto_equilibrio(custo_fixo, preco_venda, custo_variavel)

        # --- Exibição dos resultados ---
        print(f'Custo total: R$ {total:.2f}')
        print(f'Ponto de equilíbrio: {equilibrio:.1f} sacas')
    except ValueError as error:
        print(f'Entrada inválida: {error}')


if __name__ == '__main__':
    main()
