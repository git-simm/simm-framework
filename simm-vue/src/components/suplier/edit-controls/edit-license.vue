<template>
  <section>
    <el-form :model="formData" ref="formData" label-width="140px" class="demo-ruleForm">
      <el-row>
        <el-col :span="20">
          <h4 class="text-theme">证照信息</h4>
        </el-col>
        <!-- 上传营业执照 -->
        <el-col :span="20">
          <p class="upload-cj-txt">
            <span style="color:red;">*</span>请上传营业执照：
          </p>
        </el-col>
        <el-col :span="24" class="uploader-cj-size">
          <el-form-item>
            <sxh-uploader
              ref="businessLicenseImg"
              :limit="50"
              :maxSize="5"
              :fileList="formData.businessLicensePicList"
              @change="list=>{
                      formData.businessLicensePicList = list;
                    }"
            ></sxh-uploader>
          </el-form-item>
        </el-col>
        <!-- 上传开户许可证 -->
        <el-col :span="20">
          <p class="upload-cj-txt">请上传开户许可证：</p>
        </el-col>
        <el-col :span="24" class="uploader-cj-size">
          <el-form-item>
            <sxh-uploader
              ref="accountLicenceImg"
              :limit="50"
              :maxSize="5"
              :fileList="formData.accountLicencePicList"
              @change="list=>{
                      formData.accountLicencePicList = list;
                    }"
            ></sxh-uploader>
          </el-form-item>
        </el-col>
        <!-- 上传法人身份证 -->
        <el-col :span="20">
          <p class="upload-cj-txt">
            <span style="color:red;">*</span>请上传法人身份证：
          </p>
        </el-col>
        <el-col :span="24" class="uploader-cj-size">
          <el-form-item>
            <sxh-uploader
              ref="juridicalPersonImg"
              :limit="50"
              :maxSize="5"
              :fileList="formData.juridicalPersonIDPicList"
              @change="list=>{
                      formData.juridicalPersonIDPicList = list;
                    }"
            ></sxh-uploader>
          </el-form-item>
        </el-col>
        <!--上传授权代理人（提款人）身份照片-->
        <el-col :span="20">
          <p class="upload-cj-txt">
            <span style="color:red;">*</span>请上传授权代理人（提款人）身份证照片：
          </p>
        </el-col>
        <el-col :span="24" class="uploader-cj-size">
          <el-form-item>
            <sxh-uploader
              ref="identityCardImg"
              :limit="50"
              :maxSize="5"
              :fileList="formData.identityCardPicList"
              @change="list=>{
                      formData.identityCardPicList = list;
                    }"
            ></sxh-uploader>
          </el-form-item>
        </el-col>
        <!-- 上传其他证照 -->
        <el-col :span="20">
          <p class="upload-cj-txt">其他证照：食品经营许可证、免税证明、注册商标证书、其他经营许可证</p>
        </el-col>
        <el-col :span="24" class="uploader-cj-size">
          <el-form-item>
            <sxh-uploader
              ref="businessImg"
              :limit="50"
              :maxSize="5"
              :fileList="formData.businessPicList"
              @change="list=>{
                      formData.businessPicList = list;
                    }"
            ></sxh-uploader>
          </el-form-item>
        </el-col>
        <!-- 上传合同 -->
        <el-col :span="20">
          <p class="upload-cj-txt">上传合同：</p>
        </el-col>
        <el-col :span="24" class="uploader-cj-size">
          <!-- prop="contractPic" -->
          <el-form-item>
            <sxh-uploader
              ref="contractImg"
              :limit="50"
              :maxSize="5"
              :fileList="formData.contractPicList"
              @change="list=>{
                      formData.contractPicList = list;
                    }"
            ></sxh-uploader>
          </el-form-item>
        </el-col>
        <!-- 上传保证金凭证 -->
        <div
          v-show="entity.isAgent==1 || entity.is_direct_purchasing===1 || entity.process_status===3"
        >
          <el-col :span="20">
            <p class="upload-cj-txt">请上传保证金凭证：</p>
          </el-col>
          <el-col :span="24" class="uploader-cj-size">
            <el-form-item>
              <sxh-uploader
                ref="bailEvidenceImg"
                :multiple="false"
                :fileList="formData.bailEvidencePicList"
                @change="list=>{
              formData.bailEvidencePicList = list;
            }"
              ></sxh-uploader>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import EditLicenseHandler from "./edit-license-handler.js";
import EditCommonHandler from "./edit-common-handler.js";
export default {
  name: "EditLicense",
  mixins: [EditLicenseHandler, EditCommonHandler],
  props: {
    baseData: {},
    entity: {}
  },
  //方法列表
  methods: {
    /**
     * 初始化
     * @param {*} data
     * @param {*} compProp
     */
    initData(data, compProp) {
      this.baseInitData(data, compProp);
      if (this.baseData.mode != "add") {
        var self = this;
        //图片初始化
        self.$refs.businessLicenseImg.updatePicList(
          data,
          self.formData.businessLicensePicList
        );
        self.$refs.accountLicenceImg.updatePicList(
          data,
          self.formData.accountLicencePicList
        );
        self.$refs.identityCardImg.updatePicList(
          data,
          self.formData.identityCardPicList
        );
        self.$refs.juridicalPersonImg.updatePicList(
          data,
          self.formData.juridicalPersonIDPicList
        );
        self.$refs.businessImg.updatePicList(
          data,
          self.formData.businessPicList
        );
        self.$refs.contractImg.updatePicList(
          data,
          self.formData.contractPicList
        );
        self.$refs.bailEvidenceImg.updatePicList(
          data,
          self.formData.bailEvidencePicList
        );
      }
    },
    exec(cmd) {
      //只提交图片信息
      //this.$emit(cmd, this.getImgData());
    }
  }
};
</script>
