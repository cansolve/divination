<template>
  <div class="home__page">
    <div class="banner">
      <img src="../assets/img/banner.jpg" alt="" />
    </div>
    <section class="content1">
      <div class="content__wrap">
        <div class="common__tit">你是不是在經历這樣的情況</div>
        <div class="con__tit">無法找到姻缘</div>
        <div class="content__item-wrap">
          <div class="content__item">
            <div class="item__img">
              <img src="../assets/img/item-img01.png" alt="" />
            </div>
            <div class="item__name">
              錯過好姻緣
              <div class="item__dsc">單身許久， 錯過很多機會</div>
            </div>
          </div>
          <div class="content__item">
            <div class="item__img">
              <img src="../assets/img/item-img02.png" alt="" />
            </div>
            <div class="item__name">
              對婚姻迷茫
              <div class="item__dsc">適婚年齡， 自己無可奈何</div>
            </div>
          </div>
        </div>
        <div class="con__tit">關系的破滅</div>
        <div class="content__item-wrap">
          <div class="content__item">
            <div class="item__img">
              <img src="../assets/img/item-img03.png" alt="" />
            </div>
            <div class="item__name">
              愛錯了人
              <div class="item__dsc">分手收場, 最後人財兩空</div>
            </div>
          </div>
          <div class="content__item">
            <div class="item__img">
              <img src="../assets/img/item-img04.png" alt="" />
            </div>
            <div class="item__name">
              離婚後
              <br />
              心灰意冷
              <div class="item__dsc">無奈離婚， 以後還有機會嗎</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="content2">
      <div class="content__wrap">
        <div class="common__tit">在這裏你能找到的答案</div>
        <div class="tit__s">你關心的3大問題</div>
        <div class="problem__wrap">
          <div class="problem__img">
            <img src="../assets/img/problem.png" alt="" />
          </div>
        </div>
      </div>
    </section>
    <section class="content3">
      <div class="content__wrap">
        <div class="common__tit">用户真實反饋</div>
        <div class="content3-banner">
          <img src="../assets/img/content3-banner.png" alt="" />
        </div>
        <div class="user__reviews">
          <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white" vertical>
            <van-swipe-item>
              <div class="swiper__item">
                <div class="swiper__hd">
                  <div class="swiper__hd-img">
                    <img src="../assets/img/item-img02.png" alt="" />
                  </div>
                  <div class="swiper__hd-info">
                    <div class="user__name">大师</div>
                    <div class="user_rate">
                      評分：
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                    </div>
                  </div>
                </div>
                <div class="swiper__bd">
                  大師說我命中婚姻果得比較晚，婁換下一個大運才有機會，看來我怎麽相親也不會有結果的，還是聽大師的。多用時間來...
                </div>
              </div>
            </van-swipe-item>
            <van-swipe-item>
              <div class="swiper__item">
                <div class="swiper__hd">
                  <div class="swiper__hd-img">
                    <img src="../assets/img/item-img02.png" alt="" />
                  </div>
                  <div class="swiper__hd-info">
                    <div class="user__name">大师</div>
                    <div class="user_rate">
                      評分：
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                    </div>
                  </div>
                </div>
                <div class="swiper__bd">
                  大師說我命中婚姻果得比較晚，婁換下一個大運才有機會，看來我怎麽相親也...
                </div>
              </div>
            </van-swipe-item>
            <van-swipe-item>
              <div class="swiper__item">
                <div class="swiper__hd">
                  <div class="swiper__hd-img">
                    <img src="../assets/img/item-img02.png" alt="" />
                  </div>
                  <div class="swiper__hd-info">
                    <div class="user__name">大师</div>
                    <div class="user_rate">
                      評分：
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                    </div>
                  </div>
                </div>
                <div class="swiper__bd">
                  大師說我命中婚姻果得比較晚，婁換下一個大運才有機會，間來...
                </div>
              </div>
            </van-swipe-item>
            <van-swipe-item>
              <div class="swiper__item">
                <div class="swiper__hd">
                  <div class="swiper__hd-img">
                    <img src="../assets/img/item-img02.png" alt="" />
                  </div>
                  <div class="swiper__hd-info">
                    <div class="user__name">大师</div>
                    <div class="user_rate">
                      評分：
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                    </div>
                  </div>
                </div>
                <div class="swiper__bd">
                  大師說我命中婚姻果得比較晚，婁換下一個大運才有機會，看來我怎麽相親也不會有結果的，還是聽大師的。多用時間來...
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </section>
    <div class="foot__btn">
      <router-link to="/info">
        <div class="submit__btn">拆解我的姻緣問題</div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import { usePageEntryTime } from '../utils/pageEntryTime';// 引入页面时间钩子函数
  import { getInitInfo } from '../services/index'

  export default {
    name: 'HomePage',
    setup() {
      const { entryTime } = usePageEntryTime();//调用页面进入时间
      const data = {};

      onMounted(async () => {
        console.log("主页页面进入时间：" + entryTime.value)//页面进入时间
        try {
          const response = await getInitInfo(data); // 调用 getInitInfo
          data.value = response.data; // 将获取的数据赋值给响应式变量
        } catch (error) {
          console.error('Failed to fetch initial info:', error);
        }
      });
      return {
        entryTime,
        data
      };
    },
  };
</script>
<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1002px;
  height: 150px;
  background: url('../assets/img/btn.png') no-repeat center;
  background-size: 100% 100%;
  cursor: pointer;
  animation: resize-animation 2s infinite;
}

@keyframes resize-animation {

  0%,
  20%,
  40%,
  100% {
    transform: scale(0.95);
    /* 初始和结束时大小为正常 */
  }

  10%,
  30% {
    transform: scale(1);
    /* 在动画中间时，按钮放大到 1.2 倍 */
  }
}
</style>
