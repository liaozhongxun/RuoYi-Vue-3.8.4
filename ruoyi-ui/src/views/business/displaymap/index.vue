<template>
  <div>
    <div id="container" :style="{ height: innerHeight + 'px' }"></div>
  </div>
</template>

<script>
import redIco from "../../../assets/images/MAP/red.png";
import greenIco from "../../../assets/images/MAP/green.png";
import blueIco from "../../../assets/images/MAP/blue.png";
import blackIco from "../../../assets/images/MAP/black.png";
export default {
  data() {
    return {
      innerHeight: window.innerHeight - 85,
      map: null,
      massMarks:null,
      InfoWindow: null,
      mapDatas:[],
      deviceList: [
        {
          id: 1,
          lat: 26.059955,
          lng: 119.25148,
          connstate: "离线",
          name: "220防雷箱1",
          dname: "220防雷箱d1",
        },
        {
          id: 2,
          lat: 26.646715,
          lng: 119.538391,
          connstate: "在线",
          name: "220防雷箱2",
          dname: "220防雷箱d2",
        },
        {
          id: 3,
          lat: 25.821264,
          lng: 119.171526,
          connstate: "离线",
          name: "220防雷箱3",
          dname: "220防雷箱d3",
        },
        {
          id: 4,
          lat: 34.736848,
          lng: 113.589274,
          connstate: "离线",
          name: "220防雷箱4",
          dname: "220防雷箱d4",
        },
      ],
    };
  },
  methods: {
    listItem(item) {
        //地图海量点标记数据配置
        return {
            lnglat: [item.lng, item.lat],
            name: item.name,
            // d_name: dname[0],
            // d_code: dname[1],
            dname: this.devSplit(item.dname),
            id: item.id,
            conn: item.connstate,
            style: this.setStyle(item.connstate),
            // type: item.type
        };
    },
    setStyle(conn) {
        switch (conn) {
            case "在线":
                return 0;
                break;
            case "离线":
                return 1;
                break;
            case "告警":
                return 2;
                break;
            case "异常":
                return 3;
                break;
        }
    },
    devSplit(name) {
        let dname = name.split(",");
        let dname_arr = [];
        for (let i in dname) {
            dname_arr.push(dname[i].split("_"));
        }
        return dname_arr;
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
      let icoPath = [greenIco,blackIco,blueIco,redIco];
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
      info.push(e.dname[0])

      this.InfoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(17, -7),
          content: info.join("<br/>") //使用默认信息窗体框样式，显示信息内容
      });

      this.InfoWindow.setPosition(lnglat);
      this.InfoWindow.open(this.map);
    }
  },
  mounted() {
    this.deviceList.forEach((item)=>{
      if(!item.lng||!item.lat) return;
      this.mapDatas.push(
          this.listItem(item)
      );
    })
    this.init();
  },
};
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100px;
}
</style>
