export default {
    name: "采购退货审批流程",
    configName: "RETURN_AUDIT",
    nodes: [
        {
            id: "node1",
            pid: null,
            label: "省级中心总经理审批",
            lineLabel: "商品退货价格低于移动平均价时",
            roles: "SJZXZJJ",
            lineWidth: 300,
        }
    ]
}
