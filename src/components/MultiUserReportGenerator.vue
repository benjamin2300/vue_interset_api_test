<template>
  <div>
      <p :class="{ pHidden: !noData, pShow: noData }">please select at least one item.</p>
      <el-tooltip effect="dark" content="PDF報表產生" placement="top-start">
       <el-button @click="pdfGenerate" type="primary">產生pdf報表</el-button>
      </el-tooltip>
  </div>
  
</template>

<script>
import {APIService} from '@/APIService.js';
// import { log } from 'util';
import $ from 'jquery';

const apiService = new APIService();

export default {
  name: "MultiUserReportGenerator",
  data(){
    return {
      noData: false, 
      ts: "",
      te: "",
      userNameList: [],
      userHashList: [],
    }
  },
  props: {
    formData: {
      type: Object
    },
  },
  methods: {
    generatePDFMultiRiskGraph(doc, data, userNameList){
      // console.log(data);
      $('#chart').empty();
      $('#canvas').empty();
      // console.log(data);
      
      
      let time_format = d3.timeFormat('%m/%d');
      let time_parse = d3.timeParse('%Y-%m-%dT%H:%M:%S%Z[UTC%Z]');

      // data.pop();
      // data.shift();
      let margin = {top: 30, right: 150, bottom: 30, left: 60};
      let chart_width = 800 - margin.left - margin.right ;
      let chart_height = 350 -margin.top - margin.bottom;

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // layer
      svg.append("g")
          .attr("class", "lines");

      svg.append("g")
          .attr("class", "x-axis");
      
      svg.append("g")
          .attr("class", "y-axis");

      svg.append("g")
          .attr("class", "legends")
      
      let x_scale = d3.scaleTime()
          // .domain(d3.extent(data, function(d) { return d.date; }))
          .domain([
            d3.min(data, function(d){
                return d3.min(d, function(dd){
                  return dd.date;
                })
            }),
            d3.max(data, function(d){
              return d3.max(d, function(dd){
                return dd.date;
              })
            })
          ])
          .range([0, chart_width]);
      
      
      let y_scale = d3.scaleLinear()
          .domain([
            0, 100
          ])
          .range([chart_height, 0]);
      let x_axis = d3.axisBottom(x_scale)
          .ticks(6)
          .tickFormat(time_format);
      
      let y_axis = d3.axisLeft(y_scale)
          .ticks(10);
      let color_scale = d3.scaleOrdinal()
          .domain(userNameList)
          .range(d3.schemeCategory10);

      // Create Line
      let line = d3.line()
          .defined(function(d){
            return d.risk >= 0;
          })
          .x(function(d){
            // console.log(x_scale(d.date));
            return x_scale(d.date);
          })
          .y(function(d){
            return y_scale(d.risk);
          })
          .curve(d3.curveMonotoneX);
      
      svg.select(".lines")
          .selectAll(".line")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "line")
          .append("path")
          .attr("fill", "none")
          .attr("stroke", function(d, i){
            return color_scale(userNameList[i])
          })
          .attr("stroke-width", "1px")
          .attr("d", function(d){
            return line(d);
          });
      svg.select(".x-axis")
          .style('color', 'black')
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(x_axis);
      
      svg.select(".y-axis")
          .style('color', 'black')
          .call(y_axis);

      let legend = svg.select(".legends")
          .attr("transform", "translate(" + (chart_width)+ ", " + margin.top / 2 + ")")
          .selectAll(".legend")
          .data(userNameList)
          .enter()
          .append("g")
          .attr("class", "legend");

      legend.append("rect")
          .attr("x", 0)
          .attr("y", function(d, i){
            return (20 * i + 5);
          })
          .attr("width", 15)
          .attr("height", 14)
          .attr("fill", function(d, i){
            return color_scale(d);
          });

      legend.append("text")
          .attr("x", 20)
          .attr("y", function(d, i){
            return (20 * i + 5);
          })
          .attr("text-anchor", "left")
          .text(function(d){
            return d;
          })
          .attr("font-size", "13px")
          .attr("dy", "0.5em");
    },
    pdfGenerateMultiUserReport(){
      // 1st Page
      let doc = new jsPDF();
      doc.setFont('msyh');
      let month = [1,2,3,4,5,6,7,8,9,10,11,12]
      
      doc.setFontSize(24);
      doc.text('Interset多人使用者報表', 70, 150);
      
      if(this.formData.timeType == "year"){
        doc.setFontSize(20);
        doc.text(this.formData.year.getFullYear() + "年報", 85, 160);
      }else if(this.formData.timeType == "season"){
        doc.setFontSize(20);
        let t = this.formData.season_year.getFullYear();
        if(this.formData.season_q == "Q1"){
          t += "(" + "Q1" + ")";
        }else if(this.formData.season_q == "Q2"){
          t += "(" + "Q2" + ")";
        }else if(this.formData.season_q == "Q3"){
          t += "(" + "Q3" + ")";
        }else if(this.formData.season_q == "Q4"){
          t += "(" + "Q4" + ")";
        }
        doc.text(t + "季報", 80, 160);
      } else if(this.formData.timeType == "month"){
        // console.log(this.formData.timeType);
        
        doc.setFontSize(20);
        let t = this.formData.month.getFullYear();
        t += "/" + (this.formData.month.getMonth()+1) + "月";
        doc.text(t + "月報", 80, 160);
      }



      doc.setFontSize(10);
      // console.log(this.formData);

      if(this.formData.timeType == "year"){
        this.ts = this.formData.year;
        this.te = new Date(this.ts.getFullYear()+1, 0, 1);
      }else if(this.formData.timeType == "season"){
        let year = this.formData.season_year;
        if(this.formData.season_q == "Q1"){
          this.ts = new Date(year.getFullYear(), 0, 1);
          this.te = new Date(year.getFullYear(), 3, 1);
        }else if(this.formData.season_q == "Q2"){
          this.ts = new Date(year.getFullYear(), 3, 1);
          this.te = new Date(year.getFullYear(), 6, 1);
        }else if(this.formData.season_q == "Q3"){
          this.ts = new Date(year.getFullYear(), 6, 1);
          this.te = new Date(year.getFullYear(), 9, 1);
        }else if(this.formData.season_q == "Q4"){
          this.ts = new Date(year.getFullYear(), 9, 1);
          this.te = new Date(year.getFullYear()+1, 1, 1);
        }
      }else if(this.formData.timeType == "month"){
        let month = this.formData.month;
        this.ts = new Date(month.getFullYear(), month.getMonth(), 1);
        this.te = new Date(month.getFullYear(), month.getMonth()+1, 1);

      }else if(this.formData.timeType == "custom"){
        this.ts = this.formData.daterange[0];
        this.te = this.formData.daterange[1];
      }
      // console.log(this.ts);
      // console.log(this.te);
      
      
      this.ts = this.ts.getTime();
      this.te = this.te.getTime();

      let new_ts = new Date(this.ts);
      let new_te = new Date(this.te - 24*60*60*1000);

      let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
                      + " 到 " + 
                      new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate(); 
      doc.text(date_range, 85, 170);

      // 2nd Page
      // console.log(this.formData.userList);
      // console.log(this.userNameList);
      // console.log(this.ts);
      // // let a = [];
      // console.log(this.formData.userList[0]);
      // console.log(this.formData.allUserList[0]);
      let allUserList = this.formData.allUserList;
      let nameList = [];
      let hashList = [];
      // console.log(allUserList);

      this.formData.userList.forEach(function(d){
        
        nameList.push(allUserList[d].label);
        hashList.push(allUserList[d].hash);
      })
      this.userNameList = nameList;
      this.userHashList = hashList;

      Promise.all([
        apiService.getMultiUserRiskGraph(this.userHashList, this.ts, this.te),
        apiService.getMultiUserAlertsBreakdown(this.userHashList, this.ts, this.te),

      ]).then((values) => {
        this.generatePDFMultiRiskGraph(doc, values[0], this.userNameList);
        // console.log(values[1]);
        
        // this.generatePDFMultiAlertsBreakdown(doc, values[1], this.userNameList);
      })
    },
    pdfGenerate(){

      if(this.formData.contentList.length == 0){
        this.noData = true;
      } else {
        this.noData = false;
        if(this.formData.formType == "organization"){
          this.pdfGenerateOrganizationReport();
        }else if(this.formData.formType == "single-user"){
          this.pdfGenerateSingleUserReport();
        }else if(this.formData.formType == "multi-user"){
          this.pdfGenerateMultiUserReport();
        }


      }
    },
  }
}
</script>

<style>
p {
  color: red;
  font-size: 10px;
}

.pShow {
  visibility: visible;
}
.pHidden {
  visibility: hidden;
}
</style>