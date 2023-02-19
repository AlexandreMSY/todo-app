import React from 'react'

export default function AddTaskPopUp(props){
    return(
        <>
            <div className='d-flex flex-column gap-2 justify-content-center align-items-center container p-3 position-absolute border' style={{color:'black', backdropFilter: 'blur(6px)', maxWidth: '90%', height: '40vh'}}>
                <div className='d-flex gap-1'>
                    <label htmlFor="taskName">Task Name</label>
                    <input type="text" name="taskName" id="taskName" ref={props.taskNameRef}/>
                </div>
                <div className='d-flex gap-1'>
                    <button className='btn btn-danger' onClick={props.cancelAction}>Cancel</button>
                    <button className='btn btn-warning' onClick={props.submitAction}>Submit</button>
                </div>
            </div>
        </>
    )
}