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
    // let url = `${API_URL}/api/search/0/riskGraph?count=100&tz=UTC%2B8`
    let url = `${API_URL}/api/search/0/users/`
    if(userHash){
      url += userHash + '/riskGraph?count=100&tz=UTC%2B8';
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
    let url = `${API_URL}/api/search/0/alerts?count=2000&q=userid%3A`;
    if(userHash){
      url += userHash;
    }

    if(ts && te){
      url += "&ts=" + ts + "&te=" + te;
    }
    
    let response = await axios.get(url);
    let scrollId = response.data.scrollId;
    let data = response.data.data;
    let threat_statistics = {};
    let family_statistics = {};
    let threat_keys = [];
    let family_keys = []
    while(data.length != 0){
      // console.log(data);
      data.forEach(function(d, i){
        let threat = d.templates.threat;
        let family = d.templates.family;

        if(threat_keys.includes(threat)){
          threat_statistics[threat] += 1;
        }else{
          threat_keys.push(threat);
          threat_statistics[threat] = 0;
        }
        if(family_keys.includes(family)){
          family_statistics[family] += 1;
        }else{
          family_keys.push(family);
          family_statistics[family] = 0;
        }
      });
      // console.log(data);
      response = await axios.get(url + '&scrollId=' + scrollId);
      data = response.data.data;
      scrollId = response.data.scrollId;
      
      
    }
    let re_data = {
      threat: threat_statistics,
      family: family_statistics
    }
    return re_data;
  }

  async getUserRiskStream(userHash, ts, te){
    // get token
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;  
    let url = "";
    let risk_data = [];
       
    url = `${API_URL}/api/search/0/riskGraph/breakdown?count=100&breakdownBy=threat&includeRisk=true&tz=UTC%2B8`;
    
    if(userHash){
      url += "&q=userid%3A" + userHash;
    }
    if(ts && te){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    console.log(url);

    const response = await axios.get(url);
    let data = response.data.data;

    return data;

  }


  async getMultiUserRiskGraph(userHashList, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    
    let exectionPromiseArray = [];
    for(let i=0; i<userHashList.length; i++){
      exectionPromiseArray.push(this.getUserRiskGraph(userHashList[i], ts, te));
    }
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

  async getMultiUserAlertsBreakdown(userHashList, ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;

    let exectionPromiseArray = [];
    for(let i=0; i<userHashList.length; i++){
      exectionPromiseArray.push(this.getUserAlertsBreakdown(userHashList[i], ts, te));
    }
    let re_data = [];
    await Promise.all(
      exectionPromiseArray
    ).then((values) => {
      values.forEach(function(d, i){
        re_data.push(d.data);
      });
    });
    return re_data;
  }

  async getMultiUserWorkingHoursDaily(userHashList){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let exectionPromiseArray = [];
    for(let i=0; i<userHashList.length; i++){
      exectionPromiseArray.push(this.getUserWorkingHoursDaily(userHashList[i]));
    }
    let re_data = [];
    await Promise.all(
      exectionPromiseArray
    ).then((values) => {
      values.forEach(function(d, i){
        re_data.push(d.data);
      });
    });
    return re_data;
  }
  
  async getMultiUserWorkingHoursWeekly(userHashList){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let exectionPromiseArray = [];
    for(let i=0; i<userHashList.length; i++){
      exectionPromiseArray.push(this.getUserWorkingHoursWeekly(userHashList[i]));
    }
    let re_data = [];
    await Promise.all(
      exectionPromiseArray
    ).then((values) => {
      values.forEach(function(d, i){
        re_data.push(d.data);
      });
    });
    return re_data;
  }

  async getRiskGraph(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    let url = `${API_URL}/api/search/0/riskGraph?count=100&tz=UTC%2B8`;
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

  async getRiskStream(ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;    

    let url = `${API_URL}/api/search/0/riskGraph/breakdown?count=100&breakdownBy=threat&includeRisk=true&tz=UTC%2B8`;
    
    if(ts && te){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    
    const response = await axios.get(url);
    // console.log(response);
    return response.data;
  }

  async getTidInfo(ts, te){
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;    
    let url = `${API_URL}/api/search/0/info?`;
    if(ts && te){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    const response = await axios.get(url);
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

  // get top risky resources
  async getTopRiskyResources(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/resources/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10`
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
    let url = `${API_URL}/api/search/0/resources/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10`
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
  // get top risky Files
  async getTopRiskyFiles(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/files/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed files
  async getTopAccessedFiles(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/files/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
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

  // get top risky machines
  async getTopRiskyMachines(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/machines/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed machines
  async getTopAccessedMachines(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/machines/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
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

  // get top risky servers
  async getTopRiskyServers(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/servers/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed servers
  async getTopAccessedServers(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/servers/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
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

  // get top risky Printers
  async getTopRiskyPrinters(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/printers/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed printers
  async getTopAccessedPrinters(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/printers/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
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

  // get top risky websites
  async getTopRiskyWebsites(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/websites/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed websites
  async getTopAccessedWebsites(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/websites/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
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

  // get top risky ipaddresses
  async getTopRiskyIPAddresses(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/ips/topRisky?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
    if((ts!==0) && (te!==0)){
      url = url + '&ts=' + ts + '&te=' + te;
    }
    // console.log(url);
    
    const response = await axios.get(url);
    return response.data;
  }

  // get top accessed ipaddresses
  async getTopAccessedIPAddresses(ts, te) {
    let token = localStorage.getItem("interset_token");
    axios.defaults.headers.common['Authorization'] = token;
    // console.log(ts);
    let url = `${API_URL}/api/search/0/ips/topAccessed?sort=maximum&markup=false&tz=UTC%2B8&count=10&keepAlive=300000`
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