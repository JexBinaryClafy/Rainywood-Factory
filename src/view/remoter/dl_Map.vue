<template>
  <div class="mask" v-show="showDialog">
    <div class="dialog" style="width:1300px;">
      <div class="dialog-header">
        <div class="title pos-left">{{dialogTitle}}</div>
        <ul class="tools pos-right">
          <li class="item">
            <button class="btn" type="button" @click="closeDialog">
              <i class="icon icon-close"></i>
            </button>
          </li>
        </ul>
      </div>
      <div class="dialog-body scroll" style="background:#081526;">
        <div class="col xs-8">
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">监管单位信息</span>
            </div>
            <div class="box-body">
              <div class="abs">
                <h1>{{basicData.MC}}</h1>
                <h2>所处位置：{{basicData.SSQH}}</h2>
                <h2>该单位消防安全负责人：{{basicData.AQFZR || '暂无记录'}}，联系电话：{{basicData.PHONE || '暂无记录'}}</h2>
              </div>
              <ul class="towerlist">
                <li class="item">
                  <div class="title">安全评估得分</div>
                  <div class="subtitle num fg-cyan" :class="scoreColor">{{score}}</div>
                </li>
                <li class="item">
                  <div class="title">电压告警次数</div>
                  <div class="subtitle num fg-orange">{{DYCount}}</div>
                </li>
                <li class="item">
                  <div class="title">电流告警次数</div>
                  <div class="subtitle num fg-orange">{{DLCount}}</div>
                </li>
                <li class="item">
                  <div class="title">用水告警次数</div>
                  <div class="subtitle num fg-orange">{{YSCount}}</div>
                </li>
                <li class="item">
                  <div class="title">巡查隐患次数</div>
                  <div class="subtitle num fg-orange">{{YHCount}}</div>
                </li>
                <li class="item">
                  <div class="title">报警主机告警</div>
                  <div class="subtitle num fg-orange">{{BJCount}}</div>
                </li>
              </ul>
              <x-loading ref="loadingBasic" :show="showLoadingBasic"></x-loading>
            </div>
          </div>
        </div>
        <div class="col xs-4">
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">气象情况</span>
            </div>
            <div class="box-body scroll heightlmt">
              <div class="form">
                <div class="form-item">
                  <div class="label">当天环境气温</div>
                  <div class="field">{{weather.tmp}}</div>
                </div>
                <div class="form-item">
                  <div class="label">当天风力情况</div>
                  <div class="field">{{weather.wind_dir}}{{weather.wind_sc}}级</div>
                </div>
                <div class="form-item">
                  <div class="label">当天空气湿度</div>
                  <div class="field">{{weather.hum}}%</div>
                </div>
                <div class="form-item">
                  <div class="label">当天PM2.5数值</div>
                  <div class="field">{{weather.PMMin}}</div>
                </div>
                <div class="form-item">
                  <div class="label">当天PM10数值</div>
                  <div class="field">{{weather.PMMax}}</div>
                </div>
              </div>
              <x-loading ref="loadingWeather" :show="showLoadingWeather"></x-loading>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">部位电压告警记录</span>
            </div>
            <div class="box-body scroll heightlmt">
              <table class="dtable">
                <thead>
                  <tr>
                    <td>序号</td>
                    <td>隐患内容</td>
                    <td>隐患发现时间</td>
                    <td>隐患处理状态</td>
                  </tr>
                </thead>
                <tbody v-if="listDY.length>0">
                  <tr v-for="(item, index) in listDY" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                      <div
                        :title="item.detail == ''?'暂无详情':item.detail"
                      >{{item.detail == ''?'暂无详情':item.detail}}</div>
                    </td>
                    <td>
                      <div :title="item.time">{{item.time}}</div>
                    </td>
                    <td>
                      <div v-if="item.status ==0">未解决</div>
                      <div v-else>已解决</div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4">暂无告警内容</td>
                  </tr>
                </tbody>
              </table>
              <x-loading ref="loadingDY" :show="showLoadingDY"></x-loading>
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">部位电流告警记录</span>
            </div>
            <div class="box-body scroll heightlmt">
              <table class="dtable">
                <thead>
                  <tr>
                    <td>序号</td>
                    <td>隐患内容</td>
                    <td>隐患发现时间</td>
                    <td>隐患处理状态</td>
                  </tr>
                </thead>
                <tbody v-if="listDL.length>0">
                  <tr v-for="(item, index) in listDL" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                      <div
                        :title="item.detail == ''?'暂无详情':item.detail"
                      >{{item.detail == ''?'暂无详情':item.detail}}</div>
                    </td>
                    <td>
                      <div :title="item.time">{{item.time}}</div>
                    </td>
                    <td>
                      <div v-if="item.status ==0">未解决</div>
                      <div v-else>已解决</div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4">暂无告警内容</td>
                  </tr>
                </tbody>
              </table>
              <x-loading ref="loadingDL" v-if="showLoadingDL"></x-loading>
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">部位用水告警记录</span>
            </div>
            <div class="box-body scroll heightlmt">
              <table class="dtable">
                <thead>
                  <tr>
                    <td>序号</td>
                    <td>隐患内容</td>
                    <td>隐患发现时间</td>
                    <td>隐患处理状态</td>
                  </tr>
                </thead>
                <tbody v-if="listYS.length>0">
                  <tr v-for="(item, index) in listYS" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                      <div
                        :title="item.detail == ''?'暂无详情':item.detail"
                      >{{item.detail == ''?'暂无详情':item.detail}}</div>
                    </td>
                    <td>
                      <div :title="item.time">{{item.time}}</div>
                    </td>
                    <td>
                      <div v-if="item.status ==0">未解决</div>
                      <div v-else>已解决</div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4">暂无告警内容</td>
                  </tr>
                </tbody>
              </table>
              <x-loading ref="loadingYS" v-if="showLoadingYS"></x-loading>
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">人工上报消防隐患记录</span>
            </div>
            <div class="box-body scroll heightlmt">
              <table class="dtable">
                <thead>
                  <tr>
                    <td>序号</td>
                    <td>隐患内容</td>
                    <td>隐患发现时间</td>
                    <td>隐患处理状态</td>
                  </tr>
                </thead>
                <tbody v-if="listYH.length>0">
                  <tr v-for="(item, index) in listYH" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                      <div
                        :title="item.detail == ''?'暂无详情':item.detail"
                      >{{item.detail == ''?'暂无详情':item.detail}}</div>
                    </td>
                    <td>
                      <div :title="item.time">{{item.time}}</div>
                    </td>
                    <td>
                      <div v-if="item.status ==0">未解决</div>
                      <div v-else>已解决</div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4">暂无告警内容</td>
                  </tr>
                </tbody>
              </table>
              <x-loading ref="loadingYH" v-if="showLoadingYH"></x-loading>
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              <span class="title pos-left">报警主机告警记录</span>
            </div>
            <div class="box-body scroll heightlmt">
              <table class="dtable">
                <thead>
                  <tr>
                    <td>序号</td>
                    <td>隐患内容</td>
                    <td>隐患发现时间</td>
                    <td>隐患处理状态</td>
                  </tr>
                </thead>
                <tbody v-if="listBJ.length>0">
                  <tr v-for="(item, index) in listBJ" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                      <div
                        :title="item.detail == ''?'暂无详情':item.detail"
                      >{{item.detail == ''?'暂无详情':item.detail}}</div>
                    </td>
                    <td>
                      <div :title="item.time">{{item.time}}</div>
                    </td>
                    <td>
                      <div v-if="item.status ==0">未解决</div>
                      <div v-else>已解决</div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4">暂无告警内容</td>
                  </tr>
                </tbody>
              </table>
              <x-loading ref="loadingBJ" v-if="showLoadingBJ"></x-loading>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import axios from "axios";

export default {
  data() {
    return {
      basicData: {
        MC: null,
        SSQH: null,
        AQFZR: null,
        PHONE: null
      },
      weather: {
        tmp: 0,
        wind_sc: 0,
        hum: 0,
        PMMin: 0,
        PMMax: 0
      },
      score: 0,
      scoreColor: "",
      dialogTitle: "监管部位安全评估详情",
      showDialog: false,
      showLoadingBasic: false,
      showLoadingWeather: false,
      showLoadingDY: false,
      showLoadingDL: false,
      showLoadingYS: false,
      showLoadingYH: false,
      showLoadingBJ:false,
      DYCount: 0,
      DLCount: 0,
      YSCount: 0,
      YHCount: 0,
      BJCount: 0,
      listDY: [],
      listDL: [],
      listYS: [],
      listYH: [],
      listBJ:[],

      comId: !this.take ? null : this.take.comId,
      name: !this.take ? null : this.take.comName
    };
  },
  watch: {
    take(n, o) {
      this.comId = n.comId;
      this.comName = n.comName;
      this.showDialog = true;
      this.listDY = [];
      this.listDL = [];
      this.listYS = [];
      this.listYH = [];
      this.listBJ=[]
      this.query();
    },
    show(n, o) {
      this.showDialog = n;
    }
  },
  components: {
    "x-loading": Loading
  },
  props: {
    take: Object,
    show: Boolean
  },
  methods: {
    calcScore() {
      let result = 100;
      result =
        result - this.DYCount - this.DLCount - this.YSCount - this.YHCount - this.BJCount;
      if (result >= 80) {
        this.scoreColor = "fg-green";
      } else if (result < 80 && result >= 60) {
        this.scoreColor = "fg-orange";
      } else if (result < 60) {
        this.scoreColor = "fg-red";
      }
      return (result = result <= 0 ? 0 : result);
    },
    query(val) {
      this.comId = val?val.id:this.comId
      this.comName=val?val.comName:this.comName
      let params = {
        country: this.comName,
        indexDate:this.$parent.date
      };
      this.showDialog = true;
      this.listDY = [];
      this.listDL = [];
      this.listYS = [];
      this.listYH = [];
      this.listBJ = [];
      this.loadingBasic = true;
      axios
        .get(this.URLHEAD + "GetDetailed", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.basicData = data.Data[0];
          this.loadingBasic = false;
          this.score = this.calcScore();
          this.getWeatherData();
          this.getDYAlarms();
          this.getDLAlarms();
          this.getYSAlarms();
          this.getYHAlarms();
          this.getBJAlarms();
        });
    },
    getWeatherData() {
      let params = {
        countyName: this.basicData.SSQH,
        indexDate:this.$parent.date
      };
      this.loadingWeather = true;
      axios
        .get(this.URLHEAD + "QueryWeather", {
          params: params
        })
        .then(res => {
          this.weather = res.data.Data[0];
          this.loadingWeather = false;
        });
    },
    getDYAlarms() {
      let params = {
        mc: this.basicData.MC,
        type: "电压告警",
        indexDate:this.$parent.date
      };
      this.loadingDY = true;
      axios
        .get(this.URLHEAD + "GetGJDetaileNew", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.listDY = data.Data.gj;
          this.DYCount = data.Data.DYCount;
          this.DLCount = data.Data.DLCount;
          this.YSCount = data.Data.YSCount;
          this.YHCount = data.Data.YHCount;
          this.BJCount = data.Data.BJCount;
          this.score = this.calcScore();
          this.loadingDY = false;
        });
    },
    getDLAlarms() {
      let params = {
        mc: this.basicData.MC,
        type: "电流告警",
        indexDate:this.$parent.date
      };
      this.loadingDL = true;
      axios
        .get(this.URLHEAD + "GetGJDetaileNew", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.listDL = data.Data.gj;
          this.DYCount = data.Data.DYCount;
          this.DLCount = data.Data.DLCount;
          this.YSCount = data.Data.YSCount;
          this.YHCount = data.Data.YHCount;
          this.BJCount = data.Data.BJCount;
          this.score = this.calcScore();
          this.loadingDL = false;
        });
    },
    getYSAlarms() {
      let params = {
        mc: this.basicData.MC,
        type: "用水告警",
        indexDate:this.$parent.date
      };
      this.loadingYS = true;
      axios
        .get(this.URLHEAD + "GetGJDetaileNew", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.listYS = data.Data.gj;
          this.DYCount = data.Data.DYCount;
          this.DLCount = data.Data.DLCount;
          this.YSCount = data.Data.YSCount;
          this.YHCount = data.Data.YHCount;
          this.BJCount = data.Data.BJCount;
          this.score = this.calcScore();
          this.loadingYS = false;
        });
    },
    getYHAlarms() {
      let params = {
        mc: this.basicData.MC,
        type: "隐患巡查",
        indexDate:this.$parent.date
      };
      this.loadingYH = true;
      axios
        .get(this.URLHEAD + "GetGJDetaileNew", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.listYH = data.Data.gj;
          this.DYCount = data.Data.DYCount;
          this.DLCount = data.Data.DLCount;
          this.YSCount = data.Data.YSCount;
          this.YHCount = data.Data.YHCount;
          this.BJCount = data.Data.BJCount;
          this.score = this.calcScore();
          this.loadingYH = false;
        });
    },
    getBJAlarms(){
      let params = {
        mc: this.basicData.MC,
        type: "报警主机",
        indexDate:this.$parent.date
      };
      this.loadingBJ = true;
      axios
        .get(this.URLHEAD + "GetGJDetaileNew", {
          params: params
        })
        .then(res => {
          let data = res.data;
          this.listBJ = data.Data.gj;
          this.DYCount = data.Data.DYCount;
          this.DLCount = data.Data.DLCount;
          this.YSCount = data.Data.YSCount;
          this.YHCount = data.Data.YHCount;
          this.BJCount = data.Data.BJCount;
          this.score = this.calcScore();
          this.loadingBJ = false;
        });
    },
    closeDialog() {
      //this.reset();
      this.showDialog = false;
    }
  }
};
</script>