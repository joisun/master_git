<script>
export default {
  name: "AppLogin",
  async created() {
    console.log('🎸 DEBUG_5 login.vue 👉', 1231)
    const res = await this.jaxLib.common.auth.goLogin({});
    console.log('🎸 DEBUG_6 login.vue🎸 DEBUG_6 login.vue 👉 👉', res)
    // window.location.replace(res.data.url);
  },
};
</script>
