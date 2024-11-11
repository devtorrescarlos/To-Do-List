// Variables
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll("#filter button");

let tasks = []; // Arreglo donde se guardarán las tareas

// Cargar EventListeners
loadEvents();
function loadEvents() {
  taskForm.addEventListener("submit", addTask);
  document.addEventListener("DOMContentLoaded", () => {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    createHTML();
  });
}

// Funciones
function addTask(e) {
  // Función para agregar las tareas
  e.preventDefault();
  if (taskInput.value.trim() === "") return; // Esta condición evalúa que no tenga espacios en blancos al incio y al final

  const task = {
    // Objeto donde se guardarán los datos de la tarea
    id: Date.now(),
    text: taskInput.value,
    completed: false,
  };

  tasks = [...tasks, task]; // Añadimos la nueva tarea al arreglo con un Spread Operator
  createHTML();
  taskForm.reset(); // Reiniciamos el formulario
}

// Función para crear el HTML
function createHTML(filter = "all") {
  cleanList(); // Esta función limpiará el HTML antes de crearlo

  if (tasks.length > 0) {
    // Evaluamos si el arreglo de tareas es mayor a 0. (debe haber 1 o más)
    tasks.forEach((task) => {
      if (
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed)
      ) {
        // Crear la tarea
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" id="task-${task.id}" ${
          task.completed ? "checked" : ""
        }>
        <span class="task-text ${task.completed ? "completed" : ""}">${
          task.text
        }</span>`;

        // Crear el botón de eliminar
        const deleteBtn = document.createElement("a");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");

        // Añadir función para eliminar la tarea
        deleteBtn.onclick = () => {
          deleteTask(task.id);
        };
        // Evento que escucha si el checkbox está checked o no
        li.querySelector("input").addEventListener("change", () =>
          toggleTask(task.id)
        );
        li.appendChild(deleteBtn); // Añadimos el botón al li
        taskList.appendChild(li); // Añadimos la tarea a la lista
      }
    });
    storageSync();
  }

  // Sincronizar localStorage para guardar las tareas al cerrar e iniciar sesión en el navegador
  
}

function toggleTask(id) {
  const task = tasks.find((task) => task.id === id); // Buscamos la tarea con el ID requerido
  task.completed = !task.completed; // Si se cumple la condición, cambiamos el completed a true
  createHTML();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id); // Filtra las tareas y actualiza 'tasks'
  createHTML(); // Vuelve a crear el HTML para reflejar los cambios
}

function cleanList() {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  // Función para evitar la duplicación de tareas
}

function storageSync() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**  Añadimos la función a los botones de filtrado para mostrar y crear el HTML según el ID, es decir,
 si presionamos el botón de pendientes, se creará el HTML con las tareas que tengan el ID de "active" y tengan el valor
 de completed en false. Sucederá respectivamente con las demás tareas, si el ID = all, se muestra todo, si el ID = completed,
 se muestran las tareas completadas.
*/
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    createHTML(button.id);
  })
);
createHTML();
