import ComputerOutlined from '@mui/icons-material/ComputerOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import { Button } from 'antd'
import type { TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../../../shared/components/DataTable'
import {
  ResourceCell,
  ResourceCode,
  ResourceIcon,
  ResourceName,
} from '../../../../shared/components/DataTable/styles'
import { StatusBadge } from '../../../equipment/components/StatusBadge'
import {
  formatEquipmentDate,
  getEquipmentTypeLabel,
} from '../../../equipment/types/equipment'
import type { LocationEquipment } from '../../types/location'
import { EquipmentCard, Title } from './styles'

interface LocationEquipmentCardProps {
  equipment: LocationEquipment[]
  loading?: boolean
  pagination?: TableProps<LocationEquipment>['pagination']
}

export function LocationEquipmentCard({
  equipment,
  loading,
  pagination,
}: LocationEquipmentCardProps) {
  const navigate = useNavigate()

  const columns: TableProps<LocationEquipment>['columns'] = [
    {
      title: 'Equipamento',
      dataIndex: 'name',
      key: 'name',
      render: (_, item) => (
        <ResourceCell>
          <ResourceIcon>
            <ComputerOutlined fontSize="small" />
          </ResourceIcon>
          <span>
            <ResourceName>{item.name}</ResourceName>
            <ResourceCode>{item.code}</ResourceCode>
          </span>
        </ResourceCell>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: LocationEquipment['type']) => getEquipmentTypeLabel(type),
    },
    {
      title: 'Modelo',
      dataIndex: 'model',
      key: 'model',
      render: (model?: string) => model ?? 'Não informado',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: LocationEquipment['status']) => <StatusBadge status={status} />,
    },
    {
      title: 'Atualizado',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: LocationEquipment['updatedAt']) => formatEquipmentDate(updatedAt),
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, item) => (
        <Button
          aria-label={`Ver detalhes de ${item.name}`}
          icon={<VisibilityOutlined fontSize="small" />}
          type="text"
          onClick={() => navigate(`/equipment/${item.id}`)}
        />
      ),
    },
  ]

  return (
    <EquipmentCard styles={{ body: { padding: 24 } }}>
      <Title>Equipamentos vinculados</Title>

      <DataTable
        columns={columns}
        dataSource={equipment}
        emptyText="Nenhum equipamento vinculado a este local."
        loading={loading}
        pagination={pagination}
        rowKey="id"
      />
    </EquipmentCard>
  )
}
