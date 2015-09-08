define([
    'backbone',
	'ztree',
	'collections/units'
	],
    function (Backbone,zTree,Units) {
		App.Stores.Units = App.Stores.Units || new Units();
        App.Views.UnitTree = Backbone.View.extend({
            initialize: function (options) {
				_.bindAll(this, 'zTreeOnClick','loadComplete');
				this.collection = App.Stores.Units;
				this.collection.bind('change', this.onupdate, this);
                //this.collection.bind('remove', this.onremove, this);
                this.collection.bind('destroy', this.onremove, this);
                this.collection.bind('add', this.onadd, this);
                this.collection.bind('reset', this.onreset, this);
                this.render();
            },
            /*渲染*/
            render: function () {
				var me = this;
				if(!this.rendered){
					this.collection.fetch({success:this.loadComplete});
				}
            },
            /*完成加载*/
			loadComplete: function () {
				var ztreeNodes = this.collection.toJSON() || [];
				for (var i = 0; i < ztreeNodes.length; i++){
					ztreeNodes[i].icon = "static/css/zTreeStyle/img/diy/unit_icon.png";
				}
				this.zTree = $.fn.zTree.init(
					this.$el, 
					{
						data: {
							key: {
								name: "unitName"
							},
							simpleData: {
								enable: true,
								idKey: "id",
								pIdKey: "parentUnitId",
								rootPId: 0,
							}
						},/*
						async:{
							enable: true,
							type: "get",
							url: "rest/department/listDeptTree",
							dataFilter: this.ajaxDataFilter
						},*/callback: {
							onClick: this.zTreeOnClick
						}
					},
					ztreeNodes
				);
				this.rendered = true;

            },
			ajaxDataFilter:function (treeId, parentNode, responseData) {
				if(responseData.hasOwnProperty('success') && responseData.data){
					return responseData.data;
				}
				return responseData;
            },
            /*点击节点*/
			zTreeOnClick:function (event, treeId, treeNode) {
				if(this.lastSel != treeNode.id){
					this.$el.find(".tree-dropmenu").remove();
					var treeDropmenu = '<div class="tree-dropmenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="drop-icon"></span></a><ul class="dropdown-menu"><li class="modify"><a>修改</a></li><li class="delete"><a>删除</a></li></ul></div>';
					$(event.target).closest('a').append(treeDropmenu);
					this.lastSel = treeNode.id;
					this.lastSelNode = treeNode;
					this.trigger('selchanged',this.lastSel,treeNode); 
				}
			},
			/*重置*/
			onreset:function(){
                this.loadComplete();
            },
            /*添加*/
            onadd: function (model) {
				if(!this.zTree) return;
                var parentNode = null;
				var  parentDeptId = model.get('parentUnitId');
				if(parentDeptId){
					parentNode = this.zTree.getNodeByParam('id',model.get('parentUnitId'),null);
				}
				this.zTree.addNodes(parentNode,model.toJSON());
            },
            /*更新*/
            onupdate: function (model) {
				var node = this.zTree.getNodeByParam('id',model.get('id'),null);
				if(node){
					node.address = model.get('address');
					node.unitName = model.get('unitName');
					node.phoneNumber =  model.get('phoneNumber');
					this.zTree.updateNode(node);
				}
            },
            /*移除*/
            onremove: function (model) {
				if(!this.zTree) return;
				var node = this.zTree.getNodeByParam('id',model.get('id'),null);
				if(node){
					this.zTree.removeNode(node);
					this.collection.fetch({success:this.loadComplete});
				}
            }
        });
        return App.Views.UnitTree;
    });
