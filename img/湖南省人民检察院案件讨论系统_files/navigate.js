///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/require.js" />
///<reference path="../libs/underscore.js" />
///<reference path="../libs/backbone.js" />
define(['underscore', 'backbone'],
    function ( _, Backbone) {
        App.Routers.Navigate = Backbone.Router.extend({
            routes: {
                "*page": "showPage"
            },
            showPage: function (page) {
				page = page || this.defaultPage;
                var $page = $('.main.pages').find(page);
				var curView = null;
				var firestshow = false;
				var me = this;
				switch (page) {
					case '.index-page': {
						if (!App.indexView) { //this.indexView
							require(['views/indexmanager'], function (View) {
                                this.indexView = App.indexView = new View({ //me.indexView
									el: $page
								});
                             });
							firestshow = true;
						}
						curView = App.indexView; //this.indexView
						break;
					}
					case '.request-page': {
						if (!this.requestView) {
							require(['views/requestmanager'], function (View) {
                                 me.requestView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.requestView;
						break;
					}
					case '.arraignment-page': {
						if (!this.arraignView) {
							require(['views/arraignmanager'], function (View) {
                                 me.arraignView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.arraignView;
						break;
					}
					case '.approval-page': {
						if (!this.approvalView) {
							require(['views/approvemanager'], function (View) {
                                 me.approvalView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.approvalView;
						break;
					}
					case '.history-page': {
						if (!this.historyView) {
							require(['views/historys'], function (View) {
                                 me.historyView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.historyView;
						break;
					}
					case '.statistics-page': {
						if (!this.statisticsView) {
							require(['views/statistics'], function (View) {
                                 me.statisticsView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.statisticsView;
						break;
					}
					case '.unit-page': {
						if (!this.unitView) {
							require(['views/unitmanager'], function (View) {
                                 me.unitView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.unitView;
						break;
					}
					case '.department-page': {
						if (!this.departmentView) {
							require(['views/departmentmanager'], function (View) {
                                 me.departmentView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.departmentView;
						break;
					}
					case '.user-page': {
						if (!this.userView) {
							require(['views/usermanager'], function (View) {
                                 me.userView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.userView;
						break;
					}
					case '.mcu-page': {
						if (!this.mcuView) {
							require(['views/mcumanager'], function (View) {
                                 me.mcuView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.mcuView;
						break;
					}
					case '.mtresoure-page': {
						if (!this.mtresourceView) {
							require(['views/mtresourcemanager'], function (View) {
                                 me.mtresourceView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.mtresourceView;
						break;
					}
					case '.recorder-page': {
						if (!this.recorderView) {
							require(['views/recordermanager'], function (View) {
                                 me.recorderView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.recorderView;
						break;
					}
					case '.backup-page': {
						if (!this.backupView) {
							require(['views/backupmanager'], function (View) {
                                 me.backupView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.backupView;
						break;
					}
					case '.casetype-page': {
						if (!this.casetypeView) {
							require(['views/casetypemanager'], function (View) {
                                 me.casetypeView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.casetypeView;
						break;
					}
					case '.userlog-page': {
						if (!this.userlogView) {
							require(['views/userlogmanager'], function (View) {
                                 me.userlogView = new View({
									el: $page
								 });
                             });
							firestshow = true;
						}
						curView = this.userlogView;
						break;
					}
				}
                if ($page) {
                    $('.container .nav-group .selected').removeClass('selected');
                    $('.container .nav-group  div[data-navpage="' + page + '"]').addClass('selected');
                    $('.container .nav-group  li[data-navpage="' + page + '"]').addClass('selected');
                    if ($page.is(':hidden')) {
                    	$('.main.pages>div:visible').hide();
                        $page.show();
                    }
					if (!firestshow) {
                        curView ? curView.render() : '';
					}
                }
            },
            initialize: function () {
                var router = this;
                $('.nav-group').slimScroll({
	        		// distance:'3px',
				    height: '100%'
				    // alwaysVisible: true
	        	});
	        	$('.nav-group').on('click', 'span.arrow-icon', function (e) {
	        		if($(this).hasClass('arrow-bottom')){
	        			$(this).removeClass('arrow-bottom').addClass('arrow-right');
	        		}else{
	        			$(this).removeClass('arrow-right').addClass('arrow-bottom');
	        		}
	        		for(var i = 0; i < $('.nav-group').find('ul').length; i++){
	        			if($('.nav-group').find('ul')[i] != $(this).closest('.nav-btn').next('ul')[0]){
	        				$('.nav-group').find('ul').eq(i).removeClass('nav-toggle');
	        				$('.nav-group').find('ul').eq(i).prev('div.nav-btn').children('span.arrow-icon').removeClass('arrow-bottom').addClass('arrow-right');
	        			}
	        		}
	        		$(this).closest('.nav-btn').next('ul').toggleClass('nav-toggle');
	        	});

				var nav_btns = $('.container .nav-group .nav');
                nav_btns.click(function () {
                    var $cur = $(this);
                    var navpage = $cur.attr("data-navpage");
                    /*
                    	add by lyr @20150422
                    */
                    /*if(navpage == '.unit-page' || navpage == '.department-page'){
                    	$('.subordinate').attr("data-navpage", navpage);
                    }else if(navpage == '.mcu-page' || navpage == '.mtresoure-page' || navpage == '.recorder-page' || navpage == '.backup-page'){
                    	$('.device').attr("data-navpage", navpage);
                    }*/

                    if (navpage) {
                        router.navigate(navpage, {
                            trigger: true
                        });
                    }
                });
				this.defaultPage = nav_btns.eq(0).attr("data-navpage");
            }
        });
        return App.Routers.Navigate;
    });

