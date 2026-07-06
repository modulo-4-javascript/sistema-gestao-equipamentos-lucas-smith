import { Alert, App as AntDesignApp, Spin } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { getRequestErrorMessage } from '../../../../shared/http/getRequestErrorMessage'
import {
  LocationDetailSummaryCards,
  type LocationDetailSummary,
} from '../../components/LocationDetailSummaryCards'
import { LocationDetailsHeader } from '../../components/LocationDetailsHeader'
import { LocationEquipmentCard } from '../../components/LocationEquipmentCard'
import { LocationFormModal } from '../../components/LocationFormModal'
import type { LocationFormValues } from '../../components/LocationFormModal'
import { LocationHistoryCard } from '../../components/LocationHistoryCard'
import { LocationInfoCard } from '../../components/LocationInfoCard'
import { LocationRemoveModal } from '../../components/LocationRemoveModal'
import { LocationStatusModal } from '../../components/LocationStatusModal'
import type { LocationStatusFormValues } from '../../components/LocationStatusModal'
import { useDeleteLocation } from '../../hooks/useDeleteLocation'
import { useLocationDetails } from '../../hooks/useLocationDetails'
import { useLocationEquipment } from '../../hooks/useLocationEquipment'
import { useLocationHistory } from '../../hooks/useLocationHistory'
import { useUpdateLocation } from '../../hooks/useUpdateLocation'
import { useUpdateLocationStatus } from '../../hooks/useUpdateLocationStatus'
import {
  getLocationStatusLabel,
  getLocationTypeLabel,
  locationStatusOptions,
  locationTypeOptions,
  type LocationDetails,
} from '../../types/location'
import { Container, ContentGrid, MainColumn, SideColumn, StarterBox } from './styles'

const defaultPageSize = 10

function buildLocationPayload(values: LocationFormValues) {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    type: values.type!,
    building: values.building?.trim() || undefined,
    floor: values.floor?.trim() || undefined,
    room: values.room?.trim() || undefined,
    description: values.description?.trim() || null,
    status: values.status,
  }
}

function buildDetailSummary(location: LocationDetails): LocationDetailSummary[] {
  const { equipmentSummary } = location

  return [
    {
      id: 'status',
      title: 'Situação',
      value: getLocationStatusLabel(location.status),
      description: location.status === 'ACTIVE' ? 'Local em uso' : 'Local inativo',
    },
    {
      id: 'type',
      title: 'Tipo',
      value: getLocationTypeLabel(location.type),
      description: 'Classificação do espaço',
    },
    {
      id: 'total',
      title: 'Equipamentos',
      value: String(equipmentSummary.total),
      description: 'Total vinculado',
    },
    {
      id: 'available',
      title: 'Disponíveis',
      value: String(equipmentSummary.available),
      description: 'Prontos para uso',
    },
    {
      id: 'maintenance',
      title: 'Em manutenção',
      value: String(equipmentSummary.inMaintenance),
      description: 'Com restrição',
    },
    {
      id: 'inactive',
      title: 'Inativos',
      value: String(equipmentSummary.inactive),
      description: 'Fora de operação',
    },
  ]
}

export function LocationDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()
  const { locationId } = useParams()

  const [locationInForm, setLocationInForm] = useState<LocationDetails>()
  const [locationInStatus, setLocationInStatus] = useState<LocationDetails>()
  const [locationToRemove, setLocationToRemove] = useState<LocationDetails>()
  const [equipmentPage, setEquipmentPage] = useState(1)
  const [equipmentPageSize, setEquipmentPageSize] = useState(defaultPageSize)
  const [historyPage, setHistoryPage] = useState(1)
  const [historyPageSize, setHistoryPageSize] = useState(defaultPageSize)

  const locationQuery = useLocationDetails(locationId)
  const equipmentQuery = useLocationEquipment({
    locationId,
    page: equipmentPage,
    pageSize: equipmentPageSize,
  })
  const historyQuery = useLocationHistory({
    locationId,
    page: historyPage,
    pageSize: historyPageSize,
  })
  const updateLocation = useUpdateLocation()
  const updateLocationStatus = useUpdateLocationStatus()
  const deleteLocation = useDeleteLocation()

  const location = locationQuery.data
  const equipment = equipmentQuery.data?.data ?? []
  const equipmentMeta = equipmentQuery.data?.meta
  const history = historyQuery.data?.data ?? []
  const historyMeta = historyQuery.data?.meta

  const isLoading = locationQuery.isLoading
  const loadError =
    (!locationId ? 'ID da localização não encontrado na rota.' : '') ||
    locationQuery.errorMessage
  const isSavingForm = updateLocation.isLoading
  const isSavingStatus = updateLocationStatus.isLoading
  const isRemovingLocation = deleteLocation.isLoading

  const summaries = useMemo(
    () => (location ? buildDetailSummary(location) : []),
    [location],
  )

  function handleEditLocation() {
    if (location) {
      setLocationInForm(location)
    }
  }

  function handleChangeStatus() {
    if (location) {
      setLocationInStatus(location)
    }
  }

  async function handleSubmitFormModal(values: LocationFormValues) {
    if (!locationInForm) {
      return
    }

    try {
      await updateLocation.update({
        locationId: locationInForm.id,
        payload: buildLocationPayload(values),
      })
      await Promise.all([
        locationQuery.reload(),
        equipmentQuery.reload(),
        historyQuery.reload(),
      ])
      messageApi.success('Local atualizado com sucesso.')
      setLocationInForm(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleSubmitStatusModal(values: LocationStatusFormValues) {
    if (!locationInStatus) {
      return
    }

    try {
      await updateLocationStatus.updateStatus({
        locationId: locationInStatus.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })
      await locationQuery.reload()
      messageApi.success('Situação atualizada com sucesso.')
      setLocationInStatus(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleConfirmRemoveLocation() {
    if (!locationToRemove) {
      return
    }

    try {
      await deleteLocation.remove(locationToRemove.id)
      messageApi.success('Local excluído com sucesso.')
      setLocationToRemove(undefined)
      navigate('/locations')
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  function handleEquipmentPageChange(nextPage: number, nextPageSize: number) {
    setEquipmentPage(nextPage)
    setEquipmentPageSize(nextPageSize)
  }

  function handleHistoryPageChange(nextPage: number, nextPageSize: number) {
    setHistoryPage(nextPage)
    setHistoryPageSize(nextPageSize)
  }

  if (isLoading) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>
            <Spin /> Carregando local...
          </StarterBox>
        </Container>
      </AppLayout>
    )
  }

  if (loadError || !location) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <Alert
            showIcon
            message="Local não encontrado"
            description={loadError || 'Não foi possível exibir este local.'}
            type="error"
          />
        </Container>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <LocationDetailsHeader
          location={location}
          onBack={() => navigate('/locations')}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEditLocation}
          onRemove={() => setLocationToRemove(location)}
        />

        <LocationDetailSummaryCards summaries={summaries} />

        <ContentGrid>
          <MainColumn>
            <LocationInfoCard location={location} />

            {equipmentQuery.errorMessage && (
              <Alert
                showIcon
                message="Erro ao carregar equipamentos"
                description={equipmentQuery.errorMessage}
                type="error"
              />
            )}

            <LocationEquipmentCard
              equipment={equipment}
              loading={equipmentQuery.isLoading}
              pagination={{
                current: equipmentPage,
                pageSize: equipmentPageSize,
                total: equipmentMeta?.total ?? 0,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20],
                showTotal: (total) => `${total} equipamentos no total`,
                onChange: handleEquipmentPageChange,
              }}
            />
          </MainColumn>

          <SideColumn>
            {historyQuery.errorMessage && (
              <Alert
                showIcon
                message="Erro ao carregar histórico"
                description={historyQuery.errorMessage}
                type="error"
              />
            )}

            <LocationHistoryCard
              history={history}
              loading={historyQuery.isLoading}
              currentPage={historyPage}
              pageSize={historyPageSize}
              total={historyMeta?.total ?? 0}
              onPageChange={handleHistoryPageChange}
            />
          </SideColumn>
        </ContentGrid>

        <LocationFormModal
          confirmLoading={isSavingForm}
          location={locationInForm}
          mode="edit"
          open={Boolean(locationInForm)}
          statusOptions={locationStatusOptions}
          typeOptions={locationTypeOptions}
          onCancel={() => setLocationInForm(undefined)}
          onSubmit={handleSubmitFormModal}
        />

        <LocationStatusModal
          confirmLoading={isSavingStatus}
          location={locationInStatus}
          open={Boolean(locationInStatus)}
          statusOptions={locationStatusOptions}
          onCancel={() => setLocationInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />

        <LocationRemoveModal
          confirmLoading={isRemovingLocation}
          location={locationToRemove}
          open={Boolean(locationToRemove)}
          onCancel={() => setLocationToRemove(undefined)}
          onConfirm={handleConfirmRemoveLocation}
        />
      </Container>
    </AppLayout>
  )
}
