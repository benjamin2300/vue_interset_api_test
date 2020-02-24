<template>
    <div class="form-div">
    <el-form ref="form" :model="formData" >

      <el-form-item label="使用者">
        <el-select 
          filterable 
          clearable 
          class="user-select" 
          v-model="formData.user" 
          placeholder="選擇一名使用者" 
          no-match-text="無資料">
          <el-option
          v-for="user in allUserList"
          :key="user.id"
          :label="user.name"
          :value="user.name">
          </el-option>
        </el-select>
      </el-form-item>
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
        <el-select v-show='formData.timeType === "season"' v-model="formData.season_q" placeholder="請選擇季度" class="season-q-select">
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
          end-placeholder="結束日期"
          unlink-panels
          >
        </el-date-picker>
        </div>
      </el-form-item>
    
      <div class="pdf-generate-button-div">
        <SingleUserReportGenerator :formData="formData" />
      </div>
      

    </el-form>
  </div>

</template>

<script>
import SingleUserReportGenerator from '@/components/SingleUserReportGenerator'
import {APIService} from '@/APIService.js';
// import { log } from 'util';
import $ from 'jquery';
const apiService = new APIService();

export default {
  name: 'singleReportForm',
  components: {
    SingleUserReportGenerator
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
        formType: "single-user",
        timeType: "year",
        year:"",
        month:"",
        season_year:"",
        season_q:"",
        daterange:"",
        contentList:[1],
        user: "",
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
      contentLeftCheck: []
    };
  },
  mounted(){
    $(".el-transfer-panel__empty").text("無資料");
    apiService.getAllUsersList().then((value) => {
      this.allUserList = value;
      // console.log(this.allUsersList);
    }); 
    this.contentLeftCheck = [0,1,2,3,4,5,11,12,13];
  }
}
</script>

<style scoped>
  .transfer-label {
    display: inline-block;
  }
  .transfer-body {
    display: inline-block;
    margin-left: 40px;
  } 
  .report-type {
    display: flex-start;
    justify-content: center;
    /* margin-top: 14px; */
    margin-left: 40px;
  }
  .form-div{
    width: 700px;
    height: 300px;
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
  .user-select {
    margin-left: 50px;
  }
</style>