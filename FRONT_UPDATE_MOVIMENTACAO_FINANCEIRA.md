# Frontend - Atualização de Parcela Financeira

## Objetivo
Este documento descreve como o front deve integrar com o endpoint de atualização de parcela financeira, com suporte a:
- acréscimo
- desconto
- pagamento parcial (com geração automática de nova parcela para o mês seguinte)

## Endpoint
- Método: `PUT`
- URL: `/parcelas/:id`
- Controller: `FinanceiroController.updateMovimentacaoFinanceira`
- Service: `FinanceiroService.updateMovimentacaoFinanceira`

## Campos aceitos no body
Campos principais já usados pelo sistema:
- `status`: `pendente | liquidado | cancelado`
- `data_pagamento`: data/hora do pagamento
- `data_efetiva_pg`: data efetiva
- `metodo_pagamento`: `transferencia | boleto | credito | debito | cheque | dinheiro | PIX | DA | TRFCC | TED`
- `conta_id`: id da conta bancária
- `boleto`: código do boleto
- `valor_pago`: valor pago

Novos campos para cálculo no backend:
- `acrescimo` (opcional)
- `desconto` (opcional)
- `valorPago` (opcional): alias de `valor_pago`

## Regra de cálculo
Valor base da parcela:
- `valor_parcela` (valor original da movimentação)

Total ajustado:
- `totalComAjustes = valor_parcela + acrescimo - desconto`

Regras:
- se `acrescimo`/`desconto` não forem enviados, assumem `0`
- se `status = liquidado` e `valor_pago` não for enviado, o backend usa quitação total (`totalComAjustes`)
- se `status = liquidado` e `valor_pago < totalComAjustes`, é considerado pagamento parcial

## Pagamento parcial
Quando houver pagamento parcial:
1. a parcela atual é atualizada como `liquidado`
2. o backend calcula `valorRestante = totalComAjustes - valor_pago`
3. cria automaticamente uma nova movimentação com:
- `status = pendente`
- `valor_parcela = valorRestante`
- `vencimento = vencimento_atual + 1 mês`
- `financeiro_id` igual ao da parcela original

## Formato de valores
O backend aceita:
- número: `1234.56`
- string com vírgula: `"1234,56"`
- string com milhar: `"1.234,56"`

## Exemplos de payload

### 1) Quitação total sem ajustes
```json
{
  "status": "liquidado",
  "data_pagamento": "2026-03-23T14:30:00.000Z",
  "metodo_pagamento": "PIX"
}
```

### 2) Quitação total com desconto e acréscimo
```json
{
  "status": "liquidado",
  "acrescimo": "10,00",
  "desconto": "5,00",
  "valor_pago": "105,00",
  "data_pagamento": "2026-03-23T14:35:00.000Z",
  "metodo_pagamento": "transferencia"
}
```

### 3) Pagamento parcial (gera nova parcela automática)
```json
{
  "status": "liquidado",
  "acrescimo": "0,00",
  "desconto": "0,00",
  "valor_pago": "60,00",
  "data_pagamento": "2026-03-23T14:40:00.000Z",
  "metodo_pagamento": "boleto"
}
```

## Regras de UX no front
- mostrar sempre:
- `Valor original da parcela`
- `Acréscimo`
- `Desconto`
- `Valor final`
- `Valor pago`
- validar antes de enviar:
- `acrescimo >= 0`
- `desconto >= 0`
- `valor_pago > 0` quando `status = liquidado`
- alertar usuário quando `valor_pago < valor final`: 
- mensagem sugerida: `Pagamento parcial detectado. Será gerada nova parcela para o próximo mês com o valor restante.`

## Erros esperados
- `400` com `{ "error": "Erro ao atualizar movimentação financeira" }`
- Caso de regra inválida (ex.: desconto maior que o total): backend rejeita atualização

## Observação importante
A criação da nova parcela no pagamento parcial é feita no backend. O front não deve criar parcela manualmente.

Ação recomendada após `PUT` com sucesso:
1. recarregar lista de parcelas do `financeiro_id`
2. atualizar totais e status na tela
