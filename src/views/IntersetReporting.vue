<template>
  <el-container>
    <el-header>Interset報表產生器</el-header>
    <el-main>
      <table id="my-table"></table>
      <el-date-picker
        v-model="ts"
        type="date"
        placeholder="開始日期"
        class="ts-date-picker"
        >
      </el-date-picker>
      <el-date-picker
        v-model="te"
        type="date"
        placeholder="結束日期"
        class="te-date-picker"
        >
      </el-date-picker>

      <el-button @click="pdfGenerate" type="primary" icon="el-icon-files" circle></el-button>
      <div id="chart"></div>
      <div id="div-canvas"><canvas id="canvas" width="900" height="900"></canvas></div>
      
    </el-main>
</el-container>
</template>

<script>
import {APIService} from '@/APIService.js';
// import { log } from 'util';
import $ from 'jquery';
const apiService = new APIService();

export default {
  name: 'intersetReporting',
  data(){
    return{
      // interset_data: [],
      ts: "",
      te: "",
    };
  },
  methods: {
    // api related methods
    getTopRiskyUsers(ts, te) {
      return apiService.getTopRiskyUsers(ts, te);
    },
    getTopRiskyControllers(ts, te) {
      return apiService.getTopRiskyControllers(ts, te);
    },
    getTopAccessedControllers(ts, te){
      return apiService.getTopAccessedControllers(ts, te);
    },
    getTopRiskyProjects(ts, te) {
      return apiService.getTopRiskyProjects(ts, te);
    },
    getTopAccessedProjects(ts, te){
      return apiService.getTopAccessedProjects(ts, te);
    },
    getTopRiskyResources(ts, te) {
      return apiService.getTopRiskyResources(ts, te);
    },
    getTopAccessedResources(ts, te){
      return apiService.getTopAccessedResources(ts, te);
    },
    getTopRiskyShares(ts, te) {
      return apiService.getTopRiskyShares(ts, te);
    },
    getTopAccessedShares(ts, te){
      return apiService.getTopAccessedShares(ts, te);
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

      if(data.length != 0){
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
          // console.log(imgData);
          doc.addImage(imgData, 'PNG', 20, 125, 300, 200);
        }
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
      // console.log("test");
      // 1st Page
      var doc = new jsPDF();
      doc.setFont('msyh');

      // this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te));
      
      
      // console.log(this.interset_data);
      let month = [1,2,3,4,5,6,7,8,9,10,11,12]
      
      doc.setFontSize(24);
      doc.text('Interset總體報表', 70, 150);
      doc.setFontSize(10);
      let new_ts = new Date(this.ts);
      let new_te = new Date(this.te);
      let date_range = new_ts.getFullYear() + "/" + month[new_ts.getMonth()] + "/" + new_ts.getDate() 
                       + " 到 " + 
                       new_te.getFullYear() + "/" + month[new_te.getMonth()] + "/" + new_te.getDate(); 
      doc.text(date_range, 80, 160);
      // 2nd Page
      // console.log(this.ts);
      
      
      
      Promise.all([this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyProjects(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedProjects(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyResources(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedResources(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyShares(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedShares(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   ])
             .then((values) =>   
      {
        // ===========================
        // === top risky user page ===
        // ===========================
        // console.log(this.getTimestamp(this.ts));
        // console.log(this.getTimestamp(this.te));
        let data = values[0].data;
        this.generatePDFPage(doc, data, 'user', 'risk', true, false);

        // ==========================
        // top risky controllers page
        // ==========================
        data = values[1].data;
        this.generatePDFPage(doc, data, 'controller', 'risk', true, false);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('風險最高的控制器', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=0; i<data.length; i++){
        //     jspdf_table.push([data[i].risk, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['風險值', '控制器名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        // }
        // =============================
        // top accessed controllers page
        // =============================
        data = values[2];
        this.generatePDFPage(doc, data, 'controller', 'access', true, true);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('接入次數最多控制器', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=data.length-1; i>=0; i--){
        //     jspdf_table.push([data[i].accessed, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['接入次數', '控制器名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        // }
        // ========================
        // top risky projects page
        // ========================
        data = values[3].data;
        this.generatePDFPage(doc, data, 'project', 'risk', true, false);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('風險最高的專案', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=0; i<data.length; i++){
        //     jspdf_table.push([data[i].risk, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['風險值', '專案名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        // }
        // ==========================
        // top accessed projects page
        // ==========================
        data = values[4];
        this.generatePDFPage(doc, data, 'project', 'access', true, true);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('接入次數最多專案', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=data.length-1; i>=0; i--){
        //     jspdf_table.push([data[i].accessed, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['接入次數', '專案名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        //   let margin = {top: 20, right: 20, bottom: 70, left: 40};
        //   let chart_width = 400 - margin.right - margin.left;
        //   let chart_height = 400 - margin.top - margin.bottom;
        //   let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
        //   let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);
        //   let svg = d3.select("#chart-project")
        //             .append("svg")
        //             .attr("width", chart_width + margin.right + margin.left)
        //             .attr("height", chart_height + margin.top + margin.bottom)
        //             .append("g")
        //             .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        //   x_scale.domain(data.map(function(d){return d.entityName;}));          
        //   y_scale.domain([d3.min(data, function(d){return d.accessed;}) * 0.5, d3.max(data, function(d){return +d.accessed;})]);
        //   svg.append("g")
        //       .attr("class", "x-axis")
        //       .style('color', 'black')
        //       .attr("transform", "translate(0, " + chart_height + ")")
        //       .call(d3.axisBottom(x_scale))
        //       .selectAll("text")
        //       .style("text-anchor", "end")
        //       .attr("dx", "-.8em")
        //       .attr("dy", "-.55em")
        //       .attr("transform", "rotate(-90)");

        //   svg.append("g")
        //       .style('color', 'black')
        //       .attr("class", "y-axis")
        //       .call(d3.axisLeft(y_scale));

        //   svg.selectAll("rect")
        //       .data(data)
        //       .enter()
        //       .append("rect")
        //       .attr("x", function(d){return x_scale(d.entityName);})
        //       .attr("width", x_scale.bandwidth())
        //       .attr("y", function(d){return y_scale(d.accessed);})
        //       .attr("height", function(d){return chart_height - y_scale(d.accessed);})
        //       .attr("fill", "#0066ff");
          


        //   let canvas = document.getElementById('canvas-project');
        //   let context = canvas.getContext('2d');

        //   let firstSvg = $('#chart-project');
        //   let content = $(firstSvg).html();
        //   // console.log(content);
          
        //   context.drawSvg(content);
        //   let imgData = canvas.toDataURL('image/png');
        //   // console.log(imgData);
        //   doc.addImage(imgData, 'PNG', 40, 135, 300, 300);
        // }
        // ========================
        // top risky resources page
        // ========================
        data = values[5].data;
        this.generatePDFPage(doc, data, "resource", "risk", true, false);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('風險最高資源', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=0; i<data.length; i++){
        //     jspdf_table.push([data[i].risk, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['風險值', '資源名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        // }
        

        // ==========================
        // top accessed projects page
        // ==========================
        data = values[6];
        this.generatePDFPage(doc, data, "resource", "access", true, true);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('接入次數最多資源', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=data.length-1; i>=0; i--){
        //     jspdf_table.push([data[i].accessed, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['接入次數', '資源名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        //   let margin = {top: 20, right: 20, bottom: 100, left: 40};
        //   let chart_width = 400 - margin.right - margin.left;
        //   let chart_height = 400 - margin.top - margin.bottom;
        //   let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
        //   let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);
        //   let svg = d3.select("#chart-resource")
        //             .append("svg")
        //             .attr("width", chart_width + margin.right + margin.left)
        //             .attr("height", chart_height + margin.top + margin.bottom)
        //             .append("g")
        //             .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        //   x_scale.domain(data.map(function(d){return d.entityName; }));          
        //   y_scale.domain([0 , d3.max(data, function(d){return +d.accessed;})]);
        //   svg.append("g")
        //       .attr("class", "x-axis")
        //       .style('color', 'black')
        //       .attr("transform", "translate(0, " + chart_height + ")")
        //       .call(d3.axisBottom(x_scale))
        //       // .selectAll("text")
        //       .selectAll(".tick text")
        //       // .call(this.wrap, x_scale.bandwidth());
        //       .style("text-anchor", "end")
        //       .attr("dx", "-.8em")
        //       .attr("dy", "-.55em")
        //       .attr("transform", "rotate(-90)");

              

        //   svg.append("g")
        //       .style('color', 'black')
        //       .attr("class", "y-axis")
        //       .call(d3.axisLeft(y_scale));



        //   svg.selectAll("rect")
        //       .data(data)
        //       .enter()
        //       .append("rect")
        //       .attr("x", function(d){return x_scale(d.entityName);})
        //       .attr("width", x_scale.bandwidth())
        //       .attr("y", function(d){return y_scale(d.accessed);})
        //       .attr("height", function(d){return chart_height - y_scale(d.accessed);})
        //       .attr("fill", "#0066ff");
          
        //   console.log("test");
          
        //   svg.selectAll("text.resource-label")
        //       .data(data)
        //       .enter()
        //       .append("text")
        //       .attr("class", "resource-label")
        //       .text(function(d){
        //         console.log(d.accessed);
        //         return d.accessed;
        //       })
        //       .attr("x", function(d, i){
        //         return x_scale(d.entityName) + x_scale.bandwidth() / 2;
        //       })
        //       .attr("y", function(d, i){
        //         return y_scale(d.accessed) + 15;
        //       })
        //       .attr("font-size", 14)
        //       .attr("fill", "#fff")
        //       .attr("text-anchor", "middle");


        //   let canvas = document.getElementById('canvas-resource');
        //   let context = canvas.getContext('2d');

        //   let firstSvg = $('#chart-resource');
        //   let content = $(firstSvg).html();
        //   // console.log(content);
          
        //   context.drawSvg(content);
        //   let imgData = canvas.toDataURL('image/png');
        //   // console.log(imgData);
        //   doc.addImage(imgData, 'PNG', 20, 125, 300, 200);
        // }
        // ========================
        // top risky shares page
        // ========================
        data = values[7].data;
        this.generatePDFPage(doc, data, "share", "risk", true, false);
        // if(data.length != 0){
        //   doc.addPage();
        //   doc.setFontSize(24);
        //   doc.text('風險最高共享資源', 60, 20);
        //   let jspdf_table = [];
        //   for(let i=0; i<data.length; i++){
        //     jspdf_table.push([data[i].risk, data[i].entityName]);
        //   }
        //   // console.log(jspdf_table);
        //   doc.autoTable({html: '#my-table'});
        //   doc.autoTable({
        //     startY: 35,
        //     theme: 'striped',
        //     head:[['風險值', '共享資源名稱']],
        //     body: jspdf_table,
        //     styles: {font: "msyh"}
        //   })
        // }
        

        // ==========================
        // top accessed shares page
        // ==========================
        data = values[8];
        this.generatePDFPage(doc, data, "share", "access", true, true);
        doc.save('test.pdf');
      });



      // this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te)).then((data) => {
      //   doc.setFontSize(24);
      //   doc.text('風險最高使用者', 70, 20);
      //   this.interset_data = data.data;
      //   let jspdf_table = [];
      //   for(let i=0; i<this.interset_data.length; i++){
      //     jspdf_table.push([this.interset_data[i].risk, this.interset_data[i].entityName]);
      //   }
      //   console.log(jspdf_table);
      //   doc.autoTable({html: '#my-table'});
      //   doc.autoTable({
      //     startY: 35,
      //     theme: 'striped',
      //     head:[['風險值', '使用者']],
      //     body: jspdf_table,
      //     styles: {font: "msyh"}
      //   })
      //   doc.addPage();
      // });

      // this.getTopRiskyControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)).then((data) => {
      //   this.interset_data = data.data;
      //   doc.setFontSize(24);
      //   doc.text('風險最高 Controllers', 70, 20);
      //   let jspdf_table = [];
      //   for(let i=0; i<this.interset_data.length; i++){
      //     jspdf_table.push([this.interset_data[i].risk, this.interset_data[i].entityName]);
      //   }
      //   console.log(jspdf_table);
      //   doc.autoTable({html: '#my-table'});
      //   doc.autoTable({
      //     startY: 35,
      //     theme: 'striped',
      //     head:[['風險值', 'Controllers名稱']],
      //     body: jspdf_table,
      //     styles: {font: "msyh"}
      //   })
      //   // doc.addPage();
      //   doc.addPage();
      // })

      // this.getTopAccessedControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)).then((data) => {
      //   this.interset_data = data;
      //   doc.setFontSize(24);
      //   doc.text('接入次數最多 Controllers', 70, 20);
      //   let jspdf_table = [];
      //   for(let i=this.interset_data.length-1; i>=0; i--){
      //     jspdf_table.push([this.interset_data[i].accessed, this.interset_data[i].entityName]);
      //   }
      //   console.log(jspdf_table);
      //   doc.autoTable({html: '#my-table'});
      //   doc.autoTable({
      //     startY: 35,
      //     theme: 'striped',
      //     head:[['接入次數', 'Controllers名稱']],
      //     body: jspdf_table,
      //     styles: {font: "msyh"}
      //   })
      //   // doc.addPage();
      //   doc.save('test.pdf');
      // })


      //console.log(this.interset_data);
      // let jspdf_table = []
      // for(let i=0; i<this.interset_data.length; i++){
      //   jspdf_table.push([this.interset_data[i].risk, this.interset_data[i].entityName]);
      // }
      // console.log(jspdf_table);
      
      // doc.autoTable({html: '#my-table'});
      // doc.autoTable({
      //   theme: 'striped',
      //   head:[['風險值', '使用者']],
      //   body:jspdf_table,
      //   styles: {font: "msyh"}
      // });
      
      // doc.text(20, 20, '匯出標題');
      // doc.autoTable(columns, data, {}); 
      
    },
    getTimestamp(datetime){
      return new Date(datetime).getTime();
    }
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
    text-align: center;
    line-height: 160px;
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
</style>