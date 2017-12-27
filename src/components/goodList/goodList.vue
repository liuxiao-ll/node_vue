<template>
  <div>
    <div class="nav-breadcrumb-wrap">
      <div class="container">
        <nav class="nav-breadcrumb">
          <a href="/">Home</a>
          <span>Goods</span>
        </nav>
      </div>
    </div>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="toggle">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': showFlag}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="selectAll()" :class="{'cur':currentIndex === -1}">All</a></dd>
              <dd v-for="(item, index) in priceFifter" @click="selectItem(item, index)">
                <a href="javascript:void(0)" :class="{'cur':currentIndex === index}">{{item.sp}} - {{item.ep}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodList">
                  <div class="pic">
                    <a href="#"><img v-lazy="`/static/${item.prodcutImg}`"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥{{item.prodcutPrice}}元</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="md-overlay" v-show="showFlag" @click="toggle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../assets/css/base.css'
  import '../../assets/css/product.css'
  export default {
    data() {
      return {
        goodList: [],
        showFlag: false,
        priceFifter: [
          {
            'sp': 0,
            'ep': 100
          },
          {
            'sp': 100,
            'ep': 500
          },
          {
            'sp': 500,
            'ep': 1000
          },
          {
            'sp': 1000,
            'ep': 5000
          }
        ],
        currentIndex: -1,
        priceFifterNow: {}
      }
    },
    methods: {
      selectAll() {
        this.currentIndex = -1
        this._normalize(this.goodList)
        this.showFlag = false
      },
      selectItem(item, index) {
        this.currentIndex = index
        this.priceFifterNow = this.priceFifter[index]
        this._normalize(this.goodList)
        this.showFlag = false
      },
      _normalize(arr) {
        arr = this.good
        if (this.currentIndex === -1) {
          arr = this.good
          this.goodList = arr
        } else {
          let a = arr.filter((item) => {
            return item.prodcutPrice >= this.priceFifterNow.sp && item.prodcutPrice < this.priceFifterNow.ep
          })
          this.goodList = a
        }
      },
      toggle() {
        this.showFlag = !this.showFlag
      }
    },
    created() {
      let result
      this.$http.get('/api/goods').then((res) => {
        result = res.data.data.result
        this.goodList = result
        this.good = result
      })
    }
  }
</script>

<style scoped>
 
</style>