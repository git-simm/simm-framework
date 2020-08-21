export default {
    name: "供应商审批流程",
    configName: "SUPPLY_AUDIT",
    closeAutoEnd: true,//关闭自动创建终结点的功能
    debug: false, //启动调试，拖拽节点时可以在控制台输出节点的坐标
    nodes: [
        {
            id: "node1",
            pid: null,
            label: "是否代理商?",
            type: "diamond",
            x: 176,
            y: 229
        },
        {
            id: "node2",
            pid: "node1",
            label: "代理商管理员审批",
            instanceLabel: "供应商管理员审批",
            lineLabel: "是代理供应商",
            roles: "supplymanager",
            x: 353,
            y: 321
        },
        {
            id: "node3",
            pid: "node1",
            label: "是否代销供应商?",
            lineLabel: "非代理供应商",
            type: "diamond",
            x: 353,
            y: 144
        },
        {
            id: "node4",
            pid: "node3",
            label: "供应商管理员审批",
            instanceLabel: "供应商管理员审批",
            lineLabel: "代销供应商",
            roles: "supplymanager",
            x: 509,
            y: 76
        },
        {
            id: "node5",
            pid: "node3",
            label: "商品中心总经理审批",
            lineLabel: "经销供应商申请(团购)",
            roles: "zxzjl",
            x: 561,
            y: 225
        },
        {
            id: "node6",
            pid: "node4",
            label: "是否团购供应商?",
            type: "diamond",
            x: 670,
            y: 92
        },
        {
            id: "node7",
            pid: "node6",
            label: "直购经理审批",
            lineLabel: "直购",
            roles: "zgjl",
            x: 932,
            y: 74
        },
        {
            id: "node8",
            pid: "node6",
            label: "是否总部账号创建？",
            lineLabel: "团购",
            type: "diamond",
            x: 807,
            y: 208
        },
        {
            id: "node9",
            pid: "node8",
            label: "省级中心总经理审批",
            lineLabel: "非总部创建",
            roles: "SJZXZJJ",
            x: 970,
            y: 144
        },
        {
            id: "node10",
            pid: "node2,node5,node7,node8,node9",
            label: "是否有保证金？",
            //lineLabel: "审批通过",
            type: "diamond",
            x: 938,
            y: 344
        },
        {
            id: "node11",
            pid: "node10",
            label: "财务审批(服务商平台)",
            size: [120, 30],
            instanceLabel: "财务审批",
            lineLabel: "保证金>0，上传保证金回执单",
            driver: 2,
            roles: "JS007",
            x: 1198,
            y: 280
        },
        {
            id: "node12",
            pid: "node10,node11",
            type: "circle",
            label: "end",
            lineLabel: "审批通过，供应商启用",
            size: 40,
            x: 1276,
            y: 126
        }
    ]
}
