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
  Card
} from '@mui/material'
import CSV from '@/utils/CSV'
import { string } from 'yup'
import { getValueByPath } from '@/utils/tebleCellSelectionHandeler'
import Nodatafound from '@/components/NoDtata'

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
  tableTitle?: string
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
  selectionId = 'id'
}) => {
  // const { openModal, Modal, filteredData, setFilterFields } = UseFilterModal();

  console.log('object', data)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [csvData, setcsvData] = useState<any[]>([])

  const [selectAll, setSelectAll] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
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

  const getDropdownPosition = (rowIndex: number) => {
    const rowElement = document.getElementById(`row-${rowIndex}`)
    if (!rowElement) return { top: '0px' }

    const rowRect = rowElement.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const dropdownHeight = 120

    let top = rowRect.bottom + 5
    if (top + dropdownHeight > windowHeight) {
      top = rowRect.top - dropdownHeight - 5
    }

    return { top: `${top}px` }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(null)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      setSelectedRows(data)
    } else {
      setSelectedRows([])
    }
  }
  const handleActionsClick = (index: number) => {
    setDropdownVisible((prevIndex: any) => (prevIndex === index ? null : index))
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
    if (!sortConfig) return data

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
  console.log('CSV Data:', data)
  return (
    <>
      <Card className=' '>
        <div className='w-[100%] pl-[1%] flex justify-between items-center bg-transparent  py-[1%] pr-[1%] '>
          <div className='w-[80%] flex gap-[1em] max-md:hidden'>
            <h1 className=' font-[500] text-[1.15rem] leading-[28px] text-[#434f68]'>{tableTitle}</h1>
          </div>
          <div className='md:w-[40%] flex justify-end w-full items-center gap-[1em]'>
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
          {sortedRows()?.length === 0 ? (
            <Nodatafound />
          ) : (
            <Box component={Paper} sx={{ overflowX: 'auto' }}>
              {sortedRows()?.length === 0 ? (
                <div>Nodatafound</div>
              ) : (
                <MuiTable>
                  <TableHead>
                    <TableRow>
                      {csv && (
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
                  <TableBody>
                    {sortedRows()?.map((row, index) => (
                      <TableRow key={row.id} hover>
                        {csv && (
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
                            {header.render ? header.render(row) : (getValueByKey(row, header.key) ?? 'test')}
                          </TableCell>
                        ))}
                        {action && (
                          <TableCell align='center' sx={{ position: 'relative' }}>
                            <button
                              className=' bg-transparent cursor-pointer active:bg-slate-400 active:size-6 active:rounded-[50%]'
                              onClick={() => handleActionsClick(index)}
                            >
                              <EllipsisVertical />
                            </button>
                            {dropdownVisible === index && actionElements instanceof Function && (
                              <Box
                                ref={dropdownRef}
                                sx={{
                                  position: 'absolute',
                                  right: 0,
                                  top: getDropdownPosition(index).top,
                                  zIndex: 999,
                                  bgcolor: 'white',
                                  boxShadow: 3,
                                  borderRadius: 1,
                                  minWidth: 250
                                }}
                              >
                                {actionElements(row)}
                              </Box>
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

                    <TableRow>
                      <TableCell colSpan={100}>
                        {sortedRows()?.length === 0 ? (
                          ''
                        ) : (
                          <>
                            <div className='w-full justify-center flex mx-auto'>
                              <Stack spacing={2} className='mt-4 mb-10'>
                                <Pagination
                                  count={totalPages}
                                  page={page}
                                  onChange={handlePageChange}
                                  variant='outlined'
                                  shape='rounded'
                                  color='primary'
                                />
                              </Stack>
                            </div>
                            <div className='flex justify-between items-center p-4 w-[100%]'>
                              {' '}
                              <div>
                                <label htmlFor='resultsPerPage' className='mr-2'>
                                  {startItem}-{endItem} of {totalItems}
                                </label>
                              </div>
                              <div>
                                <label htmlFor='resultsPerPage' className='mr-2'>
                                  Results per page:
                                </label>
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
                            </div>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </MuiTable>
              )}
            </Box>
          )}
        </div>
      </Card>
    </>
  )
}

export default Table
