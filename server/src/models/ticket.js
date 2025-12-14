import db from '../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

const ticketsCollection = db.collection('tickets')
const performancesCollection = db.collection('performances')
const attendeesCollection = db.collection('attendees')

class TicketModel {
  async create(data) {
    const { performanceId, attendeeId, qrCodeData, qrCodeImage } = data

    const ticketData = {
      performance_id: performanceId,
      attendee_id: attendeeId,
      qr_code_data: qrCodeData,
      qr_code_image: qrCodeImage,
      status: 'valid',
      sent_at: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }

    const docRef = await ticketsCollection.add(ticketData)
    const doc = await docRef.get()

    return {
      id: doc.id,
      ...doc.data()
    }
  }

  async getById(id) {
    const ticketDoc = await ticketsCollection.doc(id).get()

    if (!ticketDoc.exists) {
      return null
    }

    const ticketData = ticketDoc.data()

    const [performanceDoc, attendeeDoc] = await Promise.all([
      performancesCollection.doc(ticketData.performance_id).get(),
      attendeesCollection.doc(ticketData.attendee_id).get()
    ])

    const performance = performanceDoc.data()
    const attendee = attendeeDoc.data()

    return {
      id: ticketDoc.id,
      ...ticketData,
      performance_name: performance?.name,
      start_date: performance?.start_date,
      satnica: performance?.satnica,
      category: performance?.category,
      attendee_email: attendee?.email
    }
  }

  async getByPerformance(performanceId) {
    const snapshot = await ticketsCollection
      .where('performance_id', '==', performanceId)
      .orderBy('created_at', 'desc')
      .get()

    const tickets = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const ticketData = doc.data()
        const attendeeDoc = await attendeesCollection.doc(ticketData.attendee_id).get()
        const attendee = attendeeDoc.data()

        return {
          id: doc.id,
          ...ticketData,
          attendee_email: attendee?.email
        }
      })
    )

    return tickets
  }

  async checkDuplicate(performanceId, attendeeId) {
    const snapshot = await ticketsCollection
      .where('performance_id', '==', performanceId)
      .where('attendee_id', '==', attendeeId)
      .limit(1)
      .get()

    return !snapshot.empty
  }

  async delete(id) {
    const ticketDoc = await ticketsCollection.doc(id).get()

    if (!ticketDoc.exists) {
      return null
    }

    const ticketData = ticketDoc.data()
    await ticketsCollection.doc(id).delete()

    return {
      performance_id: ticketData.performance_id
    }
  }

  async getByUser(userId) {
    const snapshot = await ticketsCollection
      .where('attendee_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get()

    const tickets = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const ticketData = doc.data()

        const [performanceDoc, attendeeDoc] = await Promise.all([
          performancesCollection.doc(ticketData.performance_id).get(),
          attendeesCollection.doc(ticketData.attendee_id).get()
        ])

        const performance = performanceDoc.data()
        const attendee = attendeeDoc.data()

        return {
          id: doc.id,
          ...ticketData,
          performance_name: performance?.name,
          start_date: performance?.start_date,
          satnica: performance?.satnica,
          category: performance?.category,
          attendee_email: attendee?.email
        }
      })
    )

    return tickets.sort((a, b) => {
      if (a.start_date !== b.start_date) {
        return new Date(b.start_date) - new Date(a.start_date)
      }
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  async validateTicket(ticketId) {
    const ticketDoc = await ticketsCollection.doc(ticketId).get()

    if (!ticketDoc.exists) {
      return null
    }

    const ticketData = ticketDoc.data()

    const [performanceDoc, attendeeDoc] = await Promise.all([
      performancesCollection.doc(ticketData.performance_id).get(),
      attendeesCollection.doc(ticketData.attendee_id).get()
    ])

    const performance = performanceDoc.data()
    const attendee = attendeeDoc.data()

    return {
      id: ticketDoc.id,
      ...ticketData,
      performance_name: performance?.name,
      start_date: performance?.start_date,
      satnica: performance?.satnica,
      attendee_email: attendee?.email
    }
  }

  async markAsUsed(ticketId) {
    const docRef = ticketsCollection.doc(ticketId)

    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef)

        if (!doc.exists) {
          throw new Error('Ticket not found')
        }

        const data = doc.data()

        if (data.status !== 'valid') {
          throw new Error('Ticket is not valid')
        }

        transaction.update(docRef, {
          status: 'used',
          used_at: FieldValue.serverTimestamp(),
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
}

export default new TicketModel()
