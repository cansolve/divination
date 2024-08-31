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
