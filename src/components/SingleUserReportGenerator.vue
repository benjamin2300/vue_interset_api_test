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
  name: "singleUserReportGenerator",
  data(){
    return {
      noData: false,
      ts: "",
      te: "",
      userName: "",
      userHash: "",
    }
  },
  props: {
    formData: {
      type: Object
    },
  },
  methods: {
    generatePDFSingleRisk(doc, data){
      // console.log(data);
      data = d3.max(data, function(d){
        return d.risk
      })
      let fill_color = "";
      let line_color = "";
      let risk_level = "";
      let risk_level_text = "";
      // risk vvalue decide color
      if(data >=0 && data<25){
        // low risk, green
        fill_color = "#1ad424";
        line_color = "#15aa1d";
        risk_level = "low";
        risk_level_text = "低風險使用者";
      }else if(data < 50){
        // medium risk, yellow
        fill_color = "#ffff40";
        line_color = "#e6b219";
        risk_level = "medium";
        risk_level_text = "中風險使用者";
      }else if(data < 75){
        // high risk, orange
        fill_color = "#ffc482";
        line_color = "#ff7b00";
        risk_level = "high";
        risk_level_text = "高風險使用者";
      }else{
        // extreme risk, red
        fill_color = "#eb616c";
        line_color = "#cc0000";
        risk_level = "extreme";
        risk_level_text = "極高風險使用者";
      }

      $('#chart').empty();
      $('#canvas').empty();
      // let margin = {top: 20, right: 20, bottom: 70, left: 40};
      let padding = 5;
      let chart_width = 150 - 2 * padding;
      let chart_height = 150 - 2 * padding;
      let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
      let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);

      let svg = d3.select("#chart")
                .append("svg")
                .attr("width", chart_width + 2 * padding)
                .attr("height", chart_height + 2 * padding)
                .append("g");

      svg.append("circle")
          .attr("cx", padding + chart_width / 2)
          .attr("cy", padding + chart_height / 2)
          .attr("r", chart_width / 2)
          .attr("stroke", line_color)
          .attr("stroke-width", "5px")
          .attr("fill", fill_color)
          .attr("stroke-opacity","0.5")
          .attr("fill-opacity","0.2");
      
      svg.append("text")
          .attr("x", padding + chart_width / 2)
          .attr("y", padding + chart_height / 2)
          .attr("font-size", "50px")
          .attr("font-weight", 700)
          .attr("text-anchor", 'middle')
          .attr("dy", ".3em")
          .attr("fill", line_color)
          .attr("fill-opacity", "0.7")
          .text(data);
      
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + 2 * padding)
          .attr("height", chart_height + 2 * padding);

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
      doc.addImage(imgData, 'PNG', 20, 25, 50, 50);
      doc.setFontSize(30)
      doc.text(risk_level_text, 80, 45);
      doc.text( "ID : " + this.userName, 80, 65);
    },
    generatePDFSingleRiskGraph(doc, data){
      // console.log(new Date(data[0].timestamp));
      $('#chart').empty();
      $('#canvas').empty();
      
      let time_format = d3.timeFormat('%m/%d');
      let time_parse = d3.timeParse('%Y-%m-%dT%H:%M:%S%Z[UTC%Z]');
      
      data = data.map(function(d){ return {date: new Date(d.timestamp * 1000), risk: d.risk};});
    
      // data.pop();
      // data.shift();

      let margin = {top: 70, right: 30, bottom: 30, left: 60};
      let chart_width = 750 - margin.left - margin.right ;
      let chart_height = 350 -margin.top - margin.bottom;

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // scale
      let x_scale = d3.scaleTime()
          // .domain(d3.extent(data, function(d) { return d.date; }))
          .domain([
            d3.min(data, function(d){
              return d.date;
            }),
            d3.max(data, function(d){
              return d.date;
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
      
      // Create Line
      let line = d3.line()
          .defined(function(d){
            return d.risk >= 0;
          })
          .x(function(d){
            return x_scale(d.date);
          })
          .y(function(d){
            return y_scale(d.risk);
          })
          .curve(d3.curveMonotoneX);
      // Create area
      let area = d3.area()
          .x(function(d){
            return x_scale(d.date);
          })
          .y0(chart_height)
          .y1(function(d){
            return y_scale(d.risk);
          })
          .curve(d3.curveMonotoneX);
      
      svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "#00c973")
        .attr("fill-opacity", 0.5);

      svg.append( 'path' )
        .datum( data )
        .attr( 'fill', 'none')
        .attr( 'stroke', '#00a15c')
        .attr( 'stroke-opacity', 0.5 )
        .attr( 'stroke-width', "2px")
        .attr( 'd', line );

      svg.append("g")
          .style('color', 'black')
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(x_axis);
      
      svg.append("g")
          .style('color', 'black')
          .call(y_axis);

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10 )
        .attr("x", 0 - (chart_height / 2))
        .attr("dy", "1em")
        .attr("dx", "1em")
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("font-weight", 500)
        .text("風險值");   
        
      svg.append("text")
        .attr("transform", "translate(" + chart_width + ", " + chart_height +")" )
        .attr("x", 0)
        .attr("y", margin.bottom / 2)
        .attr("dy", ".5em")
        .attr("dx", "1em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("日期");
      
      svg.append("text")
        .attr("transform", "translate(" + chart_width / 2 + ", 0)" )
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "-2em")
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("風險值變化");

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
      // doc.setFontSize(15);
      // doc.text('風險值', 35, 18);
      doc.addImage(imgData, 'PNG', 10, 75, 190, 70 );

    },
    generatePDFRiskGraphDescription(doc, ts, te, userHash){
      let month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      let new_ts = new Date(this.ts);
      let new_te = new Date(this.te - 24*60*60*1000);

      let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
                      + " 到 " + 
                      new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate();
      let text = "這頁顯示時間範圍內" + date_range + "的風險值變化，數值為 0~100之間，0~24屬於低風險使用者，25~49屬於中風險使用者，50~74屬於高風險使用者，大於75屬於極高風險使用者，";
      let text1 = "左上角圈圈代表風險值，圖表表示風險值隨時間變化，x軸代表時間變化，y軸代表風險值."
      doc.setFontSize(15);
      let lines = doc.splitTextToSize(text + text1, 210 - 15 -15);
      doc.text(15, 150, lines);
    },
    generatePDFSingleWorkingHoursDaily(doc, data){
      // data
      data = data.map(function(d){
        return {slice: 1, value: d.expected};
      });

      // pie chart
      $('#chart').empty();
      $('#canvas').empty();
      let chart_width = 450;
      let chart_height = 450;
      let padding = 60;
      let radius = chart_width / 2 - padding;

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width)
          .attr("height", chart_height)
          .append("g")
          .attr("transform", "translate(" + chart_width / 2 + ", " + chart_height /2 + ")");
      
      
      svg.append("g")
          .attr("class", "labels");
      svg.append("g")
          .attr("class", "bg-pie-chart");

      
      svg.append("g")
          .attr("class", "slices");
      svg.append("g")
          .attr("class", "bg-circle");

      let bg_color_scale = d3.scaleOrdinal()
          .range(["#cccccc", "#ffffff"])
      
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


      // pie chart layout
      let pie = d3.pie()
          .value(function(d){
            return d.slice;
          })
          .startAngle(-0.25 * Math.PI);
      
      let r_scale = d3.scaleLinear()
          .domain([
            0, d3.max(data, function(d){
              return d.value;
            })
          ])
          .range([0, radius]);

      let arc = d3.arc()
          .innerRadius(0)
          .outerRadius(function(d, i){
            return r_scale(d.data.value);
          })
      
      let slices = svg.select(".slices")
          .selectAll(".arc")
          .data(pie(data))
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

      d3.select("svg")
          .append("g")
          .attr("class", "title-text")
          .append("text")
          .text("24小時內工作活躍程度")
          .attr("x", chart_width / 2)
          .attr("text-anchor", "middle")
          .attr("y", padding / 2)
          .attr("dy", "-.1em")
          .attr("font-size", "20px");

      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width )
          .attr("height", chart_height );

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
      doc.addImage(imgData, 'PNG', 105, 125, 80, 80 );

    },
    generatePDFSingleWorkingHoursWeekly(doc, data){
      // process data
      let week_data = [];
      let sum = 0;
      let counter = 0;
      // console.log(data);
      
      for(let i=0; i<data.length; i++){
        sum += data[i].expected;
        counter += 1;
        if(counter == 48){
          // console.log(sum);
          
          week_data.push(sum);
          sum = 0;
          counter = 0;
        }
      }
      let labels = ["星期一", "星期二", "星期三", "星期四","星期五","星期六","星期日",]
      week_data = week_data.map(function(d, i){
        return {
          label: labels[i],
          value: d
        };
      });
      let bg_data = week_data.map(function(d, i){
        return {
          label: labels[i],
          value: d3.max(week_data, function(d){
            return d.value;
          })
        }
      })
      // console.log(bg_data);
      
      // back ground bar chart data
      
      // bar chart
      $('#chart').empty();
      $('#canvas').empty();
      
      let margin = {top: 40, right: 30, bottom:30, left: 60}
      let chart_width = 600 - margin.right - margin.left;
      let chart_height = 300 - margin.top - margin.bottom;

      let svg = d3.select("#chart")
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
      d3.select("svg").append("text")
          .text("一週工作活躍程度")
          .attr("x", margin.left + chart_width / 2)
          .attr("y", margin.top)
          .attr("dy", "-1em")
          .attr("text-anchor", "middle");

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
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.right + margin.left);

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
      doc.addImage(imgData, 'PNG', 10, 125, 95, 70 );
          
    },
    generatePDFSingleAlertThreatStatisics(doc, data){
      $('#chart').empty();
      $('#canvas').empty();

      let chart_width = 400;
      let chart_height = 400;
      let padding = 60;

      // console.log(data);
      let keys = Object.keys(data);
      data = keys.map(function(d, i){
        return {
          threat: d,
          num: data[d]
        };
      });
      // console.log(data);
            

      let radius = chart_height / 2;
      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + 2*padding)
          .attr("height", chart_height + 2*padding)
          .append("g")
          .attr("transform", "translate(" + (chart_width / 2 + padding) + ", " + (chart_height / 2 + padding) + ")");

      svg.append("g")
          .attr("class", "arcs")
      svg.append("g")
          .attr("class", "labels")
      svg.append("g")
          .attr("class", "legends")
      // console.log(data);
      let threat_type = ["Lateral Movement", "Credential Access", "Collection", "Initial Access", "Discovery"]
      let color_scale = d3.scaleOrdinal()
          .domain(threat_type)
          .range(d3.schemeTableau10);
      
      let pie = d3.pie()
          .value(function(d){
            return d.num;
          });
      let arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
      
      svg.select(".arcs")
          .selectAll(".arc")
          .data(pie(data))
          .enter()
          .append("g")
          .attr("class", "arc")
          .append("path")
          .attr("d", arc)
          .attr("fill", function(d){
            // console.log(d);
            return color_scale(d.data.threat);
          })
          .attr("stroke", "black");

      let legend = svg.select(".legends")
          .attr("transform", "translate(" +  (chart_width / 2 - 60) + ", " +  -(chart_height / 2  + 50) + ")")
          .selectAll(".legend")
          .data(threat_type);
        
      legend.enter()
          .append("g")
          .attr("class", "legend")
          .append("rect")
          .attr("x", 0)
          .attr("width", 15)
          .attr("height", 15)
          .attr("y", function(d, i){
            return (15 + 3) * i; 
          })
          .attr("fill", function(d){
            return color_scale(d);
          });
      
      legend.enter()
          .append("text")
          .attr("x", 20)
          .attr("y", function(d, i){
            return (15 + 3) * i;
          })
          .text(function(d){
            return d;
          })
          .attr("dy", "1em")
          .attr("font-size", "10px");
      
      let total_num = d3.sum(data, function(d){
        return d.num;
      });
      svg.select(".labels")
          .selectAll(".label")
          .data(pie(data))
          .enter()
          .append("g")
          .attr("class", "label")
          .append("text")
          .text(function(d){
            return (Math.floor(d.data.num / total_num * 100) + "%");
          })
          .attr("transform", function(d){
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .attr("dx", ".2em");

      
      d3.select("svg")
          .append("text")
          .attr("x", padding + chart_width / 2)
          .attr("y", padding / 2)
          .text("異常種類分佈")
          .attr("text-anchor", "middle")
          .attr("font-size", "25px");
      
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select("#canvas")
          .attr("width", chart_width + 2 * padding)
          .attr("height", chart_height + 2 * padding);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      
      
      
      d3.select("#canvas")
          .attr("width", 500)
          .attr("height", 500);
      doc.addImage(imgData, 'PNG', 105, 205, 90, 90 );


    },
    generatePDFSingleTableInfo(doc, riskBreakdown, authLogin, exitProducers, screenCaptures, violationProducers){
      $('#my-table').empty();
      let jspdfTable = [];
      
      jspdfTable.push(["極高風險異常數量", riskBreakdown.extreme]);
      jspdfTable.push(["高風險異常數量", riskBreakdown.high]);
      jspdfTable.push(["中風險異常數量", riskBreakdown.medium]);
      jspdfTable.push(["低風險異常數量", riskBreakdown.low]);
      jspdfTable.push(["登入失敗次數", authLogin[0].totalFailed]);
      jspdfTable.push(["登入成功次數", authLogin[0].totalSuccess]);
      // console.log(exitProducers.length);
      if(!exitProducers.length){
        // console.log("test");
        jspdfTable.push(["USB拔除次數", 0]);
      } else {
        let num = Object.keys(exitProducers)[0];
        jspdfTable.push(["USB拔除次數", num]);
      }

      if(!screenCaptures.length){
        // console.log("test");
        jspdfTable.push(["螢幕截圖次數", 0]);
      } else {
        let num = Object.keys(screenCaptures)[0];
        jspdfTable.push(["螢幕截圖次數", num]);
      }

      if(!violationProducers.length){
        // console.log("test");
        jspdfTable.push(["違規觸發次數", 0]);
      } else {
        let num = Object.keys(violationProducers)[0];
        jspdfTable.push(["違規觸發次數", num]);
      }

      doc.autoTable({html: '#my-table'});
      doc.autoTable({
        startY: 210,
        margin:{
          left: 20,
        },
        tableWidth: 80,
        theme: 'striped',
        body: jspdfTable,
        styles: {
          font: "msyh",
        },
        bodyStyles: {
          textColor: "black",
          halign: "center",
          lineWidth: .5,
          lineColor: "#878787",
        },
        columnStyles: {
          0: {
            cellWidth: 60,
          },
          1: {
            cellWidth: 20,
          }
        }
      })
    },
    pdfGenerateSingleUserReport(){
      // 1st Page
      this.userName = this.formData.user;
      let doc = new jsPDF();
      doc.setFont('msyh');
      let month = [1,2,3,4,5,6,7,8,9,10,11,12]
      
      doc.setFontSize(24);
      doc.text('Interset個人報表', 70, 150);
      
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

      doc.setFontSize(15);

      doc.text("使用者 : " + this.userName, 75, 170);

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
      doc.text(date_range, 80, 180);

      // let selection = this.formData.contentList.slice();
      // let promiseArray = [
      //   // maximum risk, and risk graph
      //   apiService.getUserRiskGraph(this.userHash, this.ts, this.te),
      //   // workingHoursDaily
      //   apiService.getUserWorkingHoursDaily(this.userHash),
      //   // workingHoursWeekly
      //   apiService.getUserWorkingHoursWeekly(this.userHash),
      //   // threat statistics
      //   apiService.getUserAlertsThreatStatistics(this.userHash, this.ts, this.te),
      //   // table data
      //   apiService.getUserAlertsBreakdown(this.userHash, this.ts, this.te),
      //   apiService.getUserTopFailedLogin(this.userHash, this.ts, this.te),
      //   apiService.getUserTopExitProducers(this.userHash, this.ts, this.te),
      //   apiService.getUserTopScreenCaptures(this.userHash, this.ts, this.te),
      //   apiService.getUserTopViolationProducers(this.userHash, this.ts, this.te),
      //   // risk graph stram
      
      // ]
      
      // let exectionPromiseArray = [];
      // let pdf_map = {}
      // let pdf_counter = 0;

      // selection.forEach(function(d){
      //   if(d == 0){
      //     // maximum rosk and risk line chart graph
      //     exectionPromiseArray.push(promiseArray[0]);
      //     pdf_map[d] = pdf_counter;
      //     pdf_counter += 1;
      //   }else if(d == 1){
      //     // working hours daily
      //     exectionPromiseArray.push(promiseArray[1]);
      //     pdf_map[d] = pdf_counter;
      //     pdf_counter += 1;
      //   }else if(d == 2){
      //     // working hours weekly
      //     exectionPromiseArray.push(promiseArray[2]);
      //     pdf_map[d] = pdf_counter;
      //     pdf_counter += 1;
      //   }else if(d == 3){
      //     // threat statistics
      //     exectionPromiseArray.push(promiseArray[3]);
      //     pdf_map[d] = pdf_counter;
      //     pdf_counter += 1;
      //   }else if(d == 4){
      //     //working hours daily
      //     exectionPromiseArray.push(promiseArray[4]);
      //     exectionPromiseArray.push(promiseArray[5]);
      //     exectionPromiseArray.push(promiseArray[6]);
      //     exectionPromiseArray.push(promiseArray[7]);
      //     exectionPromiseArray.push(promiseArray[8]);
      //     pdf_map[d] = pdf_counter;
      //     pdf_counter += 1;
      //   }
      //   // else if(d == 5){
      //   //   exectionPromiseArray.push(promiseArray[9])
      //   //   pdf_map[d] = pdf_counter;
      //   //   pdf_counter += 1;
      //   // }
      // });
      
      apiService.getUserHash(this.userName).then((value) => {
        // get Hash

        this.userHash = value.data.users[0].entityHash;
        // console.log(this.userHash);
        let selection = this.formData.contentList.slice();
        let promiseArray = [
          // maximum risk, and risk graph
          apiService.getUserRiskGraph(this.userHash, this.ts, this.te),
          // workingHoursDaily
          apiService.getUserWorkingHoursDaily(this.userHash),
          // workingHoursWeekly
          apiService.getUserWorkingHoursWeekly(this.userHash),
          // threat statistics
          apiService.getUserAlertsThreatStatistics(this.userHash, this.ts, this.te),
          // table data
          apiService.getUserAlertsBreakdown(this.userHash, this.ts, this.te),
          apiService.getUserTopFailedLogin(this.userHash, this.ts, this.te),
          apiService.getUserTopExitProducers(this.userHash, this.ts, this.te),
          apiService.getUserTopScreenCaptures(this.userHash, this.ts, this.te),
          apiService.getUserTopViolationProducers(this.userHash, this.ts, this.te),
          // risk graph stram
        
        ]
        
        let exectionPromiseArray = [];
        let pdf_map = {}
        let pdf_counter = 0;

        selection.forEach(function(d){
          if(d == 0){
            // maximum rosk and risk line chart graph
            exectionPromiseArray.push(promiseArray[0]);
            pdf_map[d] = pdf_counter;
            pdf_counter += 1;
          }else if(d == 1){
            // working hours daily
            exectionPromiseArray.push(promiseArray[1]);
            pdf_map[d] = pdf_counter;
            pdf_counter += 1;
          }else if(d == 2){
            // working hours weekly
            exectionPromiseArray.push(promiseArray[2]);
            pdf_map[d] = pdf_counter;
            pdf_counter += 1;
          }else if(d == 3){
            // threat statistics
            exectionPromiseArray.push(promiseArray[3]);
            pdf_map[d] = pdf_counter;
            pdf_counter += 1;
          }else if(d == 4){
            //working hours daily
            exectionPromiseArray.push(promiseArray[4]);
            exectionPromiseArray.push(promiseArray[5]);
            exectionPromiseArray.push(promiseArray[6]);
            exectionPromiseArray.push(promiseArray[7]);
            exectionPromiseArray.push(promiseArray[8]);
            pdf_map[d] = pdf_counter;
            pdf_counter += 1;
          }
          // else if(d == 5){
          //   exectionPromiseArray.push(promiseArray[9])
          //   pdf_map[d] = pdf_counter;
          //   pdf_counter += 1;
          // }
        });
        
        // console.log(this.userHash);
        Promise.all(
          exectionPromiseArray
        ).then((values) => {
          let selection_count = selection.length;

          selection = this.removeFromSelection(selection, 5);
          while(selection.length != 0){
            // console.log(selection.length);
            
            if(selection.includes(0)){
              // ==============================
              // maximum risk score and risk line chart
              // ==============================
              doc.addPage();
              let data = values[pdf_map[0]].data;
              this.generatePDFSingleRisk(doc, data);
              this.generatePDFSingleRiskGraph(doc, data);
              this.generatePDFRiskGraphDescription(doc, this.ts, this.te, this.userHash)
              selection = this.removeFromSelection(selection, 0);
            } else if(selection.includes(1)){
              // ==============================
              // working hours daily
              // ==============================
              doc.addPage();
              let data = values[pdf_map[1]].data;
              this.generatePDFSingleWorkingHoursDaily(doc, data);
              selection = this.removeFromSelection(selection, 1);
            } else if(selection.includes(2)){
              // ==============================
              // working hours weekly
              // ==============================
              doc.addPage();
              let data = values[pdf_map[2]].data;
              this.generatePDFSingleWorkingHoursWeekly(doc, data);
              selection = this.removeFromSelection(selection, 2);
            } else if(selection.includes(3)){
              // ==============================
              // threat statistics
              // ==============================
              doc.addPage();
              let data = values[pdf_map[3]];
              this.generatePDFSingleAlertThreatStatisics(doc, data);
              selection = this.removeFromSelection(selection, 3);
            } else if(selection.includes(4)){
              // ==============================
              // table data
              // ==============================
              doc.addPage();
              let riskBreakdown = values[pdf_map[4]].data;
              let authLogin = values[pdf_map[4]+1].data;
              let exitProducers = values[pdf_map[4]+2].data;
              let screenCaptures = values[pdf_map[4]+3].data;
              let violationProducers = values[pdf_map[4]+4].data;
              this.generatePDFSingleTableInfo(doc, riskBreakdown, authLogin, exitProducers, screenCaptures, violationProducers);              selection = this.removeFromSelection(selection, 4);
            }
          }
          // doc.addPage();
          // // let userRisk = values[0].data.risk;
          // this.generatePDFSingleRisk(doc, values[0].data);
          // // risk graph
          // this.generatePDFSingleRiskGraph(doc, values[1].data)
          // // working hours daily
          // this.generatePDFSingleWorkingHoursDaily(doc, values[2].data);
          // // working hours weekly
          // this.generatePDFSingleWorkingHoursWeekly(doc, values[3].data);
          // // alert threat type
          // this.generatePDFSingleAlertThreatStatisics(doc, values[4]);
          // // table data
          // let riskBreakdown = values[5].data;
          // let authLogin = values[6].data;
          // let exitProducers = values[7].data;
          // let screenCaptures = values[8].data;
          // let violationProducers = values[9].data;
          
          
          // this.generatePDFSingleTableInfo(doc, riskBreakdown, authLogin, exitProducers, screenCaptures, violationProducers);
          doc.save('test.pdf');
          
        });
      });
    },
    pdfGenerate(){

      if(this.formData.contentList.length == 0){
        this.noData = true;
      } else {
        this.noData = false;
        this.pdfGenerateSingleUserReport();
      }
    },
    removeFromSelection(selection, data_type){
      let d_index = selection.indexOf(data_type);
      selection.splice(d_index, 1);
      return selection;
    }
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