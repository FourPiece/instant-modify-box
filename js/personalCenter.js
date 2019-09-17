var vm = new Vue({
	el:'#app',
	data:{
		//默认数据
		userInfo:[{
			property:'账号',
			value:'zhangsan'
		},{
			property:'昵称',
			value:'张三'
		},{
			property:'密码',
			value:'********'
		},{
			property:'联系电话',
			value:'15099088965'
		}],
		user:{},
		//更新的数据
		update:{},
		isNickName : false,
		isPhone : false,
		isUserName : false
		
	},
	mounted:function(){
    	//加载页面的时候获取
		this.getUserInfo();
    },
	methods: {
		getUserInfo:function(){
			//这里 用于获取信息
			this.user = {
					userName:'zhangsan',
					nickName:'张三',
					password:'',
					phone:'15099088965'
				};
			/**
			$.get("/sys/user/info",function(data){
				if(data.code==0){
					vm.userInfo=[];
					vm.userInfo.push({'property':'账号','value':data.user.userName})
					vm.userInfo.push({'property':'昵称','value':data.user.nickName})
					vm.userInfo.push({'property':'密码','value':'********'})
					vm.userInfo.push({'property':'联系电话','value':data.user.phone})
					vm.user = data.user;
				}
			});
			**/
		},
		getId:function(row){
			var property = row.property;
			if(property=="账号"){
				return "myUserNameSpan"
			}else if(property=="昵称"){
				return "myNickNameSpan"
			}else if(property=="密码"){
				return "myPasswordSpan"
			}else if(property=="联系电话"){
				return "myPhoneSpan"
			}
		},
		getValue:function(row){
			return row.value;
		},
		updateMsg:function(row){
			var property = row.property;
			//根据自己需要的定义属性
			if(property=="密码"){
				//打开密码修改框
				this.$alert('打开一个弹出框，输入原密码，新密码', '修改密码', {
					confirmButtonText: '确定',
					callback: action => {
						this.$message({
							type: 'info',
							message: 'action: ${ action }'
						});
					}
				});
			}else{
				var id = event.target.parentElement.lastChild.id;
				//变成可编辑， 背景变成白色
				$("#"+id).attr("contentEditable",true);
				$("#"+id).addClass("spanFocus");
				$("#"+id).focus();
				//改变右边的图标
				//保存
				event.target.parentElement.children[1].style="display:block"
				//取消
				event.target.parentElement.children[0].style="display:block"
				//编辑
				event.target.parentElement.children[2].style="display:none"	
			}
			
		},
		saveMsg:function(row){
			vm.update = {};
			var value = event.target.parentElement.lastChild.innerHTML;
			var property = vm.getProperty(row);
			var id = event.target.parentElement.lastChild.id;
			var chineseProperty = row.property;
			//去除空白
			if(value.replace(/&nbsp;/g,"").replace(/&nbsp/g,"").trim()==""){
				alert("信息不能为空!");
				return;
			}
			
			//无法编辑
			vm.unableEdit(id);
			//获取操作名称
			var title = vm.openLayer(chineseProperty);
			//弹出提示框
			const h = vm.$createElement;
			var text = '修改成功';
			var time =1000;
			var toLogin = false;
			if(chineseProperty=="账号"){
				text = text+' ， 5s后返回登陆页面！'
				time = 5000;
				toLogin = true;
			}
			vm.$notify({
			  title: title,
			  message: text,
			  duration: time,
			  type: 'success'
			});
			
			//修改账号后重新登陆(写自己的逻辑)
			if(toLogin){
				setTimeout(function(){
			    	window.top.location.href = "login.html";
			    },5000);
			}
			
			//用于更新内容的ajax 和上面一样，只不过是放到ajax中
			/**
			$.ajax({
				url:'/sys/user/userSelfUpdate',
				data:JSON.stringify(vm.update),
				type:'POST',
				success:function(r){
					if(r.code==0){
						vm.unableEdit(id);
						var title = vm.openLayer(chineseProperty);
						const h = vm.$createElement;
						var text = '修改成功';
						var time =1000;
						var toLogin = false;
						if(chineseProperty=="账号"){
							text = '修改成功! ， 5s后返回登陆页面！'
							time = 5000;
							toLogin = true;
						}
						vm.$notify({
				          title: title,
				          message: text,
				          duration: time,
				          type: 'success'
				        });
						if(toLogin){
							setTimeout(function(){
				            	window.top.location.href = "/logout";
				            },5000);
						}
					}
					else{
						alert(r.msg);
					}
				}
			})
			**/
		},
		//返回
		backMsg:function(row){
			var property = row.property;
			var id = event.target.parentElement.lastChild.id;
			vm.unableEdit(id);
			if(property=="账号"){
				$("#"+id).text(vm.user.userName);
			}else if(property=="昵称"){
				$("#"+id).text(vm.user.nickName);
			}else if(property=="联系方式"){
				$("#"+id).text(vm.user.phone);
			}else if(property=="密码"){
				
			}
		},
		//无法编辑
		unableEdit:function(id){
			var id = id;
			$("#"+id).attr("contentEditable",false);
			$("#"+id).removeClass("spanFocus");
			//改变右边的图标
			//保存
			$("#"+id).parent().children("i:eq(1)").css("display","none")
			//取消
			$("#"+id).parent().children("i:eq(0)").css("display","none")
			//编辑
			$("#"+id).parent().children("i:eq(2)").css("display","block")
		},
		
		getProperty:function(row){
			var property = row.property;
			if(property=="账号"){
				return "userName"
			}else if(property=="昵称"){
				return "nickName"
			}else if(property=="联系方式"){
				return "phone"
			}
		},
		openLayer:function(chineseProperty){
			var property = chineseProperty;
			var name = "更改";
			if(property=="账号"){
				return name = name + "账号"
			}else if(property=="昵称"){
				return name = name + "昵称"
			}else if(property=="联系方式"){
				return name = name + "联系方式"
			}else if(property=="密码"){
				return name = name + "密码"
			}
			
		}
	}
});