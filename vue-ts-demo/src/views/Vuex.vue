<template>
	<div>
		{{user}}}
		<button @click="login">login</button>
	</div>
</template>

<script lang="ts">
    import { $user } from '@/stores/user';
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class VuePage extends Vue {
        get user() {
            return $user.user;
        }

        async login() {
            await $user.login({
                username: 'admin',
                password: 'test'
            });
            alert('登录成功');
        }
    }
</script>

<style scoped>

</style>
