# Dengue Front — Recife

Interface web para o sistema de vigilância epidemiológica de dengue.

## Pré-requisitos

- Node.js 18+
- Back-end FastAPI rodando em `http://localhost:8000`

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Variável de ambiente (opcional)

Se o back-end rodar em outra porta ou host, edite a linha no topo de `src/App.jsx`:

```js
const API_BASE = "http://localhost:8000/api/v1";
```

## Endpoints consumidos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Verifica se a API está online |
| GET | `/api/v1/historico?limite=200&ano=2024` | Histórico de casos do MongoDB |
| POST | `/api/v1/predict` | Gera previsão de casos |
| GET | `/api/v1/predicoes?limite=50` | Lista previsões salvas |

## Estrutura

```
src/
  App.jsx        # Componente principal — toda a lógica e UI
  main.jsx       # Entry point React
index.html
vite.config.js
package.json
```
