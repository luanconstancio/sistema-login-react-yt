import axios from 'axios';


export default class UserService {
  constructor () {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_LOGIN
    })
  }

  async login (dados) {
    const credetion = btoa(`${dados.email}:${dados.password}`);
    const {data} = await this.axios.get('/login',  { headers: {
      Authorization: "Basic" + credetion 
      } }) 

    if (data) {
      localStorage.setItem("nome", data.user.nome)
      localStorage.setItem("email", data.user.email)
      localStorage.setItem("token", data.token.token)

      return true
    }

    return
  }

  async cadastrar (dados) {
    console.log(dados)
    return this.axios.post('/user', dados)

  }

  usuarioAutenticado () {
    return localStorage.getItem("token") !== undefined ? true : false
    // return typeof localStorage.getItem("token")
  }

  //Desafio ---> implemente um botão que chama essa função dentro da página Home
  async logout () {
    localStorage.removeItem("token")
    localStorage.removeItem("nome")
    localStorage.removeItem("email")
  }
}