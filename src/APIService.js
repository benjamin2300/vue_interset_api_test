import axios from 'axios';
const API_URL = 'https://192.168.100.34';

export class APIService {
  constructor(){
    
  }

  async getAllUsersList() {
    // token
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users?count=100&sortOrder=asc`;
    let response = await axios.get(url);
    // get all user name
    let allUsers = [];
    let scrollId = '';
    let data = response.data.data;
    scrollId = response.data.scrollId;

    // data.map(function(d){    
    //   return allUsers.push({name: d.entityName, id: d.entityHash});
    // })
    while(data.length != 0){
      data.map(function(d){
        return allUsers.push({name: d.entityName, id: d.entityHash});
      });
      url = `${API_URL}/api/search/0/users?count=100&sortOrder=asc`;
      url += '&scrollId=' + scrollId;
      response = await axios.get(url);
      data = response.data.data;
      scrollId = response.data.scrollId;
    }    
    return allUsers
  }



  async getUsers() {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    const url = `${API_URL}/api/search/0/users`;
    const response = await axios.get(url);
    return response.data;
  }

  async getRiskGraph(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/riskGraph?interval=day&tz=UTC%2B8`;
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getAuthenication(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/topFailedLogin?count=10`;
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    return response.data;
  }

  async getWorkingHoursDaily() {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/workingHours/daily`;
    const response = await axios.get(url);
    // console.log(response);
    return response.data;
  }




  // get top risky users
  async getTopRiskyUsers(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);    
    let url = `${API_URL}/api/search/0/users/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`;
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
    let url = `${API_URL}/api/search/0/controllers/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed controllers
  async getTopAccessedControllers(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/controllers/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    // console.log(Object.keys(response.data.data));
    let rData = [];
    let data = response.data.data;
    let keys = Object.keys(data);
    // console.log(keys);
    
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let kData = data[key]
      for(let j=0; j<kData.length; j++){
        kData[j]['accessed'] = key; 
        rData.push(kData[j]);
      }
    }
    return rData;
  }

  // get top risky projects
  async getTopRiskyProjects(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/projects/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed projects
  async getTopAccessedProjects(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/projects/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    // console.log(Object.keys(response.data.data));
    let rData = [];
    let data = response.data.data;
    let keys = Object.keys(data);
    // console.log(keys);
    
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let kData = data[key]
      for(let j=0; j<kData.length; j++){
        kData[j]['accessed'] = key; 
        rData.push(kData[j]);
      }
    }
    return rData;
  }

  // get top risky resources
  async getTopRiskyResources(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/resources/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed resources
  async getTopAccessedResources(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/resources/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    // console.log(Object.keys(response.data.data));
    let rData = [];
    let data = response.data.data;
    let keys = Object.keys(data);
    // console.log(keys);
    
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let kData = data[key]
      for(let j=0; j<kData.length; j++){
        kData[j]['accessed'] = key; 
        rData.push(kData[j]);
      }
    }
    return rData;
  }
  // get top risky shares
  async getTopRiskyShares(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/shares/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed shares
  async getTopAccessedShares(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/shares/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    // console.log(Object.keys(response.data.data));
    let rData = [];
    let data = response.data.data;
    let keys = Object.keys(data);
    // console.log(keys);
    
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let kData = data[key]
      for(let j=0; j<kData.length; j++){
        kData[j]['accessed'] = key; 
        rData.push(kData[j]);
      }
    }
    return rData;
  }
}