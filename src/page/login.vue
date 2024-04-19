<script>
import { goLogin } from "@/apis/auth";

export default {
  name: "AppLogin",
  async created() {
    const res = await goLogin({});
    window.location.replace(res.data.url);
  },
};
</script>
