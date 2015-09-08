define([
	'backbone',
    'text!templates/messagelist-page.html',
    'widgets/modaldlg',
    'text!templates/message-form.html',
	'views/messageform',
	'paginator'
	], 
	function (Backbone, mesPageTpl, ModalDlg, messageTpl, MessageForm) {
		App.Views.MessageList = Backbone.View.extend({
			events:{
				'click .backbtn': 'onBackClick',
				'click tr': 'OnMesItemClick'
			},
			initialize: function (options) {
				_.bindAll(this, 'render', 'OnMesItemClick');
				this.$el.html(mesPageTpl);
				this.mesListItem = '<tr data-value="<%=data.id%>"><td name="content"><%=data.content%></td><td name="statedescription"><%=data.statedescription%></td><td name="createTime"><%=data.createTime%></td><td name="unit"><%=data.unitName%><%=data.departmentName%></td><td name="userName"><%=data.userName%></td><td name="caseType"><%=data.caseType%></td></tr>';
				this.mesmodalDlg = new ModalDlg({title:'信息通知',content:messageTpl,id:'message-form-readonly'});
				this.mesmodalDlg.form = new MessageForm({el: this.mesmodalDlg.content, parent: this.mesmodalDlg});
				this.render({start:'0', limit: '30'});
				this.paginate();
			},
			render: function (options) {
				this.getMessageList(options);
			},
			paginate: function (options) {
				this.pageOpts = this.pageOpts || {};
				this.pageOpts.$el = this.pageOpts.$el || this.$el.find('.pagingbar ul');
				this.pageOpts.pageSize = this.pageOpts.pageSize || 30;
				this.pageOpts.currentPage = this.pageOpts.currentPage || 1;
				this.pageOpts.totalPages = this.pageOpts.totalPages || 1;
				var me = this;
				this.pageOpts.$el.bootstrapPaginator({
					currentPage: 1,
					bootstrapMajorVersion:3,
					totalPages: 1,
					onPageChanged: function(e,oldPage,newPage){
						// me.updatePage(e, oldPage, newPage);
						me.pageOpts.currentPage = newPage;
						me.$el.find('.meslist-table tbody').children().remove();
						me.getMessageList({start: (me.pageOpts.currentPage - 1) * 30, limit: me.pageOpts.pageSize});
					}
				});
			},
			updatePage: function (options){
				this.pageOpts.$el.bootstrapPaginator({
					currentPage: this.pageOpts.currentPage,
					totalPages: this.pageOpts.totalPages
				});
			},
			getMessageList: function (options) {
				var me = this;
				$.ajax({
					url:'message/getAllMessage',
					data:options,//{start:'0', limit:'30'}
					dataType:'JSON',
					type:'GET',
					success: function (result) {
						if(result.total && (result.total % me.pageOpts.pageSize != 0)){
							me.pageOpts.totalPages = Math.floor(result.total / me.pageOpts.pageSize) + 1;
						}
						if(result.success){
							for(var i = 0; i < result.data.length; i++){
								me.addMesItem(result.data[i]);
								me.updatePage();
							}
						}
					}
				});
			},
			addMesItem: function (options) {
				this.$el.find('.meslist-table tbody').append(_.template(this.mesListItem, { data: options}));
			},
			onBackClick: function (e) {
				this.animateSwitch(this.$el, this.parentEl);
			},
			animateSwitch:function(willhide,willshow){ //页面隐藏和显示切换
				willhide.hide(function(){willshow.slideDown();});
			},
			loadForm: function (modalDlg, data) {
				modalDlg.domodal();
				var input = modalDlg.form.$el.find('input,textarea');
            	for(var i = 0; i < input.length; i++){
            		if(($(input[i]).attr('name') == 'unitName') && data.departmentName){
            			$(input[i]).val(data[$(input[i]).attr('name')] + data.departmentName);
            		}else{
            			$(input[i]).val(data[$(input[i]).attr('name')]);
            		}
            	}
			},
			OnMesItemClick: function (e) {
				var me = this;
				var mesId = '';
				if($(e.target).attr('data-value')){
					mesId = $(e.target).attr('data-value');
				}else{
					mesId = $(e.target).closest('tr').attr('data-value');
				}
				$.ajax({
					url:'message/getMessageInfo/' + mesId,
					// dataType:'JOSN',
					type:'GET',
					success: function (result) {
						if(result.success){
							me.loadForm(me.mesmodalDlg, result.data);
							me.$el.find('.meslist-table tbody').children().remove();
							me.getMessageList({start: (me.pageOpts.currentPage - 1) * 30, limit: me.pageOpts.pageSize});
						}
					},
					error: function (result) {
					}
				});
			}
		});
		return App.Views.MessageList;
});