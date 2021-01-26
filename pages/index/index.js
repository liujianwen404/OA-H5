export function handleSignClick(){
	console.log(1)
}
// 本地存储打卡信息
export function setSignInfo(info){
	var signInfo = {main:[info]}
	uni.setStorageSync("signInfo",JSON.stringify(signInfo));
}
// 本地添加打卡信息
export function addSignInfo(info,signInfo){
	signInfo.main.push(info);
	uni.setStorageSync("signInfo",JSON.stringify(signInfo));
}
// 本地获取打卡信息
export function getSignInfo(){
	let signInfo = uni.getStorageSync("signInfo");
	if(!signInfo){
		return;
	}
	return JSON.parse(signInfo)
}
// 本地打卡信息清理
export function delSignInfo(){
	uni.removeStorage({
		key: 'signInfo',
		success(){
			uni.showToast({title:"重置成功"})
		}
	});
}
export function removeSignInfo(key){
	uni.removeStorageSync(key);
}
// 打卡信息
export function getInfo(signInfo){
	var nowT = new Date();
	var info = {mode:signInfo.mode, latitude:signInfo.latitude, longitude:signInfo.longitude,
	address:signInfo.address, time:signInfo.time, remarks:signInfo.remarks, imgURL:signInfo.imgURL,
	classId:signInfo.classId, groupId:signInfo.groupId, userId:signInfo.userId, userName:signInfo.userName};
	return info;
}

// 腾讯位置服务key 值
// export const key = "VEEBZ-HJL34-U3LUY-XUBOX-NSUF7-E4BRF";
export const key = "75VBZ-OHRW5-5WEIX-QKCQN-YJXEZ-H5BWW";
//本地
// export const webApiURL = "http://localhost:2003";
//测试
export const webApiURL = "https://hr-web-test.xiantian365.com";
//验证
// export const webApiURL = "http://192.168.2.77:2003";
//生产
// export const webApiURL = "https://hr-web.xiantian365.com";


