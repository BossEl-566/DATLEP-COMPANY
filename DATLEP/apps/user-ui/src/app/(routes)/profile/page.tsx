'use client'

import React from 'react'
import useUser from 'apps/user-ui/src/configs/hooks/useUser'

function Page() {
  const { user } = useUser()
  console.log(user)

  return <div>page</div>
}

export default Page