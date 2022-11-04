<template>
    <div
        class="app-container home"
        :style="{ height: innerHeight - 84 + 'px' }"
    >
        <div class="countList">
            <div class="total">
                <div class="left">
                    <i class="el-icon-place total"></i>
                </div>
                <div class="right">
                    <span class="title">设备总数</span>
                    <span class="value">
                        <count-to
                            :start-val="0"
                            :end-val="lastdata.total"
                            :duration="1800"
                            class="card-panel-num"
                        />
                    </span>
                </div>
            </div>
            <div class="online">
                <div class="left">
                    <i class="el-icon-location online"></i>
                </div>
                <div class="right">
                    <span class="title">近期已巡检</span>
                    <span class="value">
                        <count-to
                            :start-val="0"
                            :end-val="lastdata.online"
                            :duration="1800"
                            class="card-panel-num"
                        />
                    </span>
                </div>
            </div>
            <div class="offline">
                <div class="left">
                    <i class="el-icon-location-outline offline"></i>
                </div>
                <div class="right">
                    <span class="title">近期未巡检</span>
                    <span class="value">
                        <count-to
                            :start-val="0"
                            :end-val="lastdata.offline"
                            :duration="1800"
                            class="card-panel-num"
                        />
                    </span>
                </div>
            </div>
        </div>
        <div class="content">
            <img src="../assets/images/bg.jpg" />
        </div>
    </div>
</template>

<script>
import CountTo from "vue-count-to";
import { listData } from "@/api/dpis/rfidcardcount";
export default {
    name: "Index",
    data() {
        return {
            innerHeight: window.innerHeight,
            queryParams: {},
            lastdata: {
                online:0,
                offline:0,
                total:0
            },
            queryParams: {
                pageNum: 1,
                pageSize: 1,
            },
        };
    },
    components: {
        CountTo,
    },
    methods: {
        goTarget(href) {
            window.open(href, "_blank");
        },
        getList() {
            listData(this.queryParams).then((response) => {
                this.lastdata = response.rows[0];
                console.log(this.lastdata)
            });
        },
    },
    mounted(){
        this.getList();
    },
};
</script>

<style scoped lang="scss">
.app-container {
    display: flex;
    //   justify-content: center;
    //   align-items: center;
    flex-direction: column;
    padding: 20px 150px 0px;
    background: #f2f2f2;
    .content {
        width: 100%;
        padding: 10px;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        img {
            width: 100%;
        }
    }
}
.countList {
    height: 100px;
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    & > div {
        flex: 1;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-radius: 1px;
        display: flex;
        transition: all 0.5s;
        &:not(:last-child) {
            margin-right: 10px;
        }
        .left {
            flex: 1;
            transition: all 0.5s;
            padding: 20px 0 0 20px;
            i {
                transition: all 0.5s;
                // font-weight: bold;
                text-align: center;
                line-height: 60px;
                width: 60px;
                height: 60px;
                background: #fff;
                font-size: 38px;
                border-radius: 2px;
                &.total {
                    color: #36a3f7;
                }
                &.online {
                    color: #05cb05;
                }
                &.offline {
                    color: #828683;
                }
            }
        }
        .right {
            width: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .title {
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 19px;
                color: rgba(0, 0, 0, 0.45);
                margin-bottom: 10px;
                font-weight: bold;
            }
            .value {
                font-size: 23px;
                text-align: center;
                color: #666;
            }
        }

        &:hover {
            box-shadow: 2px 2px 38px rgba(0, 0, 0, 0.1);
            .left {
                i {
                    color: #fff;
                    &.total {
                        background: #36a3f7;
                    }
                    &.online {
                        background: #05cb05;
                    }
                    &.offline {
                        background: #828683;
                    }
                }
            }
        }
    }
}
</style>
