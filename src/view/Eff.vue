<template>
    <div>
        <div class="col xs-12">
            <vmIndex title="各部效能指数横向分析"></vmIndex>
        </div>
        <div class="col xs-3">
            <vmCapacity title="各部业务能力分析"></vmCapacity>
        </div>
        <div class="col xs-3">
            <vmSpeed title="各部响应速度分析"></vmSpeed>
        </div>
        <div class="col xs-6">
            <vmPressure title="各部工作压力分析"></vmPressure>
        </div>
    </div>
</template>

<script>

import vmIndex from '@/view/eff/vm_Index'
import vmCapacity from '@/view/eff/vm_Capacity'
import vmSpeed from '@/view/eff/vm_Speed'
import vmPressure from '@/view/eff/vm_Pressure'

export default {
    data() {
        return {
            
        }
    },
    components:{
        'vmIndex':vmIndex,
        'vmCapacity':vmCapacity,
        'vmSpeed':vmSpeed,
        'vmPressure':vmPressure
    },
    mounted(){
        this.bus.$emit('loadView','eff')
    }
}
</script>
<style scoped>

</style>
