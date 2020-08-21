/**
 * 模板请求api
 */
export class FileApi {
    constructor(vue) {
        this.vue = vue;
    }
    /**
     * 获取模板信息
     * @param {*} templateId 
     */
    getTemplateFile(templateId, title) {
        this.vue.$httpUtil.export({
            url: "/file/downloadTemp.json?fileId=" + templateId,
            title: title,
            contentType: "form"
        });
    }
}