import Rx from 'rxjs/Rx'
import mkdirp from 'mkdirp'
import Level from 'level'

import { fromNode } from '../utils'

import {
  isNotFoundError,
  createNotFoundError,
} from './errors'

export async function createDb(dbDirectory) {
  await fromNode(cb => mkdirp(dbDirectory, cb))
  const level = new Level(dbDirectory, {
    createIfMissing: true,
    keyEncoding: 'json',
    valueEncoding: 'json',
  })

  class Db {
    async has(key) {
      try {
        await this.get(key)
        return true
      } catch (err) {
        if (isNotFoundError(err)) return false
        throw err
      }
    }

    async get(key) {
      try {
        return await fromNode(cb => level.get(key, cb))
      } catch (err) {
        if (err && err.notFound) throw createNotFoundError(key)
        throw err
      }
    }

    async set(key, value) {
      await fromNode(cb => level.put(key, value, cb))
    }

    async delete(key) {
      await fromNode(cb => level.del(key, cb))
    }

    async close() {
      await fromNode(cb => level.close(cb))
    }

    getAll() {
      return new Rx.Observable(observer => {
        const stream = level.createReadStream()
        stream
          .on('data', d => observer.next(d))
          .on('error', d => observer.error(d))
          .on('end', d => observer.complete(d))
        return () => stream.destroy()
      })
    }
  }

  return new Db()
}
