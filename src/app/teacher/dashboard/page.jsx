'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const TeachersDashboard = () => {
  const router = useRouter()
  router.push('/teacher')
  return null
}

export default TeachersDashboard