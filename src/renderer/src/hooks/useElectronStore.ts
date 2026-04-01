// src/hooks/useElectronStore.ts
import { useState, useEffect, useCallback } from 'react'
import { StoreData } from '@/types'

export const useElectronStore = <K extends keyof StoreData>(
  key: K,
  initialValue: StoreData[K]
): { value: StoreData[K]; loading: boolean; setValue: (value: StoreData[K]) => void } => {
  const [value, setValue] = useState<StoreData[K]>(initialValue)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    // 1. 读取数据
    const loadValue = async (): Promise<void> => {
      try {
        const storedValue = await window.api.getStore(key)
        if (isMounted) {
          setValue(storedValue !== undefined ? storedValue : initialValue)
        }
      } catch (error) {
        console.error(`Failed to load store key: ${key}`, error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadValue()

    // 2. 监听变化
    const unsubscribe = window.api.onStoreUpdate((data) => {
      if (data.key === key) {
        setValue(data.value)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [key, initialValue])

  // 3. 更新数据
  const updateValue = useCallback(
    async (newValue: StoreData[K]) => {
      setValue(newValue) // 乐观更新
      try {
        await window.api.setStore(key, newValue)
      } catch (error) {
        console.error(`Failed to set store key: ${key}`, error)
      }
    },
    [key]
  )

  return { value, setValue: updateValue, loading }
}
