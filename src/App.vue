<template>
  <router-view />
</template>

<script>
  import { ref, onMounted } from 'vue';
  import FingerprintJS from '@fingerprintjs/fingerprintjs';
  // import { v4 as uuidv4 } from 'uuid';
  export default {
    name: "App",
    setup() {
      const visitorId = ref('');
      const uuid = ref('');
      onMounted(() => {
        // 通过 FingerprintJS v3+ 初始化
        FingerprintJS.load()
          .then(fp => fp.get())
          .then(result => {
            // 获取浏览器指纹ID
            visitorId.value = result.visitorId;
            console.log("用户设备ID："+visitorId.value)
          })
          .catch(error => {
            console.error('Failed to load FingerprintJS', error);
          });

        // uuid.value = uuidv4();
        // console.log(uuid.value)
      });

      return {
        visitorId,
        uuid
      };
    },
  };
</script>

<style scoped></style>
