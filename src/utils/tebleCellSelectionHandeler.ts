export const getValueByPath = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => {
    return acc?.[key]
  }, obj)
}
