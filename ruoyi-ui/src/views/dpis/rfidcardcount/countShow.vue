<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="巡检时间">
                <el-date-picker
                    v-model="daterangeGatherTime"
                    style="width: 240px"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
            </el-form-item>
        </el-form>

        <el-table
            v-loading="loading"
            :data="dataList"
        >
            <el-table-column
                label="巡检日期"
                align="center"
                prop="gatherTime"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{
                        parseTime(
                            scope.row.gatherTime,
                            "{y}-{m}-{d}"
                        )
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总数" align="center" prop="total" />
            <el-table-column label="已巡检" align="center" prop="online" />
            <el-table-column label="未巡检" align="center" prop="offline" />
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import { listData } from "@/api/dpis/rfidcardcount";

export default {
    name: "Data",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 采集数据表格数据
            dataList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 采集时间时间范围
            daterangeGatherTime: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                code: null,
                ctype: null,
                cdata: null,
                gatherTime: null,
            },
            // 表单参数
            form: {},
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询采集数据列表 */
        getList() {
            this.loading = true;
            this.queryParams.params = {};
            if (
                null != this.daterangeGatherTime &&
                "" != this.daterangeGatherTime
            ) {
                this.queryParams.params["beginGatherTime"] =
                    this.daterangeGatherTime[0];
                this.queryParams.params["endGatherTime"] =
                    this.daterangeGatherTime[1];
            }
            listData(this.queryParams).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
    },
};
</script>
