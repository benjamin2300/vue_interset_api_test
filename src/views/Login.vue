<template>
  <el-container>
    <el-header>Interset報表產生器</el-header>
    <el-main>
      <div class="login"> 
        <h1>使用者登入</h1>
        <el-form :label-position="labelPosition" size="medium" label-width="100px" :model="loginModel">
          <el-form-item label="使用者名稱">
            <el-input v-model="loginModel.name"></el-input>
          </el-form-item>
          <el-form-item label="密碼">
            <el-input type="password" v-model="loginModel.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="loginBtn" type="primary" @click="login">登入</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'login',
  components: {

  },
  data(){
    return {
      labelPosition: "left",
      loginModel: {
        name: '',
        password: '',
      }
    }
  },
  methods: {
    login(){
      const {username, passeord} = this;
      this.$store.dispatch(AUTH_REQUEST, {username, password}).then(() => {
        this.$router.push('/');
      })
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
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    /* text-align: center; */
    line-height: 100px;
  }
  .login{
    width: 300px;
    height: 400px;
    margin: 30px auto;
    padding: 10px;
    border: 3px solid lightgray;
    border-radius: 10px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 40px;
    padding-left: 20px;
    margin: auto;
    
    /* font-family: Arial, "新細明體"; */
    font-family: "OpenSans";
    font-weight: 700;
    font-style: normal;
  }

  .loginBtn {
    margin-right: 80px;
  }

  h1 {
    text-align: center;
  }
</style>