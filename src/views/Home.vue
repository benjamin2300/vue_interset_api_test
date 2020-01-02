<template>
  <el-container>
    <el-header>
      <div class="site-title-div">
        Interset Test
      </div>
      <!-- <div class="pdf-generator-div">
        <el-button @click="pdfGenerate" type="info" icon="el-icon-message" circle></el-button>
      </div> -->
    </el-header>
    
    <!-- <el-button class=""type="primary" icon="el-icon-edit" circle></el-button> -->
    <el-main>
      <table id="my-table"></table>
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

          <el-table v-if="this.showTopAccessedControllers"
            :data="interset_data"
            :default-sort="{prop:'accessed', order:'descending'}"
            stripe
            style="width: 100%;"
            max-height="700">
            <el-table-column
              prop="accessed"
              label="接入次數"
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
import $ from 'jquery';

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
      showTopAccessedControllers: false,
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
    getTopAccessedControllers(ts, te){
      apiService.getTopAccessedControllers(ts, te).then((data) => {
        // console.log(data)
        this.interset_data = data;
      });
    },
    // close all table
    clearAllTables(){
      this.showTopRiskyUsers = false;
      this.showTopRiskyControllers = false;
      this.showTopAccessedControllers = false;
    },
    // handle dropdown events
    handleCommand(command){
      if(command === 'risky_users'){
        this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te));
        this.clearAllTables();
        this.showTopRiskyUsers = true;
        // console.log(this.getTimestamp(this.ts));
        // console.log(this.getTimestamp(this.te));        
      }else if(command === 'risky_controllers'){
        this.getTopRiskyControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te));
        this.clearAllTables();
        this.showTopRiskyControllers = true;
      }else if(command === 'accessed_controllers'){
        this.getTopAccessedControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te));
        this.clearAllTables();
        this.showTopAccessedControllers = true;
      }
    },
    pdfGenerate(){
      // console.log("test");
      var doc = new jsPDF();
      doc.setFont('msyh')
      //console.log(this.interset_data);
      let jspdf_table = []
      for(let i=0; i<this.interset_data.length; i++){
        jspdf_table.push([this.interset_data[i].risk, this.interset_data[i].entityName]);
      }
      console.log(jspdf_table);
      
      doc.autoTable({html: '#my-table'});
      doc.autoTable({
        theme: 'striped',
        head:[['風險值', '使用者']],
        body:jspdf_table,
        styles: {font: "msyh"}
      });
      
      doc.text(20, 20, '匯出標題');
      // doc.autoTable(columns, data, {}); 
      doc.save('test.pdf')
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

  /* .site-title-div {
    width: 100px;
    float: left;
  } */

  .pdf-generator-div {
    width: 20px;
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