import { defineStore } from 'pinia'
import {
  getLocationByUserId,
  getLocationById,
  deleteLocation,
  createLocation,
  updateLocation,
  updateLocationIsDefault,
} from '@/services/locationService'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    selectedLocation: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLocationsByUser() {
      this.loading = true
      this.error = null
      try {
        const res = await getLocationByUserId()
        // normalize different API shapes:
        // - res.data could be the array
        // - res.data.data could be the array
        // - res.data.items could be the array
        let payload = res.data
        if (payload && typeof payload === 'object') {
          if (Array.isArray(payload)) {
            // already an array
          } else if (Array.isArray(payload.data)) {
            payload = payload.data
          } else if (Array.isArray(payload.items)) {
            payload = payload.items
          } else {
            // fallback: no array found
            payload = []
          }
        }

        this.locations = payload || []
        return this.locations
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể tải danh sách địa chỉ'
      } finally {
        this.loading = false
      }
    },

    async fetchLocationById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await getLocationById(id)
        this.selectedLocation = res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể tải địa chỉ'
      } finally {
        this.loading = false
      }
    },

    async createLocation(data) {
      this.loading = true
      this.error = null
      try {
        await createLocation(data)
        await this.fetchLocationsByUser()
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể thêm địa chỉ'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateLocation(data) {
      this.loading = true
      this.error = null
      try {
        await updateLocation(data)
        await this.fetchLocationsByUser()
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể cập nhật địa chỉ'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteLocation(id) {
      this.loading = true
      this.error = null
      try {
        await deleteLocation(id)
        this.locations = this.locations.filter((loc) => loc.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể xóa địa chỉ'
        throw err
      } finally {
        this.loading = false
      }
    },

    async setDefaultLocation(id) {
      this.loading = true
      this.error = null
      try {
        await updateLocationIsDefault(id, true)
        await this.fetchLocationsByUser()
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể đặt mặc định'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
