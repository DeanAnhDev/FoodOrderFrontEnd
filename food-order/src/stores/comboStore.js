import { defineStore } from "pinia";
import { getCombos } from "@/services/comboService";
import { getComboWithFoods } from "@/services/comboService";


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

export const useComboDetailWithFoodsStore = defineStore("comboWithFoods", {
  state: () => ({
    comboWithFoods: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchComboWithFoods(slug) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getComboWithFoods(slug);
        this.comboWithFoods = response.data;
        // comboStore.js
console.log("response from API:", response.data)
console.log("first food in comboDetails:", response.data?.comboDetails?.[0]?.food)


      } catch (err) {
        this.error = "Không thể tải combo!";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});