<template>
    <section class="content">
        <div class="row center-block">
            <div class="form-horizontal">
                <div class="col-md-12">
                    <div class="box">
                        <div class="box-body">
                            <div class="dataTables_wrapper dt-bootstrap" id="example1_wrapper">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div id="example1_length" class="dataTables_length">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2"><span class="text-red">*</span>登录账号:</label>
                                            <div class="col-sm-6">
                                                <input type="text" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2"><span class="text-red">*</span>姓名:</label>
                                            <div class="col-sm-6">
                                                <input type="text" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2">职位:</label>
                                            <div class="col-sm-6">
                                                <input type="text" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2">手机:</label>
                                            <div class="col-sm-6">
                                                <input type="text" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2">email:</label>
                                            <div class="col-sm-6">
                                                <input type="email" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2"><span class="text-red">*</span>所属分站:</label>
                                            <div class="col-sm-2">
                                                <select class="form-control">
                                                    <option value="">分站1</option>
                                                    <option value="">分站2</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2">账号权限:</label>
                                            <div class="col-sm-8">
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" name="checkboxgroup1" value="全部" />全部</label>
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" name="checkboxgroup1" value="上架" />上架</label>
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" name="checkboxgroup1" value="下架" />下架</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <div class="col-sm-offset-2 col-sm-10">
                                            <router-link to="/settings/employee/list">
                                                <input type="button" class="btn btn-default" value="返回" />
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
