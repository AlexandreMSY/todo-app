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
  const taskName = useRef()
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState(0)
  const [openCreatePopUp, setOpenCreatePopUp] = useState()
  const cookieCreated = useRef(false)

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await fetchTasks()
      setCount(prevState => prevState = tasks.length)
      setTasks(prevState => prevState = tasks)
    }

    if(cookieCreated.current) return
    cookieCreated.current = true
    getTasks()
  }, [])

  const addTask = async () => {
    const name = taskName.current.value
    const currentDate = new Date().toISOString().slice(0, 10)

    const body = {
      taskName: name,
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
    setTasks(prevState => prevState = [...tasksFound])
    setOpenCreatePopUp(prevState => prevState = !prevState)
  }

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

    setCount(prevState => prevState = newTasks.length)
    setTasks(prevState => prevState = [...newTasks])
  }

  return(
    <>
      <div className='d-flex flex-row justify-content-center'>
        <div className='position-relative border border-1 p-2 container-sm'>
            <div className='d-flex justify-content-between m-2'>
              <h3>Todos ({count})</h3>
              <button className='btn btn-primary' onClick={() => {setOpenCreatePopUp(prevState => prevState = !prevState)}}>Add Task</button>
            </div> 

            {openCreatePopUp && <div className='d-flex justify-content-center'>
              <AddTaskPopUp 
              submitAction={() => {addTask()}} 
              cancelAction={() => {setOpenCreatePopUp(prevState => prevState = !prevState)}} 
              taskNameRef={taskName}/>
            </div>}

            <div className='d-flex flex-column gap-1'>
              {Number(tasks.length) > 0 ? tasks.map((item) => <Task 
              key={item.task_id} 
              taskName={item.task_name} 
              date={dateConverter(item.date_created)}
              deleteBtnAction={() => deleteTask(item.task_id)}/>) : <h3 className='text-center'>No Todos</h3>}
            </div>
        </div>
      </div>
    </>
  )
}

export default App
