import { defineStore } from "pinia";
import { getCombos } from "@/services/comboService";

export const useComboStore = defineStore("combo", {
  state: () => ({
    combos: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCombos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getCombos();
        this.combos = response.data;
      } catch (err) {
        this.error = "Không thể tải combo!";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});