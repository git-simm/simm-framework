<template>
  <section class="content-section">
    <div class="row">
      <el-form :model="request" :rules="rules" ref="request" label-width="100px" class="demo-ruleForm">
        <div class="col-sm-5">
          <el-form-item label="原始密码" prop="oldPassword">
            <el-input type="password" v-model="request.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="request.newPassword"  placeholder="密码由数字,字母,特殊符号混合组成,且长度要大于8位!"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPassword">
            <el-input type="password" v-model="request.checkPassword" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveFun('request')">提交</el-button>
            <el-button @click="resetForm('request')">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </section>
</template>
<script>
  export default{
    data: function () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.request.checkPassword !== '') {
            this.$refs.request.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.request.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        response: '',
        request: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: '请输入原始密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      saveFun: function (formName) {
        var self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            var store = this.$store
            var jsondata = Object.assign(self.request, {token: store.state.token, tokenid: store.state.tokenid})
            self.$parent.callAPI('GET', '/adminUser/changePassword.json', jsondata, function (response) {
              self.$message({message: '修改成功！', type: 'success'})
            })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }

  }
</script>
