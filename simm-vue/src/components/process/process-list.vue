<template>
  <section class="content-section layer-container process-list">
    <div style="width:100%;height:100%;overflow:auto;">
      <sxh-process-def
        v-if="(process.nodes || []).length > 0"
        :process-def="process"
      ></sxh-process-def>
      <el-timeline>
        <el-timeline-item v-for="(item, index) in list" :key="index">
          <span>{{ item.auditRemark }}</span>
          <span
            v-if="item.remark > ''"
            :style="item.status === -1 ? `color:red` : `color:green`"
            class="audit-remark"
          >
            <b>{{ item.remark }}</b>
          </span>
        </el-timeline-item>
        <el-timeline-item v-if="nextAuditor != null" :model="nextAuditor">
          <span style="color:green">
            <span v-if="nextAuditor.prepend"> {{ nextAuditor.prepend }} </span>
            待{{ nextAuditor.admin_role_name }}审批
            <span v-if="nextAuditor.append">{{ nextAuditor.append }}</span>
          </span>
        </el-timeline-item>
      </el-timeline>
    </div>
  </section>
</template>

<script>
import ProdProcessExtend from "@/components/process/prod-process-extend";
import SupplyProcessExtend from "@/components/process/supply-process-extend";
export default {
  name: "processList",
  data: function() {
    return {
      //流程名称
      processName: null,
      //业务ID
      refId: null,
      //流程列表
      list: [],
      //流程实例节点
      sysAudits: [],
      process: {
        nodes: [],
      },
      nextAuditor: null,
    };
  },
  created() {
    this.processName = this.$options.propsData.processName;
    this.refId = this.$options.propsData.refId;
    this.getData(this.processName, this.refId);
  },
  methods: {
    // 记录补全数据
    getData: function(processName, refId) {
      var self = this;
      self.$httpUtil.post({
        url: "/audit/log/auditLogList.json",
        contentType: "form", //json,form,multipart
        data: {
          configName: processName,
          refId: refId,
        },
        succ: function(data) {
          self.extendNode(data.data, (auditInfo) => {
            self.list = auditInfo.sysAuditLogs;
            if (auditInfo.nextAuditor != null) {
              self.nextAuditor = auditInfo.nextAuditor;
            }
            self.sysAudits = auditInfo.sysAudits;
            self.handleProcessNodes(self.sysAudits);
            self.handleAuditNote(self.list);
          });
        },
      });
    },
    /**
     * 处理审批日志
     */
    handleAuditNote(list) {
      if ((list || []).length == 0) return;
      list.forEach((log) => {
        if (log.auditRemark.includes("[")) {
          var arr = log.auditRemark.split("[");
          if (arr && arr.length > 1) {
            if (arr[1]) {
              var pos = arr[1].lastIndexOf("]");
              log.remark = "[" + arr[1].substring(0, pos) + "]";
              log.auditRemark = arr[0] + arr[1].substring(pos + 1);
            } else {
              log.remark = "[" + arr[1];
              log.auditRemark = arr[0];
            }
          }
        }
      });
    },
    handleProcessNodes(sysAudits) {
      if ((sysAudits || []).length === 0) return;
      for (var p in this.$flows) {
        if (this.$flows[p] && this.$flows[p].configName === this.processName) {
          //组装节点
          this.wrapNodes(
            (this.$flows[p].nodes || []).filter((a) => a.roles > ""),
            sysAudits
          );
          return;
        }
      }
    },
    wrapNodes(nodeDefs, sysAudits) {
      var lastNode = {};
      this.process = {
        config_name: this.processName,
        fitWidth: 140,
        fitTop: 24,
        fitLeft: 50,
        lineType: "line",
        isInstance: true,
        nodes: [],
      };
      (sysAudits || []).sort((a, b) => a.sort - b.sort);
      for (var i in sysAudits) {
        var node = sysAudits[i];
        var def = nodeDefs.find((a) =>
          (node.config_condition || "").includes(a.roles)
        );
        if (def) {
          node.id = `node_${node.id}`;
          node.pid = lastNode.id;
          node.label = def.instanceLabel ?? def.label;
          node.roles = def.roles;
          this.process.nodes.push(node);
          lastNode = node;
        }
      }
    },
    extendNode(auditInfo, callback) {
      if (this.processName == "PRODUCT_AUDIT") {
        var processExtend = new ProdProcessExtend(
          this,
          this.processName,
          this.refId
        );
        processExtend.extendNode(auditInfo, callback);
      } else if (this.processName == "SUPPLY_AUDIT") {
        var supplyExtend = new SupplyProcessExtend(
          this,
          this.processName,
          this.refId
        );
        supplyExtend.extendNode(auditInfo, callback);
      } else {
        if (callback) {
          callback(auditInfo);
        }
      }
    },
  },
};
</script>

<style lang="less">
.process-list {
  .el-timeline {
    padding-left: 10px !important;
  }

  .el-timeline-item {
    padding-bottom: 1px !important;
  }

  .audit-remark {
    display: flex; // inline-block;
    padding: 5px 0;
    margin-right: 10px;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
