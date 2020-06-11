<template>
  <div class="login_body">
    <div class="login-title">
      <img src="../assets/login/title.svg" />
    </div>
    <div class="login_shadow">
      <div class="login_main">
        <span>用户登录</span>
        <div class="login_main_list">
          <suc-form
            ref="loginForm"
            :model="loginForm"
            :rules="ruleForm"
            :label-width="0"
          >
            <suc-form-item prop="userName">
              <suc-input
                type="text"
                v-model="loginForm.userName"
                placeholder="用户名"
                :config="{ size: 'large' }"
                @keyup.enter.native="loginSubmit('loginForm')"
              >
                <img
                  src="../assets/login/username.svg"
                  style="width: 20px;height: 20px"
                  slot="prepend"
                />
              </suc-input>
            </suc-form-item>
            <suc-form-item prop="password">
              <suc-input
                type="password"
                v-model="loginForm.password"
                placeholder="密码"
                :config="{ size: 'large' }"
                @keyup.enter.native="loginSubmit('loginForm')"
              >
                <img
                  src="../assets/login/password.svg"
                  style="width: 20px;height: 20px"
                  slot="prepend"
                />
              </suc-input>
            </suc-form-item>
            <!-- <FormItem prop="codeValue">
                        <Row>
                            <Col span="14">
                            <Input class="code_input" type="text" v-model="loginForm.codeValue" placeholder="验证码" size="large"
                             @keyup.enter.native="loginSubmit('loginForm')">
                            </Input>
                            </Col>
                            <Col span="8" offset="2" style="height:36px;">
                            <img class="code_img" type="image" id="checkImg" :src="codeImg" />
                            </Col>
                        </Row>
                    </FormItem> -->
            <suc-form-item>
              <suc-button @click.prevent="loginSubmit('loginForm')" long>
                登 陆
              </suc-button>
            </suc-form-item>
          </suc-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucButton, SucInput, SucIcon, SucForm, SucFormItem } from "@suc/ui";

const validateName = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("用户名不能为空"));
  } else {
    callback();
  }
};
const validatePass = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("密码不能为空"));
  } else {
    callback();
  }
};
// const validateCode = (rule, value, callback) => {
// 	if (value === '') {
// 		callback(new Error('验证码不能为空'));
// 	}
// 	setTimeout(() => {
// 		if (value.length == 4) {
// 			this.$http.get("/rest/authox/checkCodeValidate?value=" + this.loginForm.codeValue).then(res => {
// 				if (res.data === 'false') {
// 					callback(new Error('验证码错误'));
// 				} else {
// 					callback();
// 				}
// 			}).catch(err => {
// 				console.log(err);
// 			});

// 		} else {
// 			callback(new Error('验证码错误'));
// 		}
// 	}, 800);
// };
@Component({
  components: {
    SucInput,
    SucIcon,
    SucForm,
    SucFormItem,
    SucButton
  }
})
export default class Login extends Vue {
  codeImg = "";
  codeCheck = {};
  loginForm = {
    userName: "",
    codeValue: "",
    password: ""
  };
  ruleForm = {
    userName: [
      {
        validator: validateName,
        trigger: "blur"
      }
    ],
    password: [
      {
        validator: validatePass,
        trigger: "blur"
      }
    ]
    // codeValue: [{
    // 	validator: validateCode,
    // 	trigger: 'blur'
    // }]
  };

  created() {
    //this.getCodeImg();
  }

  loginSubmit() {
    this.$router.push("/home");
    // const form: any = this.$refs[name];
    // form.validate((valid: any) => {
    //     if (valid) {
    //         this.$http({
    //             url: "/login",
    //             method: "post",
    //             data: qs.stringify({
    //                 username: this.loginForm.userName,
    //                 password: this.loginForm.password,
    //                 checkCode: this.loginForm.codeValue
    //             }),
    //             headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //             }
    //         })
    //             .then(res => {
    //                 if (this.$route.query.redirect) {
    //                     this.$router.push(<string>(
    //                         this.$route.query.redirect
    //                     ));
    //                 } else {
    //                     this.$router.push("/");
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 this.$Message.error("登录失败!");
    //             });
    //     } else {
    //         this.$Message.error("登录失败!");
    //     }
    // });
  }
}
</script>
<style lang="scss">
.login_body {
  background: url("../assets/login/login.png") no-repeat fixed center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: -webkit-flex;
  display: flex;
  .login-title {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
  }
  .login_shadow {
    margin: auto;
    text-align: center;
    width: 800px;
    height: 510px;
    background-color: rgb(255, 255, 255, 0.3);
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    .login_main {
      margin: 20px;
      text-align: center;
      width: 760px;
      height: 470px;
      border-radius: 8px;
      padding: 43px 195px 0 195px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);
      span {
        width: 106px;
        height: 30px;
        font-family: FZZZHUNHJW--GB1-0;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 58px;
        letter-spacing: 2px;
        color: #444c67;
      }
      .login_main_list {
        margin: 65px 0 0 0;
        .suc-input {
          width: 400px;
        }
        .ivu-input-group-large > .ivu-input-group-prepend {
          padding: 12px 20px;
        }
        .suc-input .ivu-input {
          height: 50px;
          line-height: 50px;
        }
        button {
          box-shadow: 0 5px 10px 0 rgba(29, 30, 196, 0.3);
          border-radius: 30px;
          width: 260px;
          height: 60px;
          margin-top: 36px;
          span {
            width: 47px;
            height: 27px;
            font-size: 22px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 58px;
            letter-spacing: 3px;
            color: #ffffff;
          }
        }
      }

      .code_img {
        width: 100%;
        height: 36px;
      }
    }
  }
}
</style>
