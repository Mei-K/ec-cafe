<template>
  <header>
    <div class="container">
      <div class="header">
        <div class="header-left logo">
          <router-link to="/"> Raku＊2 coffee </router-link>
        </div>

        <div class="header-right">
          <router-link to="/addNewItem" v-if="loginAdmin">
            <i class="far fa-plus-square"></i>商品追加
          </router-link>
          <router-link to="/itemList">
            <i class="fas fa-utensils"></i> 商品一覧
          </router-link>
          <router-link to="/cartList" v-if="!loginAdmin">
            <i class="fas fa-shopping-cart"></i>カート
          </router-link>
          <router-link to="/contactCompany" v-if="!loginAdmin">
            <i class="fas fa-comment"></i>お問い合わせ
          </router-link>
          <router-link to="/registerUser" v-if="!loginStatus">
            <i class="fas fa-user"></i>会員登録
          </router-link>
          <router-link to="/loginUser" v-if="!loginStatus">
            <i class="fas fa-sign-in-alt"></i>ログイン
          </router-link>
          <router-link to="/loginAdministrator" v-if="!loginStatus">
            <i class="fas fa-sign-out-alt"></i>管理者はこちら
          </router-link>
          <router-link to="/orderHistory" v-if="loginUser">
            <i class="fas fa-user"></i>注文履歴
          </router-link>
          <div class="example-modal-window" v-if="loginStatus">
            <a>
              <button @click="openModal" class="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>ログアウト
              </button>
            </a>
            <LogoutModal v-on:close-modal="closeModal" v-if="isModalOpen" />
          </div>
          <span class="admin-apper" v-if="loginAdmin">管理者：ログイン中</span>
          <span class="user-apper" v-if="loginUser">
            {{ loginUserdata._name }}：ログイン中
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { User } from "@/types/User";
import { Component, Vue } from "vue-property-decorator";
import LogoutModal from "./logoutModal.vue";

@Component({ components: { LogoutModal } })
export default class Header extends Vue {
  //モーダルの表示ステータス
  private isModalOpen = false;
  //ユーザーがログイン中
  private loginUser = false;
  //管理者がログイン中
  private loginAdmin = false;
  //ユーザーまたは管理者がログイン中
  private loginAllStatus = false;
  private loginUserdata = new User(0, "", "", "", "", "", "");

  /**
   * 会員または管理者のログイン状態でナビゲーションの項目を変化
   * @returns true:会員か管理者がログイン false:会員と管理者共にログアウトの状態
   */
  get loginStatus(): boolean {
    // フィールド変数にユーザー情報を格納
    this.loginUserdata = this.$store.getters.getLoginUserInfo;

    if (this["$store"].getters.getLoginStatus) {
      this.loginAllStatus = this["$store"].getters.getLoginStatus;
      this.loginUser = true;
    } else if (this["$store"].getters.getLoginAdmin) {
      this.loginAllStatus = this["$store"].getters.getLoginAdmin;
      this.loginAdmin = true;
    } else {
      this.loginAllStatus = false;
      this.loginUser = false;
      this.loginAdmin = false;
    }

    return this.loginAllStatus;
  }
  //モーダルをオープンする処理
  openModal(): void {
    this.isModalOpen = true;
  }

  //モーダルをクローズする処理
  //logoutModal.vueから受け取った引数をもとにモーダルクローズする
  closeModal(close: string): void {
    if (close === "") {
      this.isModalOpen = false;
    } else {
      this.isModalOpen = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  height: 65px;
  width: 100%;
  background-color: #ede4cd;
  position: fixed; /* スクロールしてもヘッダが表示されるように位置を固定する */
  z-index: 10; /* ヘッダが一番上に表示されるようにする(数が多いほど上に来る。例えば-1にするとヘッダが裏側に行き見えなくなります) */
}
.header {
  display: flex; /* ヘッダロゴと右側のリンクを横並びにする */
  /* justify-content: flex-end; 右寄せにしたい場合*/
}
.logo {
  width: 15%;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
.logo a {
  color: #332315;
}
.header-right {
  margin-left: auto; /* ヘッダ右側のリンクだけ右寄せにする(ロゴは左寄せのまま) */
  /* float: right; */
  display: flex; /* ヘッダ右側のリンクを横に並べる */
}
.header-right a {
  line-height: 65px; /* 行の高さを指定(文字が上下の真ん中に配置される) */
  padding: 0 25px;
  color: #9d8e87;
  display: block; /* a要素をブロック要素に変更(borderまでがクリックできるようになる) */
  /* float: left; */
  transition: all 0.5s; /* アニメーションの設定 all=変化の対象 0.5s=変化にかかる時間 hoverと組み合わせることが多い */
}
.header-right a:hover {
  color: #332315;
}
/* fontawesome(ログインアイコンの設定) */
.fas {
  margin-right: 5px;
}
.admin-apper {
  background-color: #332315;
  margin: 10px;
  color: white;
  padding: 10px 5px;
}
.user-apper {
  background-color: #332315;
  color: white;
  margin: 10px;
  padding-top: 10px;
  padding: 10px;
  border-radius: 5px;
}
.logoutBtn {
  border: none;
  color: #9d8e87;
  background-color: #ede4cd;
  cursor: pointer;
}

.logoutBtn:hover {
  color: #332315;
}
</style>
