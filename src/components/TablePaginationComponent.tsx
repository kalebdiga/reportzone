import CustomTextField from '@/@core/components/mui/TextField'
import { MenuItem } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { type SetStateAction } from 'react'

interface TablePaginationComponentProps {
  count: number
  rowsPerPage: number
  page: number
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  setResultsPerPage: (value: SetStateAction<number>) => void
}

const TablePaginationComponent = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange
}: TablePaginationComponentProps) => {
  const start = count === 0 ? 0 : page * rowsPerPage + 1
  const end = Math.min((page + 1) * rowsPerPage, count)
  console.log(count, rowsPerPage, page, onPageChange, onRowsPerPageChange)
  return (
    <div className='flex justify-between w-full items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>{`Showing ${start} to ${end} of ${count} entries`}</Typography>
      <div className='flex w-[70%] items-center justify-end gap-1'>
        <div className='size-[25%] flex justify-end'>
          <CustomTextField
            select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            className='flex-auto max-sm:is-full is-[70px]'
          >
            {' '}
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={70}>70</MenuItem>
          </CustomTextField>
        </div>
        <div className='w-[100%] flex justify-end'>
          <Pagination
            shape='rounded'
            color='primary'
            variant='tonal'
            count={Math.ceil(count / rowsPerPage)}
            page={page + 1}
            onChange={onPageChange}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </div>
  )
}

export default TablePaginationComponent
