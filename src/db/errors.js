export function isNotFoundError(err) {
  return (err && err.isNotFoundError)
}

export function createNotFoundError(id) {
  const err = new Error(`"${id}" not found`)
  err.isNotFoundError = true
  return err
}
