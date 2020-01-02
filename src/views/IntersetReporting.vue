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
      interset_data: [],
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
      
      doc.addPage();
      
      Promise.all([this.getTopRiskyUsers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopRiskyControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te)),
                   this.getTopAccessedControllers(this.getTimestamp(this.ts), this.getTimestamp(this.te))])
             .then((values) =>   
      {
        console.log(this.getTimestamp(this.ts));
        console.log(this.getTimestamp(this.te));
        this.interset_data = values[0].data;
        doc.setFontSize(24);
        doc.text('風險最高使用者', 70, 20);
        let jspdf_table = [];
        for(let i=0; i<this.interset_data.length; i++){
          jspdf_table.push([this.interset_data[i].risk, this.interset_data[i].entityName]);
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
        doc.addPage();

        this.interset_data = values[1].data;
        doc.setFontSize(24);
        doc.text('風險最高 Controllers', 70, 20);
        jspdf_table = [];
        for(let i=0; i<this.interset_data.length; i++){
          jspdf_table.push([this.interset_data[i].risk, this.interset_data[i].entityName]);
        }
        // console.log(jspdf_table);
        doc.autoTable({html: '#my-table'});
        doc.autoTable({
          startY: 35,
          theme: 'striped',
          head:[['風險值', 'Controllers名稱']],
          body: jspdf_table,
          styles: {font: "msyh"}
        })
        // doc.addPage();
        doc.addPage();
        this.interset_data = values[2];
        doc.setFontSize(24);
        doc.text('接入次數最多 Controllers', 70, 20);
        jspdf_table = [];
        for(let i=this.interset_data.length-1; i>=0; i--){
          jspdf_table.push([this.interset_data[i].accessed, this.interset_data[i].entityName]);
        }
        console.log(jspdf_table);
        doc.autoTable({html: '#my-table'});
        doc.autoTable({
          startY: 35,
          theme: 'striped',
          head:[['接入次數', 'Controllers名稱']],
          body: jspdf_table,
          styles: {font: "msyh"}
        })
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
</style>