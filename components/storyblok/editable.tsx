'use client'

import type React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface EditableProps {
  blok: any
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: React.CSSProperties
}

/**
 * Wraps a block element with Storyblok editable attributes.
 * Renders normally in production · attaches Visual Editor click-to-edit when in Storyblok iframe.
 */
export function Editable({ blok, children, as: Tag = 'div', className, style }: EditableProps) {
  const editableProps = storyblokEditable(blok)
  const TagAny = Tag as React.ElementType
  return (
    <TagAny {...editableProps} className={className} style={style}>
      {children}
    </TagAny>
  )
}
