<template>
  <el-container>
    <el-header>Interset報表產生器</el-header>
    <el-container>
      <el-aside width="220px">
        <el-menu 
          router 
          :default-active="$route.path" 
          :default-openeds="['1']"
          text-color="#fff"
          >
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>報表產生</template>
            <el-menu-item index="/report/organization">
              <i class="el-icon-school"></i><span>總體報表</span>
            </el-menu-item>
            <el-menu-item index="/report/single-user">
              <i class="el-icon-user"></i><span>單一使用者報表</span>
            </el-menu-item>
            <el-menu-item index="/report/multi-user">
              <i class="el-icon-user-solid"></i><span>多個使用者報表</span> 
            </el-menu-item>
            <!-- <el-menu-item-group v-for="menuItem in menuList" :key="menuItem.name">
              <router-link :to="menuItem.path">
                <el-menu-item
                :index="menuItem.name"
                >
                  <span>{{menuItem.meta.title}}</span>
                </el-menu-item>
              </router-link> -->

              <!-- <el-menu-item index="1-1">總體報表</el-menu-item>
              <el-menu-item index="1-2">單一使用者報表</el-menu-item>
              <el-menu-item index="1-3">多個使用者報表</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item-group>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">調修建議</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main>
        <table id="my-table"></table>
        
        <!-- <el-tooltip effect="dark" content="PDF報表產生" placement="top-start">
          <el-button @click="pdfGenerate" type="primary" icon="el-icon-files" circle></el-button>
        </el-tooltip> -->


        <!-- <el-tooltip effect="dark" content="html報表產生" placement="top-start">
          <el-button @click="htmlGenerate" type="primary" icon="el-icon-files" circle></el-button>
        </el-tooltip> -->
        <router-view></router-view>

        <div id="chart"></div>
        <div id="div-canvas"><canvas id="canvas" width="500" height="500"></canvas></div>
      </el-main>
      
    </el-container>

</el-container>
</template>

<script>
import {APIService} from '@/APIService.js';
// import OrganiztionReportForm from '@/components/OrganizationReportForm.vue'

// import { log } from 'util';
import $ from 'jquery';
const apiService = new APIService();

export default {
  name: 'home',
  // components:{
  //   OrganiztionReportForm
  // },

  computed:{
    menuList(){
      return this.$router.options.routes[0].children;
    }
  },
  
  methods: {

    htmlGenerate(){
      this.body = "";
      let filename = "test.html";
      let text = "";
      let all_start = '<!DOCTYPE html><html lang="en">';
      let head_start = "<head>";
      let head = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">';
      let head_end = "</head>"
      let title = '<title>html test report</title>';
      let body_start = '<body>';
      let body_end = '</body>';
      // let body = '';
      let all_end = '</html>';

      Promise.all([this.getTopRiskyUsers(this.ts.getTime(), this.te.getTime()),
                   this.getTopRiskyControllers(this.ts.getTime(), this.te.getTime()),
                   this.getTopAccessedControllers(this.ts.getTime(), this.te.getTime()),
                   this.getTopRiskyProjects(this.ts.getTime(), this.te.getTime()),
                   this.getTopAccessedProjects(this.ts.getTime(), this.te.getTime()),
                   this.getTopRiskyResources(this.ts.getTime(), this.te.getTime()),
                   this.getTopAccessedResources(this.ts.getTime(), this.te.getTime()),
                   this.getTopRiskyShares(this.ts.getTime(), this.te.getTime()),
                   this.getTopAccessedShares(this.ts.getTime(), this.te.getTime()),
                   this.getRiskGraph(this.ts.getTime(), this.te.getTime())
                  ])
             .then((values) =>   
      {
        this.htmlAddH1("Interset總體報表");
        let month = [1,2,3,4,5,6,7,8,9,10,11,12]
      
      
      
      
        let new_ts = new Date(this.ts);
        let new_te = new Date(this.te);

        let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
                         + " 到 " + 
                         new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate(); 
        this.htmlAddH2(date_range);
        this.htmlAddHr();
        // ===========================
        // top risky user page
        // ===========================
        let data = values[0].data;
        if(data.length != 0){
          this.htmlAddH2("風險最高的使用者");
          this.htmlAddTable('user', 'risk', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top risky controller page
        // ===========================
        data = values[1].data;
        if(data.length != 0){
          this.htmlAddH2("風險最高的控制器");
          this.htmlAddTable('controller', 'risk', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top accessed controller page
        // ===========================
        data = values[2];
        if(data.length != 0){
          this.htmlAddH2("接入次數最高的控制器");
          this.htmlAddTable('controller', 'access', data);
          this.htmlAddChart('controller', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top risky project page
        // ===========================
        data = values[3].data;
        if(data.length != 0){
          this.htmlAddH2("風險最高的專案");
          this.htmlAddTable('project', 'risk', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top accessed project page
        // ===========================
        data = values[4];
        if(data.length != 0){
          this.htmlAddH2("接入次數最高的專案");
          this.htmlAddTable('project', 'access', data);
          this.htmlAddChart('project', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top risky resource page
        // ===========================
        data = values[5].data;
        if(data.length != 0){
          this.htmlAddH2("風險最高的資源");
          this.htmlAddTable('resource', 'risk', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top accessed resource page
        // ===========================
        data = values[6];
        if(data.length != 0){
          this.htmlAddH2("接入次數最高的資源");
          this.htmlAddTable('resource', 'access', data);
          this.htmlAddChart('resource', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top risky share page
        // ===========================
        data = values[7].data;
        if(data.length != 0){
          this.htmlAddH2("風險最高的分享資源");
          this.htmlAddTable('share', 'risk', data);
          this.htmlAddHr();  
        }
        // ===========================
        // top accessed share page
        // ===========================
        data = values[8];
        if(data.length != 0){
          this.htmlAddH2("接入次數最高的分享資源");
          this.htmlAddTable('share', 'access', data);
          this.htmlAddChart('share', data);
          this.htmlAddHr();  
        }
        // ===========================
        // risk graph page
        // ===========================
        data = values[9].data;
        if(data.length != 0){
          this.htmlAddH2("總體風險值變化");
          this.htmlAddLineChart(data);
          this.htmlAddHr();  
        }


        text = all_start + 
             head_start + head + title + head_start +
             body_start + this.body + body_end + 
             all_end;
        this.download(filename, text);
      });
      
    },
    htmlAddH1(text){
      this.body += '<h1>' + text +'</h1>';
    },
    htmlAddH2(text){
      this.body += '<h2>' + text + '</h2>';
    },
    htmlAddP(text){
      this.body += '<p>' + text + '</p>'
    },
    htmlAddHr(){
      this.body += '<hr>';
    },
    htmlAddTable(entityType, tableType, data){
      let entityTypeHeader = "";
      let tableTypeHeader = "";
      if(entityType == 'user'){
        entityTypeHeader = "使用者";
      }else if(entityType == 'controller'){
        entityTypeHeader = "控制器";
      }else if(entityType == 'project'){
        entityTypeHeader = "專案";
      }else if(entityType == 'resource'){
        entityTypeHeader = "資源";
      }


      if(tableType == "risk"){
        tableTypeHeader = "風險值";
      }else if (tableType == "access"){
        tableTypeHeader = "接入次數";
      }
      this.body += '<table width="500" border="1"><tr><th>' + tableTypeHeader +'</th>'
                 + '<th>' + entityTypeHeader + '</th></tr>';
      let jspdf_table = [];
      if(tableType == "risk"){
        for(let i=0; i<data.length; i++){
          jspdf_table.push([data[i].risk, data[i].entityName]);
        }
      }else if(tableType == "access"){
        for(let i=data.length-1; i>=0; i--){
          jspdf_table.push([data[i].accessed, data[i].entityName]);
        }
      }
      for(let i=0; i<jspdf_table.length; i++){
        this.body += '<tr><td>' + jspdf_table[i][0] + '</td><td>' + jspdf_table[i][1] + '</td></tr>'
      }
      this.body += '</table>';
    },
    htmlAddChart(entityType, data){
      $('#chart').empty();
      $('#canvas').empty();
      let margin = {top: 20, right: 20, bottom: 70, left: 40};
      let chart_width = 500 - margin.right - margin.left;
      let chart_height = 400 - margin.top - margin.bottom;
      let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
      let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);
      let svg = d3.select("#chart")
                .append("svg")
                .attr("width", chart_width + margin.right + margin.left)
                .attr("height", chart_height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      x_scale.domain(data.map(function(d){return d.entityName;}));          
      y_scale.domain([0, d3.max(data, function(d){return +d.accessed;})]);
      svg.append("g")
          .attr("class", "x-axis")
          .style('color', 'black')
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(d3.axisBottom(x_scale))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

      svg.append("g")
          .style('color', 'black')
          .attr("class", "y-axis")
          .call(d3.axisLeft(y_scale));

      svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", function(d){return x_scale(d.entityName);})
          .attr("width", x_scale.bandwidth())
          .attr("y", function(d){return y_scale(d.accessed);})
          .attr("height", function(d){return chart_height - y_scale(d.accessed);})
          .attr("fill", "#0066ff");

        svg.selectAll("text.bar-label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bar-label")
          .text(function(d){
            return d.accessed;
          })
          .attr("x", function(d, i){
            return x_scale(d.entityName) + x_scale.bandwidth() / 2;
          })
          .attr("y", function(d, i){
            return y_scale(d.accessed) + 15;
          })
          .attr("font-size", 14)
          .attr("fill", "#fff")
          .attr("text-anchor", "middle");

      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
      
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');

      this.body += '<img src="' + imgData + '" width:"300" height:"200">' ;
    },
    htmlAddLineChart(data){

      $('#chart').empty();
      $('#canvas').empty();
      // 
      let time_format = d3.timeFormat('%Y/%m/%d');
      let time_parse = d3.timeParse('%Y-%m-%dT%H:%M:%S%Z[UTC%Z]');
      data = data.map(function(d){ return {date: time_parse(d.timestampStr), risk: d.risk};});
      data.pop();
      data.shift();
      // console.log(data);
      let margin = {top: 20, right: 20, bottom: 70, left: 40};
      let chart_width = 500 ;
      let chart_height = 350 ;
      // scale
      let x_scale = d3.scaleTime()
          .domain([
            d3.min(data, function(d){
              return d.date;
            }),
            d3.max(data, function(d){
              return d.date;
            })
          ])
          .range([margin.left, chart_width - margin.right]);
      // console.log(data[0].date);
      
      // console.log(x_scale(data[0].date));
      
      let y_scale = d3.scaleLinear()
          .domain([
            0, d3.max(data, function(d){
              return d.risk;
            })
          ])
          .range([chart_height - margin.bottom, margin.top]);

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width)
          .attr("height", chart_height);
      
      let x_axis = d3.axisBottom(x_scale)
          .ticks(5)
          .tickFormat(time_format);
      
      let y_axis = d3.axisLeft(y_scale)
          .ticks(10);

      svg.append("g")
          .style('color', 'black')
          .attr("transform", "translate(0, " + (chart_height - margin.bottom) + ")")
          .call(x_axis);
      
      svg.append("g")
          .style('color', 'black')
          .attr("transform", "translate(" + margin.left + ", 0)")
          .call(y_axis);
      
      // Create Line
      var line = d3.line()
          .defined(function(d){
            return d.risk >= 0;
          })
          .x(function(d){
            // console.log(x_scale(d.date));
            
            return x_scale(d.date);
          })
          .y(function(d){
            return y_scale(d.risk);
          });
      
      svg.append( 'path' )
        .datum( data )
        .attr( 'fill', 'none' )
        .attr( 'stroke', '#73FF36')
        .attr( 'stroke-width', 3)
        .attr( 'd', line );

      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      this.body += '<img src="' + imgData + '" width:"300" height:"200">' ;

    },
    download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    getTimestamp(datetime){
      return datetime.getTime();
    }
  }
}

</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: left;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #304156;
    /* color:#ffffff; */
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 1000px;
    /* line-height: 160px; */
  }

  
  .el-menu {
    background-color: #304156;
    border-right: none;
  }

  .el-menu-item {
    background-color: #304156;
  }
  
  .el-submenu > ul .el-menu-item {
    background-color: #263445;
  }

  .el-submenu > ul .el-menu-item:hover {
    background-color: #1e2a37;
  }

  .el-menu-item:hover {
    background-color: #263445;
  }
  
  /* #form-div{
    width: 700px;
    height: 500px;
    margin: 30px 20px;
    padding: 10px;
    border: 3px solid lightgray;
    border-radius: 10px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 40px;
    padding-left: 20px;
    font-family: Arial, "新細明體";
  } */
  
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

  .te-date-picker {
    margin: 10px;
  }
  /* #chart {
    width: 800px;
    height: 800px;
    background-color: #f7f7f7;
    margin: 10px auto;
  } */
  #chart {
    display: none;
  } 
   #div-canvas {
    display: none;
  } 

  .report-type {
    display: flex-start;
    justify-content: center;
    /* margin-top: 14px; */
    margin-left: 40px;
  }

  .date-picker {
    margin-left: 40px;
  }
  /* .transfer-div{
    display:flex;
  } */


  .pdf-generate-button-div {
    text-align: left;
    margin-top: 30px;
  }
  .season-q-select {
    /* width: 30px; */
  }
</style>

<style>
  .el-submenu__title:hover {
    background-color: #223449 !important;
  }
</style>