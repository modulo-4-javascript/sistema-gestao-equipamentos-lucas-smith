import { Description, Grid, Label, SummaryCard, Value } from './styles'

export interface LocationDetailSummary {
  id: string
  title: string
  value: string
  description: string
}

interface LocationDetailSummaryCardsProps {
  summaries: LocationDetailSummary[]
}

export function LocationDetailSummaryCards({ summaries }: LocationDetailSummaryCardsProps) {
  return (
    <Grid aria-label="Resumo dos equipamentos do local">
      {summaries.map((summary) => (
        <SummaryCard key={summary.id} styles={{ body: { padding: 16 } }}>
          <Label>{summary.title}</Label>
          <Value>{summary.value}</Value>
          <Description>{summary.description}</Description>
        </SummaryCard>
      ))}
    </Grid>
  )
}
