import {
  formatLocationDate,
  getLocationTypeLabel,
  type LocationDetails,
} from '../../types/location'
import { Description, DescriptionList, Detail, InfoCard, Term, Title, Value } from './styles'

function formatRoomLabel(room?: string) {
  if (!room) {
    return undefined
  }

  return room.toLowerCase().startsWith('sala') ? room : `Sala ${room}`
}

function formatLocationAddress(location: LocationDetails) {
  const addressParts = [
    location.building,
    formatRoomLabel(location.room) ?? location.floor,
  ].filter(Boolean)

  return addressParts.length > 0 ? addressParts.join(' • ') : 'Não informado'
}

interface LocationInfoCardProps {
  location: LocationDetails
}

export function LocationInfoCard({ location }: LocationInfoCardProps) {
  return (
    <InfoCard styles={{ body: { padding: 24 } }}>
      <Title>Informações gerais</Title>

      <DescriptionList>
        <Detail>
          <Term>Tipo</Term>
          <Value>{getLocationTypeLabel(location.type)}</Value>
        </Detail>

        <Detail>
          <Term>Endereço</Term>
          <Value>{formatLocationAddress(location)}</Value>
        </Detail>

        <Detail>
          <Term>Prédio</Term>
          <Value>{location.building ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Andar</Term>
          <Value>{location.floor ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Sala</Term>
          <Value>{location.room ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Equipamentos vinculados</Term>
          <Value>{location.equipmentCount}</Value>
        </Detail>

        <Detail>
          <Term>Data de cadastro</Term>
          <Value>{formatLocationDate(location.createdAt)}</Value>
        </Detail>

        <Detail>
          <Term>Última atualização</Term>
          <Value>{formatLocationDate(location.updatedAt)}</Value>
        </Detail>
      </DescriptionList>

      {location.description && (
        <Detail style={{ marginTop: 24 }}>
          <Term>Descrição</Term>
          <Description>{location.description}</Description>
        </Detail>
      )}
    </InfoCard>
  )
}
