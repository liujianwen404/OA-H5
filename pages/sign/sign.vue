<template>
	<view class="content sign2">
		<view class="page-body">
	        <!-- <view class="page-section page-section-gap">
	            <map 
					class="map"  
					@callouttap 
					@controltap="controltap"
					:scale="scale"  
					:controls="controls"
					:latitude="latitude" 
					:longitude="longitude" 
					:circles="circles" 
					:markers="covers" 
				/>
	        </view> -->
			<view class="text-info">
				<view class="inputV" style="display: flex;justify-content: space-between;">
					<view>我的位置 （<text :class="isTrue ? 'colorBlue' : 'colorRed'">{{signstate}}</text> ）</view>
					<!-- <view>精确度:{{accuracy}}</view> -->
				</view>
				<!-- <view class="inputV" style="display: flex;justify-content: space-between;">
					<view class="colorBlue" @click="reLocation">重新定位</view>
				</view> -->
				<view class="inputV">
					<view class="t">当前位置</view>
					<view class="text">{{address}}</view>
				</view>
				<view class="inputV">
					<view class="t">备注</view>
					<input class="text" type="text" v-model="remarks" placeholder="选填备注">
				</view>
				<view class="inputV">
					<view class="t">上传图片</view>
					<view class="index-page">
						<sunui-upimg @change="getImageInfo1" :upload_auto="true" ref="upimg1" :upload_count="3"></sunui-upimg>
						<!-- <sunui-upimg @change="getImageInfo2" :upload_auto="true" ref="upimg2" :upimg_preview="serviceArr2" :upload_count="3"></sunui-upimg> -->
						<!-- 可能有的时候只是从服务器获取图片，禁用删除图片! -->
						<!-- <sunui-upimg @change="getImageInfo3" :upload_auto="true" :upimg_preview="serviceArr3" :upimg_move="false" ref="upimg3"></sunui-upimg> -->
						<!-- <sunui-upimg @change="getImageInfo4" :upload_auto="true" ref="upimg4" :upimg_preview="serviceArr4"></sunui-upimg> -->
						<!-- <ss-upload-image :url="url" :file-list="fileList" :name="name" @on-success="onSuccess" @on-error="" @on-remove="onRemove" @on-process="onProcess" /> -->
					</view>
				</view>
				<view class="inputV">
					<button 
						style="color: white;" 
						:class="isTrue === true ? 'bgBlue' : isTrue === false ? 'bgGreen' : isTrue === null ? 'bgAsh' : ''" 
						@click="clickSign"
					>
						{{time}} --- 保存
					</button>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import {handleSignClick,setSignInfo,addSignInfo,getSignInfo,delSignInfo,getInfo,key} from "../index/index.js";
	import {formateDate,pointInsideCircle,countRadius} from "@/common/util.js";	//时间按格式化
	import {webApiURL} from "../index/index.js";
	import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	export default {
		components: {"sunUiUpimg":sunUiUpimg},
		data() {
			return {
				userId:null,
				sessionId:null,
				userName:"",
				isTrue:null,							//是否在考勤范围内
				signText:"",							//打卡文字
				signstate:"",							//打卡状态
				r : 0,									//半径
				scale:"18",								//缩放
				clickNum:0,								//点击重新获取位置信息次数
				latitude: "",							//当前经度
				longitude: "",							//当前维度
				accuracy:"",
				address:"我的位置",						//公司位置-名称	
				time:formateDate(new Date(),'h:min:s'),	//当前时分秒		
				signInfo:{mode:"", latitude:"",longitude:"",address:"",time:"",remarks:"",upload:""},	//打卡信息 （模式，经纬度，地址，时间 备注 图片）
				covers: [
					// 公司点信息
					{id:0,callout:{content:null,display:"ALWAYS",},latitude:null,longitude:null,iconPath: '../../static/img/location.png'},
				],
				circles:[
					// 公司圆信息
					{latitude:null,longitude:null ,radius:null,strokeWidth:1,fillColor:"#7fff0099"},
				],
				controls:[
					// 控件
					{id:0,position:{left:300,top:300,width:32,height:32},iconPath:"../../static/img/resetlo.png",clickable:true}
				],
				serviceArr2: [],
				serviceArr3: [{
					path: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=1537304011,3995405403&fm=74&app=80&f=JPEG&size=f121,140?sec=1880279984&t=97b7ba208086526f1a92f5294f1a68a3'
				}],
				serviceArr4: [{
						path: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=1537304011,3995405403&fm=74&app=80&f=JPEG&size=f121,140?sec=1880279984&t=97b7ba208086526f1a92f5294f1a68a3'
					},
					{
						path: 'https://dss0.baidu.com/73t1bjeh1BF3odCf/it/u=63785387,1979900985&fm=85&s=8015CD304A92909C8F80B180030030EB'
					}
				],
				imgURL: [],
				remarks:"",
				
			}
		},
		onLoad(options){
			// 数据更新不及时时可以在下次DOM更新时使用
			// this.$nextTick(function(){
			// 	this.getInfo();
			// })
			let sessionId = uni.getStorageSync("sessionId");
			let userId = uni.getStorageSync("userId");
			let userName = uni.getStorageSync("userName");
			this.sessionId = JSON.parse(sessionId);
			this.userId = JSON.parse(userId);
			this.userName = JSON.parse(userName);
			console.log("主页携带的数据: "+JSON.stringify(options));
			console.log("sessionId: "+this.sessionId);
			this.covers[0].callout.content = options.address;
			this.covers[0].latitude = this.circles[0].latitude = options.latitude;
			this.covers[0].longitude = this.circles[0].longitude = options.longitude;
			this.r = this.circles[0].radius = options.radius;
			this.getTime()
			this.getLocation()
		},
		
		methods: {
			// 初始化数据  （公司的经纬度 公司名称 打卡范围 打卡时间）
			getData(){
				var that = this;
				var url = webApiURL +`/webApi/attendance/getData`;
				uni.request({
					url,
					withCredentials:true,
					xhrFields: {
					    withCredentials: true
					},
					data: {
					    sessionId: this.sessionId
					},
					success(res){
						// console.log("请求后台初始化数据: "+res.data);
						if(res.data.code == 0){
							let data = res.data.data;
							that.covers[0].callout.content = data.address;
							that.covers[0].latitude = that.circles[0].latitude = data.latitude;
							that.covers[0].longitude = that.circles[0].longitude = data.longitude;
							that.r = that.circles[0].radius = data.scope;
						}else{
							let msg = res.data.msg;
							uni.showModal({
								title: '系统提示',
								content: msg,
								position:'center',
								showCancel: false,
								success: function(){
									uni.reLaunch({url:"/pages/login/login"})
								}
							});
						}
						
					}
				})			
			},
			
			// 实时时间
			getTime(){
				var that = this;
				setInterval(function(){
					that.time = formateDate(new Date(),'h:min:s')
				},1000)
			},
			// 点击返回
			clickSign(){
				var userId = this.userId;
				var userName = this.userName;
				var imgURL = this.imgURL;
				var remarks = this.remarks;
				setTimeout(function(){
					uni.hideLoading();
					uni.navigateTo({url:"/pages/index/index?imgURL="+imgURL+"&remarks="+remarks})
				},1000)	
			},
			// 腾讯位置服务
			getAdd(){
				if(this.isTrue === true){
					let address = this.covers[0].callout.content;
					this.address = address;
					this.signInfo.address = address;
					return;
				}
				var that = this;
				// var url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${that.latitude},${that.longitude}&key=${key}`;
				var url = webApiURL +`/webApi/api/map/?location=${that.latitude},${that.longitude}&key=${key}`;
				uni.request({
					url,
					withCredentials:true,
					xhrFields: {
					    withCredentials: true
					},
					success(res){
						var data = res.data;
						if(data.status != 0){
							uni.showToast({title:data.message,icon:"none",position:'center'})
							return;
						}
						if(that.isTrue === false){
							let address = res.data.result.address + res.data.result.formatted_addresses.recommend
							that.address = address;
							that.signInfo.address = address;
						}
					},
					fail(res){
						console.log("腾讯位置定位接口调用失败: "+JSON.stringify(res));
					}
				})
			},
			// 重新获取位置
			controltap(e){
				this.getLocation()
			},
			// 获取当前位置
			getLocation(){
				var that = this;
				if(this.clickNum !== 0){
					uni.showLoading({title:"获取中...",mask:true})
				}
				if(this.clickNum >= 3){
					uni.showToast({title:"请稍后尝试！",icon:"none",mask:true,position:'center'});
					return ;
				}
				this.clickNum++;
				uni.getLocation({
					type: 'gcj02', //返回国测局坐标,h5端使用这个需要在mainfest.json中配置使用地图
					// type: 'wgs84', //返回 gps 坐标,h5端使用这个不准确
					success(res) {
						uni.hideLoading();
						that.accuracy = res.accuracy;
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.scale = 18;
						// console.log(res.latitude,"---",res.longitude)
						that.covers[1] = {id:1,latitude:res.latitude,longitude : res.longitude,iconPath: '../../static/img/location.png'}
						
						// var s = pointInsideCircle([that.latitude,that.longitude],[that.circles[0].latitude,that.circles[0].longitude],that.circles[0].radius);
						let circlesLat = that.circles[0].latitude;
						let circlesLon = that.circles[0].longitude;
						let circlesRad = that.circles[0].radius;
						var s = countRadius([that.latitude,that.longitude],[circlesLat,circlesLon],circlesRad);
						that.isTrue = s;
						that.signstate = s ? "在考勤范围内" : "不在考勤范围内";
						that.signText = s ? "正常打卡" : "外勤打卡";
						
						that.signInfo.latitude = res.latitude;
						that.signInfo.longitude = res.longitude;
						// that.signInfo.address = that.address;
						that.signInfo.mode = s ? "正常打卡" : "外勤打卡";
						// that.signInfo.time = formateDate(new Date,'Y-M-D h:min:s');
						
						
						that.getAdd()
					},
					fail(err){
						uni.hideLoading()
						that.signText = "请检查位置信息";
						uni.showToast({title:"请检查位置信息状态！",icon:"none", mask:true,duration:1000,position:'center'})
					}
				});
			},
			// 选择地址
			openLocation(){
				var that = this;
				uni.chooseLocation({
					success: function (res) {
						that.address = res.address;
						that.signInfo.address = res.address;
						// 这里是有问题的 .返回的 res 中有经纬度，地址名  如果使用这个经纬度 就会存在问题，（当前位置和公司位置重合），所以不建议使用这个经纬度。
						var s = pointInsideCircle([that.latitude,that.longitude],[that.circles[0].latitude,that.circles[0].longitude],that.circles[0].radius);
						that.isTrue = s;
						that.signstate = s ? "在考勤范围内" : "不在考勤范围内";
						that.signText = s ? "正常打卡" : "外勤打卡";
						
					}
				});
			},
			
			getImageInfo1(e) {
				console.log('图片返回1：', e);
				this.imgURL = e;
			},
			//查看session信息,是否为合法登录
			isLegal(){
				let sessionId = uni.getStorageSync("sessionId");
				if(sessionId == undefined){
					uni.showModal({
						title: '系统提示',
						content: "非法访问",
						position:'center',
						showCancel: false,
						success: function(){
							uni.reLaunch({url:"/pages/login/login"})
						}
					});
				};
				
				var url = webApiURL +`/webApi/verify`;
				uni.request({
					url,
					withCredentials:true,
					xhrFields: {
					    withCredentials: true
					},
					method:'POST',
					data: {
					    sessionId: sessionId
					},
					success: (res) => {
						console.log("session验证信息:"+JSON.stringify(res.data));
						if(res.data.code != 0){
							let data = res.data.data;
							uni.showModal({
								title: '系统提示',
								content: data.msg,
								position:'center',
								showCancel: false,
								success: function(){
									uni.reLaunch({url:"/pages/login/login"})
								}
							});
						}
					},
					fail: (res) => {
					    uni.showModal({
					    	title: '系统提示',
					    	content: "系统错误,请重新联系管理员",
					    	position:'center',
					    	showCancel: false,
					    	success: function(){
					    		uni.reLaunch({url:"/pages/error/500"})
					    	}
					    });
					}
				});
				
			}
			// getImageInfo2(e) {
			// 	console.log('图片返回2：', e)
			// },
			// getImageInfo3(e) {
			// 	console.log('图片返回3：', e)
			// },
			// getImageInfo4(e) {
			// 	console.log('图片返回4：', e)
			// }
			
		}
	}
</script>

<style>
	uni-page-body{height: 100%;overflow: hidden;width:100%}
	.sign2{width: 100%;height: 100%;}
	/* #ifdef APP-PLUS */
	.sign2{height: 100vh;overflow: hidden;}
	/* #endif */
	/* #ifdef MP-WEIXIN */
	.sign2{height: 100vh;overflow: hidden;}
	/* #endif */
	.map{width: 100%; height: 170px;}
	.colorGreen{color: #32CD32;}
	.colorBlue{color:#007aff}
	.colorRed{color:red}
	.bgBlue{background-color: #007aff;}
	.bgGreen{background-color: #32CD32;}
	.bgAsh{background-color: #C8C7CC;}
	.inputV {padding:20upx}
	.inputV .t{font-size:36upx}
	.inputV .text{border-bottom:1px solid #000;width: 100%;color:#666;}
</style>
