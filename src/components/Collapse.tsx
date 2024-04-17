import { useState, type JSX } from 'preact/compat'
import { Animation } from './Animation'

interface Props {
  className?: string
  labels: string
  items: { label: string; code: string }[]
}

export const Collapse = (props: Props) => {
  const { items, labels, className } = props
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <section id='collapse' className={className}>
      <div className='collapse-container'>
        <div
          className='collapse-toggle'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ pointerEvents: items.length ? 'auto' : 'none' }}>
          <span>{labels}</span>
          <span id='icon-toggle'>{isMenuOpen ? '–' : '+'}</span>
        </div>
        <Animation
          animationName='slideIn'
          key={Number(isMenuOpen)}
          className={`collapse-menu ${isMenuOpen ? 'show' : ''}`}>
          {items?.map((item, idx) => (
            <li key={'collapse_menu_' + idx}>
              <a aria-label={item.label} className='collapse-item' href={item.code}>
                {item.label}
              </a>
            </li>
          ))}
        </Animation>
      </div>
    </section>
  )
}

type CollapseAniProps = {
  defaultOpen?: boolean
  collapseKey?: string
  btnText?: string
  className?: { header?: string; root?: string }
  RenderHeader?: JSX.Element
  children: any
  headerIcon?: boolean
  style?: any
  onClick?: any
  isOpen?: boolean
}
export const CollapseAni = (props: CollapseAniProps) => {
  const {
    collapseKey,
    btnText,
    RenderHeader,
    isOpen,
    className,
    defaultOpen = false,
    children,
    headerIcon = true,
    style,
    onClick
  } = props
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`collapse-box ${className?.root}`} data-idx={collapseKey} style={style}>
      <div
        onClick={() => {
          setOpen(!open)
          onClick?.()
        }}
        className={`collapse-container ${className?.header}`}>
        {RenderHeader ? (
          RenderHeader
        ) : (
          <>
            <span className='header-left'>{btnText}</span>
            {headerIcon && <span className='header-right'>{open ? '–' : '+'}</span>}
          </>
        )}
      </div>
      {isOpen ? (
        open && (
          <Animation
            key={collapseKey}
            className={`content ${open && 'open'}`}
            style={{ overflowY: 'auto' }}
            animationName='fadeIn'>
            {children}
          </Animation>
        )
      ) : (
        <Animation
          key={collapseKey}
          className={`content ${open && 'open'}`}
          style={{ overflowY: 'auto' }}
          animationName='fadeIn'>
          {children}
        </Animation>
      )}
    </div>
  )
}
