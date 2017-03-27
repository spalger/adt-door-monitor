export function createEvent(type, value) {
  return { time: Date.now(), type, value }
}

export function eventValuesOfType(events, type) {
  return events.filter(e => e.type === type).map(e => e.value)
}
