export default {
    name: "SGU审批流程",
    configName: "SGU_AUDIT",
    nodes: [
        {
            id: "node1",
            pid: null,
            label: "谁发起的审批?",
            lineLabel: "商品毛利率过低",
            type: "diamond"
        },
        {
            id: "node2",
            pid: "node1",
            label: "直购经理审批",
            lineLabel: "直购商品上架申请",
            lineWidth: 300,
            roles: "zgjl"
        },
        {
            id: "node3",
            pid: "node1",
            label: "采购总监审批",
            lineLabel: "总部团购商品上架申请",
            lineWidth: 300,
            roles: "PD"
        },
        {
            id: "node4",
            pid: "node1",
            label: "省级中心总经理审批",
            lineLabel: "非总部团购商品上架申请",
            lineWidth: 300,
            roles: "SJZXZJJ"
        }
    ]
}
