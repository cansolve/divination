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
	import { onMounted } from "vue"
	export default {
		name: "App",
		setup() {
			onMounted(() => {})

			return {}
		},
	}
</script>

<style scoped></style>
