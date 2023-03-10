import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Task(props){

    return(
        <div className='container border text-center p-2'>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col">
                    <h5 style={{marginBottom: "auto"}}>{props.taskName}</h5>
                </div>
                <div className="col-md">
                    <p style={{marginBottom: "auto"}}><strong>Due Date: </strong> {props.dueDate}</p>
                </div>
                <div className="col-md">
                    <div className='d-flex flex-row gap-1 justify-content-center'>
                        <button className='btn btn-primary' onClick={props.editBtnAction}>Edit</button>
                        <button className='btn btn-danger' onClick={props.deleteBtnAction}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

