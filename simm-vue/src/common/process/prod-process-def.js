export default {
    name: "商品审批流程",
    configName: "PRODUCT_AUDIT",
    closeAutoEnd: true,//关闭自动创建终结点的功能
    debug: true,
    nodes: [
        {
            id: "node1",
            pid: null,
            label: "商品管理员审核",
            // description: "2020-04-09 12:00:00 \r\n sd",
            roles: "prodmanager",
            x: 236,
            y: 90
        },
        {
            id: "node2",
            pid: "node1",
            label: "是否分账？",
            //lineLabel: "审批通过",
            type: "diamond",
            x: 396,
            y: 50
        },
        {
            id: "node3",
            pid: "node2",
            label: "供应商审批",
            size: [120, 30],
            instanceLabel: "供应商审批",
            lineLabel: "分账商品，需要供应商审批销售价",
            driver: 2,
            roles: "supplymanager",
            x: 650,
            y: 120
        },
        {
            id: "node4",
            pid: "node2,node3",
            type: "circle",
            label: "end",
            lineLabel: "审批通过",
            size: 40,
            x: 800,
            y: 60
        }
    ]
}
