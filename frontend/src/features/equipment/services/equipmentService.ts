import { axiosApi } from '../../../services/api'
import type {
  CreateEquipmentPayload,
  Equipment,
  EquipmentDetail,
  EquipmentLocationOption,
  EquipmentStatus,
  EquipmentSummaryResponse,
  EquipmentType,
  PaginatedResult,
  UpdateEquipmentPayload,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'

export interface GetEquipmentListParams {
  search?: string
  status?: EquipmentStatus
  type?: EquipmentType
  page?: number
  pageSize?: number
}

interface ApiLocation {
  id: string
  code: string
  name: string
}

export const equipmentService = {
  async getEquipmentList(params: GetEquipmentListParams = {}) {
    const response = await axiosApi.get<PaginatedResult<Equipment>>('/equipment', {
      params: {
        page: 1,
        pageSize: 10,
        ...params,
      },
    })

    return response.data
  },

  async getEquipmentSummary() {
    const response = await axiosApi.get<EquipmentSummaryResponse>(
      '/equipment/summary',
    )

    return response.data
  },

  async getEquipmentById(equipmentId: string) {
    const response = await axiosApi.get<EquipmentDetail>(
      `/equipment/${equipmentId}`,
    )

    return response.data
  },

  async createEquipment(payload: CreateEquipmentPayload) {
    const response = await axiosApi.post<EquipmentDetail>('/equipment', payload)

    return response.data
  },

  async updateEquipment(equipmentId: string, payload: UpdateEquipmentPayload) {
    const response = await axiosApi.put<EquipmentDetail>(
      `/equipment/${equipmentId}`,
      payload,
    )

    return response.data
  },

  async updateEquipmentStatus(
    equipmentId: string,
    payload: UpdateEquipmentStatusPayload,
  ) {
    const response = await axiosApi.patch<EquipmentDetail>(
      `/equipment/${equipmentId}/status`,
      payload,
    )

    return response.data
  },

  async getEquipmentLocationOptions() {
    const response = await axiosApi.get<PaginatedResult<ApiLocation>>(
      '/locations',
      {
        params: {
          page: 1,
          pageSize: 100,
        },
      },
    )

    return response.data.data.map<EquipmentLocationOption>((location) => ({
      id: location.id,
      label: `${location.code} - ${location.name}`,
    }))
  },
}
