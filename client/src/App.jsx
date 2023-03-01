import { useState, useEffect, useRef } from 'react'
import Task from './components/Task';
import AddTask from './components/AddTask';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import EditTask from './components/EditTask';

const currentDate = new Date().toISOString().slice(0, 10)

const fetchApi = async (url, params) => {
  const req = await fetch(url, params)
  const res = await req.json()

  return res
}

const dateConverter = (date) => {
  const originalDate = new Date(date)
  
  const year = originalDate.getFullYear()
  const month = originalDate.getMonth() + 1
  const day = originalDate.getDate()

  return `${day.toString().length > 1 ? day : `0${day}`}-${month.toString().length > 1 ? `${month}` : `0${month}`}-${year}`
}

const currentDate = () => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month.toString().length > 1 ? `${month}` : `0${month}`}-${day.toString().length > 1 ? `${day}` : `0${day}`}`
}

const getUuid = async () => {
  const res = await fetchApi('http://localhost:5000/auth/createUser', {credentials: 'include', method:'post'})
  const uuid = res.uuid

  return uuid
}

function App() {
  const [tasks, setTasks] = useState({})
  const [taskInfo, setTaskInfo] = useState({})
  const [uuid, setUuid] = useState()
  const [inputs, setInputs] = useState({})
  const [addTaskPopUp, setAddTaskPopUp] = useState(false)
  const [editTaskPopUp, setEditTaskPopUp] = useState(false)
  const newTaskNameRef = useRef('')
  const cookieCreated = useRef(false)

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
    
    setTasks(prevState => ({tasks: prevState.tasks = res.rows, tasksCount: prevState.tasksCount = res.rows.length}))
    setUuid(prevState => prevState = uuid)
  }

  useEffect(() => {
    if(cookieCreated.current) return
    cookieCreated.current = true
    fetchTasks()
  }, [])

  //handle input changes
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    setInputs(values => ({...values, [name]: value}))
    console.log(inputs);
    console.log(inputs);
  }

  //add task
  const addTask = async () => {

    const body = {
      taskName: inputs.taskName,
      dateCreated: currentDate,
      dueDate: !inputs.expireDate ? currentDate : inputs.expireDate,
      uuid: uuid
    }

    fetchApi('http://localhost:5000/task/createTask', {
      method: 'post',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    console.log(inputs);
    console.log(body.dueDate);
    console.log(body.uuid);

    await fetchTasks()
    setInputs(prevState => ({expireDate: prevState.expireDate = undefined}))
    setAddTaskPopUp(prevState => prevState = !prevState)
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
    setInputs(prevState => ({newTaskName: prevState.newTaskName = newTaskNameRef.current}))

    const body = {
      taskId: taskInfo.taskId,
      newTaskName: inputs.newTaskName,
      newDueDate: !inputs.newExpireDate ? currentDate : inputs.newExpireDate,
      uuid: uuid
    }

    fetchApi('http://localhost:5000/task/updateTask', {
      method: "put",
      credentials: "include",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    await fetchTasks()
    setInputs(prevState => ({newExpireDate: prevState.newExpireDate = undefined}))
    setEditTaskPopUp(prevState => prevState = !prevState)
  }


  return(
    <>
        <div className='d-flex flex-column justify-content-center shadow border border-1 position-relative container-md p-2'>
            <div className='d-flex flex-row justify-content-between m-2'>
              <h3>Todos ({tasks.tasksCount})</h3>
              <button className='btn btn-primary' onClick={() => {setAddTaskPopUp(prevState => prevState = !prevState)}}>Add Task</button>
            </div> 

            {addTaskPopUp &&
              <div className='d-flex justify-content-center'>
                <div className='border position-absolute' style={{width: '80%'}}>
                  <AddTask
                    submitOnClick = {() => {addTask()}} 
                    cancelOnClick = {() => {setAddTaskPopUp(prevState => prevState = !prevState)}}
                    handleChange = {handleChange} 
                  />
                </div>
              </div>
            }

            {editTaskPopUp &&
              <div className='d-flex justify-content-center'>
                <div className='border border-warning position-absolute'>
                  <EditTask
                    newTaskNameValue = {newTaskNameRef.current}
                    cancelOnClick = {() => {setEditTaskPopUp(prevState => prevState = !prevState)}}
                    editOnClick = {() => editTask()}
                    handleChange = {handleChange}
                  />
                </div>
              </div> 
            }

            <div className='d-flex flex-column gap-1 m-2'>
              {tasks.tasksCount ? tasks.tasks.map((item) => 
              <Task 
                key={item.task_id} 
                taskName={item.task_name} 
                //date={dateConverter(item.date_created)}
                dueDate={dateConverter(item.due_date)}
                deleteBtnAction={() => deleteTask(item.task_id)}
                editBtnAction={() => {
                  newTaskNameRef.current = item.task_name
                  setTaskInfo(prevState => ({taskName: prevState.taskName = item.task_name, taskId: prevState.taskName = item.task_id}))
                  setEditTaskPopUp(prevState => prevState = !prevState)
                }}
              />) : <h3 className='text-center border p-4'>No Todos</h3>}
            </div>
          </div>
    </>
  )
}

export default App
