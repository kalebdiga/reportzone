import { FileDown } from 'lucide-react'
import React from 'react'
import { CSVLink } from 'react-csv'

// Utility function to flatten the nested objects
const flattenObject = (obj: any, parentKey: string = '', result: any = {}) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = parentKey ? `${parentKey}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], propName, result) // Recursive call for nested objects
      } else {
        result[propName] = obj[key]
      }
    }
  }
  return result
}

export default function CSV({ data, fileName }: any) {
  const flattenedData = data.map((item: any) => flattenObject(item))

  return (
    <div>
      <CSVLink data={flattenedData} filename={fileName} className='btn btn-primary' target='_blank'>
        <div className='flex items-center gap-2 '>
          <FileDown />
          <span className=' max-md:hidden'>CSV</span>
        </div>
      </CSVLink>
    </div>
  )
}
