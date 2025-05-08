'use server'

import { signIn, signOut } from '../../../auth'

export async function doLogout() {
  await signOut({ redirectTo: '/' })
}

export async function doCredentialLogin(data: any) {
  try {
    const response: { error?: string } = await signIn('login', {
      data: JSON.stringify(data),
      redirect: false,
      callbackUrl: '/add-management/addprofile'
    })

    return response
  } catch (err) {
    throw err
  }
}

export async function doCredentialSignup(data: { password: string; email: string }) {
  const { password, email } = data

  try {
    const response = await signIn('signup', {
      password,
      email,
      redirect: false
    })

    return response
  } catch (err) {
    throw err
  }
}
