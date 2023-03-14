import Task from "./Task";
import dateConverter from "../modules/dateConverter";

const TaskList = (props) => {
    const {tasks, deleteTask, editTask} = props

    return (
        <div className='d-flex flex-column gap-1 m-2'>
            {tasks.map((item) =>
                <Task
                key={item.task_id} 
                taskName={item.task_name}
                dueDate={dateConverter(item.due_date)}
                deleteBtnAction={() => deleteTask(item.task_id)}
                editBtnAction={() => editTask(
                    item.task_name, 
                    item.due_date, 
                    item.task_id
                )}
                />
            )}
        </div>
    )
}

export default TaskList