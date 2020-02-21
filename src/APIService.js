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

  async getUserHash(userName){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/typeAhead?count=5`;
    
    if(userName){
      url += '&text=' + userName;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getUserRisk(userHash, riskType){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/`;
    
    if(userHash){
      url += userHash + '/risk?sort=' + riskType + '&markup=true&tz=UTC%2B8';
    }
    const response = await axios.get(url);
    return response.data;
  }

  async getUserRiskGraph(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/`
    if(userHash){
      url += userHash + '/riskGraph?interval=day&tz=UTC%2B8';
    }
    if(ts && te){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
    return response.data;
  }

  async getUserWorkingHoursDaily(userHash){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/`
    if(userHash){
      url += userHash + '/workingHours/daily';
    }
    const response = await axios.get(url);
    return response.data;
  }

  async getUserWorkingHoursWeekly(userHash){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/`;
    if(userHash){
      url += userHash + '/workingHours/weekly';
    }

    const response = await axios.get(url);
    
    return response.data;
  }

  async getUserAlertsBreakdown(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/alerts/breakdown/risk?q=userid%3A`;
    if(userHash){
      url += userHash;
    }
    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getUserTopFailedLogin(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/topFailedLogin?q=userid%3A`;
    if(userHash){
      url += userHash;
    }
    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getUserTopExitProducers(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/topExitProducers?q=userid%3A`;
    if(userHash){
      url += userHash;
    }
    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getUserTopScreenCaptures(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/topScreenCaptures?q=userid%3A`;
    if(userHash){
      url += userHash;
    }
    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getUserTopViolationProducers(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/topViolationProducers?q=userid%3A`;
    if(userHash){
      url += userHash;
    }
    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    const response = await axios.get(url);
    // console.log(response);
    
    return response.data;
  }

  async getUserAlertsThreatStatistics(userHash, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/alerts?count=300&q=userid%3A`;
    if(userHash){
      url += userHash;
    }

    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    
    let response = await axios.get(url);
    let scrollId = response.data.scrollId;
    let data = response.data.data;
    let statistics = {};
    
    while(data.length != 0){
      // console.log(data);
      data.forEach(function(d, i){
        let threat = d.templates.threat;
        if(threat in statistics){
          statistics[threat] += 1;
        }else{
          statistics[threat] = 0
        }
      });

      response = await axios.get(url + '&scrollId=' + scrollId);
      data = response.data.data;
      scrollId = response.data.scrollId;
    }
    // console.log(statistics);
    return statistics;
  }

  async getMultiUserRiskGraph(userHashList, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    
    let exectionPromiseArray = [];
    for(let i=0; i<userHashList.length; i++){
      exectionPromiseArray.push(this.getUserRiskGraph(userHashList[i], ts, te));
    }
    // userHashList.forEach(function(d){
    //   exectionPromiseArray.push(getUserRiskGraph(d, ts, te))
    // });
    let re_data = [];
    await Promise.all(
      exectionPromiseArray
    ).then((values) => {
      // console.log(values);
      values.forEach(function(d, i){
        let td = d.data.map(function(dd){
          let date = new Date(dd.timestamp*1000);
          return {
            // name: userNameList[i],
            risk: dd.risk,
            date: date
          }
        })
        td.pop();
        td.shift();
        re_data.push(td);
      })
      
    })
    return re_data;
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

  async getWorkingHoursWeekly() {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/users/workingHours/weekly`;
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