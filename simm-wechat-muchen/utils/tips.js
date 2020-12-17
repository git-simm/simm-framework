// utils/tips.js
import tips from 'wx-tips';
export default tips.getInstance({
  errorIconPath: '/images/icons/useHelp.png', // 错误提示图片路径  必须提供
  alertIconPath: '/images/icons/useHelp.png', // alert提示图片路径 必须提供
  loadingMode: 'Loading' // 选项 NavigationBarLoading|Loading
});