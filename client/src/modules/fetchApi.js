const fetchApi = async (url, params) => {
    const req = await fetch(url, params)
    const res = await req.json()
  
    return res
}

export default fetchApi