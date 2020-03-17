<template>
  <div>
      <!-- <p :class="{ pHidden: !noData, pShow: noData }">please select at least one item.</p> -->
      <el-tooltip effect="dark" content="PDF報表產生" placement="top-start">
       <el-button @click="pdfGenerate" type="primary">產生pdf報表</el-button>
      </el-tooltip>
      <el-alert
        v-show="notOKForm"
        :title="alert_messages"
        type="error"
        show-icon>
      </el-alert>
  </div>
</template>

<script>
import {APIService} from '@/APIService.js';
// import { log } from 'util';
import $ from 'jquery';

const apiService = new APIService();
export default {
  name: "OrganizationReportGenerator",
  data(){
    return {
      status: "",
      notOKForm: false,
      ts: "",
      te: "",
      alert_messages: "",
    }
  },
  props: {
    formData: {
      type: Object
    },
  },
  methods: {
    generatePDFOrganIndexPage(doc, selection){
      console.log(selection);
      // console.log(pdf_map);
      // index title
      doc.addPage();
      doc.setFontSize(35);
      doc.text("目錄", 95, 20);
      let line = 0;
      let page_number = 0
      let selection_count = selection.length;
      doc.setFontSize(20);
      for(let i=0; i<selection_count; i++){
        if(selection.includes(11)){
          // risk graph
          doc.text("總體風險值變化..................................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          selection = this.removeFromSelection(selection, 11);
          line += 1;
          page_number += 1;
        } else if (selection.includes(12)){
          // risk graph stream
          doc.text("總體風險值變化(含威脅種類分佈)..................................." + (page_number+1), 20, 20 + 15 * (line+1));
          selection = this.removeFromSelection(selection, 12);
          line += 1;
          page_number += 1;
        } else if (selection.includes(0)){
          doc.text("風險值最高的前10位使用者............................................." + (page_number+1), 20, 20 + 15 * (line+1));
          selection = this.removeFromSelection(selection, 0);
          line += 1;
          page_number += 1;
        } else if (selection.includes(1)){
          doc.text("風險值最高的前10個控制器............................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個控制器........................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 1);
          line += 2;
          page_number += 2;
        } else if (selection.includes(2)){
          doc.text("風險值最高的前10個資源................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個資源............................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 2);
          line += 2;
          page_number += 2;
        } else if (selection.includes(3)){
          doc.text("風險值最高的前10個分享資源........................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個分享資源....................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 3);
          line += 2;
          page_number += 2;
        } else if (selection.includes(4)){
          doc.text("風險值最高的前10個檔案................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個檔案............................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          line += 2;
          page_number += 2;
        } else if (selection.includes(5)){
          doc.text("風險值最高的前10個主機................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個主機............................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 5);
          line += 2;
          page_number += 2;
        } else if (selection.includes(6)){
          doc.text("風險值最高的前10個專案................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個專案............................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 6);
          line += 2;
          page_number += 2;
        } else if (selection.includes(7)){
          doc.text("風險值最高的前10個伺服器............................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個伺服器........................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 7);
          line += 2;
          page_number += 2;
        } else if (selection.includes(8)){
          doc.text("風險值最高的前10個印表機............................................" + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個印表機........................................" +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 8);
          line += 2;
          page_number += 2;
        } else if (selection.includes(9)){
          doc.text("風險值最高的前10個網站................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個網站............................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 9);
          line += 2;
          page_number += 2;
        } else if (selection.includes(10)){
          doc.text("風險值最高的前10個IP位址............................................." + (page_number+1), 20, 20 + 15 * (line+1));
          doc.text("接入次數最多的前10個IP位址........................................." +  (page_number+2), 20, 20 + 15 * (line+2));
          selection = this.removeFromSelection(selection, 10);
          line += 2;
          page_number += 2;
        } else if (selection.includes(13)){
          doc.text("日/周工作時間分布............................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          selection = this.removeFromSelection(selection, 13);
          line += 1;
          page_number += 1;
        } else if (selection.includes(14)){
          doc.text("登入成功/失敗次數............................................................." + (page_number+1), 20, 20 + 15 * (line+1));
          selection = this.removeFromSelection(selection, 14);
          line += 1;
          page_number += 1;
        }
        if(line == 16 || line == 17){
          doc.addPage();
          line = 0;
        }
      }
      
      
    },
    generatePDFOrganRiskStream(doc, data){
      $('#chart').empty();
      $('#canvas').empty();
      let keys = data.categories;
      data = data.breakdown.map(function(d){
        let risk = d.risk;
        let re_data = {};
        re_data['risk'] = risk;
        re_data['date'] = new Date(d.timestamp * 1000)
        keys.forEach(function(key){
          if(key in d.values){
            // console.log(key);
            // console.log(d.values[key]);
            
            re_data[key] = risk * d.values[key].contribution / 100;
          }else{
            re_data[key] = 0;
          }
        })
        return re_data
      })
      data.pop();
      
      let margin = {top: 50, right: 30, bottom: 100, left: 40};
      let chart_width = 800 - margin.left - margin.right;
      let chart_height = 450 - margin.top - margin.bottom;
      
      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
      // layer 
      // axis layer
      svg.append("g")
          .attr("class", "x-axis");
      svg.append("g")
          .attr("class", "y-axis");
      // grid layer
      svg.append("g")
          .attr("class", "x-grid");
      svg.append("g")
          .attr("class", "y-grid");
      // chart layer
      svg.append("g")
          .attr("class", "stacked-stream-chart");
      // legend
      svg.append("g")
          .attr("class", "legends");
      
      // scale
      // x-scale
      let x_scale = d3.scaleTime()
          .domain([
            d3.min(data, function(d){
              return d.date;
            }),
            d3.max(data, function(d){
              return d.date;
            })
          ])
          .range([0, chart_width]);
      // y-scale
      let y_scale = d3.scaleLinear()
          .domain([0 , 100
          ])
          .range([chart_height, 0]);
      // color scale
      let color_scale = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeCategory10);
      
      // layout
      let area = d3.area()
          .x(function(d, i){
            return x_scale(d.data.date);
          })
          .y0(function(d){
            return y_scale(d[0]);
          })
          .y1(function(d){     
            if(d[1] >= 100){          
              return y_scale(100)
            }else{
              return y_scale(d[1]);
            }
              
          })
          .curve(d3.curveMonotoneX);
      
      let stacked_data = d3.stack()
          .keys(keys)(data);

      // stacked stream chart
      svg.select(".stacked-stream-chart")
          .selectAll(".stream")
          .data(stacked_data)
          .enter()
          .append("g")
          .attr("class", "stream")
          .append("path")
          .attr("d", function(d){
            // console.log(d);
            return area(d);
          })
          .attr("fill", function(d, i){
            return color_scale(keys[i])
          })
          .attr("fill-opacity", 0.5)
          .attr("stroke-width", "1px")
          .attr("stroke", function(d, i){
            return color_scale(keys[i]);
          })
          .attr("stroke-opacity", 0.2);
      // axis
      let time_format = d3.timeFormat('%m-%d');
      // x-axis
      let x_axis = d3.axisBottom(x_scale)
          .ticks(10)
          .tickFormat(time_format);
      // y-axis
      let y_axis = d3.axisLeft(y_scale)
          .ticks(10);

      svg.select(".x-axis")
          .attr("color", "black")
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(x_axis);

      svg.select(".y-axis")
          .attr("color", "black")
          .call(y_axis);
      
      svg.select(".x-axis")
          .selectAll("text")
          .attr("font-size", "15px");

      svg.select(".y-axis")
          .selectAll("text")
          .attr("font-size", "15px");
    
      
      // x-axis grid line
      svg.select(".x-grid")
          .attr("transform", "translate(0, " + chart_height + ")")
          .attr("color", "lightgrey")
          .attr("stroke-opacity", 0.8)
          .attr("shape-rendering", "crispEdges")
          .call(x_axis
                  .tickSize(-chart_height)
                  // .tickValues([])
                  .tickFormat("")
                );
      // y-axis grid line
      svg.select(".y-grid")
          .attr("color", "lightgrey")
          .attr("stroke-opacity", 0.8)
          .attr("shape-rendering", "crispEdges")
          .call(y_axis
                  .tickValues([20, 40, 60, 80, 100])
                  .tickSize(-chart_width)
                  .tickFormat("")
                );
      // legends
      let legends = svg.select(".legends")
          .selectAll("legend")
          .data(keys)
          .enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i){
            return "translate(" + (i * 150 + 50) + ", " + (chart_height + margin.bottom /2) + ")";
          });
      
      legends.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", function(d){
            return color_scale(d);
          });
      legends.append("text")
          .attr("x", 18)
          .attr("y", 15)
          .attr("dy", "-.3em")
          .text(function(d){
            return d;
          })
          .attr("font-size", "13px")
          .attr("text-anchor", "start");
      // 
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      // console.log(imgData);
      
      d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
      doc.addPage();
      doc.setFontSize(24);
      doc.text("總體風險值變化(含威脅種類分佈)", 50, 20);
      doc.addImage(imgData, 'PNG', 10, 50, 190, 90 );
      
    },
    generatePDFOrganRiskPage(doc, data){
      
      $('#chart').empty();
      $('#canvas').empty();
      
      let time_format = d3.timeFormat('%m-%d');
      let time_parse = d3.timeParse('%Y-%m-%dT%H:%M:%S%Z[UTC%Z]');
      data = data.map(function(d){ return {date: time_parse(d.timestampStr), risk: d.risk};});
      data.pop();
      data.shift();
      // console.log(data);
      let margin = {top: 50, right: 30, bottom: 100, left: 40};
      let chart_width = 800 - margin.left - margin.right;
      let chart_height = 450 - margin.top - margin.bottom ;
      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
      // layer 
      // grid layer
      svg.append("g")
          .attr("class", "x-grid");
      svg.append("g")
          .attr("class", "y-grid");
      // axis layer
      svg.append("g")
          .attr("class", "x-axis");
      svg.append("g")
          .attr("class", "y-axis");
      // chart layer
      svg.append("g")
          .attr("class", "line-chart")
      // scale
      // x-scale
      let x_scale = d3.scaleTime()
          .domain([
            d3.min(data, function(d){
              return d.date;
            }),
            d3.max(data, function(d){
              return d.date;
            })
          ])
          .range([0, chart_width]);
      // y-scale
      let y_scale = d3.scaleLinear()
          .domain([
            0, 100
          ])
          .range([chart_height, 0]);
      
      // Create area
      let area = d3.area()
          .defined(function(d){
            return d.risk >= 0;
          })
          .x(function(d){
            return x_scale(d.date);
          })
          .y0(chart_height)
          .y1(function(d){
            return y_scale(d.risk);
          })
         	.curve(d3.curveMonotoneX);
      
      svg.select(".line-chart")
        .append("path")
        .datum( data )
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "#00c973")
        .attr("fill-opacity", 0.2)
        .attr("stroke", "#00a15c")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", "2px");

      // axis
      let x_axis = d3.axisBottom(x_scale)
          .ticks(10)
          .tickFormat(time_format);
      let y_axis = d3.axisLeft(y_scale)
          .ticks(10);

      svg.select(".x-axis")
          .attr('color', 'black')
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(x_axis);
      
      svg.select(".y-axis")
          .attr('color', 'black')
          .call(y_axis);
      
      svg.select(".x-axis")
          .selectAll("text")
          .attr("font-size", "15px");

      svg.select(".y-axis")
          .selectAll("text")
          .attr("font-size", "15px");
      
      // x-axis grid line
      svg.select(".x-grid")
          .attr("transform", "translate(0, " + chart_height + ")")
          .attr("color", "lightgrey")
          .attr("stroke-opacity", 0.8)
          .attr("shape-rendering", "crispEdges")
          .call(x_axis
                  .tickSize(-chart_height)
                  // .tickValues([])
                  .tickFormat("")
                );
      // y-axis grid line
      svg.select(".y-grid")
          .attr("color", "lightgrey")
          .attr("stroke-opacity", 0.8)
          .attr("shape-rendering", "crispEdges")
          .call(y_axis
                  .tickValues([20, 40, 60, 80, 100])
                  .tickSize(-chart_width)
                  .tickFormat("")
                );

      // save svg as base64
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      
      d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
      doc.addPage();
      doc.setFontSize(24);
      doc.text("總體風險值變化", 70, 20);
      doc.addImage(imgData, 'PNG', 10, 50, 190, 80);
      
    },
    generatePDFOrganAuthenicationPage(doc, data){
      // clear #chart
      $('#chart').empty();
      $('#canvas').empty();
      // d3 arguments
      let m = 2;
      let keys = ['totalSuccess', 'totalFailed'];
      let margin = {top: 50, right: 50, bottom: 70, left: 40};
      let chart_width = 700 - margin.right - margin.left;
      let chart_height = 350 - margin.top - margin.bottom;
      let svg = d3.select("#chart")
          .append('svg')
          .attr("width", chart_width + margin.right + margin.left)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top +")");
      
      // layer
      // axis layer
      svg.append("g")
          .attr("class", "x-axis");
      svg.append("g")
          .attr("class", "y-axis");
      // grid layer
      svg.append("g")
          .attr("class", "y-grid")
      // chart layer
      svg.append("g")
          .attr("class", "stacked-bar-chart");
      // legend layer
      svg.append("g")
          .attr("class", "legend")
      // scale
      // x0 scale for entityName
      let x0_scale = d3.scaleBand()
            .domain(data.map(function(d){
              return d.entityName;}
            ))
            .rangeRound([0, chart_width])
            .paddingInner(0.2);
      // x1 scale for keys
      let x1_scale = d3.scaleBand()
            .domain(keys)
            .rangeRound([0, x0_scale.bandwidth()]);
      
      let y_scale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){ 
              return d3.max(keys, function(key){
                return d[key];}
              )
            })])
            .range([chart_height, 0]);
      // color_scale for keys
      let color_scale = d3.scaleOrdinal()
            .range(["#41ef08", "#e93b26"]);
      // legend scale
      let legend_scale = d3.scaleOrdinal()
            .domain(keys)
            .range(["登入成功", "登入失敗"]);

      // create stacked bar chart
      svg.select(".stacked-bar-chart")
        .selectAll(".slice")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "slice")
        .attr("transform", function(d){return "translate(" + x0_scale(d.entityName) + ",0)"})
        .selectAll("rect")
        .data(function(d){
          return keys.map(function(key){
            return {key: key, value:d[key]};
          });
        })
        .enter()
        .append("rect")
        .attr("x", function(d){
          return x1_scale(d.key);
        })
        .attr("y", function(d){
          return y_scale(d.value);
        })
        .attr("width", x1_scale.bandwidth())
        .attr("height", function(d){
          return chart_height - y_scale(d.value)
        })
        .attr("fill", function(d){
          return color_scale(d.key)
        })
        .attr("fill-opacity", 0.5)
        .attr("stroke", function(d){
          return color_scale(d.key);
        })
        .attr("stroke-opacity", 0.8)
        .attr("stroke-width", "2px")
        .attr("stroke-dasharray", function(d){
          let sw = x1_scale.bandwidth()
          let sh = chart_height - y_scale(d.value);
          return [sw+sh, sw, sh];
        });
      
      // create axis
      let x0_axis = d3.axisBottom(x0_scale);
      let y_axis = d3.axisLeft(y_scale); 
      // x-axis
      svg.select(".x-axis")
        .attr("color", "black")
        .attr("transform", "translate(0, " + (chart_height) + ")")
        .call(x0_axis)
        .selectAll(".tick text")
        .call(this.wrap, x0_scale.bandwidth());
        // .attr("text-anchor", "end")
        // .attr("dx", "-.8em")
        // .attr("dy", "-.55em")
        // .attr("transform", "rotate(-90)");
      // y-axis
      svg.select(".y-axis")
        .attr('color', 'black')
        .call(y_axis);
      // y-grid
      svg.select(".y-grid")
          .attr("color", "lightgrey")
          .attr("stroke-opacity", 0.8)
          .attr("shape-rendering", "crispEdges")
          .call(y_axis
                  .tickSize(-chart_width)
                  .tickFormat(""));
      // create legend
      let legend = d3.select('svg')
        .append("g")
        .attr("class", "legends")
        .selectAll(".legend")
        .data(keys.slice().reverse())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i){
          return "translate(80," + (i * 20 + 5) + ")";
        });
      
      legend.append("rect")
        .attr("x", chart_width - 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", function(d){ 
          return color_scale(d); 
        })
        .attr("fill-opacity", 0.5)
        .attr("stroke", function(d){
          return color_scale(d);
        })
        .attr("stroke-width", "1px")
        .attr("stroke-opacity", 0.8);

      legend.append("text")
        .attr("x", chart_width - 30)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .style("text-anchor", "end")
        .text(function(d){ return legend_scale(d);});
      
      // save svg as base64 
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();

      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
      // create pdf page 
      doc.addPage();
      doc.setFontSize(24);
      doc.text("登入失敗最高的使用者", 60, 20);
      doc.addImage(imgData, 'PNG', 20, 50, 150, 100);
      
    },
    generatePDFOrganWorkingHours(doc, daily_data, weekly_data){
      // daily data
      daily_data = daily_data.map(function(d){
        return {
          slice: 1,
          value: d.expected
        }
      })

      $('#chart').empty();
      $('#canvas').empty();
      doc.addPage();
      doc.setFontSize(24);
      doc.text("使用者一天工作時數分佈", 60, 20);

      let margin = {top: 50, right: 50, bottom: 50, left: 50};
      let chart_width = 500 - margin.right - margin.left;
      let chart_height = 500 - margin.top - margin.bottom;
      let radius = chart_width / 2;

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + (margin.left + chart_width / 2) + ", " + (margin.top + chart_height / 2) + ")");
    
      // layer
      // bg chart layer
      svg.append("g")
          .attr("class", "bg-pie-chart");
      // chart layer
      svg.append("g")
          .attr("class", "arcs");
      // chart border layer
      svg.append("g")
          .attr("class", "bg-circle");
      // label layer
      svg.append("g")
          .attr("class", "labels");

      // bg-pie-chart
      let bg_color_scale = d3.scaleOrdinal()
          .range(["#cccccc", "#ffffff"]);
      
      let bg_data = new Array(24).fill(1);
      let bg_pie = d3.pie();
      let bg_arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);

      let bg_arcs = svg.select(".bg-pie-chart")
          .selectAll(".bg-arc")
          .data(bg_pie(bg_data))
          .enter()
          .append("g")
          .attr("class", "bg-arc")
          .append("path")
          .attr("d", bg_arc)
          .attr("fill", function(d, i){
            return bg_color_scale(i % 2);
          })
          .attr("fill-opacity", 0.2);

      let bg_circle = svg.select(".bg-circle")
          .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", radius)
          .attr("stroke-width", "1px")
          .attr("stroke", "#6c85a8")
          .attr("fill", "none");

      // pie chart arcs
      let pie = d3.pie()
          .value(function(d){
            return d.slice;
          })
          .startAngle(-0.25 * Math.PI);
      
      let r_scale = d3.scaleLinear()
          .domain([
            0, d3.max(daily_data, function(d){
              return d.value;
            })
          ])
          .range([0, radius]);

      let arc = d3.arc()
          .innerRadius(0)
          .outerRadius(function(d, i){
            return r_scale(d.data.value);
          })
      
      let slices = svg.select(".arcs")
          .selectAll(".arc")
          .data(pie(daily_data))
          .enter()
          .append("g")          
          .attr("class", "arc")
          .append("path")
          .attr('d', arc)    
          .attr("fill", "#97a9c2")
          .attr("stroke", "white")
          .style("stroke-width", "0.5px")
          .style("opacity", 0.7);

      let labels = ["12pm", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"];
      svg.select(".labels")
          .selectAll(".label")
          .data(labels)
          .enter()
          .append("g")
          .attr("class", "label")
          .append("text")
          .text(function(d){
            // console.log(d);
            return d;
          })
          .attr("text-anchor", "middle")
          .attr("x", function(d, i){
            // console.log((radius+5) * Math.sin(i * Math.PI / 4) + ", " + (radius+5) * Math.cos(i * Math.PI / 4));
            
            return (radius+5) * Math.sin(i * Math.PI / 4);
          })
          .attr("y", function(d, i){

            return -(radius+5) * Math.cos(i * Math.PI / 4);
          })
          .attr("dx", function(d, i){
            // console.log(d);
            
            if(i >= 5 && i <= 7){
              return "-1em";
            }else if(i >= 1 && i <= 3 ){
              return "1.5em";
            }
          })
          .attr("dy", function(d, i){
            if(i == 4){
              return "1em";
            }
          });

      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + margin.left + margin.right )
          .attr("height", chart_height + margin.top + margin.bottom );

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      // console.log(imgData);
      
      d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
      // doc.setFontSize(15);
      // doc.text('風險值', 35, 18);
      doc.addImage(imgData, 'PNG', 40, 20, 120, 120 );


      // weekly_data
      // process data
      let week_data = [];
      let sum = 0;
      let counter = 0;
      // console.log(data);
      
      for(let i=0; i<weekly_data.length; i++){
        sum += weekly_data[i].expected;
        counter += 1;
        if(counter == 48){
          // console.log(sum);
          
          week_data.push(sum);
          sum = 0;
          counter = 0;
        }
      }
      labels = ["星期一", "星期二", "星期三", "星期四","星期五","星期六","星期日",]
      week_data = week_data.map(function(d, i){
        return {
          label: labels[i],
          value: d
        };
      });
      bg_data = week_data.map(function(d, i){
        return {
          label: labels[i],
          value: d3.max(week_data, function(d){
            return d.value;
          })
        }
      })
      // console.log(bg_data);
      
      // back ground bar chart data
      doc.setFontSize(24);
      doc.text("使用者一週工作時數分佈", 60, 155);
      // bar chart
      $('#chart').empty();
      $('#canvas').empty();
      
      margin = {top: 40, right: 30, bottom:30, left: 60}
      chart_width = 600 - margin.right - margin.left;
      chart_height = 300 - margin.top - margin.bottom;

      svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
      svg.append("g")
          .attr("class", "bg-bars");
      svg.append("g")
          .attr("class", "x-axis");
      svg.append("g")
          .attr("class", "y-axis");
      svg.append("g")
          .attr("class", "bars");
      
      let x_scale = d3.scaleBand()
          .rangeRound([0, chart_width])
          .padding(0.05)
          .domain(labels);
      let y_scale = d3.scaleLinear()
          .range([chart_height, 0])
          .domain([0, d3.max(week_data, function(d){
            return +d.value;
          })]);
      let bars = svg.select(".bars")
          .selectAll(".bar")
          .data(week_data)
          .enter()
          .append("g")
          .attr("class", "bar")
          .append("rect")
          .attr("x", function(d){
            return x_scale(d.label);
          })
          .attr("y", function(d){
            return y_scale(d.value);
          })
          .attr("width", x_scale.bandwidth())
          .attr("height", function(d){
            return chart_height - y_scale(d.value);
          })
          .attr("fill", "#97a9c2")
          .attr("fill-opacity", 0.8);
      
      svg.select(".x-axis")
          .attr("color", "black")
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(d3.axisBottom(x_scale))
          .selectAll("text")
          .attr("text-anchor", "middle");
      // d3.select("svg").append("text")
      //     .text("一週工作活躍程度")
      //     .attr("x", margin.left + chart_width / 2)
      //     .attr("y", margin.top)
      //     .attr("dy", "-1em")
      //     .attr("text-anchor", "middle");

      d3.select(".bg-bars")
          .selectAll("bg-bar")
          .data(bg_data)
          .enter()
          .append("g")
          .attr("class", "bg-bar")
          .append("rect")
          .attr("x", function(d){
            return x_scale(d.label);
          })
          .attr("y", function(d){
            return y_scale(d.value);
          })
          .attr("width", x_scale.bandwidth())
          .attr("height", function(d){
            return chart_height - y_scale(d.value);
          })
          .attr("fill", "#cccccc")
          .attr("fill-opacity", 0.3);
      // svg.select(".y-axis")
      //     .attr("color", "black")
      //     .call(d3.axisLeft(y_scale));
      canvas = document.getElementById('canvas');
      context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.right + margin.left);

      firstSvg = $('#chart');
      content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      imgData = canvas.toDataURL('image/png');
      // console.log(imgData);
      
      d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
      // doc.setFontSize(15);
      // doc.text('風險值', 35, 18);
      doc.addImage(imgData, 'PNG', 20, 160, 160, 100 );

    },
    generatePDFOrganPage(doc, data, entityName, pageType, table_flag=false, chart_flag=false){
      // get chinese name, title header
      let entityNameChinese = this.entityNameMapping(entityName);
      let pageTitle = "";
      let pageTableHeader = ""
      if(pageType == "risk"){
        pageTitle = "風險值最高的前10";
        pageTableHeader = "風險值";
      }else if(pageType == "access"){
        pageTitle = "接入次數最多的前10";
        pageTableHeader = "接入次數";
      }
      if(entityName == "user"){
        pageTitle += "位";
      }else{
        pageTitle += "個";
      }
      
      if(table_flag){
        doc.addPage();
        doc.setFontSize(24);
        doc.text(pageTitle + entityNameChinese, 60, 20);
        let jspdf_table = [];
        if(pageType == "risk"){
          for(let i=0; i<data.length; i++){
            jspdf_table.push([data[i].risk, data[i].entityName]);
          }
        }else if(pageType == "access"){
          for(let i=data.length-1; i>=0; i--){
            jspdf_table.push([data[i].accessed, data[i].entityName]);
          }
        }
        
        // console.log(jspdf_table);
        doc.autoTable({html: '#my-table'});
        doc.autoTable({
          startY: 35,
          theme: 'striped',
          head:[[pageTableHeader, entityNameChinese]],
          body: jspdf_table,
          styles: {font: "msyh"}
        })
      }
      if(chart_flag){
        // clear #chart
        $('#chart').empty();
        $('#canvas').empty();
        // d3 arguments
        let margin = {top: 20, right: 20, bottom: 90, left: 60};
        let chart_width = 600 - margin.right - margin.left;
        let chart_height = 400 - margin.top - margin.bottom;
        
        let svg = d3.select("#chart")
            .append("svg")
            .attr("width", chart_width + margin.left + margin.right)
            .attr("height", chart_height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.right + ")");

        // layer
        // axis layer
        svg.append("g")
            .attr("class", "x-axis");
        svg.append("g")
            .attr("class", "y-axis")
        svg.append("g")
            .attr("class", "bar-chart");
        svg.append("g")
            .attr("class", "bar-chart-label");

        // scale
        let x_scale = d3.scaleBand()
            .domain(data.map(function(d){
              return d.entityName;
            }))
            .rangeRound([0, chart_width])
            .padding(0.05);
        
        let y_scale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){
              return +d.accessed
            })])
            .rangeRound([chart_height, 0]);
            
        
        // creating chart
        svg.select(".bar-chart")
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d){
              return x_scale(d.entityName);
            })
            .attr("width", x_scale.bandwidth())
            .attr("y", function(d){
              return y_scale(d.accessed);
            })
            .attr("height", function(d){
              return chart_height - y_scale(d.accessed);
            })
            .attr("fill", "#0066ff")
            .attr("fill-opacity", 0.5)
            .attr("stroke", "#0066ff")
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", "2px")
            .attr("stroke-dasharray", function(d){
              let sw = x_scale.bandwidth()
              let sh = chart_height - y_scale(d.accessed);
              return [sw+sh, sw, sh];
            })
          
          // creating axis
        svg.select(".x-axis")
            .attr("color", "black")
            .attr("transform", "translate(0, " + chart_height + ")")
            .call(d3.axisBottom(x_scale))
            .selectAll(".tick text")
            .call(this.wrap, x_scale.bandwidth());
            // .attr("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", "-.55em")
            // .attr("transform", "rotate(-90)");
      
        svg.select(".y-axis")
            .attr("color", "black")
            .call(d3.axisLeft(y_scale));

        // bar chart label
        svg.select(".bar-chart-label")
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
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
        d3.select("#canvas")
            .attr("width", chart_width + margin.left + margin.right)
            .attr("height", chart_height + margin.top + margin.bottom);

        let firstSvg = $('#chart');
        let content = $(firstSvg).html();
        
        context.drawSvg(content);
        let imgData = canvas.toDataURL('image/png');
        d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
        // console.log(imgData);
        doc.addImage(imgData, 'PNG', 20, 125, 150, 100);
        
      }
    },
    pdfGenerateOrganizationReport(){
      // 1st Page
      let doc = new jsPDF();
      doc.setFont('msyh');
      let month = [1,2,3,4,5,6,7,8,9,10,11,12]
      
      doc.setFontSize(24);
      doc.text('Interset總體報表', 70, 150);
      
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

      this.ts = this.ts.getTime();
      this.te = this.te.getTime();

      let new_ts = new Date(this.ts);
      let new_te = new Date(this.te - 24*60*60*1000);

      let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
                      + " 到 " + 
                      new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate(); 
      doc.text(date_range, 85, 170);
      // 2nd Page After
      // console.log(this.ts);
      //["使用者", "控制器", "資源", "分享資源", "檔案", "主機", "專案", "伺服器", "印表機", "網站", "IP位址"]
      let selection = this.formData.contentList.slice();
      let promiseArray = [
        apiService.getTopRiskyUsers,
        apiService.getTopRiskyControllers,
        apiService.getTopAccessedControllers,
        apiService.getTopRiskyResources,
        apiService.getTopAccessedResources,
        apiService.getTopRiskyShares,
        apiService.getTopAccessedShares,
        apiService.getTopRiskyFiles,
        apiService.getTopAccessedFiles,
        apiService.getTopRiskyMachines,
        apiService.getTopAccessedMachines,
        apiService.getTopRiskyProjects,
        apiService.getTopAccessedProjects,
        apiService.getTopRiskyServers,
        apiService.getTopAccessedServers,
        apiService.getTopRiskyPrinters,
        apiService.getTopAccessedPrinters,
        apiService.getTopRiskyWebsites,
        apiService.getTopAccessedWebsites,
        apiService.getTopRiskyIPAddresses,
        apiService.getTopAccessedIPAddresses,
        apiService.getRiskGraph,
        apiService.getRiskStream,
        apiService.getWorkingHoursDaily,
        apiService.getWorkingHoursWeekly,
        apiService.getAuthenication,
      ];

      
      // let exectionPromiseArray = selection.map(d => {
      //   return promiseArray[d];
      // });
      let exectionPromiseArray = [];
      let pdf_map = {}
      let pdf_counter = 0;
      selection = selection.sort(function(a, b){
        return a - b;
      });
      let pts = this.ts;
      let pte = this.te;
      
      selection.forEach(function(d){
        
        if(d == 0){
          // user
          exectionPromiseArray.push(promiseArray[0](pts, pte));
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }else if(d >= 1 && d <= 10){

          exectionPromiseArray.push(promiseArray[2*d-1](pts, pte));
          exectionPromiseArray.push(promiseArray[2*d](pts, pte));
          pdf_map[d] = pdf_counter;
          pdf_counter += 2;
        }else if(d == 11){
          // risk graph
          exectionPromiseArray.push(promiseArray[21](pts, pte));
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }else if(d == 12){
          // risk graph stream
          exectionPromiseArray.push(promiseArray[22](pts, pte));
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }else if(d == 13){
          //working hours daily
          exectionPromiseArray.push(promiseArray[23]());
          exectionPromiseArray.push(promiseArray[24]());
          pdf_map[d] = pdf_counter;
          pdf_counter += 2;
        }else if(d == 14){
          // authenication
          exectionPromiseArray.push(promiseArray[25](pts, pte));
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }
      });

      // get data, promise geting all data and generate pdf
      //["使用者", "控制器", "資源", "分享資源", "檔案", "主機", "專案", "伺服器", "印表機", "網站", "IP位址"]
      Promise.all(
                  exectionPromiseArray
                  )           
            .then((values) =>   
      {
        this.generatePDFOrganIndexPage(doc, selection.slice());
        let selection_count = selection.length;
        for (let i=0; i<selection_count; i++){
          if(selection.includes(11)){
            // ==========================
            // risk graph page
            // ==========================
            let data = values[pdf_map[11]].data;
            this.generatePDFOrganRiskPage(doc, data);
            selection = this.removeFromSelection(selection, 11);
          } else if(selection.includes(12)){
            // ==========================
            // risk graph stream
            // ==========================
            let data = values[pdf_map[12]].data;
            this.generatePDFOrganRiskStream(doc, data);
            // console.log(data);
            selection = this.removeFromSelection(selection, 12);
          }else if(selection.includes(0)){
            // ===========================
            // top risky user page
            // ===========================
            let data = values[pdf_map[0]].data;
  
            this.generatePDFOrganPage(doc, data, 'user', 'risk', true, false);
            selection = this.removeFromSelection(selection, 0);
            
          } else if(selection.includes(1)){
            // ==========================
            // top risky controllers page
            // ==========================
            let data = values[pdf_map[1]].data;

            this.generatePDFOrganPage(doc, data, 'controller', 'risk', true, false);
            // =============================
            // top accessed controllers page
            // =============================
            data = values[pdf_map[1] + 1];
            this.generatePDFOrganPage(doc, data, 'controller', 'access', true, true);
            selection = this.removeFromSelection(selection, 1);
          } else if(selection.includes(2)){
            // ==========================
            // top risky resources page
            // ==========================
            let data = values[pdf_map[2]].data;

            this.generatePDFOrganPage(doc, data, 'resource', 'risk', true, false);
            // =============================
            // top accessed resources page
            // =============================
            data = values[pdf_map[2] + 1];
            this.generatePDFOrganPage(doc, data, 'resource', 'access', true, true);
            selection = this.removeFromSelection(selection, 2);
          } else if(selection.includes(3)){
            // ==========================
            // top risky share page
            // ==========================
            let data = values[pdf_map[3]].data;
            
            this.generatePDFOrganPage(doc, data, 'share', 'risk', true, false);
            // =============================
            // top accessed share page
            // =============================
            data = values[pdf_map[3] + 1];
            this.generatePDFOrganPage(doc, data, 'share', 'access', true, true);
            selection = this.removeFromSelection(selection, 3);
          } else if(selection.includes(4)){
            // ==========================
            // top risky files page
            // ==========================
            let data = values[pdf_map[4]].data;

            this.generatePDFOrganPage(doc, data, 'file', 'risk', true, false);
            // =============================
            // top accessed files page
            // =============================
            data = values[pdf_map[4] + 1];
            this.generatePDFOrganPage(doc, data, 'file', 'access', true, true);
            selection = this.removeFromSelection(selection, 4);
          } else if(selection.includes(5)){
            // ==========================
            // top risky machines page
            // ==========================
            let data = values[pdf_map[5]].data;

            this.generatePDFOrganPage(doc, data, 'machine', 'risk', true, false);
            // =============================
            // top accessed machines page
            // =============================
            data = values[pdf_map[5] + 1];
            this.generatePDFOrganPage(doc, data, 'machine', 'access', true, true);
            selection = this.removeFromSelection(selection, 5);
          } else if(selection.includes(6)){
            // ==========================
            // top risky projects page
            // ==========================
            let data = values[pdf_map[6]].data;

            this.generatePDFOrganPage(doc, data, 'project', 'risk', true, false);
            // =============================
            // top accessed projects page
            // =============================
            data = values[pdf_map[6] + 1];
            this.generatePDFOrganPage(doc, data, 'project', 'access', true, true);
            selection = this.removeFromSelection(selection, 6);
          } else if(selection.includes(7)){
            // ==========================
            // top risky servers page
            // ==========================
            let data = values[pdf_map[7]].data;

            this.generatePDFOrganPage(doc, data, 'server', 'risk', true, false);
            // =============================
            // top accessed servers page
            // =============================
            data = values[pdf_map[7] + 1];
            this.generatePDFOrganPage(doc, data, 'server', 'access', true, true);
            selection = this.removeFromSelection(selection, 7);
          } else if(selection.includes(8)){
            // ==========================
            // top risky printers page
            // ==========================
            let data = values[pdf_map[8]].data;

            this.generatePDFOrganPage(doc, data, 'printer', 'risk', true, false);
            // =============================
            // top accessed printers page
            // =============================
            data = values[pdf_map[8] + 1];
            this.generatePDFOrganPage(doc, data, 'printer', 'access', true, true);
            selection = this.removeFromSelection(selection, 8);
          } else if(selection.includes(9)){
            // ==========================
            // top risky websites page
            // ==========================
            let data = values[pdf_map[9]].data;

            this.generatePDFOrganPage(doc, data, 'website', 'risk', true, false);
            // =============================
            // top accessed websites page
            // =============================
            data = values[pdf_map[9] + 1];
            this.generatePDFOrganPage(doc, data, 'website', 'access', true, true);
            selection = this.removeFromSelection(selection, 9);
          } else if(selection.includes(10)){
            // ==========================
            // top risky ipaddress page
            // ==========================
            let data = values[pdf_map[10]].data;

            this.generatePDFOrganPage(doc, data, 'ipaddress', 'risk', true, false);
            // =============================
            // top accessed ipaddress page
            // =============================
            data = values[pdf_map[10] + 1];
            this.generatePDFOrganPage(doc, data, 'ipaddress', 'access', true, true);
            selection = this.removeFromSelection(selection, 10);
          } else if(selection.includes(13)){
            // ==========================
            // daily and weekly working hours page
            // ==========================
            let daily_data = values[pdf_map[13]].data;
            let weekly_data = values[pdf_map[13] + 1].data;
            // console.log(data);
            this.generatePDFOrganWorkingHours(doc, daily_data, weekly_data);
            selection = this.removeFromSelection(selection, 13);
          } else if(selection.includes(14)){
            // ==========================
            // risk graph stream ver. page
            // ==========================
            let data = values[pdf_map[14]].data;
            this.generatePDFOrganAuthenicationPage(doc, data);
            selection = this.removeFromSelection(selection, 14);
          }
        }
        doc.save('test.pdf');
      });
    },
    pdfGenerate(){

      this.notOKForm = true;
      if(this.formData.contentList.length == 0){
        this.alert_messages = "請加入至少一項內容";
      } else if(this.formData.timeType == "year" && !this.formData.year){
        this.status = "year no year";
        this.alert_messages = "請選擇年";
        // this.pdfGenerateSingleUserReport();
      } else if(this.formData.timeType == "season"){
        if(!this.formData.season_year){
          this.status = "season no year";
          this.alert_messages = "請選擇季度的年";
        }else if(!this.formData.season_q){
          this.status = "season no season";
          this.alert_messages = "請選擇季度的季";
        }else {
          this.notOKForm = false;
          this.pdfGenerateSingleUserReport();
        }
      } else if(this.formData.timeType == "month" && !this.formData.month){
        this.status = "month no month";
        this.alert_messages = "請選擇月份";
      } else if(this.formData.timeType == "custom" && !this.formData.daterange){
        this.status = "custom no daterange";
        this.alert_messages = "請選擇時間範圍";
      } else {
        this.notOKForm = false;
        this.pdfGenerateOrganizationReport();
      }        
    },
    //["使用者", "控制器", "資源", "分享資源", "檔案", "主機", "專案", "伺服器", "印表機", "網站", "IP位址"]

    entityNameMapping(entityName){
      if(entityName == 'user'){
        return "使用者";
      }else if(entityName == 'controller'){
        return "控制器";
      }else if(entityName == 'share'){
        return "分享資源";
      }else if(entityName == 'resource'){
        return "資源";
      }else if(entityName == 'file'){
        return "檔案";
      }else if(entityName == 'machine'){
        return "主機";
      }else if(entityName == 'project'){
        return "專案";
      }else if(entityName == 'server'){
        return "伺服器"
      }else if(entityName == 'printer'){
        return "印表機";
      }else if(entityName == 'website'){
        return "網站";
      }else if(entityName == 'ipaddress'){
        return "IP位址";
      }
    },
    removeFromSelection(selection, data_type){
      let d_index = selection.indexOf(data_type);
      selection.splice(d_index, 1);
      return selection;
    },
    wrap(text, width) {
      text.each(function(d) {
        let text = d3.select(this),
            words = text.text().split(/([.-\s/s_]+)/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        // console.log(text);
        if(words.slice().pop() == ""){
          words.pop();
        }
        // console.log(words);
        
        while (word = words.pop()) {
          // console.log(word);
          
          line.push(word);
          tspan.text(line.join(""));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(""));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  }
}
</script>

<style>
p {
  color: red;
  font-size: 10px;
}

.el-alert {
  font-weight: 700;
  margin-top: 5px;
}
.pShow {
  visibility: visible;
}
.pHidden {
  visibility: hidden;
}
</style>