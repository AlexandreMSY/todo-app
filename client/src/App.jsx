import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Task from './components/Task';
import TasksCrud from './modules/TasksCrud';
import AddTaskPopUp from './components/Test';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

//var tasksCrud = new TasksCrud()

const dateConverter = (date, isoDate) => {
  const originalDate = new Date(date)
  
  const year = originalDate.getFullYear()
  const month = originalDate.getMonth() + 1
  const day = originalDate.getDate()

  return !isoDate ? `${day.toString().length > 1 ? day : `0${day}`}-0${month}-${year}` : `${year}-0${month}-${day.toString().length > 1 ? day : `0${day}`}`
}

const getUuid = async () => {
  const req = await fetch('http://localhost:5000/auth/createUser', {credentials: 'include', method:'post'})
  const res = await req.json()
  const uuid = await res.uuid

  return uuid
}

const fetchTasks = async () => {
  const uuid = await getUuid()
  const req = await fetch(`http://localhost:5000/task/alltasks?uuid=${uuid}`)
  const res = await req.json()

  return res.rows
}

function App() {
  const [tasks, setTasks] = useState({})
  const [inputs, setInputs] = useState({})
  const [count, setCount] = useState(0)
  const [openCreatePopUp, setOpenCreatePopUp] = useState()
  const cookieCreated = useRef(false)

  useEffect(() => {
    const getTasks = async () => {
      const tasksFound = await fetchTasks()
      setCount(tasksFound.length)
      setTasks(tasksFound)
    }

    getTasks()
    console.log(tasks);
  }, [])

  //handle input changes
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    setInputs(values => ({...values, [name]: value}))
    console.log(inputs)
  }

  //add task
  const addTask = async () => {
    const currentDate = new Date().toISOString().slice(0, 10)

    const body = {
      taskName: inputs.taskName,
      dateCreated: currentDate,
      uuid: await getUuid()
    }

    TasksCrud.fetcher('http://localhost:5000/task/createTask', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const tasksFound = await fetchTasks()

    setCount(prevState => prevState = tasksFound.length)
    setTasks(prevState => ({...prevState}, tasksFound))

    setOpenCreatePopUp(prevState => prevState = !prevState)
  }

  //delete task
  const deleteTask = async (taskId) => {
    const uuid = await getUuid()
    const body = {
      uuid: uuid,
      taskid: taskId
  }

    TasksCrud.fetcher('http://localhost:5000/task/deletetask', {
      method: "delete",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const newTasks = await fetchTasks()

    setCount(prevState => prevState = prevState - 1)
    setTasks(prevState => prevState = newTasks)
  }

  return(
    <>
        <div className='d-flex flex-column justify-content-center shadow border border-1 position-relative container-md p-2'>
            <div className='d-flex flex-row justify-content-between m-2'>
              <h3>Todos ({count})</h3>
              <button className='btn btn-primary' onClick={() => {setOpenCreatePopUp(prevState => prevState = !prevState)}}>Add Task</button>
            </div> 

            {openCreatePopUp &&
              <div className='d-flex justify-content-center'>
                <div className='border position-absolute' style={{width: '80%'}}>
                  <AddTaskPopUp 
                  submitOnClick={() => {addTask()}} 
                  cancelOnClick={() => {setOpenCreatePopUp(prevState => prevState = !prevState)}}
                  handleChange={handleChange} 
                  />
                </div>
              </div>
            }

            <div className='d-flex flex-column gap-1 m-2'>
              {tasks.length ? tasks.map((item) => <Task 
              key={item.task_id} 
              taskName={item.task_name} 
              date={dateConverter(item.date_created)}
              deleteBtnAction={() => deleteTask(item.task_id)}/>) : <h3 className='text-center'>No Todos</h3>}
            </div>
          </div>
    </>
  )
}

export default App
