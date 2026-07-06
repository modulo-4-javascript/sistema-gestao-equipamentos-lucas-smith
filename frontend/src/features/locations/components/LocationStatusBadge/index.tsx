import { Tag } from 'antd'
import styled from 'styled-components'
import type { LocationStatus } from '../../types/location'
import { getLocationStatusLabel } from '../../types/location'

interface StatusTagProps {
  $status: LocationStatus
}

function getStatusTextColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#007c8c' : '#6b7280'
}

function getStatusBackgroundColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#e6fffb' : '#f3f4f6'
}

function getStatusBorderColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#b5f5ec' : '#dde6ee'
}

const StatusTag = styled(Tag)<StatusTagProps>`
  &.ant-tag {
    margin: 0;
    color: ${({ $status }) => getStatusTextColor($status)};
    background: ${({ $status }) => getStatusBackgroundColor($status)};
    border-color: ${({ $status }) => getStatusBorderColor($status)};
    border-radius: 999px;
    font-weight: 600;
  }
`

interface LocationStatusBadgeProps {
  status: LocationStatus
}

export function LocationStatusBadge({ status }: LocationStatusBadgeProps) {
  return <StatusTag $status={status}>{getLocationStatusLabel(status)}</StatusTag>
}
