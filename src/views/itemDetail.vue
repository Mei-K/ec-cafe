<template>
  <div class="top-wrapper">
    <div class="container">
      <h1 class="page-title">{{ currentOrderItem.item.name }}</h1>
      <div class="row">
        <div class="row item-detail">
          <div class="item-icon">
            <img v-bind:src="currentOrderItem.item.imagePath" />
          </div>
          <div class="item-intro">
            {{ currentOrderItem.item.description }}
          </div>
        </div>
        <div class="row item-size">
          <div class="item-hedding">サイズ</div>
          <div>
            <label>
              <input
                id="size-m"
                name="size"
                type="radio"
                checked="checked"
                v-model="size"
                value="M"
              />
              <span>
                &nbsp;<span class="price">Ｍ</span>&nbsp;&nbsp;{{
                  currentOrderItem.item.priceM
                }}円(税抜)</span
              >
            </label>
            <label>
              <input
                id="size-l"
                name="size"
                type="radio"
                v-model="size"
                value="L"
              />
              <span>
                &nbsp;<span class="price">Ｌ</span>&nbsp;&nbsp;{{
                  currentOrderItem.item.priceL
                }}円(税抜)</span
              >
            </label>
          </div>
        </div>
        <div class="row item-toppings">
          <div class="item-hedding">
            トッピング：&nbsp;1つにつき
            <span>&nbsp;Ｍ&nbsp;</span>&nbsp;&nbsp;200円(税抜)
            <span>&nbsp;Ｌ</span>&nbsp;&nbsp;300円(税抜)
          </div>
          <div
            v-for="topping of currentOrderItem.item.toppingList"
            v-bind:key="topping.id"
            class="toppingList"
          >
            <label class="item-topping">
              <input
                type="checkbox"
                v-model="selectedTopping"
                :value="topping"
              />
              <span>{{ topping.name }}</span>
            </label>
          </div>
        </div>
        <div class="row item-quantity">
          <div class="item-hedding item-hedding-quantity">数量</div>
          <div class="item-quantity-selectbox">
            <div class="input-field col s12">
              <select class="browser-default" v-model.number="quantity">
                <option value="" disabled selected>選択して下さい</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row item-total-price">
          <span
            >この商品金額：{{
              currentOrderItem
                .calcSubTotalPrice(size, selectedTopping.length, quantity)
                .toLocaleString()
            }}
            円(税抜)</span
          >
        </div>
        <div class="errorMessage">{{ errorMessage }}</div>
        <div class="row item-cart-btn">
          <button
            class="waves-effect waves-light btn"
            type="button"
            @click="addItem"
          >
            <span>カートに入れる</span>
          </button>
        </div>
      </div>
    </div>
    <!-- end container -->
  </div>
  <!-- end top-wrapper -->
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Item } from "@/types/Item";
import { Topping } from "@/types/Topping";
// 使用するためには「npm install axios --save」を行う
import axios from "axios";
import { OrderItem } from "@/types/OrderItem";
import { OrderTopping } from "@/types/OrderTopping";

@Component
export default class itemDetail extends Vue {
  //現在表示されている商品
  private currentOrderItem = new OrderItem(
    0,
    0,
    0,
    0,
    "M",
    new Item(
      0,
      "type",
      "name",
      "description",
      0,
      0,
      "image",
      false,
      new Array<Topping>(),
      false,
      0
    ),
    new Array<OrderTopping>()
  );

  // 現在選択されている商品の画像
  private currentItemImage = "";
  //選択されているサイズ
  private size = "M";
  //選択されているトッッピングの個数
  private selectedTopping = new Array<Topping>();
  //選択された商品の個数
  private quantity = 1;
  //サイズと数量が選択されていない時のエラーメッセージ
  private errorMessage = "";

  /**
   * 商品詳細情報をAPIから取得.
   */
  async created(): Promise<void> {
    // 送られてきたリクエストパラメータのidをnumberに変換して取得する
    const itemID = parseInt(this["$route"].params.id);
    try {
      const response = await axios.get(
        `http://153.127.48.168:8080/ecsite-api/item/${itemID}`
      );
      //外部APIから取得してきたデータを代入
      this.currentOrderItem = new OrderItem(
        0,
        0,
        0,
        0,
        "M",
        new Item(
          response.data.item.id,
          response.data.item.type,
          response.data.item.name,
          response.data.item.description,
          response.data.item.priceM,
          response.data.item.priceL,
          response.data.item.imagePath,
          response.data.item.deleted,
          response.data.item.toppingList,
          false,
          0
        ),
        new Array<OrderTopping>()
      );
    } catch (error) {
      if (error) {
        this.$router.push("/not-found");
      }
    }
  }

  /**
   * ショッピングカートに商品を追加する.
   */
  addItem(): void {
    this["$store"].commit("addItemToCart", {
      size: this.size,
      orderToppingList: this.selectedTopping,
      quantity: this.quantity,
      orderItem: {
        id: this.currentOrderItem.item.id,
        name: this.currentOrderItem.item.name,
        description: this.currentOrderItem.item.description,
        priceM: this.currentOrderItem.item.priceM,
        priceL: this.currentOrderItem.item.priceL,
        imagePath: this.currentOrderItem.item.imagePath,
        deleted: this.currentOrderItem.item.deleteId,
      },
    });
    this["$router"].push("/cartList");
  }
}
</script>

<style scoped>
.item-detail {
  display: flex;
  /* 中央揃え */
  justify-content: center;
}
.item-icon img {
  margin: auto;
  display: block;
  border-radius: 30px;
  width: 250px;
  height: 250px;
  padding: 0 0 15px 0;
}

.item-intro {
  width: 400px;
  padding: 0 2%;
  font-size: 20px;
  text-align: left;
}

.item-hedding {
  font-weight: bold;
  font-size: 17px;
  text-align: left;
}
.item-size {
  /* text-align: center; */
  font-size: 15px;
  margin-bottom: 20px;
  padding: 0 200px 0 200px;
}

/* サイズをオレンジ〇で囲む */
.price {
  background-color: #d6c6af;
  border-radius: 50%; /* 角丸にする設定 */
  color: black;
}

.item-toppings {
  font-size: 15px;
  padding: 0 200px 0 200px;
  text-align: left;
}

.item-topping {
  margin-right: 10px;
}

.item-hedding-quantity {
  margin-left: 200px;
}

.item-quantity {
  text-align: center;
  font-size: 15px;
}

.item-quantity-selectbox {
  padding: 0 300px 0 300px;
}

.item-total-price {
  font-size: 35px;
  text-align: center;
}

.item-cart-btn {
  text-align: center;
}

.toppingList {
  display: inline;
  text-align: left;
}

.item-size {
  text-align: left;
}
.errorMessage {
  color: red;
  text-align: center;
}
.top-wrapper {
  min-height: 97vh;
}
[type="radio"]:checked + span:after {
  -webkit-transform: scale(1.02);
  transform: scale(1.02);
  background-color: #55423d;
  border: #55423d;
}
[type="checkbox"]:checked + span:not(.lever):before {
  top: -4px;
  left: -5px;
  width: 12px;
  height: 22px;
  border-top: 2px solid transparent;
  border-left: 2px solid transparent;
  border-right: 2px solid #332315;
  border-bottom: 2px solid #332315;
  -webkit-transform: rotate(40deg);
  transform: rotate(40deg);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}
button.waves-effect.waves-light.btn {
  margin: 3%;
}
</style>
