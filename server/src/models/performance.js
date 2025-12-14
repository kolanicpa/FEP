import db from '../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

const performancesCollection = db.collection('performances')

class PerformanceModel {
  async getAll() {
    const snapshot = await performancesCollection
      .orderBy('start_date', 'asc')
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
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
    const { name, status, startDate, satnica, category, totalTickets } = data

    const performanceData = {
      name,
      status,
      start_date: startDate,
      satnica,
      category,
      total_tickets: totalTickets,
      available_tickets: totalTickets,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }

    const docRef = await performancesCollection.add(performanceData)
    const doc = await docRef.get()

    return {
      id: doc.id,
      ...doc.data()
    }
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
