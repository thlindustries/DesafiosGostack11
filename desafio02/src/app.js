const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      error: 'Id do repositório inválido'
    });
  };

  return next();
}

app.use('/repositories/:id', validateRepoId);

app.get('/repositories', (req, res) => {
  return res.status(200).json(repositories);
});

app.post('/repositories', (req, res) => {
  const { url, title, techs } = req.body;
  const newObj = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(newObj);

  return res.status(200).json(newObj);
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;
  const repoId = repositories.findIndex(repo => repo.id == id);

  if (repoId < 0) {
    return res.status(400).json({ error: 'Repositório não encontrado' });
  }

  repositories[repoId].likes++;

  return res.status(200).json(repositories[repoId]);

});

app.put('/repositories/:id', (req, res) => {
  const { title, url, techs } = req.body;
  const { id } = req.params;
  const repoId = repositories.findIndex(repo => repo.id == id)

  if (repoId < 0) {
    return res.status(400).json({ error: 'Repositório não encontrado' });
  }

  const newObj = {
    id: repositories[repoId].id,
    url,
    title,
    techs,
    likes: repositories[repoId].likes
  };

  repositories[repoId] = newObj;

  return res.status(200).json(newObj);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const repoId = repositories.findIndex(repo => repo.id == id);

  if (repoId < 0) {
    return res.status(400).json({ error: 'Repositório não encontrado' });
  }

  repositories.splice(repoId, 1);

  return res.status(204).send();
});

module.exports = app;