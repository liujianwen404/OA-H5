####最新
* 1.为了贴合之前公司的发展，接入钉钉h5微应用，在微应用里面打卡h5页面进行操作（至于为什么有了钉钉还要使用本应用，领导给出的理由是为了以后从钉钉切换到自研系统）
* 2.启动步骤：使用HBuilder X发行打包成h5，将打包后的文件夹放入web容器下，即可通过域名地址访问
* 3.注意：要在钉钉h5微应用的环境中打开，如果不想在钉钉中，可以注释掉有关钉钉登录环境的那一段代码







###关于使用：
* 1.打卡时，要选择第一个位置，作为当前位置；（开发人员，可以使用第三方js插件，直接设置当前位置；也可以将当前经纬度保存比对）
* 2.不考虑特殊情况。（没有开启位置信息服务，恶意打卡）
* 3.只做了基座测试。
###后续：
* 1.部分功能实现了，可能不尽人意。
* 2.如果你有更好的实现方式，希望和我交流。
* wx:Everything-is-object

###关于扩展：
* 1.地图组件，如打车平台的地图显示，外卖平台的实时地图显示，交友平台的位置显示等等

###关于人脸识别的思路
####首先说思路 ：
* 1.点击 人脸识别打卡 启用本地相机拍照得到临时地址；
* 2.开始上传到服务器，服务器返回上传信息，上传成功后请求验证；
* 3.返回验证结果，判断是否打卡成功；
####其次说下为什么要有这个思路：
* 1.我使用的人脸识别API是 face++ ，但测试有问题，后来改用阿里云的人脸识别,但无论是哪种 api 所传的参数都类似；
* 2.需要两个图片的 url 或是 base64 信息；又因为拍照只能得到临时地址（至于转base64暂时不考虑），
* 3.所以选择 url 让后台代理请求返回结果。
####结果：
* 1.我后台是用node做测试，放的绝对路径，测试可以正常返回结果参数；(官方有demo)
* 2.返回参数后，前台要根据匹配值（如 80.00000）做判断是否为同一个人=>打卡成功

