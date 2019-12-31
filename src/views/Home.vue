<template>
  <el-container>
    <el-header>Interset Test</el-header>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="card-title-div">
            <span>test title</span>
          </div>
          <div class="ts-div">
            <el-date-picker
              v-model="ts"
              type="date"
              placeholder="開始日期"
              style="width: 100%;"
              class="ts-date-picker"
              >
            </el-date-picker>
          </div>
          <div class="te-div">
            <el-date-picker
              v-model="te"
              type="date"
              placeholder="結束日期"     
              style="width: 100%;"
              class="ts-date-picker">
            </el-date-picker>
          </div>
          
          <div class="dropdown-div">
            <el-dropdown @command="handleCommand">
              <el-button type="primary">
                選擇資料<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="risky_users">Top Risky Users</el-dropdown-item>
                <el-dropdown-item command="risky_controllers">Top Risky Controllers</el-dropdown-item>
                <el-dropdown-item command="accessed_controllers">Top Accessed Controllers</el-dropdown-item>
                <el-dropdown-item command="risky_shares">Top Risky Shares</el-dropdown-item>
                <el-dropdown-item command="accessed_shares">Top Accessed Shares</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> 
          </div>
          
        </div>
        <div>
          <el-table v-if="this.showTopRiskyUsers"
            :data="interset_data"
            stripe
            style="width: 100%;"
            max-height="700">
            <el-table-column
              prop="risk"
              label="風險值"
              width="200">
            </el-table-column>
            <el-table-column
              prop="entityName"
              label="使用者"
              width="300">
            </el-table-column>
          </el-table>

          <el-table v-if="this.showTopRiskyControllers"
            :data="interset_data"
            stripe
            style="width: 100%;"
            max-height="700">
            <el-table-column
              prop="risk"
              label="風險值"
              width="200">
            </el-table-column>
            <el-table-column
              prop="entityName"
              label="使用者"
              width="300">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
// @ is an alias to /src
import {APIService} from '@/APIService.js';
import { log } from 'util';
const apiService = new APIService();
export default {
  name: 'home',
  components: {
    
  },
  data() {
    return {
      interset_data: [],
      showTopRiskyUsers: false,
      showTopRiskyControllers: false,
      ts: "",
      te: ""
    };
  },
  methods: {
    // call apiService methods
    getTopRiskyUsers(ts, te) {
      apiService.getTopRiskyUsers(ts, te).then((data) => {
        // console.log(data)
        this.interset_data = data.data;
      });
    },
    getTopRiskyControllers(ts, te) {
      apiService.getTopRiskyControllers(ts, te).then((data) => {
        // console.log(data)
        this.interset_data = data.data;
      });
    },
    // handle dropdown events
    handleCommand(command){
      if(command === 'risky_users'){
        this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te));
        this.showTopRiskyUsers = true;
        // console.log(this.getTimestamp(this.ts));
        // console.log(this.getTimestamp(this.te));        
      }else if(command === 'risky_controllers'){
        this.getTopRiskyControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te));
        this.showTopRiskyControllers = true;
      }
    },
    getTimestamp(datetime){
      return new Date(datetime).getTime();
    }
  },
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 50px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* line-height: 160px; */
  }
  
  

  .text {
    font-size: 14px;
  }


  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 600px;
    height: 700px;
    margin: 20px auto;
  }
  


  .card-title-div {
    width: 100%;
    line-height: 30px;
  }


  .ts-div {
    width: 150px;
    height: 50px;
    /* sline-height: 50px; */
    padding: 10px;
    /* border: 2px solid blue; */
    margin: 2px 5px;
    float: left;
  }

  .te-div {
    width: 150px;
    height: 50px;
    /* sline-height: 50px; */
    padding: 10px;
    /* border: 2px solid blue; */
    /* margin-top: 2px; */
    margin: 2px 5px;
    float: left;
  }

  .dropdown-div {
    /* margin-left: 200px; */
    width: 150px;
    height: 50px;
    
    padding: 10px;
    margin: 2px 5px;
    float: left;
  }
  .el-dropdown {
    width: 100%;
  }

  .el-dropdown button {
    width: 100%;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>