import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddTaskPopUp(props){
    return(
        <>
            <div className='column-gap-3 p-4 border shadow container' style={{backgroundColor: 'white'}}>
                <div className='column'>
                    <div className="col">
                        <div className='d-flex flex-column'>
                            <label htmlFor="taskName"><h5>Task Name</h5></label>
                            <input type="text" name="taskName" id="taskName" onChange={props.handleChange}/>
                        </div>
                    </div>
                    <div className="col mt-2">
                        <div className='d-flex flex-column'>
                            <label htmlFor="date"><h5>Date</h5></label>
                            <input type="date" name="expireDate" id="expireDate" className='text-center' onChange={props.handleChange}/>
                        </div>
                    </div>
                    <div className="col mt-2">
                        <div className='d-flex justify-content-center gap-2 flex-row mt-2'>
                            <button className='btn btn-danger' onClick={props.cancelOnClick}>Cancel</button>
                            <button className='btn btn-primary' onClick={props.submitOnClick}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}