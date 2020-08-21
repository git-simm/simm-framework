<template>
  <section class="content-section adjust_remark">
    <h2>类目调整工具说明</h2>
    <ul>
      <li>
          <h4>特别注意：</h4>
          <ol>
              <li>
                  1、类目调整涉及到大量业务数据的刷新，建议在
                  <span class="important">21：00点以后</span>执行操作；
              </li>
              <li>
                  2、类目属于基础数据，
                  <span class="important">
              涉及团购自提、团购包邮、直购、代理商4部分业务，
              贯穿SPU、SKU、商品、上架、下单、拣货、发货、报表统计整个过程，调整需谨慎。
            </span>建议提前与直购、代理商业务与产品经理进行沟通。
              </li>
          </ol>
      </li>
      <li>
          <el-divider></el-divider>
          <h4>类目调整说明：</h4>
        <ol>
            <li>1、如需修改一级类目，点击 进行修改，修改类目名称的同时相关的SPU、SKU中类目名字将一起更新；</li>
            <li>
                2、如需迁移二级或三级类目，只能同级迁移，比如二级类目换父级类目，只能选择一级类目作为父级。同理，三级类目只能选择二级类目作为父级。
                <ol class="darkmagenta">
                    <li>SPU、SKU表的刷新：类目切换了父级后，需要同步更新掉SPU、SKU中存储的类目ID</li>
                    <li>SGU搜索引擎表的刷新：二级类目切换父级后，引擎数据同步刷新，保证小程序查询无误</li>
                    <li>类目、商品售后时效的刷新：类目切换了父级后，需要根据新父级类目的售后时效刷新迁移的(二级、三级)类目的售后时效信息，同时刷新所有受影响的类目所关联商品的售后时效，并更新系统redis缓存
                    </li>
                    <li>供应商追加经营类目：二级类目切换父级后，它们关联的商品所对应的供应商需要将新父级类目加入自己的经营类目中</li>
                </ol>
            </li>
          <li>
                3、如需导入批量SPU到指定的三级类目中
            <ol class="darkmagenta">
              <li>SPU、SKU表的刷新：SPU导入到新三级类目后，需要同步更新掉SPU、SKU中存储的类目ID</li>
              <li>SGU搜索引擎表的刷新：SPU导入到新三级类目后，引擎数据同步刷新，保证小程序查询无误</li>
              <li>商品售后时效的刷新：SPU导入到新三级类目后，需要根据新三级类目的售后时效刷新SPU所关联商品的售后时效，并更新系统redis缓存</li>
              <li>供应商追加经营类目：SPU导入到新三级类目后，它们关联的商品所对应的供应商需要将新父级类目加入自己的经营类目中</li>
              <li>建议：1、请先在SPU管理页面点击【导出】按钮，导出需要操作的的SPU列表；2、导出后上传时，"SPU编码"为必填信息；3、只能上传xlx/xlsx文件；4、一次导入SPU数量最多200条</li>
            </ol>
          </li>
            <li>4、关于类目调整的任何操作，系统会记录全部日志，在【指令管理】里进行查看，如在执行过程中出现异常阻断，可以进入【指令管理】页签针对失败的指令执行【重试】。
                失败的指令在锁定状态时，不允许再针对该类目做新的调整指令。
            </li>
            <li>
                5、变更后，请及时告知相关人员，确保信息及时透明
                <ol class="darkmagenta">
                    <li>一级类目调整或新增，需告知管理员配置新的类目账号管理权限及个城市仓库主管（涉及到拣货、发货操作）</li>
                    <li>二级类目调整或新增，需告知各城市运营人员，配置营销类目</li>
                    <li>任何类目调整，请告知直购及代理商业务对接人</li>
                </ol>
            </li>
            <li>6、为保证技术侧及时了解类目变更的操作，系统会在类目新增、重命名、迁移时发送邮件给技术部采购组；</li>
        </ol>
      </li>
    </ul>
  </section>
</template>
<style lang="less">
.adjust_remark {
  .important {
    font-size: larger;
    font-weight: bolder;
    color: #f7497e;
  }
  h2 {
    text-align: center;
  }
  ul {
      // list-style: korean-hanja-informal;
      list-style: none;
    font-size: 14px;
    ol {
        // list-style: square;
        list-style: none;
        // font-style: italic;
        // color: darkmagenta;
    }

      .darkmagenta {
      list-style: square;
      color: darkmagenta;
    }
    li {
      line-height: 30px;
    }
  }
}
</style>