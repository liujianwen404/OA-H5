<template>
	<view class="content">
		<view class="page-body">
			<view class="sign-title">
				<view class="sign-title-l">
					<view class="portrait" >
						{{userName}}
					</view>
					<!-- <view class="text">
						<view class="gz" @click="goRule" style="text-align: center;padding: 30upx 0;">
							<text class="t1">考勤组:公司考勤</text>
							<text>查看规则</text>
						</view>
					</view> -->
				</view>
				<view class="sign-title-r">
					<view class="date">
						<!-- <picker mode="date" :value="date"  @change="bindDateChange">
							<view class="uni-input">{{date}} <uni-icon type="arrowdown"></uni-icon></view>
						</picker> -->
						<view class="uni-input">{{date}} <uni-icon type="arrowdown"></uni-icon></view>
					</view>
				</view>
			</view>
			
			<text class="addClockIn" @click="reset">重置</text>
		
			<view style="text-align: center;padding: 20upx 0;">当前位置: <text>{{address}}</text></view>
			<view class="uni-timeline">
				<view class="uni-timeline-item uni-timeline-first-item">
					<view class="uni-timeline-item-divider" :style="{ background : (!isAm ? '#1AAD19' : '#bbb')}"></view>
					<view class="uni-timeline-item-content">
						<view >
							<view class="uni-timeline-item-content-t1">上班时间{{Timer[0].time}}</view>
							<view class="desc-pad" v-if="isAm">
								<view v-if="amSign.time === undefined">
									<view class="time uni-timeline-item-content-t">
										缺卡
									</view>
								</view>
								<view v-else>
									<view class="time uni-timeline-item-content-t">
										打卡时间 {{(amSign.time).substring(10,16)}}
										<view class="iswq" v-if="amSign.mode == '外勤打卡'">外勤</view>
										<view class="isNormal" v-if="amSign.timeResult == 'Late'">迟到</view>
										<view class="isNormal" v-if="amSign.timeResult == 'Absenteeism'">旷工</view>
									</view>
									<view> <uni-icon type="location-filled"/> {{amSign.address}}</view>
									<view class="bz last" @click="showBz('amSign')">
										备注 <uni-icon :style="{color:'rgb(0, 122, 255)'}"  type="forward"></uni-icon>
									</view>
								</view>
							</view>
							<view v-else class="content-show">
								<view v-if="isRest === true">
									<view class="module CAsh">
										<view class="text">无法打卡</view>
										<view class="time">{{time}}</view>
									</view>
									<view class="colorBlack" style="text-align: center;" v-if="isRest">
										不属于考勤打卡时间
									</view>
								</view>
								<view v-else>
									<view v-if="is === true">
										<view class="module CBlue" @click="clickSign">
											<view class="text">上班打卡</view>
											<view class="time">{{time}}</view>
										</view>
										<view class="colorGreen" style="text-align: center;" v-if="is">
											已在考勤范围内 <text class="addClockIn" @click="addClockIn">添加打卡信息</text>
										</view>
									</view>
									<view v-else-if="is === false">
										<view class="module CGreen"  @click="clickSign">
											<view class="text">外勤打卡</view>
											<view class="time">{{time}}</view>
										</view>
										<view class="colorRed" style="text-align: center;" v-if="!is">
											不在考勤范围内	<text class="addClockIn" @click="addClockIn">添加打卡信息</text>
										</view>
									</view>
									<view v-else-if="is === null">
										<view class="module CAsh">
											<view class="text">请检查位置信息</view>
											<view class="time">{{time}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="uni-timeline-item uni-timeline-last-item">
					<view class="uni-timeline-item-divider" :style="{ background : (isAm ? '#1AAD19' : '#bbb')}"></view>
					<view class="uni-timeline-item-content">
						<view >
							<view class="uni-timeline-item-content-t1">下班时间{{Timer[1].time}}</view>
							<view v-if="isAm" class="desc-pad">
								<view class="desc-pad" v-if="isPm">
									<view v-if="pmSign.time === undefined">
										<view class="time uni-timeline-item-content-t">
											缺卡
										</view>
									</view>
									<view v-else>
										<view class="time uni-timeline-item-content-t">
											打卡时间:{{(pmSign.time).substring(10,16)}}
											<view class="iswq" v-if="pmSign.mode == '外勤打卡'">外勤</view>
											<view class="isNormal" v-if="pmSign.timeResult == 'Early'">早退</view>
											<view class="isNormal" v-if="pmSign.timeResult == 'Absenteeism'">旷工</view>
										</view>
										<view><uni-icon type="location-filled"/>{{pmSign.address}}</view>
										<view class="bz last" @click="showBz('pmSign')">
											备注 <uni-icon :style="{color:'rgb(0, 122, 255)'}" type="forward" />
										</view>
									</view>
								</view>
								<view v-else class="content-show">
									<view v-if="isRest === true">
										<view class="module CGreen">
											<view class="text">无法打卡</view>
											<view class="time">{{time}}</view>
										</view>
										<view class="colorBlack" style="text-align: center;" v-if="isRest">
											不属于考勤打卡时间
										</view>
									</view>
									<view v-else>
										<view v-if="is === true">
											<view class="module CBlue" @click="clickSign">
												<view class="text">下班打卡</view>
												<view class="time">{{time}}</view>
											</view>
											<view class="colorGreen" style="text-align: center;" v-if="is">
												已在考勤范围内 <text class="addClockIn" @click="addClockIn">添加打卡信息</text>
											</view>
										</view>
										<view v-else-if="is === false">
											<view class="module CGreen"  @click="clickSign">
												<view class="text">外勤打卡</view>
												<view class="time">{{time}}</view>
											</view>
											<view class="colorRed" style="text-align: center;" v-if="!is">
												不在考勤范围内 <text class="addClockIn" @click="addClockIn">添加打卡信息</text>
											</view>
										</view>
										<view v-else-if="is === null">
											<view class="module CAsh">
												<view class="text">请检查位置信息</view>
												<view class="time">{{time}}</view>
											</view>
										</view>
									</view>
									
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<text class="addClockIn" @click="reLocation">重新定位</text>
			<!-- <view v-if="false">
				<uni-collapse >
					<uni-collapse-item title="全部打卡信息">
						<uni-list>
							<view  class="uni-list-cell-left">
								<view v-for="(item,index) in allSign" :key="index" style="border-bottom: 1px dashed #007AFF;">
									<view>{{item.mode}}</view>
									<view>{{item.address}}</view>
									<view>{{item.time}}</view>
								</view>
							</view>
						</uni-list>
					</uni-collapse-item>
				</uni-collapse>
			</view> -->
        </view>
		<!-- 备注 -->
		<uni-popup :show="type === 'middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
			<view class="title" style="padding: 20upx 0;font-weight: bold;width: 100%;text-align: center;border-bottom: 1px solid #666;">打卡备注</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<text class="text">打卡时间:</text>
				<text>{{bzText.time}}</text>
				<view class="text">打卡地点:</view>
				<view>{{bzText.address}}</view>
			</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<view>{{bzText.remarks}}</view>
			</view>
			<view class="bottom" style="padding: 20upx 10upx;color: cadetblue;width: 100%;text-align: center;border-top: 1px solid #666;" @click="togglePopup('')">关闭</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import permision from "@/js_sdk/wa-permission/permission.js"
	import {formateDate,pointInsideCircle ,isSameDay,countRadius} from "@/common/util.js"	
	import {handleSignClick,setSignInfo,addSignInfo,getSignInfo,delSignInfo,getInfo , key ,removeSignInfo,webApiURL} from "./index.js"
	import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载
	
	export default {
		components: {uniIcon,uniPopup},
		data() {
			return {
				elasticityFlag:null,//是否弹性制
				groupId:null,
				classId:null,
				sessionId:null,
				userId:null,
				userName:"",
				bzText:{time:"",address:"",img:"",remarks:""},
				type:"",
				
				r : 0,									//半径
				Timer:[{time:"09:00",num:null},{time:"18:00",num:null}],	//上下班时间
				isAm:false,								//上班是否打卡
				isPm:false,								//下班是否打卡
				amSign:{time:"",address:"",remarks:"",img:""},			//上午打卡信息
				pmSign:{time:"",address:"",remarks:"",img:""},			//下午打卡信息
				clickNum:0,								//点击重新获取位置信息次数
				is:null,								//是否属于正常打卡范围（外勤打卡）
				isRest:false,							//是否是公休日
				isSign:false,							//是否打卡
				time:formateDate(new Date(),'h:min:s'),	//当前时分秒
				date:formateDate(new Date(),'Y-M-D'),
				latitude: null,							//当前经度
				longitude: null,							//当前维度
				radius:null,
				address:null,						//
				wqInfo:null,
				// allSign:[],								//所有打卡信息
				imgURL:[],
				remarks:"",
				signInfo:{mode:"", latitude:"",longitude:"",address:"",time:"",remarks:"",imgURL:"",classId:"",groupId:"",userId:"",userName:""},	//打卡信息 （模式，经纬度，地址，时间）
				covers: [
					// 公司点信息
					{id:0,callout:{content:null,color:"red",display:"ALWAYS",},latitude:null,longitude:null,iconPath: '../../../static/img/location.png'},
				],
				circles:[
					// 公司圆信息(latitude:22.626287,longitude:114.078199 );
					{latitude:null,longitude:null ,radius:null,strokeWidth:1,fillColor:"#7fff0099"},
				]
			}
		},
		// 初始化
		onLoad(options) {
			// this.isLegal();
			let sessionId = uni.getStorageSync("sessionId");
			let userId = uni.getStorageSync("userId");
			let userName = uni.getStorageSync("userName");
			this.sessionId = JSON.parse(sessionId);
			this.signInfo.userId = this.userId = JSON.parse(userId);
			this.signInfo.userName = this.userName = JSON.parse(userName);
			if(options.imgURL != null && options.imgURL != ""){
				this.signInfo.imgURL = this.imgURL = options.imgURL;
			}if(options.remarks != null && options.remarks != ""){
				this.signInfo.remarks = this.remarks = options.remarks;
			}
			// console.log("imgURL:" + this.imgURL[0]);
			this.getData();
			this.getLocation();
			this.getTime();
		},
		methods: {
			togglePopup(type) {
				this.type = type;
			},
			// 查看规则
			goRule(){
				uni.navigateTo({url:"/pages/rule/rule"})
			},
			// 腾讯位置服务
			getAdd(){
				/* if(this.isAm && this.isPm){
					return;
				} */
				// console.log("腾讯位置服务getAdd()方法入口");
				if(this.is === true){
					let address = this.covers[0].callout.content;
					this.address = address;
					this.signInfo.address = address;
					return;
				}
				
				var that = this;
				// var url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${that.latitude},${that.longitude}&key=${key}`;
				var url = webApiURL + `/webApi/api/map/?location=${that.latitude},${that.longitude}&key=${key}`;
				// var url = `/api/reverse_geocoding/v3/
				// ?ak=gZyHe6maBlPynLnuw6R1xvbhSHNs4BOs
				// &output=json&coordtype=wgs84ll
				// &location=${that.latitude},${that.longitude}`;

				uni.request({
					url,
					success(res){
						console.log("腾讯位置服务getAdd()方法成功回调: "+JSON.stringify(res))
						var data = res.data;
						if(data.status != 0){
							uni.showToast({title:data.message,icon:"none",position:'center'})
							return;
						}else{
							if(data.result.address != null){
								let address = data.result.address
								that.address = address;
								that.signInfo.address = address;
								// console.log("腾讯位置定位: "+address);
							}else{
								that.address = "请检查位置信息！"
								that.is = null;
							}	
						}
					},
					fail(res){
						console.log("腾讯位置定位接口调用失败: "+JSON.stringify(res));
						that.address = "请检查位置信息！"
						that.is = null;
					}
					
				})
			},
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
						console.log("初始化数据开始:"+JSON.stringify(res.data));
						if(res.data.code == 0){
							let data = res.data.data;
							let isRest = data.isRest;
							if(isRest != null){
								//如果当天是公休日
								that.isRest = isRest;
								return;
							}
							that.covers[0].callout.content = data.address;
							that.covers[0].latitude = that.circles[0].latitude = data.latitude;
							that.covers[0].longitude = that.circles[0].longitude = data.longitude;
							that.r = that.circles[0].radius = data.scope;
							that.Timer[0].time = data.work_time;
							that.Timer[1].time = data.closing_time;
							that.signInfo.groupId = that.groupId = data.group_id;
							that.signInfo.classId = that.classId = data.class_id;
							let elasticityFlag =  that.elasticityFlag = data.elasticity_flag;
							let restStartTime = data.rest_start_time;
							let clockInArray = data.clockIn;
							if(clockInArray.length != null && clockInArray.length != 0){
								console.log("打卡信息不为空");
								for(var i=0;i<clockInArray.length;i++){
									let type = clockInArray[i].check_type;
									if(type == "OnDuty"){
										//上班卡信息
										that.amSign.address = clockInArray[i].user_address;
										that.amSign.time = clockInArray[i].user_check_time;
										that.amSign.remarks = clockInArray[i].remark;
										that.isAm = true;
										if(clockInArray[i].location_result == "Outside"){
											that.amSign.mode = "外勤打卡";
										}else{
											that.amSign.mode = "正常打卡";
										}
										let timeResult = clockInArray[i].time_result;
										if(timeResult == "Normal"){
											//此时后台返回的是一条正常打卡记录
											that.amSign.timeResult = "Normal";
										}else if(timeResult == "NotSigned"){
											//此时后台返回的是一条缺卡后的生成的未打卡
											that.amSign.time = undefined;
											that.amSign.timeResult = "NotSigned";
										}
										else if(timeResult == "AbsenteeismLateOneDay"){
											//此时后台返回的是一条旷工打卡记录
											that.amSign.timeResult = "Absenteeism";
										}else{
											//此时后台返回的是一条迟到记录
											that.amSign.timeResult = "Late";
										}
									}
									if(type == "OffDuty"){
										//下班卡信息
										that.pmSign.address = clockInArray[i].user_address;
										that.pmSign.time = clockInArray[i].user_check_time;
										that.pmSign.remarks = clockInArray[i].remark;
										that.isAm = true;
										that.isPm = true;
										if(clockInArray[i].location_result == "Outside"){
											that.pmSign.mode = "外勤打卡";
										}else{
											that.pmSign.mode = "正常打卡";
										}
										let timeResult = clockInArray[i].time_result;
										if(timeResult == "Normal"){
											//此时后台返回的是一条正常打卡记录
											that.pmSign.timeResult = "Normal";
										}else if(timeResult == "AbsenteeismEarlyOneDay"){
											//此时后台返回的是一条旷工打卡记录
											that.pmSign.timeResult = "Absenteeism";
										}else{
											//此时后台返回的是一条早退记录
											that.pmSign.timeResult = "Early";
										}
									}
								}
								
								if(that.amSign.time == null || that.amSign.time == ""){
									//如果只有下班卡，没有上班卡，上班卡显示为缺卡
									that.amSign.time = undefined;
								}
							}else{
								console.log("打卡信息为空");
								if( restStartTime != null ){
									let restStartTimeNum = Number.parseInt(restStartTime.split(":")[0]);
									let restNum = Number.parseInt(restStartTimeNum)*60 + Number.parseInt(restStartTime.split(":")[1]);
									let now = new Date();
									let nowNum = Number.parseInt(now.getHours()) * 60 + Number.parseInt(now.getMinutes());
									console.log("restNum: " + restNum);
									console.log("nowNum: " + nowNum);
									if( elasticityFlag == "0" ){//非弹性制
										if(nowNum > restNum){
											//如果当前时间比该员工所属考勤组的休息开始时间大，则不允许打上班卡
											if(that.amSign.time == null || that.amSign.time == ""){
												//页面显示缺卡
												that.amSign.time = undefined;
											}
											that.isAm = true;
										}
									}						
								}
							}
							
							console.log("初始化数据结束！");
						}else{
							let msg = res.data.msg;
							uni.showModal({
								title: '系统提示',
								content: msg,
								position:'center',
								showCancel: false,
								success: function(){
									uni.reLaunch({url:"/pages/error/404"})
								}
							});
						}
						
					},
					fail: (res) => {
						let msg = res.data.msg;
					    uni.showModal({
					    	title: '系统提示',
					    	content: msg,
					    	position:'center',
					    	showCancel: false,
					    	success: function(){
					    		uni.reLaunch({url:"/pages/error/500"})
					    	}
					    });
					}
				})	
				// this.getClockIn();
			},
			
			//获取员工当日打卡信息
			getClockIn(){
				var url = webApiURL +`/webApi/clockIn/getClockIn`;
				uni.request({
					url,
					withCredentials:true,
					xhrFields: {
					    withCredentials: true
					},
					data: {
					    userId: this.userId,
					    sessionId: this.sessionId
					},
					success: (res) => {
						console.log("获取员工当日打卡信息:"+JSON.stringify(res.data));
						if(res.data.code == 0){
							let data = res.data.data;
							if(data.length != null || data.length != 0){
								for(var i=0;i<data.length;i++){
									let type = data[i].check_type;
									if(type == "OnDuty"){
										//上班卡信息
										this.amSign.address = data[i].user_address;
										this.amSign.time = data[i].user_check_time;
										this.isAm = true;
									}
									if(type == "OffDuty"){
										//下班卡信息
										this.pmSign.address = data[i].user_address;
										this.pmSign.time = data[i].user_check_time;
										this.isAm = true;
										this.isPm = true;
									}
								}
							}	
						}
					},
					fail: (res) => {
					    uni.showModal({
					    	title: '系统提示',
					    	content: "系统错误,请重新联系管理员",
					    	position:'center',
					    	showCancel: false,
					    	success: function(){
					    		uni.reLaunch({url:"/pages/login/login"})
					    	}
					    });
					}
				})			
			},
			// 添加打卡信息
			addClockIn(){
				let address = this.covers[0].callout.content;
				let radius = this.circles[0].radius;
				let latitude = this.circles[0].latitude;
				let longitude = this.circles[0].longitude;
				uni.navigateTo({url:"/pages/sign/sign?address="+address+"&radius="+radius+"&latitude="+latitude+"&longitude="+longitude,})
			},
			// 选择打卡日期
			bindDateChange: function(e) {
				this.date = e.target.value
			},	
			// 重置打卡
			reset(){
				//不准重置上班打卡信息
				var that = this;
				let isAm = this.isAm;
				let isPm = this.isPm;
				let userId = this.userId;
				let sessionId = this.sessionId;
				if (isAm == true && isPm == true){
					uni.showModal({
						title:"重置本地打卡信息",
						content:"重置下班打卡信息,可以更新打卡信息",
						success: function (resp) {
							var url = webApiURL +`/webApi/clockIn/delClockIn`;
							if (resp.confirm) {
								that.isSign = false;
								that.isPm = false;
								uni.request({
									url,
									withCredentials:true,
									xhrFields: {
									    withCredentials: true
									},
									data: {
									    userId: userId,
									    sessionId: sessionId
									},
									success(res){
										console.log("删除下班卡接口成功:" + JSON.stringify(res));
										var data = res.data;
										if(data.code == 0){
											uni.redirectTo({url:"/pages/index/index"});
										}else{
											let msg = res.data.msg;
											uni.showModal({
												title: '系统提示',
												content: msg,
												position:'center',
												showCancel: false,
												success: function(){
													uni.reLaunch({url:"/pages/error/404"})
												}
											});
										}
									},
									fail(res){
										console.log("删除打卡接口调用失败: "+JSON.stringify(res));
										let msg = res.data.msg;
										uni.showModal({
											title: '系统提示',
											content: msg,
											position:'center',
											showCancel: false,
											success: function(){
												uni.reLaunch({url:"/pages/error/404"})
											}
										});
									}
								})
							} else if(resp.cancel) {
								return;
							}
						}
					});
				}else{
					uni.showModal({
						title:"重置本地打卡信息",
						content:"请直接打卡！",
						success: function (res) {
							return;
						}
					});
					
				}
				
				
			},
			// 显示备注
			showBz(type){
				this.type = 'middle-list';
				if(type == 'amSign'){
					this.bzText.time = this.amSign.time;
					this.bzText.address = this.amSign.address;
					this.bzText.remarks = this.amSign.remarks;
				}else if(type == 'pmSign'){
					this.bzText.time = this.pmSign.time;
					this.bzText.address = this.pmSign.address;
					this.bzText.remarks = this.pmSign.remarks;
				}
			},
			// 实时时间
			getTime(){
				var that = this;
				setInterval(function(){
					that.time = formateDate(new Date(),'h:min:s')
				},100)
			},
			// 获取当前位置
			getLocation(){
				// console.log("获取当前位置getLocation()方法入口");
				var that = this;
				if(this.clickNum !== 0){
					uni.showLoading({title:"获取中...",mask:true})
				}
				if(this.clickNum >= 3){
					this.clickNum--;
					uni.showToast({title:"请稍后尝试！",icon:"none",mask:true,position:'center'});
					return ;
				}
				this.clickNum++;
				uni.getLocation({
					type: 'gcj02', //返回国测局坐标,h5端使用这个需要在mainfest.json中配置使用地图
					// type: 'wgs84', //返回 gps 坐标,h5端使用这个不准确
					geocode:true,//设置该参数为true可直接获取经纬度及城市信息
					success(res) {
						console.log("获取当前位置坐标成功======>" + JSON.stringify(res))
						// console.log("获取当前位置: "+JSON.stringify(res));
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);
						that.latitude = res.latitude;
						that.longitude = res.longitude;

						let circlesLat = that.circles[0].latitude;
						let circlesLon = that.circles[0].longitude;
						let circlesRad = that.circles[0].radius;
						// console.log(res.latitude,"---",res.longitude) latitude:114.078199,longitude:22.626287 ,radius:80000
						that.covers[1] = {id:1,latitude:res.latitude,longitude : res.longitude,iconPath: '../../static/location.png'}
						var s = countRadius([that.latitude,that.longitude],[circlesLat,circlesLon],circlesRad);
						that.is = s;
						
						that.signInfo.latitude = res.latitude;
						that.signInfo.longitude = res.longitude;
						that.signInfo.mode = s ? "正常打卡" : "外勤打卡";
						
						that.getAdd();
						setTimeout(function () {
						    uni.hideLoading();
						}, 1000);
					},
					fail(err){
						// console.log("获取当前位置失败，打开当前App的权限设置界面。可用于引导用户赋权======>" + JSON.stringify(err))
						// // App跳转系统的设置界面
						// permision.gotoAppPermissionSetting();
						//获取定位信息失败
						this.is = null;
						that.address = "请检查位置信息！"
						console.log("获取当前位置坐标失败======>" + JSON.stringify(err))
					}
				});
				
				// if(this.is === null){
				// 	that.address = "请检查位置信息！"
				// 	return;
				// }

			},
			// 点击打卡
			clickSign(){
				// this.isLegal();
				var isOutWork = this.is;//是否外勤
				if(isOutWork === null){
					uni.showToast({title:"请检查位置信息状态！",icon:"none", mask:true,duration:3000,position:'center'})
					return;
				}
				
				uni.showLoading({title:"打卡记录中...",mask:true});
				this.signInfo.time = formateDate(new Date(),'Y-M-D h:min:s');
				var signInfo = getSignInfo();
				if(signInfo != undefined){
					addSignInfo(getInfo(this.signInfo),signInfo)
				}else{
					setSignInfo(getInfo(this.signInfo))
				}
				var clockInData = getInfo(this.signInfo);
				// this.allSign = getSignInfo().main;
				console.log("点击打卡后的打卡数据:"+JSON.stringify(clockInData))
				
				var sessionId = this.sessionId;
				
				if(this.isAm === false && this.isPm === false){//上班卡	
					uni.request({
					    url: webApiURL +'/webApi/clockIn/saveClockIn',
						method:'POST',
						withCredentials:true,
						xhrFields: {
						    withCredentials: true
						},
					    data: {
					        mode: clockInData.mode,
					        address: clockInData.address,
					        time: clockInData.time,
							longitude: clockInData.longitude,
					        latitude: clockInData.latitude,
					        remarks: clockInData.remarks,
					        userId: clockInData.userId,
							userName: clockInData.userName,
							groupId: clockInData.groupId,
							classId: clockInData.classId,
							imgURL:clockInData.imgURL,
							is:isOutWork,
							isAm: true,
							isPm: false,
							sessionId: sessionId
					    },
					    header: {
					    	'content-type': 'application/x-www-form-urlencoded',
					    },
					    success: (res) => {
							console.log("上班卡回调: "+JSON.stringify(res));
							if(res.data.code == 0){
								uni.showToast({
									icon: 'success',
									position: 'bottom',
									title: '打卡成功',
									position:'center'
								});
								
								uni.hideLoading();
								setTimeout(function () {
								    uni.redirectTo({url:"/pages/index/index"});
								}, 1000);
							}else{
								let msg = res.data.msg;
								uni.showModal({
									title: '系统提示',
									content: msg,
									position:'center',
									showCancel: false,
									success: function(){
										uni.reLaunch({url:"/pages/error/404"})
									}
								});
							} 
					    },
						fail: (res) => {
							let msg = res.data.msg;
							uni.showModal({
								title: '系统提示',
								content: msg,
								position:'center',
								showCancel: false,
								success: function(){
									uni.reLaunch({url:"/pages/error/404"})
								}
							});
						}
					});
				}else{//下班卡
					//检查是否早退
					uni.request({
						url: webApiURL +'/webApi/clockIn/checkClockIn',
						method:'POST',
						withCredentials:true,
						xhrFields: {
						    withCredentials: true
						},
						data: {
							isAm: false,
							isPm: true,
							userId: clockInData.userId,
							workTime: this.Timer[0].time,
							closingTime: this.Timer[1].time,
							sessionId: sessionId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', 
						},
						success(res){
							console.log("检查是否早退接口成功回调: "+JSON.stringify(res))
							var data = res.data;
							if(data.code == 0){
								//没有早退
								uni.request({
								    url: webApiURL +'/webApi/clockIn/saveClockIn',
									method:'POST',
									withCredentials:true,
									xhrFields: {
									    withCredentials: true
									},
								    data: {
								        mode: clockInData.mode,
								        address: clockInData.address,
								        time: clockInData.time,
								        longitude: clockInData.longitude,
								        latitude: clockInData.latitude,
								        remarks: clockInData.remarks,
								        userId: clockInData.userId,
								        userName: clockInData.userName,
								        groupId: clockInData.groupId,
								        classId: clockInData.classId,
								        imgURL:clockInData.imgURL,
								        is:isOutWork,
										isAm: false,
										isPm: true,
										sessionId: sessionId
								    },
								    header: {
								    	'content-type': 'application/x-www-form-urlencoded', 
								    },
								    success: (res) => {
										console.log("下班卡回调: "+JSON.stringify(res.data));
										if(res.data.code == 0){
											uni.showToast({
												icon: 'success',
												position: 'bottom',
												title: '打卡成功',
												position:'center'
											});
											uni.hideLoading();
											setTimeout(function () {
											    uni.redirectTo({url:"/pages/index/index"});
											}, 1000);
										}else{
											let msg = res.data.msg;
											uni.showModal({
												title: '系统提示',
												content: msg,
												position:'center',
												showCancel: false,
												success: function(){
													uni.reLaunch({url:"/pages/error/404"})
												}
											});
										}
								        
								    },
									fail: (res) => {
									    let msg = res.data.msg;
									    uni.showModal({
									    	title: '系统提示',
									    	content: msg,
									    	position:'center',
									    	showCancel: false,
									    	success: function(){
									    		uni.reLaunch({url:"/pages/error/404"})
									    	}
									    });
									}
								});
							}else{
								//早退
								uni.showModal({
									content: '您早退了！',
									confirmText: '确认打卡',
									success: function (resp) {
										if (resp.confirm) {
											console.log('用户点击确定');
											uni.request({
											    url: webApiURL +'/webApi/clockIn/saveClockIn',
												method:'POST',
												withCredentials:true,
												xhrFields: {
												    withCredentials: true
												},
											    data: {
											        mode: clockInData.mode,
											        address: clockInData.address,
											        time: clockInData.time,
											        longitude: clockInData.longitude,
											        latitude: clockInData.latitude,
											        remarks: clockInData.remarks,
											        userId: clockInData.userId,
											        userName: clockInData.userName,
											        groupId: clockInData.groupId,
											        classId: clockInData.classId,
											        imgURL:clockInData.imgURL,
											        is:isOutWork,
													isAm: false,
													isPm: true,
													sessionId: sessionId
											    },
											    header: {
											    	'content-type': 'application/x-www-form-urlencoded', 
											    },
											    success: (res) => {
													console.log("下班卡回调: "+JSON.stringify(res.data));
													if(res.data.code == 0){
														uni.showToast({
															icon: 'success',
															position: 'bottom',
															title: '打卡成功',
															position:'center'
														});
														uni.hideLoading();
														setTimeout(function () {
														    uni.redirectTo({url:"/pages/index/index"});
														}, 1000);
													}else{
														let msg = res.data.msg;
														uni.showModal({
															title: '系统提示',
															content: msg,
															position:'center',
															showCancel: false,
															success: function(){
																uni.reLaunch({url:"/pages/error/404"})
															}
														});
													}
											        
											    },
												fail: (res) => {
												    let msg = res.data.msg;
												    uni.showModal({
												    	title: '系统提示',
												    	content: msg,
												    	position:'center',
												    	showCancel: false,
												    	success: function(){
												    		uni.reLaunch({url:"/pages/error/404"})
												    	}
												    });
												}
											});
										} else if (resp.cancel) {
											uni.hideLoading();
											console.log('用户点击取消');
										}
									}
								});
							}
						},
						fail(res){
							console.log("检查是否早退接口调用失败: "+JSON.stringify(res));
						}
						
					})

				}
			
			},
			// 选择地址
			openLocation(){
				var that = this;
				uni.chooseLocation({
					success: function (res) {
						that.address = res.address;
						that.signInfo.address = res.address;
						// 这里是有问题的 .返回的 res 中有经纬度，地址名  如果使用这个经纬度 就会存在问题，（当前位置和公司位置重合），所以不建议使用这个经纬度。
						var s = countRadius([that.latitude,that.longitude],[that.circles[0].latitude,that.circles[0].longitude],that.r);
						that.is = s;
					}
				});
			},
			//重新定位
			reLocation(){
				this.getLocation();	
			},
			//查看session信息,是否为合法登录
			isLegal(){
				let sessionId = uni.getStorageSync("sessionId");
				if(sessionId == undefined || sessionId == ''){
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
					method:'POST',
					withCredentials:true,
					xhrFields: {
					    withCredentials: true
					},
					data: {
					    sessionId: sessionId
					},
					success: (res) => {
						console.log("session验证信息:"+JSON.stringify(res.data));
						if(res.data.code != 0){
							let data = res.data.data;
							uni.showModal({
								title: '系统提示',
								content: '非法访问！',
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
					    	content: "登录验证错误,请联系管理员",
					    	position:'center',
					    	showCancel: false,
					    	success: function(){
					    		uni.reLaunch({url:"/pages/error/500"})
					    	}
					    });
					}
				});
				
			}
		},
	}
</script>

<style>
	.map{width: 100%; height: 260px;}
	.uni-list-cell-left {padding: 0 30upx;}
	.text-desc{display: flex;justify-content: space-between;padding:10upx 20upx}
	.colorRed{color: red;}
	.colorGreen{color: #32CD32;}
	.colorYellow{color: yellow;}
	.colorBlue{color: #007aff;}
	
	.bgBlue{background-color: #007aff;}
	.bgGreen{background-color: #32CD32;}
	.bgAsh{background-color: #C8C7CC;}
	
	.uni-timeline{padding: 30upx 20upx;}
	.uni-timeline-item-content-t{font-weight: bold;}
	.desc-pad{padding: 0 0upx}
	.desc-pad .bz{color: rgb(0, 122, 255);}
	.desc-pad .bz .icon{color:rgb(0, 122, 255)}
	.uni-timeline-last-item .uni-timeline-item-divider{background: #bbb;}
	
	.CBlue{background-color: #007aff;box-shadow: 0 5px 5px #007aff;}
	.CGreen{background-color: #32CD32;box-shadow: 0 5px 5px #32CD32;}
	.CAsh{background-color: #C8C7CC;box-shadow: 0 5px 5px #C8C7CC;}
	
	.module{overflow: hidden; margin: 20upx auto; width: 220upx;height: 220upx;border-radius: 50%;color: #fff;text-align: center;}
	.module .text{font-size: 15px;margin: 50upx auto 10upx;}
	.uni-timeline-item .uni-timeline-item-content{width: 100%;padding-right: 20upx;}
	
	.content-show{width:100%}
	
	.sign-title{display: flex;justify-content: space-between; padding: 30upx 24upx;border-bottom: 1upx solid #333;}
	.sign-title .portrait{width: 100upx;height: 100upx;line-height: 100upx;border-radius: 50%;background-color: #007AFF;color: #fff;font-size: 28upx;text-align: center;}
	.sign-title .sign-title-l{display: flex;}
	.sign-title .sign-title-l .text{margin-left: 20upx;}
	.sign-title .sign-title-l .text .name{font-size: 32upx;}
	.sign-title .sign-title-l .text  .gz{color: darkblue;display: inline-flex;}
	.sign-title .sign-title-l .text .gz text{display: inline-block;}
	.sign-title .sign-title-l .text .gz .t1{
		overflow: hidden; /*超出部分隐藏*/
    text-overflow:ellipsis;/* 超出部分显示省略号 */
    white-space: nowrap;/*规定段落中的文本不进行换行 */
    width: 166upx;/*需要配合宽度来使用*/}
	.iswq{padding: 0px 0px 20px 10px;color: #99CC33;border: 1px solid #99CC33;width: 40px;height: 5px;border-radius: 4px;margin-left: 20upx;display: inline-block;}
	.isNormal{padding: 0px 0px 20px 10px;color: #ff5500;border: 1px solid #ff5500;width: 40px;height: 5px;border-radius: 4px;margin-left: 20upx;display: inline-block;}
	.desc-pad .last{margin-bottom:80upx;}
	.addClockIn{color: #0000FF;}
	.uni-popup .content .text{color:#666666;}
	
</style>
