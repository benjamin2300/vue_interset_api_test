<template>
  <el-container>
    <el-header>Interset報表產生器</el-header>
    <el-main>
      <table id="my-table"></table>
      <!-- <el-date-picker
        v-model="formData.ts"
        type="date"
        placeholder="開始日期"
        class="ts-date-picker"
        >
      </el-date-picker>
      <el-date-picker
        v-model="formData.te"
        type="date"
        placeholder="結束日期"
        class="te-date-picker"
        >
      </el-date-picker> -->
      <div id="form-div">
        <el-form ref="form" :model="formData" >
          <el-form-item label="報表種類" prop="type">
            <el-radio-group class="report-type" v-model="formData.formType">
              <el-radio label="year">年報</el-radio>
              <el-radio label="season">季報</el-radio>
              <el-radio label="month">月報</el-radio>
              <el-radio label="custom">客製化時間</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="時間範圍">
            <div style="display:inline-block; margin-left:40px;">
            <el-date-picker
            v-model="formData.year"
            type="year"
            placeholder="選擇年"
            v-show='formData.formType === "year"'>
            </el-date-picker>
            <el-date-picker
            v-model="formData.month"
            type="month"
            placeholder="選擇月"
            v-show='formData.formType === "month"'>
            </el-date-picker>
            <el-date-picker
            style="margin-right:25px;"
            v-model="formData.season_year"
            type="year"
            placeholder="選擇年"
            v-show='formData.formType === "season"'>
            </el-date-picker>
            <!-- <el-dropdown v-show='formData.formType === "season"'>
              <el-button type="primary">
                選擇季度<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Q1(1月～3月)</el-dropdown-item>
                <el-dropdown-item>Q2(4月～6月)</el-dropdown-item>
                <el-dropdown-item>Q3(7月～9月)</el-dropdown-item>
                <el-dropdown-item>Q4(10月～12月)</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-select v-show='formData.formType === "season"' v-model="formData.season_q" placeholder="请选择" class="season-q-select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="formData.daterange"
              v-show='formData.formType === "custom"'
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              >
            </el-date-picker>
            </div>
          </el-form-item>
          
          <div class="transfer-div">
            <div class="transfer-label"><span>選擇內容</span></div>
            <div class="transfer-body">
              <el-transfer 
                v-model="formData.content" 
                :data="formData.transferData"
                :titles="['可選擇項目', '已選擇的項目']" 
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                :left-default-checked="[0,1,2,3,4,5,11,12,13]"
                >
              </el-transfer>
            </div>
          </div> 
          
          <div class="pdf-generate-button-div">
            <PDFGenerator :formData="formData" />
          </div>
          

        </el-form>
      </div>

      
      <!-- <el-tooltip effect="dark" content="PDF報表產生" placement="top-start">
        <el-button @click="pdfGenerate" type="primary" icon="el-icon-files" circle></el-button>
      </el-tooltip> -->


      <!-- <el-tooltip effect="dark" content="html報表產生" placement="top-start">
        <el-button @click="htmlGenerate" type="primary" icon="el-icon-files" circle></el-button>
      </el-tooltip> -->
      
      <div id="chart"></div>
      <div id="div-canvas"><canvas id="canvas" width="500" height="500"></canvas></div>
      
    </el-main>
</el-container>
</template>

<script>
import {APIService} from '@/APIService.js';
import PDFGenerator from '@/components/PDFGenerator'

// import { log } from 'util';
import $ from 'jquery';
const apiService = new APIService();

export default {
  name: 'intersetReporting',
  components:{
    PDFGenerator
  },
  data(){
    const generateTransferData = _ => {
      const data = [];
      const data_type = ["使用者", "控制器", "專案", "資源", "分享資源"];
      for (let i = 0; i < data_type.length; i++) {
        data.push({
          key: i,
          label: data_type[i]
        });
      }
      const other_data = ["整體風險值", "登入成功/失敗", "日工作時數分布"]
      for(let i=0; i<other_data.length; i++){
        data.push({
          key: 11 + i,
          label: other_data[i]
        });
      }
      return data;
    };
    return{
      formData: {
        formType: "year",
        year:"",
        month:"",
        season_year:"",
        season_q:"",
        daterange:"",
        content: [],
        transferData: generateTransferData(),
      },
      body: "",
      options: [{
        value: 'Q1',
        label: 'Q1(1月～3月)'
      }, {
        value: 'Q2',
        label: 'Q2(4月～6月)'
      }, {
        value: 'Q3',
        label: 'Q3(7月～9月)'
      }, {
        value: 'Q4',
        label: 'Q4(10月～12月)'
      }],
    };
  },
  methods: {

  //   htmlGenerate(){
  //     this.body = "";
  //     let filename = "test.html";
  //     let text = "";
  //     let all_start = '<!DOCTYPE html><html lang="en">';
  //     let head_start = "<head>";
  //     let head = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">';
  //     let head_end = "</head>"
  //     let title = '<title>html test report</title>';
  //     let body_start = '<body>';
  //     let body_end = '</body>';
  //     // let body = '';
  //     let all_end = '</html>';

  //     Promise.all([this.getTopRiskyUsers(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopRiskyControllers(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopAccessedControllers(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopRiskyProjects(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopAccessedProjects(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopRiskyResources(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopAccessedResources(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopRiskyShares(this.ts.getTime(), this.te.getTime()),
  //                  this.getTopAccessedShares(this.ts.getTime(), this.te.getTime()),
  //                  this.getRiskGraph(this.ts.getTime(), this.te.getTime())
  //                 ])
  //            .then((values) =>   
  //     {
  //       this.htmlAddH1("Interset總體報表");
  //       let month = [1,2,3,4,5,6,7,8,9,10,11,12]
      
      
      
      
  //       let new_ts = new Date(this.ts);
  //       let new_te = new Date(this.te);

  //       let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
  //                        + " 到 " + 
  //                        new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate(); 
  //       this.htmlAddH2(date_range);
  //       this.htmlAddHr();
  //       // ===========================
  //       // top risky user page
  //       // ===========================
  //       let data = values[0].data;
  //       if(data.length != 0){
  //         this.htmlAddH2("風險最高的使用者");
  //         this.htmlAddTable('user', 'risk', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top risky controller page
  //       // ===========================
  //       data = values[1].data;
  //       if(data.length != 0){
  //         this.htmlAddH2("風險最高的控制器");
  //         this.htmlAddTable('controller', 'risk', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top accessed controller page
  //       // ===========================
  //       data = values[2];
  //       if(data.length != 0){
  //         this.htmlAddH2("接入次數最高的控制器");
  //         this.htmlAddTable('controller', 'access', data);
  //         this.htmlAddChart('controller', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top risky project page
  //       // ===========================
  //       data = values[3].data;
  //       if(data.length != 0){
  //         this.htmlAddH2("風險最高的專案");
  //         this.htmlAddTable('project', 'risk', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top accessed project page
  //       // ===========================
  //       data = values[4];
  //       if(data.length != 0){
  //         this.htmlAddH2("接入次數最高的專案");
  //         this.htmlAddTable('project', 'access', data);
  //         this.htmlAddChart('project', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top risky resource page
  //       // ===========================
  //       data = values[5].data;
  //       if(data.length != 0){
  //         this.htmlAddH2("風險最高的資源");
  //         this.htmlAddTable('resource', 'risk', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top accessed resource page
  //       // ===========================
  //       data = values[6];
  //       if(data.length != 0){
  //         this.htmlAddH2("接入次數最高的資源");
  //         this.htmlAddTable('resource', 'access', data);
  //         this.htmlAddChart('resource', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top risky share page
  //       // ===========================
  //       data = values[7].data;
  //       if(data.length != 0){
  //         this.htmlAddH2("風險最高的分享資源");
  //         this.htmlAddTable('share', 'risk', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // top accessed share page
  //       // ===========================
  //       data = values[8];
  //       if(data.length != 0){
  //         this.htmlAddH2("接入次數最高的分享資源");
  //         this.htmlAddTable('share', 'access', data);
  //         this.htmlAddChart('share', data);
  //         this.htmlAddHr();  
  //       }
  //       // ===========================
  //       // risk graph page
  //       // ===========================
  //       data = values[9].data;
  //       if(data.length != 0){
  //         this.htmlAddH2("總體風險值變化");
  //         this.htmlAddLineChart(data);
  //         this.htmlAddHr();  
  //       }


  //       text = all_start + 
  //            head_start + head + title + head_start +
  //            body_start + this.body + body_end + 
  //            all_end;
  //       this.download(filename, text);
  //     });
      
  //   },
  //   htmlAddH1(text){
  //     this.body += '<h1>' + text +'</h1>';
  //   },
  //   htmlAddH2(text){
  //     this.body += '<h2>' + text + '</h2>';
  //   },
  //   htmlAddP(text){
  //     this.body += '<p>' + text + '</p>'
  //   },
  //   htmlAddHr(){
  //     this.body += '<hr>';
  //   },
  //   htmlAddTable(entityType, tableType, data){
  //     let entityTypeHeader = "";
  //     let tableTypeHeader = "";
  //     if(entityType == 'user'){
  //       entityTypeHeader = "使用者";
  //     }else if(entityType == 'controller'){
  //       entityTypeHeader = "控制器";
  //     }else if(entityType == 'project'){
  //       entityTypeHeader = "專案";
  //     }else if(entityType == 'resource'){
  //       entityTypeHeader = "資源";
  //     }


  //     if(tableType == "risk"){
  //       tableTypeHeader = "風險值";
  //     }else if (tableType == "access"){
  //       tableTypeHeader = "接入次數";
  //     }
  //     this.body += '<table width="500" border="1"><tr><th>' + tableTypeHeader +'</th>'
  //                + '<th>' + entityTypeHeader + '</th></tr>';
  //     let jspdf_table = [];
  //     if(tableType == "risk"){
  //       for(let i=0; i<data.length; i++){
  //         jspdf_table.push([data[i].risk, data[i].entityName]);
  //       }
  //     }else if(tableType == "access"){
  //       for(let i=data.length-1; i>=0; i--){
  //         jspdf_table.push([data[i].accessed, data[i].entityName]);
  //       }
  //     }
  //     for(let i=0; i<jspdf_table.length; i++){
  //       this.body += '<tr><td>' + jspdf_table[i][0] + '</td><td>' + jspdf_table[i][1] + '</td></tr>'
  //     }
  //     this.body += '</table>';
  //   },
  //   htmlAddChart(entityType, data){
  //     $('#chart').empty();
  //     $('#canvas').empty();
  //     let margin = {top: 20, right: 20, bottom: 70, left: 40};
  //     let chart_width = 500 - margin.right - margin.left;
  //     let chart_height = 400 - margin.top - margin.bottom;
  //     let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
  //     let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);
  //     let svg = d3.select("#chart")
  //               .append("svg")
  //               .attr("width", chart_width + margin.right + margin.left)
  //               .attr("height", chart_height + margin.top + margin.bottom)
  //               .append("g")
  //               .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  //     x_scale.domain(data.map(function(d){return d.entityName;}));          
  //     y_scale.domain([0, d3.max(data, function(d){return +d.accessed;})]);
  //     svg.append("g")
  //         .attr("class", "x-axis")
  //         .style('color', 'black')
  //         .attr("transform", "translate(0, " + chart_height + ")")
  //         .call(d3.axisBottom(x_scale))
  //         .selectAll("text")
  //         .style("text-anchor", "end")
  //         .attr("dx", "-.8em")
  //         .attr("dy", "-.55em")
  //         .attr("transform", "rotate(-90)");

  //     svg.append("g")
  //         .style('color', 'black')
  //         .attr("class", "y-axis")
  //         .call(d3.axisLeft(y_scale));

  //     svg.selectAll("rect")
  //         .data(data)
  //         .enter()
  //         .append("rect")
  //         .attr("x", function(d){return x_scale(d.entityName);})
  //         .attr("width", x_scale.bandwidth())
  //         .attr("y", function(d){return y_scale(d.accessed);})
  //         .attr("height", function(d){return chart_height - y_scale(d.accessed);})
  //         .attr("fill", "#0066ff");

  //       svg.selectAll("text.bar-label")
  //         .data(data)
  //         .enter()
  //         .append("text")
  //         .attr("class", "bar-label")
  //         .text(function(d){
  //           return d.accessed;
  //         })
  //         .attr("x", function(d, i){
  //           return x_scale(d.entityName) + x_scale.bandwidth() / 2;
  //         })
  //         .attr("y", function(d, i){
  //           return y_scale(d.accessed) + 15;
  //         })
  //         .attr("font-size", 14)
  //         .attr("fill", "#fff")
  //         .attr("text-anchor", "middle");

  //     let canvas = document.getElementById('canvas');
  //     let context = canvas.getContext('2d');
  //     context.clearRect(0, 0, canvas.width, canvas.height);

  //     let firstSvg = $('#chart');
  //     let content = $(firstSvg).html();
  //     // console.log(content);
      
  //     context.drawSvg(content);
  //     let imgData = canvas.toDataURL('image/png');

  //     this.body += '<img src="' + imgData + '" width:"300" height:"200">' ;
  //   },
  //   htmlAddLineChart(data){

  //     $('#chart').empty();
  //     $('#canvas').empty();
  //     // 
  //     let time_format = d3.timeFormat('%Y/%m/%d');
  //     let time_parse = d3.timeParse('%Y-%m-%dT%H:%M:%S%Z[UTC%Z]');
  //     data = data.map(function(d){ return {date: time_parse(d.timestampStr), risk: d.risk};});
  //     data.pop();
  //     data.shift();
  //     // console.log(data);
  //     let margin = {top: 20, right: 20, bottom: 70, left: 40};
  //     let chart_width = 500 ;
  //     let chart_height = 350 ;
  //     // scale
  //     let x_scale = d3.scaleTime()
  //         .domain([
  //           d3.min(data, function(d){
  //             return d.date;
  //           }),
  //           d3.max(data, function(d){
  //             return d.date;
  //           })
  //         ])
  //         .range([margin.left, chart_width - margin.right]);
  //     // console.log(data[0].date);
      
  //     // console.log(x_scale(data[0].date));
      
  //     let y_scale = d3.scaleLinear()
  //         .domain([
  //           0, d3.max(data, function(d){
  //             return d.risk;
  //           })
  //         ])
  //         .range([chart_height - margin.bottom, margin.top]);

  //     let svg = d3.select("#chart")
  //         .append("svg")
  //         .attr("width", chart_width)
  //         .attr("height", chart_height);
      
  //     let x_axis = d3.axisBottom(x_scale)
  //         .ticks(5)
  //         .tickFormat(time_format);
      
  //     let y_axis = d3.axisLeft(y_scale)
  //         .ticks(10);

  //     svg.append("g")
  //         .style('color', 'black')
  //         .attr("transform", "translate(0, " + (chart_height - margin.bottom) + ")")
  //         .call(x_axis);
      
  //     svg.append("g")
  //         .style('color', 'black')
  //         .attr("transform", "translate(" + margin.left + ", 0)")
  //         .call(y_axis);
      
  //     // Create Line
  //     var line = d3.line()
  //         .defined(function(d){
  //           return d.risk >= 0;
  //         })
  //         .x(function(d){
  //           // console.log(x_scale(d.date));
            
  //           return x_scale(d.date);
  //         })
  //         .y(function(d){
  //           return y_scale(d.risk);
  //         });
      
  //     svg.append( 'path' )
  //       .datum( data )
  //       .attr( 'fill', 'none' )
  //       .attr( 'stroke', '#73FF36')
  //       .attr( 'stroke-width', 3)
  //       .attr( 'd', line );

  //     let canvas = document.getElementById('canvas');
  //     let context = canvas.getContext('2d');
  //     context.clearRect(0, 0, canvas.width, canvas.height);

  //     let firstSvg = $('#chart');
  //     let content = $(firstSvg).html();
  //     // console.log(content);
        
  //     context.drawSvg(content);
  //     let imgData = canvas.toDataURL('image/png');
  //     this.body += '<img src="' + imgData + '" width:"300" height:"200">' ;

  //   },
  //   download(filename, text) {
  //     var element = document.createElement('a');
  //     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  //     element.setAttribute('download', filename);

  //     element.style.display = 'none';
  //     document.body.appendChild(element);

  //     element.click();

  //     document.body.removeChild(element);
  //   },
  //   getTimestamp(datetime){
  //     return datetime.getTime();
  //   }
  // }
  },
  mounted(){
    $(".el-transfer-panel__empty").text("無資料");
  }
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
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    /* line-height: 160px; */
  }

  /* .el-form-item {
    text-align: left;
    float: left;
  } */

  #form-div{
    width: 700px;
    height: 500px;
    margin: 30px auto;
    padding: 10px;
    border: 3px solid lightgray;
    border-radius: 10px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 40px;
    padding-left: 20px;
    margin: auto;
    /* font-family: Arial, "新細明體"; */

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
  .transfer-label {
    display: inline-block;
  }
  .transfer-body {
    display: inline-block;
    margin-left: 40px;
  } 

  .pdf-generate-button-div {
    text-align: left;
    margin-top: 30px;
  }
  .season-q-select {
    /* width: 30px; */
  }
</style>