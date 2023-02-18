import React from 'react'

export default function Test(props){
    return(
        <>
            <div className='container p-3 position-absolute border' style={{color:'black', backdropFilter: 'blur(6px)', maxWidth: '70%', height: '40vh'}}>
                <div className='d-flex justify-content-center'>
                    <p>Task Name: <input type="text" name="taskName" id="taskName" ref={props.taskNameRef}/></p>
                </div>
                <div className='d-flex justify-content-center gap-1'>
                    <button className='btn btn-warning' onClick={props.submitAction}>Submit</button>
                    <button className='btn btn-danger' onClick={props.cancelAction}>Cancel</button>
                </div>
            </div>
        </>
    )
}