import { useEffect, useRef, useState, type JSX } from 'preact/compat'
import { Animation } from './Animation'

interface SelectBoxType {
  label?: string
  defaultValue: string
  items: { name: string; value: string }[]
  className?: string
  IconEnd?: JSX.Element
  position?: 'top' | 'bottom'
  name?: string
  target?: string
  placeholder?: string
  disabled?: boolean
  labelComponent?: () => JSX.Element
  renderItems?: () => JSX.Element
  onChange?: (item: { name: string; value: string }) => void
}

function getPosition(position: string, rect: DOMRect) {
  return position === 'top' ? `${rect.y - rect.height - 10}px` : `${rect.y + rect.height}px`
}

export const SelectBox = ({
  label,
  defaultValue,
  items,
  className,
  IconEnd,
  target = 'value',
  name,
  disabled,
  position = 'bottom',
  onChange,
  placeholder = 'Select Coin',
  renderItems,
  labelComponent
}: SelectBoxType) => {
  const getOption = (value: string) => {
    return (
      items.find((option: any) => option[target] === value) || {
        name: placeholder,
        value: ''
      }
    )
  }
  const [showDropDown, setShowDropdown] = useState(false)

  const selectBoxRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState)
    const menu = selectBoxRef.current?.querySelector('.select-options') as HTMLElement
    if (menu && selectBoxRef.current instanceof HTMLElement) {
      const rect = selectBoxRef.current.getBoundingClientRect()
      menu.style.left = `${rect.x}px`
      menu.style.top = getPosition(position, rect)
      menu.style.width = `${rect.width}px`
    }
  }

  const handleOutSideClick = (e: MouseEvent) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(e.target as Node)) {
      setShowDropdown(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleOutSideClick, { passive: true })
    document.addEventListener('scroll', (e) => handleOutSideClick(e as any), true)
    return () => {
      document.removeEventListener('click', handleOutSideClick, true)
      document.addEventListener('scroll', (e) => handleOutSideClick(e as any), true)
    }
  }, [])

  const [selectedOption, setSelectedOption] = useState<{
    name: string
    value: string
  } | null>(null)
  const handleChangeSelect = (item: { name: string; value: string }) => {
    setSelectedOption(item)
    onChange && onChange(item)
  }

  return (
    <div ref={selectBoxRef} className={`select ${className}`} onClick={toggleDropdown}>
      {label && (
        <div className='select-label'>
          <span>{label}</span>
        </div>
      )}
      <input
        type='hidden'
        name={name}
        readOnly
        disabled={disabled}
        value={selectedOption?.value || getOption(defaultValue).value || placeholder}
      />
      {!!labelComponent ? (
        labelComponent()
      ) : (
        <input className='select-value' readOnly value={selectedOption?.name || getOption(defaultValue).name} />
      )}
      {!disabled && (
        <Animation animationName='fadeIn'>
          <ul className='select-options' style={{ display: showDropDown ? 'flex' : 'none' }}>
            {!!renderItems ? (
              renderItems()
            ) : items.length ? (
              items.map((item, idx) => (
                <li key={item.value + idx} onClick={() => handleChangeSelect(item)}>
                  <div className='select-option'>{item.name}</div>
                </li>
              ))
            ) : (
              <li>
                <div className='select-option'>no options</div>
              </li>
            )}
          </ul>
        </Animation>
      )}

      <div className='select-icon-close'>
        {IconEnd ?? (
          <svg
            class='w-4 h-4 text-gray-800 '
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'>
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='m19 9-7 7-7-7'
            />
          </svg>
        )}
      </div>
    </div>
  )
}
