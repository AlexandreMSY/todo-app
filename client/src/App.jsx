import { useState, useEffect, useRef } from 'react'
import Task from './components/Task';
import AddTask from './components/AddTask';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import EditTask from './components/EditTask';
import TaskList from './components/TaskList';
import fetchApi from './modules/fetchApi';
import dateConverter from './modules/dateConverter';

const currentDate = new Date().toISOString().slice(0, 10)

const getUuid = async () => {
  const res = await fetchApi('http://localhost:5000/auth/createUser', {credentials: 'include', method:'post'})
  const uuid = res.uuid

  return uuid
}

function App() {
  const [tasks, setTasks] = useState({ tasks: [], tasksCount: 0 })
  const [uuid, setUuid] = useState()
  const [inputs, setInputs] = useState({ taskName: '', expireDate: '' })
  const [popUp, showPopUp] = useState({ addTaskPopUp: false, editTaskPopUp: false })
  const newTaskName = useRef('')
  const newDate = useRef('')
  const editTaskId = useRef('')

  const fetchTasks = async () => {
    const prevLength = tasks.tasksCount;
    const uuid = await getUuid() 
    let res = await fetchApi(`http://localhost:5000/task/alltasks?uuid=${uuid}`)

    const currentLength = res.rows.length

    if(prevLength == currentLength){
      res = await fetchApi(`http://localhost:5000/task/alltasks?uuid=${uuid}`)
    }

    /*the line above is a partial solution for the tasks not updating bug 
    still investigating the bug
    
    in case the current task length fetched is the same as the previous length, it just fetches the api again
    */
    
    setTasks(prevState => ({
      ...prevState, 
      tasks: res.rows,
      tasksCount: res.rows.length
    }))

    setUuid(uuid)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  //handle input changes
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    setInputs(values => ({ ...values, [name]: value }))
    console.log(inputs);
  }

  //add task
  const addTask = async () => {
    const {taskName, expireDate} = inputs

    const body = {
      taskName: taskName,
      dateCreated: currentDate,
      dueDate: expireDate ? expireDate : currentDate,
      uuid: uuid
    }

    fetchApi('http://localhost:5000/task/createTask', {
      method: 'post',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    await fetchTasks()
    setInputs({ taskName: '', expireDate: ''})
    showPopUp(prevState => ({ ...prevState, addTaskPopUp: !addTaskPopUp }))
  }

  //delete task
  const deleteTask = async (taskId) => {
    const body = {
      uuid: uuid,
      taskid: taskId
  }

    fetchApi('http://localhost:5000/task/deletetask', {
      method: "delete",
      credentials: "include",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    await fetchTasks()
  }

  //edit task
  const editTask = async () => {
    const {taskName, expireDate} = inputs

    const body = {
      taskId: editTaskId.current,
      newTaskName: taskName,
      newDueDate: expireDate ? expireDate : currentDate,
      uuid: uuid
    }

    fetchApi('http://localhost:5000/task/updateTask', {
      method: "put",
      credentials: "include",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    await fetchTasks()
    showPopUp(prevState => prevState = !prevState)
  }

  const openEditPopUp = (taskName, dueDate, taskId) => {
    newTaskName.current = taskName
    newDate.current = String(dueDate).slice(0,10)
    editTaskId.current = taskId

    showPopUp(prevState => ({...prevState, editTaskPopUp: !editTaskPopUp}))
  }

  const allTasks = tasks.tasks
  const tasksCount = tasks.tasksCount
  const addTaskPopUp = popUp.addTaskPopUp
  const editTaskPopUp = popUp.editTaskPopUp

  return(
    <>
        <div className='d-flex flex-column justify-content-center shadow border border-1 position-relative container-md p-2'>
            <div className='d-flex flex-row justify-content-between m-2'>
              <h3>Todos ({tasks.tasksCount})</h3>
              <button className='btn btn-primary' onClick={() => {
                showPopUp(prevState => ({...prevState, addTaskPopUp: !addTaskPopUp}))
              }}>Add Task</button>
            </div> 

            {addTaskPopUp &&
              <div className='d-flex justify-content-center'>
                <div className='border position-absolute' style={{width: '80%'}}>
                  <AddTask
                    submitOnClick = {() => {addTask()}} 
                    cancelOnClick = {() => {
                      showPopUp(prevState => ({...prevState, addTaskPopUp: !addTaskPopUp}))
                    }}
                    handleChange = {handleChange}
                    defaultDateValue = {currentDate}
                  />
                </div>
              </div>
            }

            {editTaskPopUp &&
              <div className='d-flex justify-content-center'>
                <div className='border border-warning position-absolute'>
                  <EditTask
                    taskDefaultValue = {newTaskName.current}
                    dateDefaultValue = {newDate.current}
                    cancelOnClick = {() => {
                      showPopUp(prevState => ({...prevState, editTaskPopUp: !editTaskPopUp}))
                    }}
                    editOnClick = {() => editTask()}
                    handleChange = {handleChange}
                  />
                </div>
              </div> 
            }

            {tasksCount > 0 ? <TaskList 
            tasks={allTasks}
            deleteTask={deleteTask}
            editTask={openEditPopUp}
            /> : <h3 className='text-center border p-4'>No Todos</h3>}
            
          </div>
    </>
  )
}

export default App
