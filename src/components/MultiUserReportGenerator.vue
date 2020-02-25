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
          .attr("text-anchor", "start")
          .text(function(d){
            return d;
          })
          .attr("font-size", "13px")
          .attr("dy", ".75em");
      // canvas

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
      doc.setFontSize(30);
      doc.text('多名使用者風險值變化', 50, 20);
      doc.addImage(imgData, 'PNG', 10, 30, 190, 70);
      doc.setFontSize(30);
    },
    generatePDFMultiAlertsBreakdown(doc, data, userNameList){
      $('#chart').empty();
      $('#canvas').empty();

      // stakced bar chart
      let margin = {top: 40, right: 120, bottom: 30, left: 40}
      let chart_width = 800 - margin.left - margin.right;
      let chart_height = 500 - margin.top - margin.bottom;

      let alert_type = ["low", "medium", "high", "extreme"];

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", "+ margin.top + ")");
      
      //layer
      svg.append("g")
          .attr("class", "grouped-chart");
      
      svg.append("g")
          .attr("class", "x-axis");
          
      svg.append("g")
          .attr("class", "y-axis");
      
      svg.append("g")
          .attr("class", "legend");
      

      // scale
      let x0_scale = d3.scaleBand()
          .domain(userNameList)
          .range([0, chart_width])
          .padding(0.2);
      
      let x1_scale = d3.scaleBand()
          .domain(alert_type)
          .range([0, x0_scale.bandwidth()]);

      let y_scale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d){
            return d.low;
          })])
          .range([chart_height, 0]);
      
      let color_scale = d3.scaleOrdinal()
          .domain(alert_type)
          .range(["#cccccc", "#ffce00", "#ff8c00", "#940f23"])

      svg.select(".grouped-chart")
          .selectAll(".g-bars")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "g-bars")
          .attr("transform", function(d, i){
            return "translate(" + x0_scale(userNameList[i]) + ", " + "0)" ;
          })
          .selectAll("rect")
          .data(function(d){
            return alert_type.map(function(key){
              return {
                key: key,
                value: d[key]
              };
            });
          })
          .enter()
          .append("rect")
          .attr("x", function(d, i){
            return x1_scale(d.key);
          })
          .attr("y", function(d){
            return y_scale(d.value);
          })
          .attr("width", x1_scale.bandwidth())
          .attr("height", function(d){
            return chart_height - y_scale(d.value);
          })
          .attr("fill", function(d, i){
            return color_scale(d.key)
          });

      svg.select(".grouped-chart")
          .selectAll(".g-labels")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "g-labels")
          .attr("transform", function(d, i){
            return "translate(" + x0_scale(userNameList[i]) + ", " + "0)" ;
          })
          .selectAll("text")
          .data(function(d){
            return alert_type.map(function(key){
              return {
                key: key,
                value: d[key]
              };
            });
          })
          .enter()
          .append("text")
          .attr("x", function(d, i){
            return x1_scale(d.key) + x1_scale.bandwidth() / 2;
          })
          .text(function(d){
            return d.value;
          })
          .attr("text-anchor", "middle")
          .attr("y", function(d){
            return y_scale(d.value) - 13;
          })
          .attr("font-size", "15px");

      svg.select(".x-axis")
          .attr("transform", "translate(0," + chart_height + ")")
          .attr("color", "black")
          .call(d3.axisBottom(x0_scale));
      
      svg.select(".y-axis")
          .attr("color", "black")
          .call(d3.axisLeft(y_scale))

      // canvas

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
      doc.setFontSize(30);
      doc.text('多名使用者異常等級數量分佈', 50, 20);
      doc.addImage(imgData, 'PNG', 10, 30, 190, 70);
      // doc.setFontSize(30);
      
      // let stacked = d3.stack()
      //     .keys(alert_type)(data);
      
      // console.log(stacked);
      
      // d3.select(".stacked-chart")
      //     .selectAll(".stacked-bar")
      //     .data(stacked)
      //     .enter()
      //     .append("g")
      //     .attr("class", "stacked-bar")
      //     .attr("fill", function(d){
      //       // console.log(d.key);
            
      //       return color_scale(d.key);
      //     })
      //     .selectAll("rect")
      //     .data(function(d){
      //       // console.log(d);
            
      //       return d;
      //     })
      //     .enter()
      //     .append("rect")
      //     .attr("x", function(d, i){
      //       console.log(x_scale(userNameList[i]));
            
      //       return x_scale(userNameList[i]);
      //     })
      //     .attr("y", function(d){
      //       return y_scale(d[1]);
      //     })
      //     .attr("height", function(d){
      //       return y_scale(d[0]) - y_scale(d[1]);
      //     })
      //     .attr("width", x_scale.bandwidth());
          
    },
    generatePDFMultiWorkingHoursDaily(doc, allData, userNameList){
      // console.log(data);
      doc.addPage();
      doc.setFontSize(30);
      doc.text('多名使用者24小時內活躍程度', 45, 15);
      // processing data
      for(let i=0; i<allData.length; i++){
        allData[i] = allData[i].map(function(d){
          return {
            slice: 1,
            r: d.expected
          }
        })
      }
      // console.log(data);
      // pie chart 
      //clear c#hart
      // public data
      

      // loop userslist
      for(let ui=0; ui<allData.length; ui++){

        let data = allData[ui];
        $('#chart').empty();
        $('#canvas').empty();
        
        let margin = {top:60, left:60, bottom:60, right:60};
        let chart_width = 450 - margin.right - margin.left;
        let chart_height = 450 - margin.top - margin.bottom;
        let radius = chart_width / 2;
        
        let svg = d3.select("#chart")
            .append("svg")
            .attr("width", chart_width + margin.right + margin.left)
            .attr("height", chart_height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (margin.left + radius) + ", " + (margin.top + radius)+ ")");
        // layer
        svg.append("g")
          .attr("class", "labels");
        svg.append("g")
            .attr("class", "bg-pie-chart");
        svg.append("g")
            .attr("class", "arcs");
        svg.append("g")
            .attr("class", "bg-circle");
        
        // drawing
        // bg-chart
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

        // circle stroke
        let bg_circle = svg.select(".bg-circle")
            .append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", radius)
            .attr("stroke-width", "1px")
            .attr("stroke", "#6c85a8")
            .attr("fill", "none");
        // pie chart
        // pie chart layout
        let pie = d3.pie()
            .value(function(d){
              return d.slice;
            })
            .startAngle(-0.25 * Math.PI);
        
        let r_scale = d3.scaleLinear()
            .domain([
              0, d3.max(data, function(d){
                return d.r;
              })
            ])
            .range([0, radius]);

        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(function(d, i){
              return r_scale(d.data.r);
            })
        
        let slices = svg.select(".arcs")
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
        // label
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
        // title
        d3.select("svg")
            .append("g")
            .attr("class", "title-text")
            .append("text")
            .text(userNameList[ui])
            .attr("x", chart_width / 2 + margin.left)
            .attr("text-anchor", "middle")
            .attr("y", margin.top / 2)
            .attr("dy", "-.1em")
            .attr("font-size", "20px");

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
        doc.addImage(imgData, 'PNG', 80 * (ui % 2) + 30  
                                  , 70 * Math.floor(ui / 2) + 20 
                                  , 70
                                  , 70 );
      }

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
        apiService.getMultiUserWorkingHoursDaily(this.userHashList)

      ]).then((values) => {
        this.generatePDFMultiRiskGraph(doc, values[0], this.userNameList);
        // console.log(values[1]);
        
        this.generatePDFMultiAlertsBreakdown(doc, values[1], this.userNameList);
        this.generatePDFMultiWorkingHoursDaily(doc, values[2], this.userNameList);
        doc.save("test.pdf");

      })
    },
    
    pdfGenerate(){

      if(this.formData.contentList.length == 0){
        this.noData = true;
      } else {
        this.noData = false;
        this.pdfGenerateMultiUserReport();
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