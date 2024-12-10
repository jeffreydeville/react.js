import React,{ useState,useEffect } from 'react'



export default function App() {
  const [todo, setTodo] = useState([
    ]
);

const [editId, setEditId] = useState(null); // L'ID de la tâche en cours de modification
const [newTask, setNewTask] = useState(''); // Le texte de la nouvelle tâche
const [editTask, setEditTask] = useState(''); // Le texte de la nouvelle tâche

/---------------------------------------------------------------------------------------------------------------/
  useEffect(() => {
    // Appel à l'API pour récupérer les tâches
    fetch('http://localhost:3000/todo')
      .then((response) => response.json()) // Convertir la réponse en JSON
      .then((data) => setTodo(data)) // Mettre à jour l'état des tâches
      .catch((error) => console.error('Erreur lors du chargement des tâches:', error));
  }, []); // Le tableau vide [] signifie que cet effet s'exécute une seule fois au montage du composant
/---------------------------------------------------------------------------------------------------------------/


const handlesup = (id)=>{
    setTodo((prev) => prev.filter((item) => item.id !== id));

    fetch(`http://localhost:3000/todo/${id}`, { method: 'DELETE' })
    .catch((error) => console.error('Erreur lors de la suppression de la tâche:', error));
};

  const handlemodif =(id, task)=>{
    
    setEditId(id);
    setEditTask(task);
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/todo/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editId, task: editTask }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTodo((prev) =>
          prev.map((item) => (item.id === editId ? updatedTask : item))
        );
      })
      .catch((error) => console.error('Erreur lors de la mise à jour de la tâche:', error));
    setEditId(null);
    setEditTask('');
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (newTask.trim() === '') {
    alert('Veuillez entrer une tâche');
    return; 
  }

  const newTodo = {
    task: newTask,
  };
  fetch('http://localhost:3000/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  })
  .then((response) => response.json())
  .then((data) => {
      setTodo((prev) => [...prev, data]);
      setNewTask('');
    })
    .catch((error) => console.error('Erreur lors de l\'ajout de la tâche:', error));
};


return (
  <>
    <h1>TO-DO LIST</h1>

    {/* Formulaire d'ajout de nouvelle tâche */}
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Ajouter une tâche"
      />
      <button className='add' type="submit">Ajouter</button>
    </form>

    {/* Liste des tâches */}
    <ul>
      {todo.map((listitem) => (
        <li key={listitem.id}>
          {editId === listitem.id ? (
            // Formulaire d'édition de la tâche
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                placeholder="Modifier la tâche"
              />
              <button className='add' type="submit">Valider</button>
            </form>
          ) : (
            // Affichage de la tâche
            <span>{listitem.task}</span>
          )}

          {/* Boutons d'édition et de suppression */}
          <div className="button-container">
            <button onClick={() => handlesup(listitem.id)}>
              <img src="poubelle.png" alt="Supprimer" />
            </button>
            <button onClick={() => handlemodif(listitem.id, listitem.task)}>
              <img src="crayon.png" alt="Modifier" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </>
);
}