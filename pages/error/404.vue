<template>
	<view>
		<!-- 默认 -->
		<!-- <cmd-result-page></cmd-result-page> -->
		<!-- 页面丢失 -->
		<cmd-result-page type="lost" ></cmd-result-page>
		<!-- 网络异常 -->
		<!-- <cmd-result-page type="network"></cmd-result-page> -->
		<!-- 按钮列表 -->
		<!-- <cmd-result-page def-btn="再试一次" @defBtn="fnClick"></cmd-result-page> -->
		<!-- <cmd-result-page warn-btn="重启" @warnBtn="fnClick" ></cmd-result-page> -->
		<!-- <cmd-result-page pri-btn="确认成功" @priBtn="fnClick"></cmd-result-page> -->
		<!-- <cmd-result-page def-btn="返回" @defBtn="fnClick" pri-btn="再来一次" @priBtn="fnClick" warn-btn="终止" @warnBtn="fnClick"></cmd-result-page> -->
		<!-- 自定义图案 -->
		<!-- <cmd-result-page src="/static/404.jpg" text="等待处理" subtext="已提交申请，等待银行处理"></cmd-result-page> -->
	</view>
</template>

<script>
	import cmdResultPage from "@/components/cmd-result-page/cmd-result-page.vue"
	export default {
		components: {cmdResultPage},
		onLoad() {

		},
		methods: {
			// 这里模拟点击请求
			fnClick() {
				uni.showToast({
					title: `数据加载中...`,
					icon:'none'
				});
				setTimeout(() => {
					uni.showToast({
						title: `数据加载成功!`,
						icon:'none'
					});
					this.skyContent = true;
				}, 2000);
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
