///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/bootstrap-all.js" />
///<reference path="../libs/flat-ui/jquery.dropkick-1.0.0.js" />
///<reference path="../libs/flat-ui/jquery.placeholder.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />
///<reference path="../libs/require.js" />
///<reference path="../apps/configure.js" />
define([
	'views/updateinfo',
	'text!templates/user-password-form.html',
	'widgets/modaldlg',
	'text!templates/myinfo-form.html',
	'views/myinfoform',
    'views/messagelist',
    'libs/jquery-ui'
	],
    function (UserInfoForm,infoTpl,ModalDlg,myinfoTpl,MyInfoForm,MessageList) {
        App.Views.SystemMenu = Backbone.View.extend({
			events:{
				'click li':'onItemClick',
				'click .logout':'onLogoutClick'
			},
            initialize: function (options) {
				this.usermodalDlg = new ModalDlg({title:'修改密码',content:infoTpl,id:'userinfo-form'});
				this.usermodalDlg.form = new UserInfoForm({el:this.usermodalDlg.content,parent:this.usermodalDlg});
                this.usermodalDlg.$el.find('.modal-content').draggable({containment: "#userinfo-form",scroll: false });

				this.myinfomodalDlg = new ModalDlg({title:'个人信息', content:myinfoTpl, id:'myinfo-form'});
				this.myinfomodalDlg.form = new MyInfoForm({el:this.myinfomodalDlg.content,parent: this.myinfomodalDlg});
                this.myinfomodalDlg.$el.find('.modal-content').draggable({containment: "#myinfo-form",scroll: false });
                this.on('curuserchange', this.changeUsername, this);

                this.$el.find('.cur-user').attr('title', CUR_USER);
            },
			onItemClick:function(e){
				var litem = $(e.currentTarget);
				if(litem.hasClass('logout')){
					this.onLogoutClick(e);
				}else if(litem.hasClass('modify_password')){
					this.onModifyPasswordClick(e);
				}else if(litem.hasClass('cur-myinfo')){
					this.onMyinfoClick(e);
				}else if(litem.hasClass('cur-meslist')){
                    this.onMeslistClick(e);
                }
				e.preventDefault();
			},
            onModifyPasswordClick: function (e) {
				this.usermodalDlg.domodal();
            },
            onLogoutClick: function (e) {
				$.post('login/logOut',function(json){
					if(json.success){
						document.location.href = 'login';
					}
				});
            },
            onMyinfoClick: function (e) {
            	this.myinfomodalDlg.domodal();
            	var input = this.myinfomodalDlg.form.$el.find('input,textarea');
            	for(var i = 0; i < input.length; i++){
            		var value = $(input[i]).attr('name');
            		var values = value.split('.');
            		if(values.length > 1 && G_USER[values[0]]){
            			$(input[i]).val(G_USER[values[0]][values[1]]);
            		}else if (values.length < 2){
            			$(input[i]).val(G_USER[values[0]]);
            		}
            	}
            	var inputUserrole = this.myinfomodalDlg.form.$el.find('input[name="userRole"]');
            	var userRoles = G_USER.userRoleIds.split(',');
            	var userRole = '';
            	for(var i = 0; i < userRoles.length; i++){
            		if(userRoles[i] == '1'){
            			userRole += "管理权限 ";
            		}else if(userRoles[i] == '2'){
            			userRole += "预约权限 ";
            		}else if(userRoles[i] == '3'){
            			userRole += "审批权限 ";
            		}
            	}
            	inputUserrole.val(userRole);
            },
            onMeslistClick: function (e) {
                App.messageList = App.messageList || new MessageList({el: $('.message-list')});
                var parentElArr = $('.content').closest('div.page');
                App.messageList.parentEl = parentElArr.filter(function(x) {
                    return $(parentElArr[x]).css('display') == 'block';
                });
                this.animateSwitch(App.messageList.parentEl, App.messageList.$el);
                
            },
            animateSwitch:function(willhide,willshow){ //页面隐藏和显示切换
                willhide.hide(function(){willshow.slideDown();});
            },
            changeUsername: function (options) {
                var curUser = this.$el.find('.cur-user > span');
                curUser.text(options.get('username'));
                curUser.attr('title', options.get('username'));
            }
        });
        return App.Views.SystemMenu;
    });
