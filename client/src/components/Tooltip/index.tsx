import './index.css'

import { ReactNode, useRef, useState } from 'react'

interface TooltipProps {
  children: ReactNode
  text: string
}

export default function Tooltip({ children, text }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const childRef = useRef(null)

  const handleMouseOver = () => {
    setVisible(true)
  }

  const handleMouseOut = () => {
    setVisible(false)
  }

  return (
    <div className="tooltip-container" ref={childRef} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {children}
      {visible && <div className="tooltip-content">{text}</div>}
    </div>
  )
}
