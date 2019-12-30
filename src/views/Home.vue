<template>
  <el-container>
    <el-header>Interset Test</el-header>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="card-header clearfix">
          <span class="list-title">test title</span>
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
        <div>
          <el-table v-if="this.showTopRiskyUsers"
            :data="interset_data"
            stripe
            style="width: 100%"
            max-height="700">
            <el-table-column
              prop="risk"
              label="風險值"
              width="180">
            </el-table-column>
            <el-table-column
              prop="entityName"
              label="使用者"
              width="180">
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
const apiService = new APIService();
export default {
  name: 'home',
  components: {
    
  },
  data() {
    return {
      interset_data: [],
      showTopRiskyUsers: false,
    };
  },
  methods: {
    getTopRiskyUsers() {
      apiService.getTopRiskyUsers().then((data) => {
        console.log(data)
        this.interset_data = data.data;
      });
    },
    handleCommand(command){
      if(command === 'risky_users'){
        this.getTopRiskyUsers();
        this.showTopRiskyUsers = true;
      }
    },
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
  
  .card-header {
    text-align: left;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
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
    width: 480px;
    height: 700px;
    margin: 20px auto;
  }
  
  .el-dropdown {
    margin-left: 250px;
  }
  /* body > .el-container {
    margin-bottom: 40px;
  }
   */
  /* .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  } */
</style>