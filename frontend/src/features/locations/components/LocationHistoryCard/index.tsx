import { Empty, Pagination } from 'antd'
import { formatLocationDate, type LocationHistoryItem } from '../../types/location'
import {
  DateText,
  Description,
  EmptyText,
  Event,
  EventTitle,
  HistoryCard,
  Timeline,
  Title,
} from './styles'

interface LocationHistoryCardProps {
  history: LocationHistoryItem[]
  loading?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number, pageSize: number) => void
}

export function LocationHistoryCard({
  history,
  loading,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
}: LocationHistoryCardProps) {
  const showPagination = total > pageSize

  return (
    <HistoryCard styles={{ body: { padding: 24 } }} loading={loading}>
      <Title>Histórico de movimentações</Title>

      {history.length === 0 && !loading ? (
        <Empty description={<EmptyText>Nenhuma movimentação registrada.</EmptyText>} />
      ) : (
        <>
          <Timeline>
            {history.map((event) => (
              <Event key={event.id}>
                <DateText>{formatLocationDate(event.createdAt)}</DateText>
                <EventTitle>{event.title}</EventTitle>
                <Description>{event.description}</Description>
              </Event>
            ))}
          </Timeline>

          {showPagination && onPageChange && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              showSizeChanger
              pageSizeOptions={[5, 10, 20]}
              showTotal={(count) => `${count} movimentações no total`}
              style={{ marginTop: 24 }}
              total={total}
              onChange={onPageChange}
            />
          )}
        </>
      )}
    </HistoryCard>
  )
}
