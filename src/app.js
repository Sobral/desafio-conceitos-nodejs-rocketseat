const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const {url, title, techs} = request.body;
  const id = uuid();
  const repository = {
    id,
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {


  const {id} = request.params;
  const {url, title, techs} = request.body;

  let repository = repositories.find(repo => repo.id === id);

  if(!repository) {
    return response.status(400).json({message: 'Repository not found.'});
  }


  if(url) {repository.url = url}
  if(title) {repository.title = title}
  if(techs) {repository.techs = techs}


  return response.json(repository); 

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository) { return response.status(400).json({message: "Repository not found."})}

  const index = repositories.indexOf(repository);

  repositories.splice(index,  1);

  return response.status(204).json({message: "OK"});

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository) { return response.status(400).json({message: "Repository not found."})}

  repository.likes++;
  
  const {likes} = repository;

  return response.status(201).json({likes});
});

module.exports = app;
