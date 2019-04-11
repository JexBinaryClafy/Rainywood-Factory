<template>
  <div>
    <div class="row">
      <div class="col xs-3">
        <vmEducation title="政治教育课件热度"></vmEducation>
      </div>
      <div class="col xs-6">
        <vmMedia title="党政要闻媒体热度"></vmMedia>
      </div>
      <div class="col xs-3">
        <vm31 title="三重一大事项申报情况"></vm31>
      </div>
    </div>
    <div class="row">
      <div class="col xs-4">
        <vmCommunist title="各部党员发展情况"></vmCommunist>
      </div>
      <div class="col xs-4">
        <vmForum title="文化建设论坛活跃情况"></vmForum>
      </div>
      <div class="col xs-4">
        <vmMeeting title="党委会议题申报趋势"></vmMeeting>
      </div>
    </div>
  </div>
</template>
<script>
import vmEducation from "@/view/party/vm_Education";
import vmMedia from "@/view/party/vm_Media";
import vm31 from "@/view/party/vm_31";
import vmCommunist from "@/view/party/vm_Communist";
import vmForum from "@/view/party/vm_Forum";
import vmMeeting from "@/view/party/vm_Meeting";

export default {
  data() {
    return {};
  },
  components: {
    vmEducation: vmEducation,
    vmMedia: vmMedia,
    vm31: vm31,
    vmCommunist: vmCommunist,
    vmForum: vmForum,
    vmMeeting: vmMeeting
  },
  mounted() {
    this.bus.$emit("loadView", "party");
  }
};
</script>
<style scoped>
</style>
