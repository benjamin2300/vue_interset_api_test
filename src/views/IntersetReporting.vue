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
      <div id="chart">
        
      </div>
    </el-main>
</el-container>
</template>

<script>
import {APIService} from '@/APIService.js';
// import { log } from 'util';
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
      console.log(this.ts);
      
      
      
      Promise.all([this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyProjects(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedProjects(this.getTimestamp(this.ts), this.getTimestamp(this.te))
                   ])
             .then((values) =>   
      {
        // top risky user page
        console.log(this.getTimestamp(this.ts));
        console.log(this.getTimestamp(this.te));
        let data = values[0].data;
        if(data.length != 0){
          doc.addPage();
          doc.setFontSize(24);
          doc.text('風險最高使用者', 60, 20);
          let jspdf_table = [];
          for(let i=0; i<data.length; i++){
            jspdf_table.push([data[i].risk, data[i].entityName]);
          }
          // console.log(jspdf_table);
          doc.autoTable({html: '#my-table'});
          doc.autoTable({
            startY: 35,
            theme: 'striped',
            head:[['風險值', '使用者']],
            body: jspdf_table,
            styles: {font: "msyh"}
          })
          // drawing bar chart
          // width: 1000px, height: 800px
          // let margin = {top: 20, right: 20, bottom: 70, left: 40};
          // let chart_width = 800 - margin.right - margin.left;
          // let chart_height = 600 - margin.top - margin.bottom;
          // let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
          // let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);
          // let svg = d3.select("#chart")
          //           .append("svg")
          //           .attr("width", chart_width + margin.right + margin.left)
          //           .attr("height", chart_height + margin.top + margin.bottom)
          //           .append("g")
          //           .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
          // x_scale.domain(data.map(function(d){return d.entityName;}));
          // y_scale.domain([0, d3.max(data, function(d) {return d.risk;})]);
          // svg.selectAll("rect")
          //     .data(data)
          //     .enter()
          //     .append("rect")
          //     .attr("x", function(d){return x_scale(d.entityName);})
          //     .attr("width", x_scale.bandwidth())
          //     .attr("y", function(d){return y_scale(d.risk);})
          //     .attr("height", function(d){return chart_height - y_scale(d.risk);})
          //     .attr("fill", "#0066ff");
          
          // svg.append("g")
          //     .attr("transform", "translate(0, " + chart_height + ")")
          //     .call(d3.axisBottom(x_scale))
          //     .selectAll("text")
          //     .style("text-anchor", "end")
          //     .attr("dx", "-.8em")
          //     .attr("dy", "-.55em")
          //     .attr("transform", "rotate(-90)");

          // svg.append("g")
          //     .call(d3.axisLeft(y_scale));
          
        }
        // top risky controllers page
        data = values[1].data;
        if(data.length != 0){
          doc.addPage();
          doc.setFontSize(24);
          doc.text('風險最高的控制器', 60, 20);
          let jspdf_table = [];
          for(let i=0; i<data.length; i++){
            jspdf_table.push([data[i].risk, data[i].entityName]);
          }
          // console.log(jspdf_table);
          doc.autoTable({html: '#my-table'});
          doc.autoTable({
            startY: 35,
            theme: 'striped',
            head:[['風險值', '控制器名稱']],
            body: jspdf_table,
            styles: {font: "msyh"}
          })
        }
        // top accessed controllers page
        data = values[2];
        if(data.length != 0){
          doc.addPage();
          doc.setFontSize(24);
          doc.text('接入次數最多控制器', 60, 20);
          let jspdf_table = [];
          for(let i=data.length-1; i>=0; i--){
            jspdf_table.push([data[i].accessed, data[i].entityName]);
          }
          console.log(jspdf_table);
          doc.autoTable({html: '#my-table'});
          doc.autoTable({
            startY: 35,
            theme: 'striped',
            head:[['接入次數', '控制器名稱']],
            body: jspdf_table,
            styles: {font: "msyh"}
          })
        }

        // top risky projects page
        data = values[3].data;
        if(data.length != 0){
          doc.addPage();
          doc.setFontSize(24);
          doc.text('風險最高的專案', 60, 20);
          let jspdf_table = [];
          for(let i=0; i<data.length; i++){
            jspdf_table.push([data[i].risk, data[i].entityName]);
          }
          // console.log(jspdf_table);
          doc.autoTable({html: '#my-table'});
          doc.autoTable({
            startY: 35,
            theme: 'striped',
            head:[['風險值', '專案名稱']],
            body: jspdf_table,
            styles: {font: "msyh"}
          })
        }
        // top accessed projects page
        data = values[4];
        if(data.length != 0){
          doc.addPage();
          doc.setFontSize(24);
          doc.text('接入次數最多專案', 60, 20);
          let jspdf_table = [];
          for(let i=data.length-1; i>=0; i--){
            jspdf_table.push([data[i].accessed, data[i].entityName]);
          }
          console.log(jspdf_table);
          // doc.autoTable({html: '#my-table'});
          // doc.autoTable({
          //   startY: 35,
          //   theme: 'striped',
          //   head:[['接入次數', '專案名稱']],
          //   body: jspdf_table,
          //   styles: {font: "msyh"}
          // })
          let margin = {top: 20, right: 20, bottom: 70, left: 40};
          let chart_width = 800 - margin.right - margin.left;
          let chart_height = 800 - margin.top - margin.bottom;
          let x_scale = d3.scaleBand().rangeRound([0, chart_width]).padding(0.05);
          let y_scale = d3.scaleLinear().rangeRound([chart_height, 0]);
          let svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", chart_width + margin.right + margin.left)
                    .attr("height", chart_height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
          x_scale.domain(data.map(function(d){return d.entityName;}));          
          y_scale.domain([d3.min(data, function(d){return d.accessed;}) * 0.5, d3.max(data, function(d){return +d.accessed;})]);
          svg.selectAll("rect")
              .data(data)
              .enter()
              .append("rect")
              .attr("x", function(d){return x_scale(d.entityName);})
              .attr("width", x_scale.bandwidth())
              .attr("y", function(d){return y_scale(d.accessed);})
              .attr("height", function(d){return chart_height - y_scale(d.accessed);})
              .attr("fill", "#0066ff");
          
          svg.append("g")
              .attr("transform", "translate(0, " + chart_height + ")")
              .call(d3.axisBottom(x_scale))
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", "-.55em")
              .attr("transform", "rotate(-90)");

          svg.append("g")
              .call(d3.axisLeft(y_scale));
          window.svgLib.saveSvgAsPng(document.getElementsByTagName("svg")[0], "test.png", {backgroundColor: "#FFFFFF"});
          // doc.addImage('/home/finch2300/Downloads/test.png', 'PNG', 15, 200, 800, 800);
          // let myImage = new Image();
          // myImage.src = '/home/finch2300/Downloads/test.png';
          // console.log(myImage);
          
          // myImage.onload = function(){
          //   doc.addImage(myImage , 'PNG', 15, 30, 100, 100);
          // };
          let imgData = 'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAAyAAAAMgCAYAAADbcAZoAAAgAElEQVR4XuzdfYyVZ37f/4ttjAJWSJGqTVGtUto/vAWZWgUUqIsgULWoDkWIiApbrSkNxnWsVAKWLFtkvJvYLbUtCpvSpY15cEIIhMULfaCBSoBLbR6KCWUDMcWLm7XlVGlBiWKaZIX56b5/grWztj8+13juHc95zT82w/eeOfPa7/G53jrnzI64devWreKDAAECBAgQIECAAAECHQiMECAdKPsWBAgQIECAAAECBAi0AgLEIhAgQIAAAQIECBAg0JmAAOmM2jciQIAAAQIECBAgQECA2AECBAgQIECAAAECBDoTECCdUftGBAgQIECAAAECBAgIEDtAgAABAgQIECBAgEBnAgKkM2rfiAABAgQIECBAgAABAWIHCBAgQIAAAQIECBDoTECAdEbtGxEgQIAAAQIECBAgIEDsAAECBAgQIECAAAECnQkIkM6ofSMCBAgQIECAAAECBASIHSBAgAABAgQIECBAoDMBAdIZtW9EgAABAgQIECBAgIAAsQMECBAgQIAAAQIECHQmIEA6o/aNCBAgQIAAAQIECBAQIHaAAAECBAgQIECAAIHOBARIZ9S+EQECBAgQIECAAAECAsQOECBAgAABAgQIECDQmYAA6YzaNyJAgAABAgQIECBAYMgEyIgRIz70f43Zs2eXo0eP+l+KAAECBAgQIECAwKciMGLFp/JlhtUXubW1ux9nyATIR/3ITZjcunWrOxHfiQABAgQIECBAYFgLCJDv/59XgLzPRIAM6/u/H44AAQIECBAg0LmAABEgH7t0AqTz+6RvSIAAAQIECBAY1gICRIAIkGF9F/fDESBAgAABAgSGloAAESACZGjdJ90aAgQIECBAgMCwFhAgAkSADOu7uB+OAAECBAgQIDC0BASIABEgQ+s+6dYQIECAAAECBIa1gAARIAJkWN/F/XAECBAgQIAAgaElIEAEiAAZWvdJt4YAAQIECBAgMKwFBIgAESDD+i7uhyNAgAABAgQIDC0BASJABMjQuk+6NQQIECBAgACBYS0gQASIABnWd3E/HAECBAgQIEBgaAkIEAEiQIbWfdKtIUCAAAECBAgMawEBIkAEyLC+i/vhCBAgQIAAAQJDS0CACBABMrTuk24NAQIECBAgQGBYCwgQASJAhvVd3A9HgAABAgQIEBhaAgJEgAiQoXWfdGsIECBAgAABAsNaQIAIEAEyrO/ifjgCBAgQIECAwNASECACRIAMrfukW0OAAAECBAgQGNYCAkSACJBhfRf3wxEgQIAAAQIEhpaAABEgAmRo3SfdGgIECBAgQIDAsBYQIAJEgAzru7gfjgABAgQIECAwtAQEiAARIEPrPunWECBAgAABAgSGtYAAESACZFjfxf1wBAgQIECAAIGhJSBABIgAGVr3SbeGAAECBAgQIDCsBQSIABEgw/ou7ocjQIAAAQIECAwtAQEiQATI0LpPujUECBAgQIAAgWEtIEAEiAAZ1ndxPxwBAgQIECBAYGgJCBABIkCG1n3SrSFAgAABAgQIDGsBASJABMiwvov74QgQIECAAAECQ0tAgAgQATK07pNuDQECBAgQIEBgWAsIEAEiQIb1XdwPR4AAAQIECBAYWgICRIAIkKF1n3RrCBAgQIAAAQLDWkCACBABMqzv4n44AgQIECBAgMDQEhAgAkSADK37pFtDgAABAgQIEBjWAgJkCATIe++9V5588snywgsvlHfeeae9RV//+tfLv/pX/+rOrbt69Wr5P//n/5Qf+ZEfufO5gwcPlqeeeqrcuHGjrFmzpixbtqz9u+ZzBw4cKDdv3izbtm0rU6dOLVeuXClLly4t165dK7NmzSpbtmwpI0aMiMvdzNy6dSvOGSBAgAABAgQIECDwSQQEyBAIkOeee66MHj26PPPMM+Wtt976vlv027/92+Wf/bN/Vr7xjW/c+bsmOu6///5y+vTpMnLkyDJt2rRy6tSpcu7cufL000+XQ4cOlYsXL5bHH3+8HD9+vMydO7f9/PTp08vixYvLY489VubMmRN3RIBEIgMECBAgQIAAAQI9CAiQIRAg7777brn77rvLPffc86EB8lM/9VPlK1/5Spk0adKdW/vyyy+XrVu3ll27drWfa0Jj/vz55cyZM2XcuHFl+fLl7eeba1599dUyefLk8uabb7af27t3bzl79mzZsGFDXBUBEokMECBAgAABAgQI9CAgQIZAgNy+CR8WIP/zf/7P9uVVL7300gdu6Z49e8rJkyfLxo0b2883L7saP358+4zIvHnzyoIFC9rPz549uzz77LPl0UcfbZ8daT6OHTtWtm/fXnbu3BlXRYBEIgMECBAgQIAAAQI9CAiQIR4gX/ziF9uX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2Wgw70ttgDz33HNl9OjR5ZlnnilvvfVW+/3+8A//sPz4j/94efXVV9t//9KXvlRefPHFO7eliY7777+/nD59uowcObJMmzatnDp1qpw7d648/fTT5dChQ+XixYvl8ccfL8ePHy9z585tPz99+vSyePHi8thjj5U5c+bEn02ARCIDBAgQIECAAIE7Ag7X+XDNKBsN5l2qDZB333233H333eWee+65EyDf/OY3y3/7b/+tPPvssx/6/V9++eWydevWsmvXrvbvm9CYP39+OXPmTBk3blxZvnx5+/lJkya1ETN58uTy5ptvtp/bu3dvOXv2bPusSvoQIEnI3xMgQIAAAQIEvifgcJ0P14yy0WDepz7wHpD3B8jXvva19mVTb7/9dvnf//t/l6985SsfeMZiz5495eTJk2Xjxo3t7WtedjV+/Pj2GZF58+aVBQsWtJ+fPXt2GzGPPvpo++xI83Hs2LGyffv2snPnzvizCZBIZIAAAQIECBAgcEfA4Tofrhllo8G8S31kgDz//PPlv/yX/1L+/b//9+2zIs3LpZog+dznPtfenpdeeqk0z4LcDpD169eXCRMmtJHRzN4OkOb9Hps3b27f/3E7QI4ePdrGx44dO753Z/mY94N4D8hgroCvTYAAAQIECAwnAYfrfLhmlI0G8z7xkQHSvLTq8uXL7TMfzUfzRvL/9J/+U/n85z/f/rl59mPTpk1l9+7d7Z9XrFhRFi1aVF577bUyduzY9s/Nx8SJE9uXWzX/vHr1avu55poLFy607zlJH54BSUL+ngABAgQIECDwPQGH63y4ZpSNBvM+9ZEB8ru/+7ttUDQvl2p+c1Xz5vE33nij/S1Zo0aNKmPGjGnf13HixIly1113lRkzZrTv/2iiZdWqVeXIkSPl/Pnz7W/HOnz4cFm4cGFZuXJlmTlzZvvvq1evLg888ED82QRIJDJAgAABAgQIELgj4HCdD9eMstFg3qXaAGneMN68Ufz1118v9957b3nooYfKl7/85fJLv/RL5etf/3r5kz/5k/ILv/AL5e/9vb9XnnjiifY3Xj3yyCNl3759Zd26de2v021+je+SJUva27p27dqyf//+9jdrNb8567777iuXLl0qDz/8cPsrex988MHSvMTrk3wIkE+iZIYAAQIECBAg8P8LOFznwzWjbDSY96ee/48IX3nllXL9+vU2Irr4ECBdKPseBAgQIECAwHARcLjOh2tG2Wgw7w89B0jzxvMpU6a0v7a3iw8B0oWy70GAAAECBD4bAg6O+eDIiFHNvfnW1pqr6q7pOUDqvk39VQKk3s6VBAgQIEBguAk4XDtc1+z0nz5c26O8RzXOn/QaAfJJpcwRIECAAAECP3ABB8d8cGTEqOaO6hmQ96l5BqRmhVxDgAABAgSGp4DDtcN1zWZ7BiSrCRABkrfEBAECBAgQ6EMBASJAatZegGQ1ASJA8paYIECAAAECfSggQARIzdoLkKwmQARI3hITBAgQIECgDwUEiACpWXsBktUEiADJW2KCAAECBAj0oYAAESA1ay9AspoAESB5S0wQIECAAIE+FBAgAqRm7QVIVhMgAiRviQkCBAgQINCHAgJEgNSsvQDJagJEgOQtMUGAAAECBPpQQIAIkJq1FyBZTYAIkLwlJggQIECAQB8KCBABUrP2AiSrCRABkrfEBAECBAgQ6EMBASJAatZegGQ1ASJA8paYIECAAAECfSggQARIzdoLkKwmQARI3hITBAgQIECgDwUEiACpWXsBktUEiADJW2KCAAECBAj0oYAAESA1ay9AspoAESB5S0wQIECAAIE+FBAgAqRm7QVIVhMgAiRviQkCBAgQINCHAgJEgNSsvQDJagJEgOQtMUGAAAECBPpQQIAIkJq1FyBZTYAIkLwlJggQIECAQB8KCBABUrP2AiSrCRABkrfEBAECBAgQ6EMBASJAatZegGQ1ASJA8paYIECAAAECfSggQARIzdoLkKwmQARI3hITBAgQIECgDwUEiACpWXsBktUEiADJW2KCAAECBAj0oYAAESA1ay9AspoAESB5S0wQIECAAIE+FBAgAqRm7QVIVhMgAiRviQkCBAgQINCHAgJEgNSsvQDJagJEgOQtMUGAAAECBPpQQIAIkJq1FyBZTYAIkLwlJggQIECAQB8KCBABUrP2AiSrCRABkrfEBAECBAgQ6EMBASJAatZegGQ1ASJA8paYIECAAAECfSggQARIzdoLkKwmQARI3hITBAgQIECgDwUEiACpWXsBktUEiADJW2KCAAECBAj0oYAAESA1ay9AspoAESB5S0wQIECAAIE+FBAgAqRm7QVIVhMgAiRviQkCBAgQINCHAgJEgNSsvQDJagJEgOQtMUGAAAECBPpQQIAIkJq1FyBZTYAIkLwlJggQIECAQB8KCBABUrP2AiSrCRABkrfEBAECBAgQ6EMBASJAatZegGQ1ASJA8paYIECAAAECfSggQARIzdoLkKwmQARI3hITBAgQIECgDwUEiACpWXsBktUEiADJW2KCAAECBAj0oYAAESA1ay9AspoAESB5S0wQIECAAIE+FBAgAqRm7QVIVhMgAiRviQkCBAgQINCHAgJEgNSsvQDJagJEgOQtMUGAAAECBPpQQIAIkJq1FyBZTYAIkLwlJggQIECAQB8KCBABUrP2AiSrCRABkrfEBAECBAgQ6EMBASJAatZegGQ1ASJA8paYIECAAAECfSggQARIzdoLkKwmQARI3hITBAgQIECgDwUEiACpWXsBktUEiADJW2KCAAECBAj0oYAAESA1ay9AspoAESB5S0wQIECAAIE+FBAgAqRm7QVIVhMgAiRviQkCBAgQINCHAgJEgNSsvQDJagJEgOQtMUGAAAECBPpQQIAIkJq1FyBZTYAIkLwlJggQIECAQB8KCBABUrP2AiSrdR4g7733XnnyySfLCy+8UN555532Fp49e7bMnTu3/Pk//+fbP/+Nv/E3yrZt2z5w6w8ePFieeuqpcuPGjbJmzZqybNmy9u+bzx04cKDcvHmzvWbq1KnlypUrZenSpeXatWtl1qxZZcuWLWXEiBFRo5m5detWnDNAgAABAgQIDH8BASJAarZcgGS1zgPkueeeK6NHjy7PPPNMeeutt9pbePTo0bJnz57y9a9//UNvcRMd999/fzl9+nQZOXJkmTZtWjl16lQ5d+5cefrpp8uhQ4fKxYsXy+OPP16OHz/exkzz+enTp5fFixeXxx57rMyZMydqCJBIZIAAAQIECPSNgAARIDXLLkCyWucB8u6775a777673HPPPXcCpHl24+WXXy5NnHzYR/N3W7duLbt27Wr/ugmN+fPnlzNnzpRx48aV5cuXt5+fNGlSefXVV8vkyZPLm2++2X5u79697TMsGzZsiBoCJBIZIECAAAECfSMgQARIzbILkKzWeYDcvknvD5Bf+ZVfKb/4i79YmpdnNRHwL//lv2xfOnX7o3l25OTJk2Xjxo3tp5qXXY0fP759RmTevHllwYIF7ednz55dnn322fLoo4+2z440H8eOHSvbt28vO3fujBoCJBIZIECAAAECfSMgQARIzbILkKw2JALkW9/6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';
          doc.addImage(imgData, 'PNG', 15, 30, 100, 100);
        }
        
        // doc.addPage();
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
  #chart {
    width: 800px;
    height: 800px;
    background-color: #f7f7f7;
    margin: 10px auto;
  }
</style>