import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user') || "{}")

const TOKEN = user?.accessToken || null

let API = axios.create({baseURL:'http://localhost:5000'})
// if(process.env.REACT_APP_LOCAL){
//    API = axios.create({ baseURL: `${process.env.REACT_APP_LOCAL}` })
// }else{
//    API = axios.create({ baseURL: '/api' })
// }
 
console.log(TOKEN)
API.interceptors.request.use(req => {
  if (TOKEN) {
    req.headers.Authorization = `Bearer ${TOKEN}`
  }
  return req
})

export const getUserLogin = (data:any) => API.post('/users/login', data);
export const createNewUser = (data:any) => API.post('/users/', data);


// export const postLogin = formData => API.post('/users/login/', formData)
// export const postSignup = formData => API.post('/users/', formData)
// export const fetchBlogs = () => API.get('/blogs/')
// export const fetchBlog = blogId => API.get(`/blogs/${blogId}`)
// export const postBlog = formData => API.post('/blogs/', formData)