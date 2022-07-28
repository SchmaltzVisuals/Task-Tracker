import Header from "./components/Header"
import { useState, useEffect } from "react"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"

const App = () => {
  const [showAdd, setShow] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //fetch tasks
  const fetchTasks = async () => {
    const response = await fetch("http://localhost:5000/tasks")
    const data = await response.json()
    return data
  }

  //fetch task
  const fetchTask = async (id) => {
    const response = await fetch(
      `http://localhost:5000/tasks/${id}`
    )
    const data = await response.json()
    return data
  }

  //add task

  const addTask = async (task) => {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    })

    const data = await response.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  //delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "delete",
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updateTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder,
    }

    const response = await fetch(
      `http://localhost:5000/tasks${id}`,
      {
        method: "put",

        headers: { "Content-type": "application/json" },
        body: JSON.stringify(updateTask),
      }
    )

    const data = await response.json()

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, reminder: !task.reminder }
          : task
      )
    )
  }

  return (
    <div className="container">
      <Header
        onAdd={() => setShow(!showAdd)}
        showAdd={showAdd}
      />
      {showAdd && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks
          tasks={tasks}
          onDelete={deleteTask}
          onToggle={toggleReminder}
        />
      ) : (
        "No Tasks"
      )}
    </div>
  )
}

export default App
