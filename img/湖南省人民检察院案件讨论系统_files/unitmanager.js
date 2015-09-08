define([
    'backbone',
    'text!templates/unit-page.html',
	'views/unittree',
	'views/unitform',
	'widgets/modaldlg',
    'text!templates/unit-form.html',
	'collections/units',
	'libs/jquery-ui'
	],
    function (Backbone,unitPageTpl,UnitTree,UnitForm,ModalDlg,formTpl,Units) {
        App.Views.UnitManager = Backbone.View.extend({
        	//触发事件
			events:{
				'click .breadcrumb .addnew':'onAddNewUnit',
				'click .tree-dropmenu .modify':'onModifyUnit',
				'click .tree-dropmenu .delete':'onDeleteUnit',
				'keydown .search':'OnSearchKeyDown',
				'click .search .search-icon': 'OnSearchKeyDown'
			},
			//初始化
            initialize: function (options) {
                _.bindAll(this, 'render');
				this.$el.find('.content').html(unitPageTpl);
				this.unitTree = new UnitTree({el:this.$el.find('.unit-tree')});
				this.modalDlg = new ModalDlg({title:'新增部门',content:formTpl,id:'unitmanage-form'});
				this.modalDlg.form = new UnitForm({el:this.modalDlg.content,autoValid:true});
				this.modalDlg.$el.find('.modal-content').draggable({containment: "#unitmanage-form",scroll: false });
				this.collection = this.unitTree.collection;
				this.modalDlg.form.on('disappear',this.onformdisappear,this);
				this.unitTree.on('selchanged',this.onTreeSelChanged,this);
				this.readOnlyForm = new UnitForm({el:this.$el.find('form.form-readonly')});
				this.render();
            },
            //渲染
            render: function () {
            	this.unitTree.lastSel = '';
            	this.unitTree.collection.fetch({success:this.unitTree.loadComplete});
            },
            //选中树节点
			onTreeSelChanged: function(nodeId,node){
				//debugger
				if(nodeId && node){
					this.selmodel = this.collection.get(node.id);
				}else{
					this.selmodel = null;
				}
				this.readOnlyForm.reload(this.selmodel); /*重载入当前点击的某级单位部门信息*/
			},
			//获取节点
			getSelectedModel: function(){
				return this.selmodel;
			},
			//搜索
			OnSearchKeyDown: function(e){
				var param = {'reset': true};
				if (e.keyCode == 13){
					param.data = {'unitName': $(e.target).val()};
				}else if(e.type === 'click'){
					param.data = {'unitName': $(e.target).prev('input').val()};
				}
				this.collection.fetch(param);
			},
			//隐藏弹框
			onformdisappear: function(reason,form){
				this.modalDlg.close();
				if(reason == 'submited'){
					
				}
			},
			//添加
			onAddNewUnit: function(e){
				var model = this.getSelectedModel();
				var attrs = model && {parentUnitId:model.get('id')};
				var model = new App.Models.Unit(attrs,{collection:this.collection});
				this.loadToForm(model,'添加单位信息');
				this.modalDlg.form.$('select.parentUnit').combo({readonly:false});
			},
			//加载
			loadToForm: function(model,title){
				this.modalDlg.domodal();
				this.modalDlg.setTitle(title);
				this.modalDlg.form.render();
				this.modalDlg.form.reload(model);
			},
			//修改
			onModifyUnit: function(e){
				var model = this.getSelectedModel();
				if(!model){Utils.alert('请先选择一个单位'); return;}
				this.loadToForm(model,'修改单位');

				if(!model.get('parentUnitId')){ //最高级无上级单位且不可修改上级单位
					this.modalDlg.form.$('select.parentUnit').combo({data:[{}]});
				}

				this.modalDlg.form.$('select.parentUnit').combo({readonly:false});
			},
			//删除
			onDeleteUnit: function(e){
				var selmodel = this.getSelectedModel();
				if(!selmodel){Utils.alert('请先选择一个单位'); return;}
				var me = this;
				Utils.confirm('确认要删除当前选择项吗?', '提示', function (res) {
					if (res == 'ok') {
						selmodel.destroy({
							wait: true,
							success: function (model, result) {
								if (result.success) {
									if (selmodel.collection) {
										selmodel.collection.remove(selmodel);
									}
								}
								Utils.alert(result.msg);
							}
						});
					}
               });
			}
        });
        return App.Views.UnitManager;
    });