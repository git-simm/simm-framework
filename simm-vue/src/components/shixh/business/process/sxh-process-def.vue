<template>
  <div ref="container"></div>
</template>
<script>
import G6 from "@antv/g6";
import processNode from "./sxh-process-node.vue";
//https://www.pianshen.com/article/9557241119/
//https://www.jianshu.com/p/5b6567fe6f4d
//https://www.yuque.com/antv/g6/custom-interaction
export default {
  name: "sxhProcessDef",
  props: {
    treeNodes: {},
    processDef: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data() {
    return {
      maxX: 0,
      maxY: 0,
      fitHeight: 100,
      //定宽
      fitWidth: this.processDef.fitWidth || 200,
      fitTop: this.processDef.fitTop || 50,
      fitLeft: this.processDef.fitLeft || 50,
      //线类型
      lineType: this.processDef.lineType || "quadratic", //cubic,quadratic,arc,polyline,line
      nodes: this.processDef.nodes,
      completedNodeStyle: {
        stroke: "#aaaaaa",
        fill: "#dddddd",
        radius: 4
      }
    };
  },
  mounted() {
    var data = this.parseNodes();
    this.initG6(data);
  },
  methods: {
    /**
     * 解析节点
     */
    parseNodes() {
      //解析数据
      var self = this;
      var data = {};
      data.nodes = [...this.nodes];
      data.nodes.filter(n => {
        if (n.status === 1) {
          n.style = this.completedNodeStyle;
        }
        if (n.type == "diamond") {
          n.style = this.completedNodeStyle;
        }
      });
      //计算start,end节点
      var start = {
        id: "node_start",
        pid: null,
        type: "circle",
        label: "start",
        size: 40
      };
      var end = {
        id: "node_end",
        pid: null,
        type: "circle",
        label: "end",
        size: 40
      };
      if (this.processDef.isInstance) {
        start.status = 1;
        start.style = this.completedNodeStyle;
        if (!data.nodes.some(n => (n.status || 0) === 0)) {
          //流程均已经走完，则将结束节点置为完成
          end.status = 1;
          end.style = this.completedNodeStyle;
        }
      }
      data.nodes.push(start);
      if (!self.processDef.closeAutoEnd) {
        data.nodes.push(end);
      }
      //计算边线
      data.nodes
        .filter(n => !n.pid && n.id != "node_end" && n.id != "node_start")
        .forEach(n => (n.pid = "node_start"));
      data.edges = [];
      data.nodes.forEach(n => {
        //n.style = { radius: 5 };
        if (n.id.includes("end")) {
          (n.type = "circle"), (n.size = 40), (n.label = "end");
        }
        //查找节点的子级
        var children = self.nodes.filter(c =>
          (c.pid || "").split(",").includes(n.id)
        );
        children.forEach(c => {
          data.edges.push({
            source: n.id,
            target: c.id,
            type: self.lineType,
            label: c.lineLabel || ""
          });
        });
        if (children.length === 0 && !n.id.includes("end")) {
          if (!end.pid) {
            end.pid = n.id;
          } else {
            end.pid += "," + n.id;
          }
          data.edges.push({
            source: n.id,
            target: "node_end",
            type: self.lineType
          });
        }
      });
      this.autoLayout(start, data.nodes);
      return data;
    },
    /**
     * 自动计算节点布局
     */
    autoLayout(root, nodes) {
      root.level = 0;
      this.getTree(root, nodes);
      //固定变量
      var fitHeight = this.fitHeight,
        fitWidth = this.fitWidth,
        top = this.fitTop,
        left = this.fitLeft;
      var maxLevel = Math.max(...nodes.map(n => n.level));
      var groups = nodes.group(n => n.level);
      //nodesArr
      var nodesArr = [];
      for (var i = 1; i <= maxLevel; i++) {
        nodesArr.push(groups.get(i));
      }
      var maxNodeCount = Math.max(...nodesArr.map(g => g.length));
      var mY = (maxNodeCount - 1) * fitHeight;
      var configY = 0,
        configX = 0;
      var defYnodes = this.processDef.nodes.filter(n => n.y > 0);
      var defXnodes = this.processDef.nodes.filter(n => n.x > 0);
      if (defYnodes.length > 0) {
        configY = Math.max(...defYnodes.map(n => n.y));
      }
      if (defXnodes.length > 0) {
        configX = Math.max(...defXnodes.map(n => n.x));
      }
      this.maxY = Math.max(...[mY, configY]);
      this.maxX = fitWidth * (maxLevel - 1) + left;
      var self = this;
      self.maxX = null;
      nodesArr.forEach(g => {
        if (g.length < maxNodeCount) {
          var height = self.maxY / (g.length + 1);
          g.forEach((n, i) => {
            if (!n.x) {
              n.x = self.maxX ? self.maxX + (n.lineWidth || fitWidth) : left;
            }
            if (!n.y) {
              n.y = height * (i + 1) + top;
            }
          });
        } else {
          g.forEach((n, i) => {
            if (!n.x) {
              n.x = self.maxX ? self.maxX + (n.lineWidth || fitWidth) : left;
            }
            if (!n.y) {
              n.y = fitHeight * i + top;
            }
          });
        }
        var tempX = Math.max(...g.map(n => n.x));
        self.maxX = Math.max(...[tempX, configX]);
      });
    },
    getTree(root, nodes) {
      var self = this;
      root.level++;
      root.children = nodes.filter(n =>
        (n.pid || "").split(",").includes(root.id)
      );
      root.maxChildren = root.children.length;
      if (root.maxChildren === 0) return;
      root.children.forEach((c, i) => {
        c.level = root.level;
        self.getTree(c, nodes);
      });
    },
    /**
     * 初始化流程图
     */
    initG6(data) {
      const graph = new G6.Graph({
        container: this.$refs.container,
        width: this.maxX + (this.processDef.isInstance ? 30 : 100),
        height: this.maxY + (this.processDef.isInstance ? 60 : 100),
        // fitView: 'autoZoom',
        renderer: "svg",
        // layout: {
        //   // Object，可选，布局的方法及其配置项，默认为 random 布局。
        //   type: "dagre"
        // },
        defaultNode: {
          //size: [200, 40],
          type: "rect",
          // 其他配置
          linkPoints: {
            top: false,
            bottom: false,
            left: false,
            right: false,
            fill: "#fff"
          },
          style: {
            fill: "#C6E5FF",
            stroke: "#096dd9",
            radius: 4
          }
        },
        defaultEdge: {
          style: {
            //fill: "#666666",
            stroke: "#aaaaaa",
            lineWidth: 2,
            endArrow: true
          }
        }
      });
      graph.read(data);
      this.initEvent(graph);
    },
    /**
     * 事件初始化
     */
    initEvent(graph) {
      var self = this;
      let node, dx, dy;
      graph.on("node:dragstart", ev => {
        const { item } = ev;
        const model = item.getModel();
        node = item;
        dx = model.x - ev.x;
        dy = model.y - ev.y;
      });
      graph.on("node:drag", ev => {
        node &&
          graph.update(node, {
            x: ev.x + dx,
            y: ev.y + dy
          });
      });
      graph.on("node:dragend", ev => {
        if (self.processDef.debug) {
          console.log({
            x: ev.x,
            y: ev.y
          });
        }
      });
      graph.on("node:mouseenter", ev => {
        var node = (ev.item._cfg || {}).model || {};
        if (node.status === 1 || node.type == "diamond") {
          return;
        }
        graph.update(ev.item, {
          color: "darkred",
          style: {
            fill: "#fff"
          }
        });
      });
      graph.on("node:mouseleave", ev => {
        var node = (ev.item._cfg || {}).model || {};
        if (node.status === 1 || node.type == "diamond") {
          return;
        }
        graph.update(ev.item, {
          color: "#096dd9",
          style: {
            fill: "#C6E5FF"
          }
        });
      });
      graph.on("node:click", ev => {
        self.showProcessNodeInfo(ev.item._cfg.model);
      });
    },
    /**
     * 显示节点信息
     * @param {*} node
     */
    showProcessNodeInfo(node) {
      if (!node.roles) return;
      if (node.driver === 2) {
        this.$message({ message: "该节点由外部系统审核处理", type: "info" });
        return;
      }
      this.$layerUtil.openWin(this, {
        title: `${this.processDef.name || "审批流程"} - ${node.label}`,
        area: ["650px", "500px"],
        data: {
          node: node,
          process: this.processDef
        },
        component: processNode
      });
    }
  }
};
</script>
