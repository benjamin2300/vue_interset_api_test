<template>
    <div class="form-div">
    <el-form ref="form" :model="formData" >
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
        <el-select v-show='formData.timeType === "season"' 
                   v-model="formData.season_q" 
                   placeholder="請選擇季度" 
                   class="season-q-select"
                   >
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
            :data="allContentList"
            v-model="formData.contentList" 
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
        <OrganizationReportGenerator :formData="formData" />
      </div>
      

    </el-form>
  </div>

</template>

<script>
import OrganizationReportGenerator from '@/components/OrganizationReportGenerator'
import {APIService} from '@/APIService.js';

const apiService = new APIService();
export default {
  name: 'organizationReportForm',
  components: {
    OrganizationReportGenerator
  },
  data(){
    return {
      formData: {
        formType: "organization",
        timeType: "year",
        year:"",
        month:"",
        season_year:"",
        season_q:"",
        daterange:"",
        contentList:[],
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
      allContentList: [],
      contentLeftCheck: [],
      ats: 0,
      ate: 0,
      default_value:"",
      endDateOpt: "",

    };
  },
  mounted(){
    const generateAllContentList = disabled_list => {
      
      const data = [];
      const data_type = ["使用者", "控制器", "資源", "分享資源", "檔案", "主機", "專案", "伺服器", "印表機", "網站", "IP位址"];
      for (let i = 0; i < data_type.length; i++) {

        data.push({
          key: i,
          label: data_type[i],
          disabled: disabled_list.includes(i),
        });
      }
      const other_data = ["整體風險值變化", "風險值含威脅分佈",  "日/周工作時數分布", "登入成功/失敗"]
      for(let i=0; i<other_data.length; i++){
        data.push({
          key: 11 + i,
          label: other_data[i]
        });
      }
      return data;
    };
    let disabled_list = [];
    $(".el-transfer-panel__empty").text("無資料");
    
    apiService.getTidInfo().then((value) => {
      let data = value.data;
      // check datatype exist
      if(data.totalScoredUsers == 0){
        disabled_list.push(0);
      }
      if(data.totalScoredControllers == 0){
        disabled_list.push(1);
      }
      if(data.totalScoredResources == 0){
        disabled_list.push(2);
      }
      if(data.totalScoredShares == 0){
        disabled_list.push(3);
      }
      if(data.totalScoredFiles == 0){
        disabled_list.push(4);
      }
      if(data.totalScoredMachines == 0){
        disabled_list.push(5);
      }
      if(data.totalScoredProjects == 0){
        disabled_list.push(6);
      }
      if(data.totalScoredServers == 0){
        disabled_list.push(7);
      }
      if(data.totalScoredPrinters == 0){
        disabled_list.push(8)
      }
      if(data.totalScoredWebsites == 0){
        disabled_list.push(9)
      }
      if(data.totalScoredIps == 0){
        disabled_list.push(10)
      }
      
      this.allContentList = generateAllContentList(disabled_list);
      for(let i=0; i<this.allContentList.length; i++){
        let d = this.allContentList[i];
        if(!d.disabled){
          this.formData.contentList.push(d.key);
        }
      }
      console.log(data);
      // let ts = new Date(data.time)
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
    height: 500px;
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
  .pdf-generate-button-div {
    margin-top: 10px;
  }
</style>