'use client'
import CompanyEmployeesTable from '@/views/company/employee/CompanyEmployeesTable'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
  const params = useParams()

  const id: any = params.id

  console.log(id, 'id')
  return <CompanyEmployeesTable id={id} />
}
