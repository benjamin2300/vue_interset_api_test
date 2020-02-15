<template>
    <div class="form-div">
    <el-form ref="form" :model="formData" >
      <div class="user-transfer-div">
        <el-form-item label="報表種類" prop="type">
        <el-radio-group class="report-type" v-model="formData.timeType">
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
        v-show='formData.timeType === "year"'>
        </el-date-picker>
        <el-date-picker
        v-model="formData.month"
        type="month"
        placeholder="選擇月"
        v-show='formData.timeType === "month"'>
        </el-date-picker>
        <el-date-picker
        style="margin-right:25px;"
        v-model="formData.season_year"
        type="year"
        placeholder="選擇年"
        v-show='formData.timeType === "season"'>
        </el-date-picker>
        <el-select v-show='formData.timeType === "season"' v-model="formData.season_q" placeholder="请選擇" class="season-q-select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="formData.daterange"
          v-show='formData.timeType === "custom"'
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="结束日期"
          unlink-panels
          >
        </el-date-picker>
        </div>
      </el-form-item>
        <div class="user-transfer-label"><span>選擇使用者</span></div>
        <div class="user-transfer-body">
          <el-transfer 
            v-model="formData.userList" 
            :data="allUserList"
            :titles="['可選擇使用者', '已選擇使用者']" 
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :left-default-checked="userLeftCheck"
            filterable
            filter-placeholder="請輸入使用者名稱"
            >
          </el-transfer>
        </div>
      </div> 
      <div class="transfer-div">
        <div class="transfer-label"><span>選擇內容</span></div>
        <div class="transfer-body">
          <el-transfer 
            v-model="formData.contentList" 
            :data="allContentList"
            :titles="['可選擇項目', '已選擇的項目']" 
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :left-default-checked="contentLeftCheck"
            >
          </el-transfer>
        </div>
      </div> 
      
      <div class="pdf-generate-button-div">
        <PDFGenerator :formData="formData" />
      </div>
      

    </el-form>
  </div>

</template>

<script>
import PDFGenerator from '@/components/PDFGenerator'
import {APIService} from '@/APIService.js';
// import { log } from 'util';
import $ from 'jquery';
const apiService = new APIService();

export default {
  name: 'multiUserReportForm',
  components: {
    PDFGenerator
  },
  data(){
    const generateAllContentList = _ => {
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
    return {
      formData: {
        formType: "multi-user",
        timeType: "year",
        year:"",
        month:"",
        season_year:"",
        season_q:"",
        daterange:"",
        contentList: [],
        userList: []
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
      allUserList: [],
      allContentList: generateAllContentList(),
      userLeftCheck: [],
      contentLeftCheck: []
    };
  },
  mounted(){
    $(".el-transfer-panel__empty").text("無資料");
    apiService.getAllUsersList().then((value) => {
      const data = [];
      let userList = [];
      userList = value;
      // console.log(userList);
    
      for(let i=0; i<userList.length; i++){
        data.push({
          key: i,
          label: userList[i].name
        });
      }
      this.allUserList = data;
      // this.userLeftCheck = Array.from(new Array(data.length),(val,index)=>index);
    });
    this.contentLeftCheck = [0,1,2,3,4,5,11,12,13];
    // apiService.getAllUsersList().then((value) => {
    //   this.allUsersList = value;
    //   // console.log(this.allUsersList);
    // });
  }
}
</script>

<style scoped>
  .transfer-div {
    margin-top: 20px;
  }
  .transfer-label {
    display: inline-block;
  }
  .transfer-body {
    display: inline-block;
    margin-left: 40px;
  } 
  .user-transfer-label {
    display: inline-block;
  }
  .user-transfer-body {
    display: inline-block;
    margin-left: 30px;
  } 
  .report-type {
    display: flex-start;
    justify-content: center;
    /* margin-top: 14px; */
    margin-left: 40px;
  }
  .form-div{
    width: 750px;
    height: 800px;
    margin: 10px;
    padding: 10px;
    border: 3px solid lightgray;
    border-radius: 10px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 40px;
    padding-left: 20px;
    /* font-family: Arial, "新細明體"; */
  }


</style>

<style>

</style>