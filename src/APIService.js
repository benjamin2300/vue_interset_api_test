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

  // get top risky users
  async getTopRiskyUsers(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/users/topRisky?sort=maximum&markup=false&tz=UTC&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    
    const response = await axios.get(url);
    return response.data;
  }
  // get top risky controllers
  async getTopRiskyControllers(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/controllers/topRisky?sort=maximum&markup=false&tz=UTC&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    
    const response = await axios.get(url);
    return response.data;
  }
}