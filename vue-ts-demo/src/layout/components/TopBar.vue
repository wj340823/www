<template>
	<div class="header_bar">
		<suc-menu :config="menuConfig">
			<suc-menu-item name="vuex" to="/main/vuex">
				<suc-icon type="ios-map"/>
				<span>vuex-demo</span>
			</suc-menu-item>
			<suc-menu-item name="echarts" to="/main/echarts">
				<suc-icon type="ios-map"/>
				<span>echartsDemo</span>
			</suc-menu-item>
			<suc-menu-item name="map" to="/main/map">
				<suc-icon type="ios-map"/>
				<span>地图模块</span>
			</suc-menu-item>
			<suc-menu-item name="authox" to="/main/authox">
				<suc-icon type="md-settings"/>
				<span>系统设置</span>
			</suc-menu-item>
			<suc-submenu name="3">
				<template slot="title">
					<suc-icon type="md-person"/>
					<span>admin</span>
				</template>
				<suc-menu-item name="3-1">
					<span @click.stop="logout">注销登录</span>
				</suc-menu-item>
			</suc-submenu>
		</suc-menu>
	</div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { SucIcon, SucMenu, SucMenuItem, SucSubmenu } from '@suc/ui';


    @Component({
        components: {
            SucIcon, SucMenu, SucMenuItem, SucSubmenu
        }
    })
    export default class topBar extends Vue {
        menuConfig = {
            mode: 'horizontal',
            theme: 'primary',
            activeName: '',
        };

        mounted() {
            this.menuConfig.activeName = this.$route.matched[1].meta.name;
        }

        logout() {
            this.$http.get('/logout').then(res => {
                this.$router.push('/login');
            }).catch(err => {
                console.log(err);
            });
        }
    }
</script>
<style lang="scss" scoped>
	::v-deep .ivu-menu-item-active {
		opacity: .7;
	}
</style>
