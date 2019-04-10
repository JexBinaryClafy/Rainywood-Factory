<template>
    <div>
        <div class="col xs-3">
            <vmDistrict title="贵阳市警情区域分布"></vmDistrict>
            <vmClass title="贵阳市警情类型分布"></vmClass>
        </div>
        <div class="col xs-6">
            <vmMerge title="消防接警时间/类型融合分布"></vmMerge>
            <vmAccept title="消防接处警工作量"></vmAccept>
        </div>
        <div class="col xs-3">
            <vmSeason title="消防警情季度分布"></vmSeason>
            <vmEquipment title="消防装备耐用性情况"></vmEquipment>
        </div>
    </div>
</template>
<script>

import vm_Accept from '@/view/onepic/vm_Accept'
import vm_Class from '@/view/onepic/vm_Class'
import vm_District from '@/view/onepic/vm_Section'
import vm_Equipment from '@/view/onepic/vm_Equipment'
import vm_Merge from '@/view/onepic/vm_Merge'
import vm_Season from '@/view/onepic/vm_Season'

export default {
    data() {
        return {
        }
    },
    components:{
       'vmAccept':vm_Accept,
       'vmClass':vm_Class,
       'vmDistrict':vm_District,
       'vmEquipment':vm_Equipment,
       'vmMerge':vm_Merge,
       'vmSeason':vm_Season
    },
    mounted(){
        this.bus.$emit('loadView','onepic')
    },
}
</script>
<style scoped>

</style>
