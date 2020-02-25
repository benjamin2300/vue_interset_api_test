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
  name: "OrganizationReportGenerator",
  data(){
    return {
      noData: false,
      ts: "",
      te: "",
    }
  },
  props: {
    formData: {
      type: Object
    },
  },
  methods: {
    generatePDFOrganRiskStream(doc, data){
      $('#chart').empty();
      $('#canvas').empty();
      
      console.log(data);
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
      
      let margin = {top: 50, right: 100, left: 30, bottom: 30};
      let chart_width = 1200 - margin.left - margin.right;
      let chart_height = 400 - margin.top - margin.bottom;

      
      // console.log(stacked_data);
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

      
      // let y_scale = d3.scaleLinear()
      //     .domain([0 ,
      //       d3.max(data, function(d){
      //         let sum = 0;
      //         keys.forEach(function(key){
      //           sum += d[key];
      //         })
      //         return sum;
      //       })
      //     ])
      //     .range([chart_height, 0]);
      let y_scale = d3.scaleLinear()
          .domain([0 , 100
          ])
          .range([chart_height, 0]);
      
      
      let color_scale = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeCategory10);

      

      let svg = d3.select("#chart")
          .append("svg")
          .attr("width", chart_width + margin.left + margin.right)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
      // layer 
      svg.append("g")
          .attr("class", "stacked-stream-chart");
      
      svg.append("g")
          .attr("class", "x-axis");

      svg.append("g")
          .attr("class", "y-axis");
      
      svg.append("g")
          .attr("class", "legend");

      // layout
      let area = d3.area()
          .x(function(d, i){
            // console.log(x_scale(d.data.date));
            
            return x_scale(d.data.date);
          })
          .y0(function(d){
            return y_scale(d[0]);
          })
          .y1(function(d){     
            if(d[1] >= 100){
              console.log(y_scale(100));
              
              return y_scale(100)
            }else{
              console.log(y_scale(d[1]));
              
              return y_scale(d[1]);
            }
              
          })
          .curve(d3.curveMonotoneX);
      
      let stacked_data = d3.stack()
          .keys(keys)(data);

      // chart layer
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
            return color_scale(i)
          })
          .attr("stroke-width", "1px")
          .attr("stroke", "black");

      let time_format = d3.timeFormat('%m/%d');

      let x_axis = d3.axisBottom(x_scale)
          .ticks(10)
          .tickFormat(time_format);

      let y_axis = d3.axisLeft(y_scale)
          .ticks(10);

      svg.select(".x-axis")
          .attr("color", "black")
          .attr("transform", "translate(0, " + chart_height + ")")
          .call(x_axis);
      svg.select(".y-axis")
          .attr("color", "black")
          .call(y_axis);
      
      svg.select(".legend")


                  
      
      
    },
    generatePDFOrganRiskPage(doc, data){
      doc.addPage();
      doc.setFontSize(24);
      doc.text("總體風險值變化", 60, 20);
      // console.log(data);
      // console.log(new Date(data[0].timestamp));
      $('#chart').empty();
      $('#canvas').empty();
      
      let time_format = d3.timeFormat('%m/%d');
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
          .ticks(6)
          .tickFormat(time_format);
      
      let y_axis = d3.axisLeft(y_scale)
          .ticks(10);

      svg.append("g")
          .style('color', 'black')
          .attr("transform", "translate(0, " + (chart_height - margin.bottom) + ")")
          .call(x_axis);
          // .selectAll("text")
          // .style("text-anchor", "end")
          // .attr("dx", "-.8em")
          // .attr("dy", "-.55em")
          // .attr("transform", "rotate(-90)");
      
      svg.append("g")
          .style('color', 'black')
          .attr("transform", "translate(" + margin.left + ", 0)")
          .call(y_axis);
      
      // Create Line
      let line = d3.line()
          .defined(function(d){
            return d.risk >= 0;
          })
          .x(function(d){
            // console.log(x_scale(d.date))
            return x_scale(d.date);
          })
          .y(function(d){
            return y_scale(d.risk);
          })
         	.curve(d3.curveMonotoneX);
      
      svg.append( 'path' )
        .datum( data )
        .attr( 'fill', 'none' )
        .attr( 'stroke', '#73FF36')
        .attr( 'stroke-width', "2px")
        .attr( 'd', line );

      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      // console.log(imgData);
      doc.addImage(imgData, 'PNG', 20, 50, 150, 150);
      
    },
    generatePDFOrganAuthenicationPage(doc, data){
      $('#chart').empty();
      $('#canvas').empty();
      doc.addPage();
      doc.setFontSize(24);
      doc.text("登入失敗最高的使用者", 60, 20);

      let m = 2;
      let keys = ['totalSuccess', 'totalFailed'];
      let margin = {top: 50, right: 50, bottom: 70, left: 40};
      let chart_width = 500 - margin.right - margin.left;
      let chart_height = 350 - margin.top - margin.bottom;
      let svg = d3.select("#chart")
          .append('svg')
          .attr("width", chart_width + margin.right + margin.left)
          .attr("height", chart_height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top +")");
      
      let x0_scale = d3.scaleBand()
            .domain(data.map(function(d){
              return d.entityName;}
            ))
            .rangeRound([0, chart_width])
            .paddingInner(0.2);
      
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

      let z_scale = d3.scaleOrdinal()
            .range(["#41ef08", "#e93b26"]);

      let legend_scale = d3.scaleOrdinal()
            .domain(keys)
            .range(["登入成功", "登入失敗"]);

      svg.append("g")
        .attr("class", "x-axis")
        .style('color', 'black')
        .attr("transform", "translate(0, " + (chart_height) + ")")
        .call(d3.axisBottom(x0_scale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");
      
      svg.append("g")
        .attr("class", "y-axis")
        .style('color', 'black')
        // .attr("transform", "translate(" + margin.left + ", 0)")
        .call(d3.axisLeft(y_scale));

      svg.append("g")
        .selectAll(".slice")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "slice")
        .attr("transform", function(d){return "translate(" + x0_scale(d.entityName) + ",0)"})
        .selectAll("rect")
        .data(function(d){return keys.map(function(key){return {key: key, value:d[key]};});})
        .enter()
        .append("rect")
        .attr("x", function(d){return x1_scale(d.key);})
        .attr("y", function(d){return y_scale(d.value);})
        .attr("width", x1_scale.bandwidth())
        .attr("height", function(d){return chart_height - y_scale(d.value)})
        .attr("fill", function(d){return z_scale(d.key)});
      
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
        // .style("opacity", "1");
        // // .attr("font-family", "sans-serif")
        // .attr("font-size", 10)
        // .attr("text-anchor", "end");
      
      legend.append("rect")
        .attr("x", chart_width - 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", function(d){ return z_scale(d); });

      legend.append("text")
        .attr("x", chart_width - 30)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .style("text-anchor", "end")
        .text(function(d){ return legend_scale(d);});
      
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      let firstSvg = $('#chart');
      let content = $(firstSvg).html();
      // console.log(content);
        
      context.drawSvg(content);
      let imgData = canvas.toDataURL('image/png');
      // console.log(imgData);
      doc.addImage(imgData, 'PNG', 20, 50, 150, 150);
      
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
      svg.append("g")
          .attr("class", "bg-pie-chart");
      
      svg.append("g")
          .attr("class", "arcs");
      
      svg.append("g")
          .attr("class", "bg-circle");

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
        pageTitle = "風險最高的";
        pageTableHeader = "風險值";
      }else if(pageType == "access"){
        pageTitle = "接入次數最多的";
        pageTableHeader = "接入次數";
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
        $('#chart').empty();
        $('#canvas').empty();
        let margin = {top: 20, right: 20, bottom: 70, left: 40};
        let chart_width = 500 - margin.right - margin.left;
        let chart_height = 350 - margin.top - margin.bottom;
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
        // console.log(imgData);
        doc.addImage(imgData, 'PNG', 20, 125, 150, 150);
        
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
      // console.log(this.ts);
      // console.log(this.te);
      
      
      this.ts = this.ts.getTime();
      this.te = this.te.getTime();

      let new_ts = new Date(this.ts);
      let new_te = new Date(this.te);

      let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
                      + " 到 " + 
                      new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate(); 
      doc.text(date_range, 85, 170);
      // 2nd Page After
      // console.log(this.ts);
      let selection = this.formData.contentList.slice();
      let promiseArray = [
        apiService.getTopRiskyUsers(this.ts, this.te),
        apiService.getTopRiskyControllers(this.ts, this.te),
        apiService.getTopAccessedControllers(this.ts, this.te),
        apiService.getTopRiskyProjects(this.ts, this.te),
        apiService.getTopAccessedProjects(this.ts, this.te),
        apiService.getTopRiskyResources(this.ts, this.te),
        apiService.getTopAccessedResources(this.ts, this.te),
        apiService.getTopRiskyShares(this.ts, this.te),
        apiService.getTopAccessedShares(this.ts, this.te),
        apiService.getRiskGraph(this.ts, this.te),
        apiService.getAuthenication(this.ts, this.te),
        apiService.getWorkingHoursDaily(),
        apiService.getWorkingHoursWeekly(),
        apiService.getRiskStream(this.ts, this.te)
      ];
      // let exectionPromiseArray = selection.map(d => {
      //   return promiseArray[d];
      // });
      let exectionPromiseArray = [];
      let pdf_map = {}
      let pdf_counter = 0;

      selection.forEach(function(d){
        if(d == 0){
          // user
          exectionPromiseArray.push(promiseArray[0]);
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }else if(d == 1 || d == 2 || d == 3 || d == 4 ){
          // controller, project, resource, share
          exectionPromiseArray.push(promiseArray[2*d-1]);
          exectionPromiseArray.push(promiseArray[2*d]);
          pdf_map[d] = pdf_counter;
          pdf_counter += 2;
        }else if(d == 11){
          // risk graph
          exectionPromiseArray.push(promiseArray[9]);
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }else if(d == 12){
          // authication
          exectionPromiseArray.push(promiseArray[10]);
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }else if(d == 13){
          //working hours daily
          exectionPromiseArray.push(promiseArray[11]);
          exectionPromiseArray.push(promiseArray[12]);
          pdf_map[d] = pdf_counter;
          pdf_counter += 2;
        }else if(d == 14){
          exectionPromiseArray.push(promiseArray[13])
          pdf_map[d] = pdf_counter;
          pdf_counter += 1;
        }
      });
      // console.log(pdf_map);
      // console.log(selection);
      
              // get data, promise geting all data and generate pdf
      Promise.all(
                  exectionPromiseArray
                  )           
            .then((values) =>   
      {
        let selection_count = selection.length;
        for (let i=0; i<selection_count; i++){
          if(selection.includes(11)){
            // ==========================
            // risk graph page
            // ==========================
            let data = values[pdf_map[11]].data;
            this.generatePDFOrganRiskPage(doc, data);
            selection = this.removeFromSelection(selection, 11);
          } else if(selection.includes(0)){
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
            // top risky projects page
            // ==========================
            let data = values[pdf_map[2]].data;

            this.generatePDFOrganPage(doc, data, 'project', 'risk', true, false);
            // =============================
            // top accessed projects page
            // =============================
            data = values[pdf_map[2] + 1];
            this.generatePDFOrganPage(doc, data, 'project', 'access', true, true);
            selection = this.removeFromSelection(selection, 2);
          } else if(selection.includes(3)){
            // ==========================
            // top risky resources page
            // ==========================
            let data = values[pdf_map[3]].data;
            
            this.generatePDFOrganPage(doc, data, 'resource', 'risk', true, false);
            // =============================
            // top accessed resources page
            // =============================
            data = values[pdf_map[3] + 1];
            this.generatePDFOrganPage(doc, data, 'resource', 'access', true, true);
            selection = this.removeFromSelection(selection, 3);
          } else if(selection.includes(4)){
            // ==========================
            // top risky share page
            // ==========================
            let data = values[pdf_map[4]].data;
            
            this.generatePDFOrganPage(doc, data, 'share', 'risk', true, false);
            // =============================
            // top accessed share page
            // =============================
            data = values[pdf_map[4] + 1];
            this.generatePDFOrganPage(doc, data, 'share', 'access', true, true);
            selection = this.removeFromSelection(selection, 4);
          } else if(selection.includes(12)){
            // ==========================
            // authenication page
            // ==========================
            let data = values[pdf_map[12]].data;
            // console.log(data);
            this.generatePDFOrganAuthenicationPage(doc, data);
            selection = this.removeFromSelection(selection, 12);
          } else if(selection.includes(13)){
            let daily_data = values[pdf_map[13]].data;
            let weekly_data = values[pdf_map[13] + 1].data;
            // console.log(data);
            this.generatePDFOrganWorkingHours(doc, daily_data, weekly_data);
            selection = this.removeFromSelection(selection, 13);
          } else if(selection.includes(14)){
            let data = values[pdf_map[14]].data;
            this.generatePDFOrganRiskStream(doc, data);
            selection = this.removeFromSelection(selection, 14);
          }
        }
        doc.save('test.pdf');
      });
    },
    pdfGenerate(){

      if(this.formData.contentList.length == 0){
        this.noData = true;
      } else {
        this.noData = false;
        this.pdfGenerateOrganizationReport();
      }
    
    
    },
    entityNameMapping(entityName){
      if(entityName == 'user'){
        return "使用者";
      }else if(entityName == 'controller'){
        return "控制器";
      }else if(entityName == 'project'){
        return "專案";
      }else if(entityName == 'share'){
        return "分享資源";
      }else if(entityName == 'resource'){
        return "資源";
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