export default {
    name: "采购订单审批流程",
    configName: "ORDER_AUDIT",
    nodes: [
        {
            id: "node1",
            pid: null,
            label: "省级中心总经理审批",
            lineLabel: "(经销)普通订单金额 > 2万元，或特殊订单",
            lineWidth: 320,
            roles: "SJZXZJJ",
        },
        {
            id: "node2",
            pid: "node1",
            label: "是否高额订单？",
            type: "diamond"
        },
        {
            id: "node3",
            pid: "node2",
            label: "中心总经理审批",
            lineLabel: "(经销)普通订单订单金额>5万元，特殊订单>2万元申请",
            lineWidth: 400,
            roles: "zxzjl",
        },
        {
            id: "end_1",
            pid: "node2",
            lineLabel: "(经销)普通订单订单金额<=5万元，特殊订单<=2万元申请",
            lineWidth: 400
        }
    ]
}
