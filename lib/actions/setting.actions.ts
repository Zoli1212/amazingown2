'use server'
import { ISettingInput } from '@/types'
import data from '../data'
import Setting from '../db/models/setting.model'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { cookies } from 'next/headers'
import { withCache } from '../cache'

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}
export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase()
  const setting = await Setting.findOne()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

export const getSetting = async (): Promise<ISettingInput> => {
  return withCache('settings', async () => {
    await connectToDatabase()
    const setting = await Setting.findOne().lean()
    return setting
      ? JSON.parse(JSON.stringify(setting))
      : data.settings[0]
  })
}

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase()
    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean()
    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    ) // Update the cache
    return {
      success: true,
      message: 'Setting updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Server action to update the currency cookie
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Currency updated successfully',
  }
}
