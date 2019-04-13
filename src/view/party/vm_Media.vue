<template>
  <div class="box" style="margin-bottom:8px;height:466px;">
    <div class="box-header" title="显示自系统上线以来，截止至今天的数据">
      <span class="title pos-left">{{title}}</span>
    </div>
    <div class="box-body">
      <ul class="beltlist pos-left" style="width:400px;">
        <li class="item2" v-for="(item,idx) in listWords" :key="idx">
          <div class="psubtitle1 framedHead">{{idx+1}}</div>
          <div class="frameBody">
            <div class="psubtitle" style="text-align: left;">{{item.name}}</div>
            <div style="color:#fff;">数据来源：红门政教</div>
          </div>
          <div class="frameFoot">
            <div style=" font-size: 24px;text-align: center;font-weight: bold;">{{item.value}}</div>
            <div>热度指数</div>
          </div>
        </li>
      </ul>
      <ul class="beltlist pos-right" style="width:535px;">
        <li class="item1" v-for="(item,idx) in listNews" :key="idx">
          <div style="float:left;padding-left:10px;color:#f09400;padding-top:20px">
            <div class>浏览次数</div>
            <div class="psubtitle">{{item.previewNumber}}</div>
          </div>
          <div style="float:left;padding-left:20px;color:#ffffff;padding-top:20px">
            <div class="itemTitle">
              <div :title="title">{{item.title}}</div>
            </div>
            <div style="padding-top:10px">发布日期：{{item.releaseTime}}</div>
          </div>
        </li>
      </ul>
      <x-loading :show="showLoading"></x-loading>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Loading from "@/components/Loading";

export default {
    data() {
        return {
            listWords:[],
            listNews:[],
            showLoading:false,
            startTime:this.dateShift(-3650),
            endTime:this.dateShift(0)
        }
    },
    props:{
        title:String
    },
    components:{
        'x-loading':Loading
    },
    mounted() {
        this.showLoading=true
        let aysncQueue = 2
        let params = {
          startTime:this.startTime + ' 00:00:00',
          endTime:this.endTime + ' 23:59:59'
        }
        axios.get(this.URLHEAD + 'CiYun',{
          params:params
        }).then(res=>{
            let data = res.data.Data.slice(0,5)
            this.listWords = data
            aysncQueue--
            if(aysncQueue===0){
                this.showLoading=false
            }
        })
        axios.get(this.URLHEAD+'DZYWMTSJFX',{
            params:{
                pageIndex:1,
                pageSize:5
            }
        }).then(res=>{
            let data = res.data
            this.listNews = data.Data
            aysncQueue--
            if(aysncQueue===0){
                this.showLoading=false
            }
        })

    },
}
</script>