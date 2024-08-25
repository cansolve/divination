<template>
  <div class="info__page">
    <div class="info__tit">
      <div class="title1">填写信息</div>
      <div class="title2">免费查看报告</div>
    </div>
    <div class="form__wrap">
      <form @submit.prevent="handleSubmit">
        <div class="radio__group">
          <label class="custom__radio" :class="{ 'active': formData.gender === 'male' }" @click="selectGender('male')">
            <input type="radio" name="gender" value="male" v-model="formData.gender" />
            <span>男</span>
          </label>
          <label class="custom__radio" :class="{ 'active': formData.gender === 'female' }"
            @click="selectGender('female')">
            <input type="radio" name="gender" value="female" v-model="formData.gender" />
            <span>女</span>
          </label>
        </div>
        <div class="input__group">
          <input type="text" placeholder="请输入姓名" v-model="formData.username" id="username" />
        </div>
        <!-- 使用 DatePickerGroup 组件 -->
        <DatePickerGroup v-model:selectResult="formData.date" />

        <div class="requirement__group">
          <van-button :class="{ 'active': selectedValue === 'Button1' }" @click="selectButton($event, 'Button1')">
            单身寻找姻缘
          </van-button>
          <van-button :class="{ 'active': selectedValue === 'Button2' }" @click="selectButton($event, 'Button2')">
            破裂关系走向
          </van-button>
        </div>
        <div class="foot__btn">
          <div class="submit__btn" @click="handleSubmit">免费查看报告</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { showDialog } from "vant";
  import { ref, reactive, toRaw, nextTick, onMounted } from "vue";
  import { useRouter } from 'vue-router'; // 引入 useRouter


  import DatePickerGroup from "../components/DatePicker.vue";
  import { usePageEntryTime } from '../utils/pageEntryTime';// 引入页面时间钩子函数
  import { postUserInfo } from '../services/index';// 引入页面时间钩子函数


  export default {
    components: {
      DatePickerGroup,
    },
    setup() {
      const { entryTime } = usePageEntryTime();//调用页面进入时间
      const router = useRouter();

      //表单数据
      const formData = ref({
        gender: null,
        username: "",
        date: "",
        requirement: "",
      });

      const selectGender = (gender) => {
        formData.gender = gender;
      };
      const selectedValue = ref(null);
      const validate = (dialogvalues) => {
        const validations = [
          { field: "gender", message: "请选择性别" },
          { field: "username", message: "请填写姓名" },
          { field: "date", message: "请选择出生日期" },
          { field: "requirement", message: "请选择您的需求" },
        ];
        // 验证数据是否有空
        for (const validation of validations) {
          if (!dialogvalues[validation.field]) {
            showDialog({
              title: "提示",
              message: validation.message,
            }).then(() => {
              // on close
            });
            return false; // 终止进一步的处理
          }
        }
        return true; // 所有验证通过
      };
      // 需求按钮
      const selectButton = async (event, value) => {
        if (selectedValue.value === value) {
          selectedValue.value = null;
          formData.value.requirement = '';
        } else {
          selectedValue.value = value;
          formData.value.requirement = event.target.textContent
        }
        await nextTick();
        // console.log('Selected Button:', selectedValue.value);
        // console.log('formData value:', formData.value);
      };

      const handleSubmit = async () => {
        if (validate(formData.value)) {
          const rawFormData = toRaw(formData.value);
          console.log("rawFormData", rawFormData);
          // 在这里处理表单提交逻辑，例如发送 API 请求
          try {
            const response = await postUserInfo(rawFormData, "example"); // 发送 POST 请求
            console.log('Response:', response.data);
            // router.push({ name: 'ErrorPage' });//执行成功跳转
          } catch (error) {
            console.error('Failed to post data:', error);
            router.push({ name: 'DetailPage' });//测试成功跳转
          }
        }
      };
      onMounted(() => {
        console.log("信息填写页面进入时间：" + entryTime.value)//页面进入时间
      });

      return {
        formData,
        handleSubmit,
        selectButton,
        selectedValue,
        selectGender,
        entryTime
      };

    },

  };
</script>

<style scoped></style>
