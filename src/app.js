const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validadeProjectId(req, res, next) {
  if(!isUuid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid project ID'});
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositoty = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repositoty);
  return response.json(repositoty);
});

app.put("/repositories/:id", validadeProjectId, (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repositoty => repositoty.id === id);

  if(repositoryIndex < 0) {
    return res.status(400).json({ error: 'Not found repository'})
  }

  const repository = {
    id,
    url, 
    title, 
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository;

  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", validadeProjectId, (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return res.status(400).json({ error: 'Not found repository'})
  }

  repositories.splice(repositoryIndex, 1);
  return res.status(204).json(repositories);
});

app.post("/repositories/:id/like", validadeProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repositoty => repositoty.id === id);

  if(repositoryIndex < 0) {
    return res.status(400).json({ error: 'Not found repository'})
  }

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  }

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
