<template>
  <div>
    <div class="col xs-3">
      <vmDistrict title="贵阳市隐患告警量区域分布"></vmDistrict>
      <vmClass title="贵阳市隐患告警类型分布"></vmClass>
    </div>
    <div class="col xs-6">
      <vmMap title="贵阳市消防安全评估热力图"></vmMap>
    </div>
    <div class="col xs-3">
      <vmTimeliness title="贵阳市消防隐患告警趋势"></vmTimeliness>
      <vmPatrol title="贵阳市消防安全巡查/隐患告警对比"></vmPatrol>
    </div>
  </div>
</template>
<script>
import vmDistrict from '@/view/remoter/vm_District'
import vmClass from '@/view/remoter/vm_Class'
import vmMap from '@/view/remoter/vm_Map'
import vmTimeliness from '@/view/remoter/vm_Timeliness'
import vmPatrol from '@/view/remoter/vm_Patrol'

export default {
    data() {
        return {
            
        }
    },
    components:{
      'vmDistrict':vmDistrict,
      'vmClass':vmClass,
      'vmMap':vmMap,
      'vmTimeliness':vmTimeliness,
      'vmPatrol':vmPatrol
    },
    mounted() {
      this.bus.$emit('loadView','remoter')
    },
};
</script>
<style scoped>
</style>
