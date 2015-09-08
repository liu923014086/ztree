define([

],
    function(){
    var Configs = function(){}
    Configs.prototype = {
        constructor:Configs,
        caseState : {//案件状态
            saved:'Saved',//未提交
            commited:'Commited',//已提交or未审批
            unscheduled:'Unscheduled',//未安排
            unstart:'Unstart',//未开启
            underway:'Underway',//会议中
            completed:'Completed'//已完成
        },
        role : {//角色
            appointmentperson:2,//预约人
            approver:3,//审批人
            yuhuiren:{//与会人
                zhuchi:4,//主持人
                feizhuchi:5//非主持人
            },
            admin:{//管理员
                administrator:6, //超级管理员
                ordinAdministrator:1//普通管理员
            },
            feiyuhuiren:7//非与会人
        }
    }
    window.Configs = new Configs();
    return window.Configs;
});
