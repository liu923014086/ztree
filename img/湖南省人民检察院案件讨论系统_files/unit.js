//案件数据模型
define(['backbone'], function (Backbone) {
    App.Models.Unit = Backbone.Model.extend(
        {
            defaults: {
				id:null,
				unitName:'',
				/*unitAddr:'',
				unitPhone:''*/
            },
            urlRoot: 'rest/unit',
            parse: function (data, options) {
                var record;
                if (data.hasOwnProperty('success') && data.hasOwnProperty('msg')) {
                    //当服务端返回false时,data应该为原数据
                    if (data.success == false && !data.data) {
                        record = this.attributes;
                    }
                    else {
                        record = data.data;
                    }
                }
                else {
                    record = data;
                }
                if (record) {
					//custom parse
                }
                return record;
            },
            validate: function(attrs, options){
				var name = attrs.unitName;
                var address = attrs.address;
                var phoneNumber = attrs.phoneNumber;
                var comment = attrs.comment;

				if(name !== undefined){
					if(!name || !name.trim()){
						return'单位名字不能为空';
					}
					else if(name.length > 32){
						return'单位名字长度不能超过32个字符';
					}else if(!/^[\u4E00-\u9FA5a-zA-Z0-9_]{0,}$/.test(name)){
                        return'单位名字由字母、数字、下划线、汉字组成';
                    }
				}

				if(address !== undefined){
					if(address.length > 64){
						return'单位地址长度不能超过64个字符';
					}else if(!/^[\u4E00-\u9FA5a-zA-Z0-9]{0,}$/.test(address)){
                        return'单位地址由字母、数字、汉字组成';
                    }
				}

				if(phoneNumber !== undefined){
                    if(phoneNumber.trim() && phoneNumber.length < 7){
                        return'电话的长度不能小于7个字符';
                    }else if(phoneNumber.length > 23){
                        return'电话的长度不能超过23个字符';
                    }else if(phoneNumber &&!/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/.test(phoneNumber)){
						return'请输入正确的电话号码';
					}
				}

                if(comment !== undefined){
                    if(comment.length > 128){
                        return'备注长度不能超过128个字符';
                    }
                }
        	}
        });
    return App.Models.Unit;
});