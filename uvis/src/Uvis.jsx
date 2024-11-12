import React, { useCallback } from 'react'
import { VisXYContainer, VisLine, VisAxis, VisStackedBar } from '@unovis/react'

const data = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
]

export function BasicLineChart () {
  return (
    <VisXYContainer data={data}>
      <VisLine
        x={useCallback(d => d.x, [])}
        y={useCallback(d => d.y, [])}
      ></VisLine>
      <VisStackedBar x={useCallback(d => d.x, [])} y={useCallback(d => d.y, [])}/>
      <VisAxis type="x"></VisAxis>
      <VisAxis type="y"></VisAxis>
    </VisXYContainer>
  )
}