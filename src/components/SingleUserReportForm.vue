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
        :picker-options="endDateOpt"
        :default-value="default_value"
        v-show='formData.timeType === "year"'>
        </el-date-picker>
        <el-date-picker
        v-model="formData.month"
        type="month"
        placeholder="選擇月"
        :picker-options="endDateOpt"
        :default-value="default_value"
        v-show='formData.timeType === "month"'>
        </el-date-picker>
        <el-date-picker
        style="margin-right:25px;"
        v-model="formData.season_year"
        type="year"
        placeholder="選擇年"
        :picker-options="endDateOpt"
        :default-value="default_value"
        @change="disableSeason"
        v-show='formData.timeType === "season"'>
        </el-date-picker>
        <el-select v-show='formData.timeType === "season"' v-model="formData.season_q" placeholder="請選擇季度" class="season-q-select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="formData.daterange"
          v-show='formData.timeType === "custom"'
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          :picker-options="endDateOpt"
          :default-value="default_value"
          unlink-panels
          >
        </el-date-picker>
        </div>
      </el-form-item>
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
            :right-default-checked="contentRightCheck"
            >
          </el-transfer>
        </div>
      </div> 
    
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
      const data_type = ["風險值變化", 
                         "風險值變化(含威脅種類分佈)",
                         "周工作時數分佈", 
                         "日工作時數分佈", 
                         "威脅種類分佈",
                         "異常行為分佈", 
                         "異常數量和其他數據"
                         ];
      for (let i = 0; i < data_type.length; i++) {
        data.push({
          key: i,
          label: data_type[i],
          disabled: i == 1
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
        contentList:[],
        user: "",
      },
      body: "",
      options: [{
        value: 'Q1',
        label: 'Q1(1月～3月)',
        disabled: false,
      }, {
        value: 'Q2',
        label: 'Q2(4月～6月)',
        disabled: false,
      }, {
        value: 'Q3',
        label: 'Q3(7月～9月)',
        disabled: false,
      }, {
        value: 'Q4',
        label: 'Q4(10月～12月)',
        disabled: false,
      }],
      allUserList: [],
      allContentList: generateAllContentList(),
      contentLeftCheck: [],
      contentRightCheck: [],
      ats: 0,
      ate: 0,
      default_value: "",
      endDateOpt: "",
    };
  },
  mounted(){
    $(".el-transfer-panel__empty").text("無資料");
    apiService.getAllUsersList().then((value) => {
      this.allUserList = value;
      // console.log(this.allUsersList);
    }); 
    // this.contentLeftCheck = [0, 1, 2, 3, 4, 5];
    this.contentRightCheck = [];
    this.contentLeftCheck= []
    this.formData.contentList = [0 , 2, 3, 4, 5, 6];

    // let ts = new Date(data.time)
    apiService.getTidInfo().then((value) => {
      let data = value.data;
      this.ats = data.timestart * 1000;
      this.ate = data.timeend * 1000;

      this.endDateOpt = {
        disabledDate(time) {
          return (time.getTime() < data.timestart*1000 - 24*60*60*1000) || (time.getTime() > data.timeend*1000);
        }
      }
      this.default_value = this.ats;
    })
    
  },
  methods: {
    disableSeason(){
      console.log(this.formData.season_year);
      let year = this.formData.season_year.getFullYear();
      console.log(year);
      // s1, s2, s3, s4
      for(let i=0; i<4; i++){
        let ss = new Date(year, 3*i, 1).getTime();
        let se = new Date(year, 3*i + 3 , 1).getTime();
        
        if(this.ate < ss + 15*24*60*60*1000 || this.ats > se - 15*24*60*60*1000){
          this.options[i]['disabled'] = true;
        } else {
          this.options[i]['disabled'] = false;
        }
      }
    }
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
    height: 550px;
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
  .pdf-generate-button-div {
    margin-top: 10px;
  }
</style>