// types/address.ts

export type AddressFormData = {
  streetAddress: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type ActionResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string[]> // matches Zod's .flatten().fieldErrors shape
}


