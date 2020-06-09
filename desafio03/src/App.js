import React, { useState, useEffect } from "react";
import Api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    Api.get('/repositories').then(res => {
      setRepositories(res.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await Api.post('/repositories', {
      title: `Repositorio adicionado ${Date.now()}`,
      url: "https://thlindustries.com/repo/teste",
      tech: [
        "react",
        "reactJs",
        "VueJs",
        "react-native"
      ]
    });

    const newRepository = response.data;

    setRepositories([...repositories, newRepository]);
  }

  async function handleRemoveRepository(id) {
    const repoId = repositories.findIndex(repo => repo.id == id);

    const response = await Api.delete(`/repositories/${id}`);

    repositories.splice(repoId, 1);

    setRepositories([...repositories]);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories && repositories.map(repositorie =>
          <li key={repositorie.id}>
            {repositorie.title}
            <button onClick={() => handleRemoveRepository(repositorie.id)}>Remover</button>
          </li>
        )}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;