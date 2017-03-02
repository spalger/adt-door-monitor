import { uniq } from './utils'

export function createDoorTracker (adtClient, staleAfterMs, onChange, onLeftOpen) {
  const history = [{}, {}]
  const knownStates = {}

  async function getDoorStatus () {
    const homeView = await adtClient.getHomeView()
    return homeView.items
      .filter(i => i.name.includes('Door'))
      .reduce(
        (acc, { name, state }) => Object.assign(acc, {
          [name]: state.statusTxt.includes('Closed') ? 'closed' : 'open'
        }),
        {}
      )
  }

  function getKnownState (name) {
    return knownStates[name] || {}
  }

  function markStateStart (name, state) {
    knownStates[name] = { state, start: Date.now() }
  }

  function getTimeInState (name) {
    const { start } = getKnownState(name)
    return start ? Date.now() - start : 0
  }

  function isMuted (name) {
    return getKnownState(name).muteUntil >= Date.now()
  }

  class DoorTracker {
    muteUntil (name, time) {
      knownStates[name] = Object.assign(
        getKnownState(name),
        { muteUntil: time }
      )
    }

    async poll () {
      history.unshift(await getDoorStatus())
      history.length = 2

      const [currentStates, prevStates] = history
      const allNames = uniq([
        ...Object.keys(currentStates),
        ...Object.keys(prevStates)
      ])

      for (const name of allNames) {
        const current = currentStates[name]
        const prev = prevStates[name]

        if (current === prev) {
          const isOpen = current === 'open'
          const timeOpen = isOpen && getTimeInState(name)

          if (timeOpen >= staleAfterMs && !isMuted(name)) {
            await onLeftOpen(name, timeOpen)
          }
        } else {
          markStateStart(name, current)
          await onChange(name, current, prev)
        }
      }
    }
  }

  return new DoorTracker()
}
