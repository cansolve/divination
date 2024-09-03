<!--
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-02 11:09:54
 * @ Email: tongxiang608@gmail.com
 -->

<template>
	<div>
		<router-view />
	</div>
</template>

<script>
	import { ref, onMounted } from "vue"
	// import { v4 as uuidv4 } from 'uuid';
	export default {
		name: "App",
		setup() {
			const visitorId = ref("")
			const uuid = ref("")
			onMounted(() => {
				// uuid.value = uuidv4();
				// console.log(uuid.value)
			})

			return {
				uuid,
			}
		},
	}
</script>

<style scoped></style>
