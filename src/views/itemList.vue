<template>
  <div class="top-wrapper">
    <!-- search form -->
    <div class="container">
      <h1 class="page-title">＊商品一覧＊</h1>
      <form class="search-form">
        <!-- サジェスト機能 -->
        <fieldset>
          <input
            type="text"
            name="name"
            class="search-name-input"
            v-model="searchKeyWord"
            autocomplete="on"
            list="cafe-item"
          />
          <datalist id="cafe-item">
            <div v-for="item of getAllItem" v-bind:key="item.id">
              <option v-bind:value="item.name"></option>
            </div>
          </datalist>
        </fieldset>
        <button
          class="btn search-btn"
          type="button"
          v-on:click="getSearchKeyWord(searchKeyWord)"
        >
          <span>検 索</span>
        </button>
      </form>
    </div>

    <!-- item list -->
    <div v-if="hasItems">
      <div class="container">
        <div class="changeItemOrder">
          <select
            class="btn search-btn"
            name="itemlist"
            id="itemlist"
            v-on:change="changeOrder"
            v-model="selectedOrder"
          >
            <option disabled value="">おすすめ順</option>
            <option>昇順(名前)</option>
            <option>降順(名前)</option>
            <option>金額が高い順(Mサイズ)</option>
            <option>金額が低い順(Mサイズ)</option>
            <option>金額が高い順(Lサイズ)</option>
            <option>金額が低い順(Lサイズ)</option>
          </select>
        </div>
      </div>
      <div class="container">
        <div class="items" v-if="hasItems">
          <div class="card item" v-for="item of itemList" v-bind:key="item.id">
            <div class="item-icon">
              <router-link :to="'/itemDetail/' + item.id" id="item-detail-link">
                <img :src="item.imagePath" />
              </router-link>
            </div>
            <router-link :to="'/itemDetail/' + item.id" id="item-detail-link">
              {{ item.name }} </router-link
            ><br />
            <span class="price">Ｍ</span>{{ item.priceM }}円(税抜)<br />
            <span class="price">Ｌ</span>{{ item.priceL }}円(税抜)<br />
            <div class="favorite">
              <div
                class="favoriteBtn"
                @click="changeFavoriteFlag(item)"
                v-if="item.isFavorite === false"
              >
                <i
                  class="far fa-heart faa-tada animated-hover"
                  style="color: #c0c0c0"
                ></i>
              </div>
              <div
                class="favoriteBtn"
                @click="changeFavoriteFlag(item)"
                v-if="item.isFavorite === true"
              >
                <i
                  class="fas fa-heart faa-tada animated-hover"
                  style="color: red"
                ></i>
              </div>
              <div>{{ item.favoriteCount }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- itemList ページボタン -->
      <div class="container">
        <div class="page-btn">
          <div
            v-for="page of getShowPage"
            v-bind:key="page"
            class="page-num-btn"
          >
            <button
              type="button"
              class="btn"
              v-on:click="showItemListForOnePage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-if="!hasItems">
      <div class="row">
        <div class="col s12 m card-noItemList">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text center">
              <span class="card-title"
                >ヒットした商品は見つかりませんでした</span
              >
              <div class="card-action">
                検索のヒント:
                <ul>
                  <li>キーワードに誤字・脱字がないか確認します。</li>
                  <li>別のキーワードを試してみます。</li>
                  <li>もっと一般的なキーワードに変えてみます。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Item } from "../types/Item";
@Component
export default class itemList extends Vue {
  //商品一覧を格納する配列
  private itemList = Array<Item>();
  //検索キーワード
  private searchKeyWord = "";
  //表示するページ数
  private pegeNum = 0;
  //並び替え変数
  private selectedOrder = "";
  // 検索表示フラグ
  private hasItems = true;

  /**
   * WebAPIから商品一覧を取得する.
   *
   * @remarks 全商品一覧をAPIからアクションで取得、ミューテーションで商品オブジェクト化したものを商品一覧配列に格納
   */
  async created(): Promise<void> {
    await this["$store"].dispatch("getItemList");

    this.itemList = this["$store"].getters.getAllItems;

    this.defaltDisplayItemList;
  }

  /**
   *商品名を曖昧検索する.

   *@params - 入力欄に入力された検索キーワード
   */
  getSearchKeyWord(searchKeyWord: string): void {
    this.itemList = this["$store"].getters.getSearchKeyWord(searchKeyWord);
    if (this.itemList[0] == null) {
      this.hasItems = false;
    } else {
      this.hasItems = true;
    }
  }

  /**
   * ページ数を表示する.
   *
   *@remarks 検索結果の商品数(itemList.length)を使用
   *         検索結果した商品数からページング
   *@returns 表示するページ数
   */
  get getShowPage(): number {
    return Math.ceil((this.itemList.length + 1) / 9);
  }
  /**
   *１ページに表示させる商品リスト.

   *@remarks クリックされたページ数から表示させる商品リストのIndexを指定してsliceメソットで表示させるリストを指定している
   *@param targetNum - 押されたページ数
   */
  showItemListForOnePage(targetNum: number): void {
    let startIndex = (targetNum - 1) * 9;
    let endIndex = startIndex + 9;

    this.itemList = this["$store"].getters.getAllItems.slice(
      startIndex,
      endIndex
    );
  }
  /**
   * 商品一覧の初期ページを９個の商品に指定.
   *
   * @returns 商品リストの最初の９個（Index:0〜8）
   */
  get defaltDisplayItemList(): void {
    return (this.itemList = this["$store"].getters.getAllItems.slice(0, 9));
  }
  /**
   *商品全件一覧を取得.
   *
   * @remarks 商品検索のサジェスト機能をするために全件取得メソッドを作成
   */
  get getAllItem(): void {
    return this["$store"].getters.getAllItems;
  }

  /**
   * 並び替えした後の商品全件一覧を取得.
   *
   * @remarks payloadで指定した並び替え方法を渡す
   */
  changeOrder(): void {
    this["$store"].commit("changeItemOrder", this.selectedOrder);
    this.itemList = this["$store"].getters.getSelectedItems.slice(0, 9);
  }
  /**
   * いいねのフラグを変更する.
   *
   * @remarks Itemオブジェクトをペイロードとして送り、Vuexストアでいいねのフラグを変更する。
   */
  changeFavoriteFlag(item: Item): void {
    this["$store"].commit("changeFavoriteFlag", {
      item: item,
    });
  }
}
</script>

<style scoped>
.search-wrapper {
  padding: 80px 0 50px 0; /*上はヘッダが来るのでその分180px分空ける*/
  /* text-align: center; */
  position: fixed; /* スクロールしても表示されるように位置を固定 */
  height: 180px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1; /* 上に表示されるようにする(数が多いほど上に来る。例えば-1にすると裏側に行き見えなくなります) */
}

.search-form {
  margin: auto; /*検索窓を中央に配置*/
  width: 40%;
  text-align: center;
}

.search-name-input {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
  /* display: block; */
  width: 30%;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  font-family: inherit;
  margin: 0;
  text-rendering: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  text-align: start;
  appearance: auto;
  -webkit-rtl-ordering: logical;
  cursor: text;
}

.search-btn {
  color: #fff;
  background-color: #55423d;
  border-color: #55423d;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

fieldset {
  padding: 0;
  border: none;
}

/* ========================================
    item-wrapperの設定
   ======================================== */

.item-wrapper {
  padding-top: 200px; /* 上はヘッダや検索フォームが来るのでその分空ける */
  padding-bottom: 80px;
  padding-left: 15%;
  padding-right: 5%;
  background-color: #f7f7f7;
  text-align: center;
}

.items {
  display: flex;
  flex-wrap: wrap; /* 表示内容が多かった時に自動的に複数行に分割される */
  justify-content: space-around;
}

.item {
  flex: 0 0 320px; /* paddingやborder含むitem全体の横幅を320pxにする */
  padding: 20px;
  text-align: center;
}

.item-icon img {
  margin: auto;
  display: block;
  border-radius: 30px;
  width: 200px;
  height: 200px;
  padding: 0 0 15px 0;
}

/* サイズを〇で囲む */
.price {
  background-color: #d6c6af;
  border-radius: 50%; /* 角丸にする設定 */
}

.item a {
  color: #513a2a;
}
.item a:hover {
  color: #1f1714;
}

.page-btn {
  width: 100%;
  padding: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.btn {
  margin: 0 5px;
}

.changeItemOrder {
  width: 18%;
  margin: right; /*検索窓を中央に配置*/
}

.favorite {
  display: flex;
  justify-content: flex-end;
  width: 85%;
  margin-bottom: 10px;
  font-size: 18px;
  box-sizing: border-box;
}

.fa-heart:before {
  margin-right: 5px;
}
.page-num-btn {
  margin: 2%;
}
.top-wrapper {
  min-height: 97vh;
}

.card {
  background-color: #fffaf1;
}

.favoriteBtn :hover {
  cursor: pointer;
}
</style>
