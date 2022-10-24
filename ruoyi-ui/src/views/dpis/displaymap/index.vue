<template>
  <div class="mapwarp">
    <div class="layerbox" @mouseleave="outstate">
      <div class="layerbox_item">
        <div class="item btn" :class="{active:selectIndex == 'online'}" @click="getListByState('online')"><span class="iconfont el-icon-location"></span>已巡检 <span>{{countList.online}}</span></div>
        <div class="item btn" :class="{active:selectIndex == 'offline'}" @click="getListByState('offline')"><span class="iconfont el-icon-location-outline"></span>未巡检 <span>{{countList.offline}}</span></div>
        <div class="item"><span class="iconfont el-icon-place"></span>总数 <span>{{countList.total}}</span></div>
      </div>
      <div class="layerbox_cardList" v-show="stateCardList.length > 0">
          <div class="list">
            <div class='item' v-for="item in stateCardList" :key="item.id" @click="goCard(item)">
                <div class="name">{{item.name}}</div>
                <div class="code">{{item.code}}</div>
            </div>
          </div>
      </div>
    </div>
    <div class="change_day">
      <el-date-picker clearable
        v-model="day"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="请选择采集时间">
      </el-date-picker>
    </div>
    <div id="container" :style="{ height: innerHeight + 'px' }"></div>
  </div>
</template>

<script>
import redIco from "../../../assets/images/MAP/red.png";
import greenIco from "../../../assets/images/MAP/green.png";
import blueIco from "../../../assets/images/MAP/blue.png";
import blackIco from "../../../assets/images/MAP/black.png";
import { listRfidcard,listData,queryCount,showOnOfline} from "@/api/dpis/displaymap";
export default {
  data() {
    return {
      innerHeight: window.innerHeight - 85,
      updateCardList:[],
      updateTime:null,
      day:new Date().toLocaleDateString().replace(/\//g,'-'),
      map: null,
      massMarks:null,
      InfoWindow: null,
      mapDatas:[],
      deviceList: [],
      centLat:0,
      centLng:0,
      countList:{
        online:0,
        offline:0,
        total:0
      },
      stateCardList:[],
      selectIndex:null
    };
  },
  watch:{
    day(newV,oldV){
      this.getList();
      this.getMachineCount();
      if(new Date().toLocaleDateString().replace(/\//g,'-') == newV){
        this.updateTime = setInterval(()=>{
          this.getUpList();
          this.getMachineCount();
        },7000)
      }else{
        clearInterval(this.updateTime)
      }
    }
  },
  beforeDestroy(){
    if(this.updateTime){
      clearInterval(this.updateTime);
    }
  },
  methods: {
    outstate(){
        this.selectIndex = null;
        this.stateCardList = [];
    },
    goCard(item){
        let lnglat = new AMap.LngLat(item.lng, item.lat);
        this.map.setCenter(lnglat);
        // this.map.panTo(lnglat)
        this.map.setZoom(16);
        this.deviceList.forEach((data)=>{
            if (data.code == item.code) {
                item.lnglat = [data.lng,data.lat];
                item.conn = data.connstate;
            }
        })

        // setTimeout(()=>{
            // this.creatDialog(item)
        // },2000)

        lnglat = null;
    },
    getListByState(state){
        this.selectIndex = state;
        showOnOfline({gatherTime:this.day,type: state}).then(response => {
            this.stateCardList = response.data;
        })
    },
    /** 查询RFID卡列表 */
    getList() {
      listRfidcard({pageNum: 1,pageSize: 10000}).then(response => {
        this.deviceList = response.rows;
        this.centLng = 0;
        this.centLat = 0;
        this.deviceList.forEach((item,index)=>{
            this.centLng += item.lng;
            this.centLat += item.lat;
        })

        this.centLng = this.centLng/response.total;
        this.centLat = this.centLat/response.total;


        // setTimeout(() => {
        //     let lnglat = new AMap.LngLat(26.33, 119.22);
        //     this.map.setCenter(lnglat);
        // }, 2000);


        this.getUpList();
        // this.init();
      });
    },
    /** 查询采集数据列表 */
    getUpList() {
      listData({pageNum: 1,pageSize: 10000,gatherTime:this.day,type:"1"}).then(response => {
        this.updateCardList = response.rows;
        this.deviceList.forEach((item)=>{
          item.gatherChangeTime=[];
          this.updateCardList.forEach((upi)=>{
            if(item.code == upi.code){
              item.connstate = '1';
              item.gatherChangeTime.push(upi.gatherTime);
            }
          })
        })

        this.showCard();
      });
    },
    /** 采集统计 */
    getMachineCount(){
      queryCount({gatherTime: this.day}).then(response => {
        this.countList = response.data;
      });
    },
    showCard(){
      this.mapDatas = [];
      this.deviceList.forEach((item)=>{
        if(!item.lng||!item.lat) return;
        item.connstate = item.connstate || "0";
        this.mapDatas.push(
            this.listItem(item)
        );
      })

      //   this.setMarkers();
      this.init();
    },
    listItem(item) {
        //地图海量点标记数据配置
        return {
            lnglat: [item.lng, item.lat],
            name: item.name,
            id: item.cardId,
            conn: item.connstate,
            style: this.setStyle(item.connstate),
            code: item.code,
            gatherTime: item.gatherChangeTime,

            // type: item.type
        };
    },
    setStyle(conn) {
        switch (conn) {
            case "0":
                return 0;
                break;
            case "1":
                return 1;
                break;
        }
    },
    init() {
      this.map = new AMap.Map("container", {
        // viewMode: "3D", //是否为3D地图模式
        zoom: 10, //初始化地图级别
        center: [ this.centLng, this.centLat], //初始化地图中心点位置
        resizeEnable: true,
      });
      AMap.plugin(["AMap.ToolBar"], () => {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        this.map.addControl(
          new AMap.ToolBar({
            // 简易缩放模式，默认为 false
            liteStyle: true,
            offset: new AMap.Pixel(17, 150),
          })
        );
      });
      this.setMarkers();
    },
    setMarkers() {
      let that = this;
      let icoPath = [blackIco,greenIco,blueIco,redIco];
      let style = [];
      for (let i = 0; i < icoPath.length; i++) {
        let Size = new AMap.Size(32, 32);
        let Url = icoPath[i];
        style.push({
          url: Url,
          size: Size,
          // anchor: new AMap.Pixel(13, 8),
        });
      }

    //   if (this.massMarks) {
    //     this.massMarks.remove();
    //   }
      this.massMarks = new AMap.MassMarks(this.mapDatas, {
        opacity: 1,
        zIndex: 999,
        cursor: "pointer",
        style: style,
      });
      this.massMarks.on("click", function (e) {
        that.creatDialog(e);
      });
      this.massMarks.setMap(this.map);
    },
    creatDialog(e){
      if (e.data) {
          e = e.data;
      } else {
          e = e;
      }
      /*信息窗体*/
      let lnglat = new AMap.LngLat(e.lnglat[0], e.lnglat[1]);


      let info = [];
      this.map.setCenter(lnglat);
      // info.push(e.name)
      info.push("<div class='input-card content-window-card'><div><img style=\"float:left;width:67px;height:16px;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div><br> ")
      info.push(`<div class='input-item' style='margin:0;'>卡名：${e.name}</div>`);
      info.push(`<div class='input-item' style='margin:0;'>卡号：${e.code}</div>`);
      info.push(`<div class='input-item' style='margin:0;'>巡检状态：${e.conn=='0'?'未巡检':'<span style="color:green">已巡检</span>'}</div>`);
      info.push(`<div class='input-item' style='margin:0;'>巡检时间：${e.conn=='0'? '无':e.gatherTime}</div></div></div>`)

      this.InfoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(17, -7),
          content: info.join(""), //使用默认信息窗体框样式，显示信息内容
      });

      this.InfoWindow.setPosition(lnglat);
      this.InfoWindow.open(this.map);
    }
  },
  mounted() {
    this.getList();
    this.getMachineCount();
    // this.updateTime = setInterval(()=>{
    //   this.getUpList();
    // },7000)
  },
};
</script>

<style lang="scss" scoped>
.mapwarp{
  position: relative;
  .change_day{
    position: absolute;
    top:10px;
    right:10px;
    background: #fff;
    z-index: 999;
  }
  .layerbox {
    position: absolute;
    top:10px;
    left:10px;
    z-index: 999;
    user-select: none;
    .layerbox_item{
      background: #fff;
      box-shadow: 0 2px 2px rgba(0,0,0,.15);
      border-radius: 3px;
      padding: 14px 10px 13px;
      background: rgba(255,255,255,.9);
      border-radius: 3px;
      height: 45px;

      .btn{
          cursor: pointer;
      }
      .item{
        float: left;
        height: 18px;
        padding: 0 12px;
        font-size: 12px;
        vertical-align: middle;
        // cursor: pointer;
        overflow: visible;
        zoom: 1;
        color: #5f6477;
        line-height: 18px;
        &:not(:first-child){
          border-left: 1px #dbdee2 dashed;
        }
        &.btn:hover{
          color:rgb(176,179,192)
        }
        &.btn.active{
          color:rgb(176,179,192)
        }
        span{
          font-weight: bold;
        }
        .iconfont{
          font-size: 16px;
          margin-right: 5px;
          position: relative;
          top:1px;
          // &.el-icon-location{
          //   color:#00ff00
          // }
        }
      }
    }
    .layerbox_cardList{
		margin-top:7px ;
        box-shadow: 0 2px 2px rgba(0,0,0,.15);
        border-radius: 3px;
        background: rgba(255,255,255,.8);
        padding: 10px;
        padding-right: 0;
        .list{
            max-height:400px;
            padding-right: 10px;
            overflow: auto;
            .item{
                padding:4px 12px;
                cursor: pointer;
                color: #5f6477;
                &:not(:last-child){
                    border-bottom: 1px dashed rgb(233, 227, 227);
                }
                padding-bottom: 10px;
                &:hover{
                    .code{
                        color: rgb(176,179,192);
                    }
                    .name{
                        color: rgb(176,179,192);
                    }
                }
                .code{
                    font-size: 14px;
                    color: #888;
                }
                .name{
                    font-size: 16px;

                }
            }
        }
        // min-height: 10px;
    }
  }
}
#container {
  width: 100%;
  height: 100px;
}
</style>
