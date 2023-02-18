import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Task from './components/Task';
import TasksCrud from './modules/TasksCrud';
import Test from './components/Test';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

//var tasksCrud = new TasksCrud()

const dateConverter = (date) => {
  const originalDate = new Date(date)
  const year = originalDate.getFullYear()
  const month = originalDate.getMonth() + 1
  const day = originalDate.getDate()

  return `${day.toString().length > 1 ? day : `0${day}`}-0${month}-${year}`
}

const getUuid = async () => {
    const request = await fetch('http://localhost:5000/auth/createUser', {credentials: "include", method: "post"})
    const response = await request.json()
    const uuid = await response.uuid

    return uuid
}

function App() {
  const taskName = useRef()
  const [tasks, setTasks] = useState([])
  const [uuid, setUuid] = useState('')
  const [count, setCount] = useState(0)
  const [openCreatePopUp, setOpenCreatePopUp] = useState()
  const cookieCreated = useRef(false)

  const getTasks = async () => {
    const uuid = String(await getUuid())
    const tasksFound = await TasksCrud.getTasks(uuid)

    setTasks(prevState => prevState = tasksFound)
    setCount(prevState => prevState = tasksFound.length)
  }

  useEffect(() => {
    if(cookieCreated.current) return
    cookieCreated.current = true

    const setCookieUuid = async () => {
      const uuid = String(await getUuid())
      setUuid(prevState => prevState = uuid)
    }

    setCookieUuid()
    getTasks()
  }, [])

  const addTask = () => {
    const name = taskName.current.value
    TasksCrud.createTask(uuid, name, '2000-04-23')
    getTasks()
    setOpenCreatePopUp(prevState => prevState = !prevState)
  }

  const deleteTask = (taskId) => {
    TasksCrud.deleteTask(uuid, taskId)
    getTasks()
  }

  return(
    <>
      <div className='d-flex flex-row justify-content-center'>
        <div className='position-relative border border-1 p-2 container-sm'>
            <div className='d-flex justify-content-between m-2'>
              <h3>Todos ({count})</h3>
              <button className='btn btn-primary' onClick={() => {setOpenCreatePopUp(prevState => prevState = !prevState)}}>Add Task</button>
            </div> 

            {openCreatePopUp && <div className='d-flex justify-content-center align-items-start'>
            <Test 
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
