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
  name: "PDFGenerator",
  data(){
    return {
      noData: false,
      ts: "",
      te: ""
    }
  },
  props: {
    formData: {
      type: Object
    },
  },
  methods: {
    generatePDFRiskPage(doc, data){
      
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
      
      // let x_axis = d3.axisBottom(x_scale);
      // if(this.formData.formType == "year"){
      //   let time_format = d3.timeFormat('%m月');
      //   x_axis.ticks(12)
      //     .tickFormat(time_format);
          
      // }
      let x_axis = d3.axisBottom(x_scale)
          .ticks(5)
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
      // console.log(imgData);
      doc.addImage(imgData, 'PNG', 20, 50, 150, 150);
      
    },
    generatePDFAuthenicationPage(doc, data){
      $('#chart').empty();
      $('#canvas').empty();
      doc.addPage();
      doc.setFontSize(24);
      doc.text("登入失敗最高的使用者", 60, 20);

      let m = 2;
      let keys = ['totalSuccess', 'totalFailed'];
      let margin = {top: 20, right: 20, bottom: 70, left: 40};
      let chart_width = 500 ;
      let chart_height = 350 ;
      let svg = d3.select("#chart")
          .append('svg')
          .attr("width", chart_width)
          .attr("height", chart_height);
      
      let x0_scale = d3.scaleBand()
            .domain(data.map(function(d){return d.entityName;}))
            .rangeRound([margin.left, chart_width - margin.right])
            .paddingInner(0.2);
      
      let x1_scale = d3.scaleBand()
            .domain(keys)
            .rangeRound([0, x0_scale.bandwidth()]);
      
      let y_scale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){ return d3.max(keys, function(key){return d[key];})})])
            .range([chart_height - margin.bottom, margin.top]);

      let z_scale = d3.scaleOrdinal()
            .range(["#41ef08", "#e93b26"]);

      let legend_scale = d3.scaleOrdinal()
            .domain(keys)
            .range(["登入成功", "登入失敗"]);

      svg.append("g")
        .attr("class", "x-axis")
        .style('color', 'black')
        .attr("transform", "translate(0, " + (chart_height - margin.bottom) + ")")
        .call(d3.axisBottom(x0_scale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");
      
      svg.append("g")
        .attr("class", "y-axis")
        .style('color', 'black')
        .attr("transform", "translate(" + margin.left + ", 0)")
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
        .attr("height", function(d){return chart_height - margin.bottom - y_scale(d.value)})
        .attr("fill", function(d){return z_scale(d.key)});
      
      // console.log(keys);
      // console.log(keys.slice());
      // console.log(keys.slice().reverse());
      
      
      let legend = svg.selectAll(".legend")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .data(keys.slice().reverse())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i){return "translate(0," + i * 20 + ")"})
        .style("opacity", "1");
      
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
    generatePDFWorkingHoursDaily(doc, data){
      $('#chart').empty();
      $('#canvas').empty();
      doc.addPage();
      doc.setFontSize(24);
      doc.text("使用者每日平均工作時數", 60, 20);

      let margin = {top: 30, right: 30, bottom: 30, left: 30};
      let chart_width = 500 ;
      let chart_height = 500 ;

    },
    generatePDFPage(doc, data, entityName, pageType, table_flag=false, chart_flag=false){
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
    wrap(text, width) {
      text.each(function() {
        let text = d3.select(this),
        words = text.text().split("/").reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 1.1,
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    },
    pdfGenerate(){
      
      if(this.formData.content.length == 0){
        this.noData = true;
      } else {
        this.noData = false;
        // console.log("test");
        // 1st Page
        var doc = new jsPDF();
        doc.setFont('msyh');
        let month = [1,2,3,4,5,6,7,8,9,10,11,12]
        
        doc.setFontSize(24);
        doc.text('Interset總體報表', 70, 150);
        
        if(this.formData.formType == "year"){
          doc.setFontSize(20);
          doc.text(this.formData.year.getFullYear() + "年報", 85, 160);
        }else if(this.formData.formType == "season"){
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
          doc.text(t + "月報", 80, 160);
        } else if(this.formData.formType == "month"){
          console.log(this.formData.formType);
          
          doc.setFontSize(20);
          let t = this.formData.month.getFullYear();
          t += "/" + (this.formData.month.getMonth()+1) + "月";
          doc.text(t + "月報", 80, 160);
        }



        doc.setFontSize(10);
        // console.log(this.formData);

        if(this.formData.formType == "year"){
          this.ts = this.formData.year;
          this.te = new Date(this.ts.getFullYear()+1, 0, 1);
        }else if(this.formData.formType == "season"){
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
        }else if(this.formData.formType == "month"){
          let month = this.formData.month;
          this.ts = new Date(month.getFullYear(), month.getMonth(), 1);
          this.te = new Date(month.getFullYear(), month.getMonth()+1, 1);

        }else if(this.formData.formType == "custom"){
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
        let selection = this.formData.content.slice();
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
          apiService.getWorkingHoursDaily()
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
              this.generatePDFRiskPage(doc, data);
              selection = this.removeFromSelection(selection, 11);
            } else if(selection.includes(0)){
              // ===========================
              // top risky user page
              // ===========================
              let data = values[pdf_map[0]].data;
    
              this.generatePDFPage(doc, data, 'user', 'risk', true, false);
              selection = this.removeFromSelection(selection, 0);
              
            } else if(selection.includes(1)){
              // ==========================
              // top risky controllers page
              // ==========================
              let data = values[pdf_map[1]].data;

              this.generatePDFPage(doc, data, 'controller', 'risk', true, false);
              // =============================
              // top accessed controllers page
              // =============================
              data = values[pdf_map[1] + 1];
              this.generatePDFPage(doc, data, 'controller', 'access', true, true);
              selection = this.removeFromSelection(selection, 1);
            } else if(selection.includes(2)){
              // ==========================
              // top risky projects page
              // ==========================
              let data = values[pdf_map[2]].data;

              this.generatePDFPage(doc, data, 'project', 'risk', true, false);
              // =============================
              // top accessed projects page
              // =============================
              data = values[pdf_map[2] + 1];
              this.generatePDFPage(doc, data, 'project', 'access', true, true);
              selection = this.removeFromSelection(selection, 2);
            } else if(selection.includes(3)){
              // ==========================
              // top risky resources page
              // ==========================
              let data = values[pdf_map[3]].data;
              
              this.generatePDFPage(doc, data, 'resource', 'risk', true, false);
              // =============================
              // top accessed resources page
              // =============================
              data = values[pdf_map[3] + 1];
              this.generatePDFPage(doc, data, 'resource', 'access', true, true);
              selection = this.removeFromSelection(selection, 3);
            } else if(selection.includes(4)){
              // ==========================
              // top risky share page
              // ==========================
              let data = values[pdf_map[4]].data;
              
              this.generatePDFPage(doc, data, 'share', 'risk', true, false);
              // =============================
              // top accessed share page
              // =============================
              data = values[pdf_map[4] + 1];
              this.generatePDFPage(doc, data, 'share', 'access', true, true);
              selection = this.removeFromSelection(selection, 4);
            } else if(selection.includes(12)){
              // ==========================
              // authenication page
              // ==========================
              let data = values[pdf_map[12]].data;
              // console.log(data);
              this.generatePDFAuthenicationPage(doc, data);
              selection = this.removeFromSelection(selection, 12);
            } else if(selection.includes(13)){
              let data = values[pdf_map[13]].data;
              console.log(data);
              this.generatePDFWorkingHoursDaily(doc, data);
            }
          }
          doc.save('test.pdf');
        });
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