import { Loading } from "element-ui";

let loadingCount = 0;
let loading;

const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: "请求处理中...",
    // background: 'transparent',
    background: "rgba(0, 0, 0, 0.3)",
    customClass: "mask-fullscreen",
    target: document.querySelector("div.root-container") //执行遮罩层影响范围
  });
};

const endLoading = () => {
  loading.close();
};

export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
  }
  loadingCount += 1;
};

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};
