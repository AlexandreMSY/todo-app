class TasksCrud{

    static async #fetcher(url, options){
        const request = await fetch(url, options)
        const response = await request.json()

        return response
    }

    static async getTasks(uuid, taskName, afterDate, beforeDate){
        //console.log('uuid ' + uuid)
        let url = `http://localhost:5000/task/alltasks?uuid=${uuid}`
        let taskNameNoSpaces = String(taskName).replace(" ", "+")

        if(taskName && (afterDate || beforeDate)){
            url = url + `&${afterDate ? `afterdate=${afterDate}` : `beforedate=${beforeDate}`}&taskname=${taskNameNoSpaces}`
        }else if(!taskName && (afterDate || beforeDate)){
            url = url + `&${afterDate ? `afterdate=${afterDate}` : `beforedate=${beforeDate}`}`
        }else if(taskName && (!afterDate || !beforeDate)){
            url = url + `&taskname=${taskNameNoSpaces}`
        }

        const tasksFound = await this.#fetcher(url)

        return await tasksFound.rows
    }

    static async createTask(uuid, taskName, dateCreated){
        const taskBody = {
            taskName: taskName,
            dateCreated: dateCreated,
            uuid: uuid
        }

        const request = this.#fetcher('http://localhost:5000/task/createTask', {
            method: "post",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskBody)
        })

        return await request
    }

    static async deleteTask(uuid, taskId){
        const deleteTaskBody = {
            uuid: uuid,
            taskid: taskId
        }

        const request = this.#fetcher('http://localhost:5000/task/deleteTask', {
            method: "delete",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteTaskBody)
        })

        return await request
    }


}

export default TasksCrud