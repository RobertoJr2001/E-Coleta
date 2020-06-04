import express from 'express';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);
// Request Param: Parâmetros que vem da própria rota que identificam um recurso.
// Query Param: Parâmetros que vem da própria rota geralmente opcionais para filtros, paginação.
// Request Body: Parâmetros para criação/atualização de informações.

app.listen(3333);