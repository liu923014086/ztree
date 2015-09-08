///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/bootstrap-all.js" />
///<reference path="../libs/flat-ui/jquery.dropkick-1.0.0.js" />
///<reference path="../libs/flat-ui/jquery.placeholder.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />
///<reference path="../libs/require.js" />
///<reference path="../apps/configure.js" />
define([
	'backbone',
	'placeholder'
	],
    function () {
        App.Views.UpdateInfo = Backbone.View.extend({
			events:{
				'click .toolbar .cancel':'oncancelClick',
				'click .toolbar .submit':'onsubmitClick'
			},
            initialize: function (options) {
				this.$orgPassword = this.$el.find('input[name="OrgPassword"]');
				this.$newPassword = this.$el.find('input[name="NewPassword"]');
				this.$repPassword = this.$el.find('input[name="RepPassword"]');
				this.modalParent = options.parent;
            },
            oncancelClick: function (e) {
            },
            onsubmitClick: function (e) {
				var oldPassword = this.$orgPassword.val();
				var newPassword = this.$newPassword.val();
				if(!oldPassword || !newPassword || !newPassword.trim()){
					return Utils.alert('密码不能为空');
				}
				if(newPassword.length < 6){
					return Utils.alert('密码长度不能小于6个字符');
				}
				if(oldPassword == newPassword){
					return Utils.alert('新旧密码不能相同');
				}
				if(newPassword != this.$repPassword.val()){
					return Utils.alert('两次输入密码不一致');
				}
				var modalParent = this.modalParent;
				$.post('rest/user/updatepwd',{oldpassword:oldPassword,newpassword:newPassword},function(json){
					if(json.success){
						modalParent.close();
					}
					Utils.alert(json.msg);
				});
            },
            render: function () {
				this.$el.find('input').placeholder();
            }
        });
        return App.Views.UpdateInfo;
    });
