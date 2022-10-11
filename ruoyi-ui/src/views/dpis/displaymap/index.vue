<template>
  <div class="mapwarp">
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
import { listRfidcard,listData } from "@/api/dpis/displaymap";
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
      deviceList: [

      ],
    };
  },
  watch:{
    day(newV,oldV){
      console.log(newV,oldV);
      this.getList();
      if(new Date().toLocaleDateString().replace(/\//g,'-') == newV){
        this.updateTime = setInterval(()=>{
          this.getUpList();
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
    /** 查询RFID卡列表 */
    getList() {
      listRfidcard({pageNum: 1,pageSize: 10000}).then(response => {
        this.deviceList = response.rows;
        this.getUpList();
        this.init();
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
    showCard(){
      console.log(this.deviceList)
      this.mapDatas = [];
      this.deviceList.forEach((item)=>{
        if(!item.lng||!item.lat) return;
        item.connstate = item.connstate || "0";
        this.mapDatas.push(
            this.listItem(item)
        );
      })

      this.setMarkers();
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
        zoom: 9, //初始化地图级别
        // center: ["113.589274","34.736848"], //初始化地图中心点位置
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

      // console.log(this.mapDatas)
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
      console.log(e)
      if (e.data) {
          e = e.data;
      } else {
          console.log('没有data')
          e = e;
      }
      /*信息窗体*/
      let lnglat = new AMap.LngLat(e.lnglat[0], e.lnglat[1]);
      console.log(lnglat)


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
    this.updateTime = setInterval(()=>{
      this.getUpList();
    },7000)
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
}
#container {
  width: 100%;
  height: 100px;
}
</style>
