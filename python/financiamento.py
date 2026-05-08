"""Simula um financiamento agrícola com cálculo de parcela e amortização.

O script usa a fórmula da prestação fixa (PMT) para juros compostos e imprime
uma tabela com saldo devedor, juros e amortização por mês.
"""

from __future__ import annotations


def calcular_parcela(valor_presente: float, taxa: float, parcelas: int) -> float:
    """Calcula a parcela fixa de um financiamento usando a fórmula PMT."""
    # Valida entradas para evitar divisão por zero
    if taxa <= 0:
        raise ValueError('A taxa deve ser maior que zero.')
    if parcelas <= 0:
        raise ValueError('O número de parcelas deve ser maior que zero.')
    # PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
    return valor_presente * (taxa * (1 + taxa) ** parcelas) / ((1 + taxa) ** parcelas - 1)


def tabela_amortizacao(valor_presente: float, taxa: float, parcelas: int) -> None:
    """Imprime a tabela de amortização do financiamento mês a mês."""
    # Calcula a parcela fixa que será a mesma em todos os meses
    parcela = calcular_parcela(valor_presente, taxa, parcelas)
    saldo = valor_presente

    # Cabeçalho da tabela
    print(f"{'Mês':>4} | {'Parcela':>12} | {'Juros':>10} | {'Amort.':>10} | {'Saldo':>12}")
    print('-' * 60)

    # Itera mês a mês calculando juros e amortização
    for mes in range(1, parcelas + 1):
        juros = saldo * taxa                  # juros do período = saldo * taxa
        amortizacao = parcela - juros         # parcela menos juros = amortização
        saldo -= amortizacao                  # reduz o saldo devedor
        # Corrige erro de arredondamento na última iteração
        if mes == parcelas:
            saldo = 0.0
        print(
            f'{mes:>4} | R$ {parcela:>9.2f} | R$ {juros:>8.2f} | '
            f'R$ {amortizacao:>8.2f} | R$ {max(saldo, 0):>10.2f}'
        )


def main() -> None:
    """Lê os dados do usuário e executa a simulação."""
    try:
        # --- Entrada de dados ---
        valor_presente = float(input('Valor financiado (R$): '))
        taxa_percentual = float(input('Taxa mensal (%): '))
        parcelas = int(input('Número de parcelas: '))

        # Converte taxa percentual para decimal (ex: 1.5% → 0.015)
        taxa = taxa_percentual / 100

        # --- Cálculo e exibição ---
        parcela = calcular_parcela(valor_presente, taxa, parcelas)
        print(f'Parcela fixa: R$ {parcela:.2f}\n')
        tabela_amortizacao(valor_presente, taxa, parcelas)
    except ValueError as error:
        print(f'Entrada inválida: {error}')


if __name__ == '__main__':
    main()
