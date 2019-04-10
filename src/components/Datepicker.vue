<template>
    <input type="date" name="" :value="value" @input="$emit('input',$event.target.value)" :max="dateLimit">
</template>
<script>
export default {
    data() {
        return {
            value:''
        }
    },
    computed: {
        dateLimit(){
            let now = new Date()
            let obj={
                year:now.getFullYear(),
                month:(now.getMonth()+1)>=10?now.getMonth()+1:'0'+now.getMonth(),
                day:now.getDate()>=10?now.getDate():'0'+now.getDate()
            }
            return `${obj.year}-${obj.month}-${obj.day}`
        }
    },
    methods: {
        
    },
    created() {
        
    }
}
</script>