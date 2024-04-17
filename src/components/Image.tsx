type ImageProps = {
  custom?: any
  key?: string | number
  alt?: string
  src?: string
  id?: string
  transition?: Record<string, any>
  loading?: 'lazy' | 'eager'
  className?: string
  width?: string | number
  ariaLabel: string
  height?: string | number
  motion?: boolean
  style?: any
  onClick?: () => any
}
const fallbackSrc = '/logo.svg'

const Image = ({ ariaLabel, loading = 'lazy', src, motion = false, style, ...other }: ImageProps) => {
  const isSvg = src?.endsWith('.svg')
  const isStaticImg = src?.match(/static/)

  const imgSrc = !src?.match(/http(s)/) && !isSvg && isStaticImg ? `/api/image?src=${src}` : src || fallbackSrc

  const handleError = (e: any) => {
    const target = e.currentTarget
    target.style.objectFit = 'none'
  }

  return (
    <img
      {...other}
      aria-label={ariaLabel}
      src={imgSrc}
      loading={loading}
      onError={handleError}
      style={{
        objectFit: imgSrc == fallbackSrc ? 'none' : isSvg ? 'constant' : 'cover',
        ...style
      }}
    />
  )
}
export default Image
