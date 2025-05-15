import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'

export default function Notice({
  backgroundColor = '#fef9c3',
  color = ' #713f12',
  content,
  icon = (
    <IconButton>
      <i className='tabler-alert-triangle' />
    </IconButton>
  )
}: {
  backgroundColor?: string
  content: string
  icon?: React.ReactNode
  color?: string
}) {
  return (
    <Box
      sx={{
        backgroundColor: backgroundColor,
        borderRadius: 2,
        padding: 2,
        display: 'flex',
        paddingY: '2%',
        paddingX: '2%',
        gap: 2
      }}
    >
      <Typography
        style={{
          color: color
        }}
      >
        {icon}
        {content}
      </Typography>
    </Box>
  )
}
