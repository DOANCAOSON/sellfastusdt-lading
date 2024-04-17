export const ButtonLoad = ({
  loading,
  label,
  isDisable,
  ...rest
}: {
  loading?: boolean
  label: string
  className?: string
  type?: string
  style?: string
  onClick?: (e: any) => void
  id?: string
  isDisable?: boolean
}) => {
  return (
    <button
      {...rest}
      id='stamped-button-submit'
      style={{
        pointerEvents: loading || isDisable ? 'none' : 'auto',
        background: isDisable ? 'disable' : 'auto'
      }}
      disabled={isDisable}>
      {loading ? <div className='spinner-border text-light' role='status' style={{ color: '#fff' }} /> : label}
    </button>
  )
}
