import axios from 'axios';
const API_URL = 'https://192.168.100.30';

export class APIService {
  constructor(){
    
  }
  async getUsers() {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    const url = `${API_URL}/api/search/0/users`;
    const response = await axios.get(url);
    return response.data;
  }

  async getTopRiskyUsers() {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    const url = `${API_URL}/api/search/0/users/topRisky?sort=maximum&markup=false&tz=UTC&count=10&keepAlive=300000`;
    const response = await axios.get(url);
    return response.data;
  }
}