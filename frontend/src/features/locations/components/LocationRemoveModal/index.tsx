import type { Location } from '../../types/location'
import { Hint, Message, RemoveModal } from './styles'

interface LocationRemoveModalProps {
  location?: Location
  open: boolean
  confirmLoading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function LocationRemoveModal({
  location,
  open,
  confirmLoading,
  onCancel,
  onConfirm,
}: LocationRemoveModalProps) {
  const locationLabel = location ? `${location.name} (${location.code})` : 'este local'

  return (
    <RemoveModal
      centered
      open={open}
      title="Excluir local"
      okText="Excluir"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      okButtonProps={{ danger: true }}
      width={440}
      maskStyle={{
        backdropFilter: 'blur(2px)',
        background: 'rgb(0 0 0 / 45%)',
      }}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      <Message>Deseja excluir &quot;{locationLabel}&quot;?</Message>
      <Hint>
        Locais com equipamentos vinculados não podem ser excluídos. Essa ação não poderá ser
        desfeita.
      </Hint>
    </RemoveModal>
  )
}
