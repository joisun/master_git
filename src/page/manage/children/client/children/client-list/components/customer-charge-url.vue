<script>
import filterQueryParams from "@/global/function/filterQueryParams";

const DEFAULT_FORM_DATA = JSON.stringify({
    domain: "",
});
export default {
    data() {
        return {
            content: {},
            tableData: [],
            formData: JSON.parse(DEFAULT_FORM_DATA),
            visible: false,
        };
    },
    methods: {
        validateDomain(rule, value, callback) {
            if (!value) {
                callback(new Error("续费域名不能为空"));
                return;
            }

            // Remove protocol and path if present
            let domain = value.replace(/^https?:\/\//, "").split("/")[0];
            const domainRegex =
                /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

            try {
                // Always try to convert to valid domain format first
                domain = domain
                    .toLowerCase()
                    .replace(/[^a-z0-9.-]/g, "")
                    .replace(/^[.-]+|[.-]+$/g, "");

                if (domainRegex.test(domain)) {
                    // Check for duplicates in tableData
                    const isDuplicate = this.tableData.some(
                        (item) => item.domain === domain
                    );
                    if (isDuplicate) {
                        callback(new Error("该域名已存在，请输入其他域名"));
                        return;
                    }

                    this.formData.domain = domain; // Update with converted domain
                    callback();
                } else {
                    callback(new Error("请输入有效的域名格式"));
                }
            } catch (error) {
                callback(new Error("请输入有效的域名格式"));
            }
        },
        cancel() {
            this.formData = JSON.parse(DEFAULT_FORM_DATA);
            this.$refs.form.resetFields();
            this.visible = false;
        },
        open(content) {
            this.content = content;
            this.getList();
            this.visible = true;
        },
        async getList() {
            const res = await this.jaxLib.international.distributionConfigQuery(
                {
                    orgId: this.content.id,
                }
            );
            if (res && res.success) {
                this.tableData = res.data;
            }
        },
        async submit() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    const res =
                        await this.jaxLib.international.distributionConfigAdd({
                            orgId: this.content.id,
                            domain: this.formData.domain,
                        });
                    if (res && res.success) {
                        this.$message({ type: "success", message: "操作成功" });
                        this.formData = JSON.parse(DEFAULT_FORM_DATA);
                        this.$refs.form.resetFields();
                        this.getList();
                    }
                }
            });
        },
    },
};
</script>

<template>
    <el-dialog
        :visible.sync="visible"
        title="客户收款域名设置"
        :close-on-click-modal="false"
        :before-close="cancel"
    >
        <el-card
            header="新增收款域名"
            shadow="never"
            style="margin-bottom: 20px"
        >
            <el-form ref="form" :model="formData">
                <el-form-item
                    label="H5续费域名"
                    :rules="[
                        { required: true, message: '续费域名不能为空' },
                        { validator: validateDomain, trigger: 'blur' },
                    ]"
                    prop="domain"
                >
                    <el-input type="text" v-model="formData.domain" />
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit">新增</el-button>
        </el-card>

        <el-card header="当前已配置收款域名" shadow="never">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column
                    prop="index"
                    label="序号"
                    width="80"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="domain" label="域名" />
                <el-table-column
                    prop="status"
                    label="状态"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">有效</span>
                        <span v-else>无效</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </el-dialog>
</template>
