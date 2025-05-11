'use client'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { EllipsisVertical } from 'lucide-react'
import {
  Table as MuiTable,
  Box,
  Checkbox,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Card,
  Skeleton
} from '@mui/material'
import CSV from '@/utils/CSV'
import { string } from 'yup'
import { getValueByPath } from '@/utils/tebleCellSelectionHandeler'
import Nodatafound from '@/components/NoDtata'
import type { MouseEvent } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import type { MenuProps } from '@mui/material/Menu'
import type { MenuItemProps } from '@mui/material/MenuItem'

// Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>({
  '& .MuiMenu-paper': {
    border: '1px solid var(--mui-palette-divider)'
  }
})

// Styled MenuItem component
const MenuItems = styled(MuiMenuItem)<MenuItemProps>({
  '&:focus': {
    backgroundColor: 'var(--mui-palette-primary-main)',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: 'var(--mui-palette-common-white)'
    }
  }
})

interface Header {
  key: string
  label: string
  render?: (row: any) => React.ReactNode
}

interface Row {
  id: string | number
  [key: string]: any
}

interface CustomTableProps {
  headers: Header[]
  data: Row[]
  action?: boolean
  filter?: boolean
  view?: boolean
  pickdate?: boolean
  csv?: boolean
  csvName?: string
  csvData?: any[]
  tableTitle?: string | React.ReactNode
  number: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  resultsPerPage: number
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>
  setSelectedFilter?: any
  filterFieldData?: any
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  actionElements?: (row: any) => React.ReactNode
  dropdownVisible: number | null
  setDropdownVisible: any
  displayTotal?: boolean
  dataForTotal?: any[]
  addNew?: React.ReactNode
  selectionId?: string
  isSlectedDataRequired?: boolean
  setSelcteData?: any
}
const Table: React.FC<CustomTableProps> = ({
  headers,
  data = [],
  filter = false,
  csv = false,
  tableTitle = '',
  action = false,
  number = 0,
  page,
  setPage,
  resultsPerPage,
  setResultsPerPage,
  setSelectedFilter = () => {},
  filterFieldData,
  loading,
  setLoading,
  actionElements,
  dropdownVisible,
  setDropdownVisible,
  displayTotal = true,
  dataForTotal,
  addNew,
  selectionId = 'id',
  isSlectedDataRequired,
  setSelcteData
}) => {
  // const { openModal, Modal, filteredData, setFilterFields } = UseFilterModal();

  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [csvData, setcsvData] = useState<any[]>([])

  const [selectAll, setSelectAll] = useState(false)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: string
  } | null>(null)

  const totalItems = number

  const startItem = (page - 1) * resultsPerPage + 1
  const endItem = Math.min(resultsPerPage * page, totalItems)
  const totalRows = number
  const totalPages = Math.ceil(totalRows / resultsPerPage)

  const handleChangeResultsPerPage = (event: any) => {
    setResultsPerPage(event.target.value as number)
    setPage(1)
  }

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  // Update the state to include row data
  const [anchorEl, setAnchorEl] = useState<{ element: HTMLElement | null; row: any } | null>(null)

  const handleClick = (event: MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl({ element: event.currentTarget, row })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      setSelectedRows(data)
    } else {
      setSelectedRows([])
    }
  }

  const handleRowSelect = (row: any) => {
    const isSelected = selectedRows.some(
      selectedRow => getValueByPath(selectedRow, selectionId) === getValueByPath(row, selectionId)
    )

    if (isSelected) {
      setSelectedRows(
        selectedRows.filter(
          selectedRow => getValueByPath(selectedRow, selectionId) !== getValueByPath(row, selectionId)
        )
      )
    } else {
      setSelectedRows([...selectedRows, row])
    }

    const allSelected = data.length === selectedRows.length + (isSelected ? 0 : 1)
    setSelectAll(allSelected)
  }
  const sortedRows = () => {
    if (!sortConfig) return Array.isArray(data) ? data : []

    const sortedData = [...data]

    sortedData.sort((a: any, b: any) => {
      let valueA = getValueByKey(a, sortConfig.key)
      let valueB = getValueByKey(b, sortConfig.key)

      if (typeof valueA === 'string') valueA = valueA.toLowerCase()
      if (typeof valueB === 'string') valueB = valueB.toLowerCase()

      if (valueA < valueB) return sortConfig.direction === 'ascending' ? -1 : 1
      if (valueA > valueB) return sortConfig.direction === 'ascending' ? 1 : -1
      return 0
    })

    return sortedData
  }

  // const getValueByKey = (obj: any, key: string) => {
  //   return key.split(".").reduce((acc, part) => acc?.[part], obj);
  // };
  const getValueByKey = (obj: any, key: string) => {
    const value = key.split('.').reduce((acc, part) => acc?.[part], obj)
    return typeof value === 'number' ? value.toLocaleString() : value
  }
  const handleSort = (key: string) => {
    setSortConfig(prevSortConfig => ({
      key,
      direction: prevSortConfig?.key === key && prevSortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }))
  }

  useEffect(() => {
    if (csv) {
      const csvData = selectedRows.length > 0 ? selectedRows : data
      setcsvData(csvData)
    }
  }, [selectedRows, data])

  useEffect(() => {
    if (isSlectedDataRequired) {
      if (setSelcteData) {
        setSelcteData(selectedRows ?? [])
      }
    }
  }, [selectedRows, data])
  console.log('CSV Data:', data)
  return (
    <>
      <Card className=' '>
        <div className='w-[100%] pl-[1%] flex justify-between items-center bg-transparent  py-[1%] pr-[1%] '>
          <div className='w-[80%] flex gap-[1em] '>
            <div className=' font-[500] text-[1.15rem] leading-[28px] w-full text-[#434f68]'>{tableTitle}</div>
          </div>
          <div className='md:w-[20%] flex justify-end w-full items-center gap-[1em]'>
            {filter && (
              <div className='flex gap-[1em]'>
                <Button
                  className='bg-primary text-white rounded-md px-4 py-2'
                  onClick={() => {
                    setSelectedFilter(filterFieldData)
                    setLoading(true)
                  }}
                >
                  Filter
                </Button>
              </div>
            )}
            {csv && (
              <div className='flex gap-[1em]'>
                <CSV data={csvData} fileName={'data'} />
              </div>
            )}

            <div className=' flex justify-end items-center gap-[15px] '>{addNew} </div>
          </div>
        </div>
        <div className='table-container w-full  overflow-x-auto  bg-white'>
          {/* {sortedRows()?.length === 0 && !loading ? (
            <Nodatafound />
          ) : ( */}
          <Box component={Paper} sx={{ overflowX: 'auto' }}>
            {sortedRows()?.length === 0 && loading === false ? (
              <Nodatafound />
            ) : (
              <MuiTable className=' font-[500] w-full'>
                <TableHead className=' w-full'>
                  <TableRow>
                    {(csv || isSlectedDataRequired) && (
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                          color='primary'
                        />
                      </TableCell>
                    )}

                    {headers.map(header => (
                      <TableCell
                        key={header.key}
                        onClick={() => handleSort(header.key)}
                        sx={{ cursor: 'pointer', fontWeight: 600 }}
                      >
                        {header.label}
                        {sortConfig?.key === header.key && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                      </TableCell>
                    ))}
                    {action && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody className='w-full'>
                  {loading ? (
                    [...Array(7)].map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {[...Array(headers.length + (csv || isSlectedDataRequired ? 1 : 0) + (action ? 1 : 0))].map(
                          (_, colIndex) => (
                            <TableCell key={colIndex}>
                              <Skeleton variant='text' />
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <>
                      {sortedRows()?.map((row, index) => (
                        <TableRow key={index} hover>
                          {(csv || isSlectedDataRequired) && (
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={selectedRows.some(selected => {
                                  return getValueByPath(selected, selectionId) === getValueByPath(row, selectionId)
                                })}
                                onChange={() => handleRowSelect(row)}
                              />
                            </TableCell>
                          )}
                          {headers.map(header => (
                            <TableCell
                              key={header.key}
                              sx={{
                                fontWeight: getValueByKey(row, header.key) === 'Total' ? 600 : 'normal'
                              }}
                            >
                              {header.render ? header.render(row) : (getValueByKey(row, header.key) ?? '-')}
                            </TableCell>
                          ))}
                          {action && (
                            <TableCell align='center' sx={{ position: 'relative' }}>
                              <button
                                className='bg-transparent cursor-pointer active:bg-slate-400 active:size-6 active:rounded-[50%]'
                                aria-haspopup='true'
                                onClick={event => handleClick(event, row)} // Pass the row data here
                                aria-controls='customized-menu'
                              >
                                <EllipsisVertical />
                              </button>

                              {actionElements instanceof Function && (
                                <Menu
                                  keepMounted
                                  elevation={0}
                                  anchorEl={anchorEl?.element}
                                  id='customized-menu'
                                  onClose={handleClose}
                                  open={Boolean(anchorEl?.element)}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                  }}
                                  sx={{
                                    transform: 'translateX(-55px)' // Move the menu 10px to the left
                                  }}
                                >
                                  {anchorEl?.row && actionElements(anchorEl.row)}
                                </Menu>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {displayTotal && (
                        <TableRow>
                          {dataForTotal?.map((row: any, idx: number) => (
                            <TableCell key={idx} sx={{ fontWeight: 600 }}>
                              {row.toLocaleString()}
                            </TableCell>
                          ))}
                        </TableRow>
                      )}

                      {/* {isPagination && ( */}
                      <TableRow>
                        <TableCell colSpan={100}>
                          {sortedRows()?.length === 0 ? (
                            ''
                          ) : (
                            <>
                              <div className='w-full justify-around flex mx-auto  items-center'>
                                <div>
                                  <label htmlFor='resultsPerPage' className='mr-2'>
                                    {startItem}-{endItem} of {totalItems}
                                  </label>
                                </div>
                                <div className=' flex items-center gap-[0.7rem]'>
                                  {' '}
                                  <div>
                                    <Select
                                      value={resultsPerPage}
                                      onChange={handleChangeResultsPerPage}
                                      displayEmpty
                                      inputProps={{ 'aria-label': 'Results per page' }}
                                      sx={{
                                        height: '40px'
                                      }}
                                    >
                                      {[5, 10, 15, 20, 25, 50, 100].map(count => (
                                        <MenuItem key={count} value={count}>
                                          {count}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </div>
                                  <Stack spacing={2} className=''>
                                    <div className=''>
                                      <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant='outlined'
                                        shape='rounded'
                                        color='primary'
                                        showFirstButton
                                        showLastButton
                                      />
                                    </div>
                                  </Stack>
                                </div>
                              </div>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                      {/* )} */}
                    </>
                  )}
                </TableBody>
              </MuiTable>
            )}
          </Box>
          {/* )} */}
        </div>
      </Card>
    </>
  )
}

export default Table
