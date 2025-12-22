import db from '../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

const performancesCollection = db.collection('performances')

class PerformanceModel {
  async getAll() {
    const snapshot = await performancesCollection.get()

    // Sort in-memory to handle documents without startTime
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return docs.sort((a, b) => {
      if (!a.startTime) return 1
      if (!b.startTime) return -1

      const timeA = a.startTime._seconds || new Date(a.startTime).getTime() / 1000
      const timeB = b.startTime._seconds || new Date(b.startTime).getTime() / 1000

      return timeA - timeB
    })
  }

  async getById(id) {
    const doc = await performancesCollection.doc(id).get()

    if (!doc.exists) {
      return null
    }

    return {
      id: doc.id,
      ...doc.data()
    }
  }

  async create(data) {
    const { title, artist, description, genre, startTime, endTime, locationId, duration, isHeadliner } = data

    const startDateObj = new Date(startTime)
    const endDateObj = endTime ? new Date(endTime) : startDateObj

    if (isNaN(startDateObj.getTime())) {
      throw new Error('Invalid start time provided')
    }

    const performanceData = {
      title,
      artist,
      description,
      genre,
      startTime: startDateObj,
      endTime: endDateObj,
      locationId: locationId || '',
      duration: Number(duration) || 60,
      isHeadliner: isHeadliner || false,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const docRef = await performancesCollection.add(performanceData)
    const doc = await docRef.get()

    return {
      id: doc.id,
      ...doc.data()
    }
  }

  async update(id, data) {
    const { title, artist, description, genre, startTime, endTime, locationId, duration, isHeadliner, isActive } = data

    const updateData = {
      updatedAt: FieldValue.serverTimestamp()
    }

    if (title !== undefined) updateData.title = title
    if (artist !== undefined) updateData.artist = artist
    if (description !== undefined) updateData.description = description
    if (genre !== undefined) updateData.genre = genre
    if (startTime !== undefined && startTime !== '') {
      const dateObj = new Date(startTime)
      if (!isNaN(dateObj.getTime())) {
        updateData.startTime = dateObj
      }
    }
    if (endTime !== undefined && endTime !== '') {
      const dateObj = new Date(endTime)
      if (!isNaN(dateObj.getTime())) {
        updateData.endTime = dateObj
      }
    }
    if (locationId !== undefined) updateData.locationId = locationId
    if (duration !== undefined) updateData.duration = Number(duration)
    if (isHeadliner !== undefined) updateData.isHeadliner = isHeadliner
    if (isActive !== undefined) updateData.isActive = isActive

    await performancesCollection.doc(id).update(updateData)
    const doc = await performancesCollection.doc(id).get()

    return {
      id: doc.id,
      ...doc.data()
    }
  }

  async delete(id) {
    await performancesCollection.doc(id).delete()
    return { id }
  }

  async decrementAvailableTickets(performanceId) {
    const docRef = performancesCollection.doc(performanceId)

    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef)

        if (!doc.exists) {
          throw new Error('Performance not found')
        }

        const data = doc.data()

        if (data.available_tickets <= 0) {
          throw new Error('No available tickets')
        }

        transaction.update(docRef, {
          available_tickets: FieldValue.increment(-1),
          updated_at: FieldValue.serverTimestamp()
        })
      })

      const doc = await docRef.get()
      return {
        id: doc.id,
        ...doc.data()
      }
    } catch (error) {
      return null
    }
  }

  async incrementAvailableTickets(performanceId) {
    const docRef = performancesCollection.doc(performanceId)

    await docRef.update({
      available_tickets: FieldValue.increment(1),
      updated_at: FieldValue.serverTimestamp()
    })

    const doc = await docRef.get()
    return {
      id: doc.id,
      ...doc.data()
    }
  }
}

export default new PerformanceModel()
