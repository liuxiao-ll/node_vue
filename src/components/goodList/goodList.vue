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
          <a  class="price" @click="sortGoods" href="javascript:void(0)">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="toggle">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': showFlag}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter(-1)" :class="{'cur':currentIndex === -1}">All</a></dd>
              <dd v-for="(item, index) in priceFifter" @click="setPriceFilter(index)">
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
                    <a href="#"><img v-lazy="`/static/${item.productImage}`"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥{{item.salePrice}}元</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50">
                <img src="./../../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
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
        sort: true,
        page: 1,
        pageSize: 8,
        busy: true,
        loading: false,
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
        // 前端实现排序
        // this._normalize(this.goodList)
        this.showFlag = false
      },
      selectItem(item, index) {
        this.currentIndex = index
        this.priceFifterNow = this.priceFifter[index]
        // this._normalize(this.goodList)
        this.showFlag = false
      },
      // 前端实现范围功能
      _normalize(arr) {
        arr = this.good
        if (this.currentIndex === -1) {
          arr = this.good
          this.goodList = arr
        } else {
          let a = arr.filter((item) => {
            return item.salePrice >= this.priceFifterNow.sp && item.salePrice < this.priceFifterNow.ep
          })
          this.goodList = a
        }
      },
      getGoodsList(flag) {
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sort ? 1 : -1,
          priceLevel: this.currentIndex
        }
        this.loading = true
        this.$http.get('/goods', {params: param}).then((res) => {
          if (flag) {
            this.loading = false
            this.goodList = this.goodList.concat(res.data.result.list)
            if (res.data.result.count === 0) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodList = res.data.result.list
            this.busy = false
          }
        })
      },
      sortGoods() {
        this.sort = !this.sort
        this.page = 1
        this.getGoodsList()
      },
      loadMore() {
        this.busy = true
        setTimeout(() => {
          this.page++
          this.getGoodsList(true)
        }, 500)
      },
      setPriceFilter(index) {
        console.log(index)
        this.currentIndex = index
        this.page = 1
        this.getGoodsList()
      },
      toggle() {
        this.showFlag = !this.showFlag
      }
    },
    created() {
      this.getGoodsList()
    }
  }
</script>

<style scoped>
 
</style>