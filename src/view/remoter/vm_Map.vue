<template>
  <div class="box" id="vm3">
    <div class="box-header" :title="hintText">
      <span class="title pos-left">{{title}}</span>
      <ul class="tools pos-right">
        <li class="item">
          <button class="btn" type="button" @click="showSettingWindow">
            <i class="icon icon-setting"></i>
          </button>
        </li>
      </ul>
    </div>
    <div class="box-body">
      <div class="chart extrasize" id="chart-remoter-3"></div>
      <div class="chartSetting" v-show="showSetting">
        <div class="form">
          <div class="form-head">
            <div class="title">选择查看日期</div>
          </div>
          <div class="form-body">
            <div class="form-item">
              <div class="label">日期</div>
              <div class="field">
                <input type="date" class="datepicker" :max="timeLimit" v-model="date">
              </div>
            </div>
            
          </div>
          <div class="form-foot">
            <button type="button" @click="saveSetting" class="btn bg-green">
              <span class="text">确定</span>
            </button>
            <button type="button" @click="cancelSetting" class="btn bg-green">
              <span class="text">关闭</span>
            </button>
          </div>
        </div>
      </div>
      <x-loading :show="showLoading"></x-loading>
      <dl-Map ref="dialog" :show="showModal" :take="keyModal"></dl-Map>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import 'echarts/extension/bmap/bmap'
import dlMap from "@/view/remoter/dl_Map";

export default {
  data() {
    return {
      date: this.dateShift(-1),
      timeLimit: this.dateShift(-1),
      showSetting: false,
      showLoading: false,
      chartInstance: null,
      option: null,
      params: null,
      showModal: false,
      keyModal: null
    };
  },
  props: {
    title: String
  },
  computed:{
    hintText(){
      return `当前显示是${this.date}这一天的数据`
    }
  },
  components: {
    "x-loading": Loading,
    "x-pager": Pager,
    "dl-Map": dlMap
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    showSettingWindow() {
      this.showSetting = true;
    },
    cancelSetting() {
      this.showSetting = false;
    },
    saveSetting() {
      this.renderChart();
      this.showSetting = false;
    },
    renderChart() {
      let $this = this;
      let params = {
        indexDate: this.date
      };
      this.showLoading = true;
      this.option = {
        bmap: {
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: "water",
                elementType: "all",
                stylers: {
                  color: "#031628"
                }
              },
              {
                featureType: "land",
                elementType: "geometry",
                stylers: {
                  color: "#000102"
                }
              },
              {
                featureType: "highway",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry.fill",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry.stroke",
                stylers: {
                  color: "#0b3d51"
                }
              },
              {
                featureType: "local",
                elementType: "geometry",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "railway",
                elementType: "geometry.fill",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "railway",
                elementType: "geometry.stroke",
                stylers: {
                  color: "#08304b"
                }
              },
              {
                featureType: "subway",
                elementType: "geometry",
                stylers: {
                  lightness: -70
                }
              },
              {
                featureType: "building",
                elementType: "geometry.fill",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: {
                  color: "#857f7f"
                }
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "building",
                elementType: "geometry",
                stylers: {
                  color: "#022338"
                }
              },
              {
                featureType: "green",
                elementType: "geometry",
                stylers: {
                  color: "#062032"
                }
              },
              {
                featureType: "boundary",
                elementType: "all",
                stylers: {
                  color: "#465b6c"
                }
              },
              {
                featureType: "manmade",
                elementType: "all",
                stylers: {
                  color: "#022338"
                }
              },
              {
                featureType: "label",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              }
            ]
          }
        },
        visualMap: {
          top: "top",
          min: 0,
          max: 100,
          text: ["评分高", "评分低"],
          show: true,
          seriesIndex: 0,
          textStyle: {
            color: "#fff"
          },
          continuous: true,
          color: ["#ff1800", "#fa7c00", "#00dd33"].reverse(),
          calculable: true
        },
        series: [
          {
            name: "散点图",
            type: "effectScatter",
            coordinateSystem: "bmap",
            symbolSize: 15,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
              period: 2,
              scale: 3
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                formatter: "{b}",
                position: "right",
                show: true
              }
            },
            itemStyle: {
              normal: {
                // color: '#9FC33D',
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            zlevel: 2
          }
        ]
      };

      axios
        .get(this.URLHEAD + "GetSuperviseUnits", {
          params: params
        })
        .then(res => {
          //debugger;
          let data = res.data
          let mapData = data.Data.map(item => {
            return {
              name: item.MC,
              value: [item.MLng, item.MLat, item.FS, item.FS],
              comId: item.Data_ID
            };
          });
          let scatteredMapData = data.Data.map(item => {
            return {
              name: item.MC,
              value: [item.MLng, item.MLat, item.FS, item.FS],
              comId: item.Data_ID
            };
          });
          this.option.series[0].data = scatteredMapData;
          this.chartInstance=this.$Crender('chart-remoter-3',this.option)
          this.chartInstance.on("click", e => {
            //debugger;
            let takenData = {
                comName:e.data.name,
                comId:e.data.comId
            }
            $this.$refs.dialog.query(takenData)
          });
          let map = this.chartInstance
            .getModel()
            .getComponent("bmap")
            .getBMap();
          map.centerAndZoom("贵阳", 13);
          this.showLoading = false;
        });
    }
  }
};
</script>