define([
	'views/configform',
	'placeholder'
	],
    function (ConfigForm, placeholder) {
        App.Views.MyInfoFrom = ConfigForm.extend({
			events:{
				'click .toolbar .cancel':'oncancelClick',
				'click .toolbar .submit':'onsubmitClick'
			},
            initialize: function (options) {
            	ConfigForm.prototype.initialize.apply(this, arguments);
				this.modalParent = options.parent;
            },
            render: function () {
            	ConfigForm.prototype.render.apply(this, arguments);
            },
            oncancelClick: function (e) {
            	this.trigger('disappear', 'cancel', this);
            },
            onsubmitClick: function (e) {
            	var me = this;
            	var phoneNumber = this.$el.find('input[name="phoneName"]').val();
            	var mail = this.$el.find('input[name="mail"]').val();
            	var comment = this.$el.find('textarea[name="comment"]').val();
            	var modalParent = this.modalParent;
                if(phoneNumber !== undefined){
                    if(phoneNumber.length > 34){
                        return Utils.alert('电话的长度不能超过34个字符');
                    }else if(phoneNumber && !/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/.test(phoneNumber)){
                        return Utils.alert('请输入正确的电话号码');
                    }
                }
                if(mail !== undefined){
                    if(mail && !/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(mail)){
                        return Utils.alert('请输入正确的邮箱地址');
                    }
                }
				$.ajax({
					url: 'rest/user/updateUserInfo',
					data:{phoneNumber:phoneNumber, mail:mail, comment:comment},
					datatype:'JSON',
					type: 'POST',
					success: function (result) {
                        if(result.success){
                            modalParent.close();
                            G_USER = result.data;
                            me.trigger('disappear', 'submit', result.data);
                        }else{
                            Utils.alert(result.msg);
                        }
						
					}
				});
            },
            render: function () {
				this.$el.find('input').placeholder();
            }
        });
        return App.Views.MyInfoFrom;
    });
