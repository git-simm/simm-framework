/**
 * 食享会组件库
 */
import sxhLog from "./log/sxh-log-list";
import sxhDropdown from "./menu/sxh-dropdown";
import sxhDate from "./date/sxh-date";
import sxhDatePicker from "./date/sxh-date-picker";
import sxhTable from "./table/sxh-table";
import sxhCheckboxGroup from "./form/sxh-checkbox-group";
import sxhCategory from "./form/sxh-category";
import sxhCity from "./form/sxh-city";
import sxhCityMulti from "./form/sxh-city-multi";
import sxhInputNumber from "./form/sxh-input-number";
import sxhUploader from "../sgumanager/controls/img-uploader";
import sxhVideoUploader from "./video/sxh-video-uploader";
import fileUploader from "../suplier/notice/controls/file-uploader";
import sxhBank from "./bank/sxh-bank";
import sxhProcess from "./business/sxh-process";
import sxhSkuStock from "./business/stock/sxh-sku-stock";
import sxhImgStore from "./img/sxh-img-store";
import sxhCropper from "./img/sxh-cropper";
import sxhDetailView from "./view/sxh-detail-view";
import sxhPurchaseChart from "./charts/sxh-purchase-chart";
import sxhSguChart from "./charts/sxh-sgu-chart";
import prodAnalysisChart from "./charts/prod-analysis-chart";
//import drawer from "./drawer/index.js";
import sxhExcelImport from "./file/sxh-excel-import";
import sxhPopover from "./file/sxh-popover";
//流程定义
import sxhProcessDef from "./business/process/sxh-process-def";
import sxhViewContainer from "./container/sxh-view-container";
import sxhViewItem from "./container/sxh-view-item";
//帮助中心
import sxhHelp from '@/components/shixh/help/sxh-help';
import sxhHelpDetail from '@/components/shixh/help/sxh-help-detail';
//es检索面板
import skuCheck from '@/components/shixh/business/spu/sku-check';
import skuEsSearch from '@/components/shixh/business/spu/sku-es-search';

const components = {
  sxhDropdown,
  sxhDate,
  sxhTable,
  sxhUploader,
  sxhVideoUploader,
  sxhBank,
  sxhImgStore,
  sxhCropper,
  sxhCheckboxGroup,
  sxhCategory,
  sxhCity,
  sxhCityMulti,
  sxhInputNumber,
  fileUploader,
  sxhDatePicker,
  sxhProcess,
  sxhSkuStock,
  sxhDetailView,
  sxhExcelImport,
  sxhProcessDef,
  sxhPopover,
  sxhLog,
  sxhPurchaseChart,
  sxhViewContainer,
  sxhViewItem,
  sxhHelp,
  sxhHelpDetail,
  skuCheck,
  skuEsSearch,
  prodAnalysisChart,
  sxhSguChart,
};

const install = function (Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;
  for (var i in components) {
    var component = components[i];
    Vue.component(component.name, component);
  }
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  ...{
    version: "1.0.0",
    install
  }, ...components
};
