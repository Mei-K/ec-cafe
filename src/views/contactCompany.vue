<template>
  <div class="top-wrapper">
    <div class="container">
      <h1 class="page-title">＊お問い合わせ＊</h1>
      <div class="row login-page">
        <div class="col s12 z-depth-6 card-panel">
          <!-- <div class="error">{{ errorMessage }}</div> -->
          <form class="login-form">
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">account_circle</i>
                <input class="validate" id="name" type="text" v-model="name" />
                <label for="name" data-error="wrong" data-success="right"
                  >お名前</label
                >
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">mail_outline</i>
                <input
                  class="validate"
                  id="email"
                  type="email"
                  v-model="email"
                />
                <label for="email" data-error="wrong" data-success="right"
                  >メールアドレス</label
                >
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">mode_edit</i>
                <textarea
                  id="textarea"
                  class="materialize-textarea"
                  v-model="content"
                />
                <label for="textarea" data-error="wrong" data-success="right"
                  >お問い合わせ内容</label
                >
              </div>
            </div>
            <div class="row contact-btn">
              <button class="btn" type="button" @click="submitToCompany">
                <span>送信</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ContactCompany extends Vue {
  //お問い合わせ元氏名
  private name = "";
  //お問い合わせ元メールアドレス
  private email = "";
  //お問い合わせ内容
  private content = "";

  /**
   * お問い合わせ内容の送信.
   *
   * @remarks お問い合わせ内容をslackに送信。
   */
  async submitToCompany(): Promise<void> {
    const payload = {
      text:
        "お問い合わせがありました\n" +
        "お名前: " +
        this.name +
        "\n" +
        "メールアドレス: " +
        this.email +
        "\n" +
        "【問い合わせ内容】\n" +
        this.content,
    };

    //localモードにしてurlを環境変数に設定している
    const url = process.env.VUE_APP_API_BASE_URL;

    if (this.name && this.email && this.content) {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .catch((error) => {
          throw new Error(error);
        })
        .then(() => {
          alert("送信が完了しました。");
          this.name = "";
          this.email = "";
          this.content = "";
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      alert("お問い合わせ内容は全て入力してください");
    }
  }
}
</script>

<style scoped>
.contact-btn {
  text-align: center;
}
.top-wrapper {
  min-height: 97vh;
}

.col.s12.z-depth-6.card-panel {
  margin-top: 5%;
  padding: 1% 2%;
  box-sizing: border-box;
  background-color: #fffaf0;
}

.row .col.s12 {
  width: 100%;
  margin-left: auto;
  left: auto;
  right: auto;
  padding: 2% 0;
}
</style>
