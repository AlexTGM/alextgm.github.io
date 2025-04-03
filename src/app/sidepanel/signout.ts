'use server'

import { cookies } from 'next/headers'

export async function signout() {
    (await cookies()).delete('google_jwt')
}