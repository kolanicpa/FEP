import db from '../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

const attendeesCollection = db.collection('attendees')

class AttendeeModel {
  async findOrCreate(email) {
    const normalizedEmail = email.toLowerCase()

    // Try to find existing by email
    const snapshot = await attendeesCollection
      .where('email_lowercase', '==', normalizedEmail)
      .limit(1)
      .get()

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      }
    }

    // Create new attendee
    const attendeeData = {
      email,
      email_lowercase: normalizedEmail,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }

    const docRef = await attendeesCollection.add(attendeeData)
    const doc = await docRef.get()

    return {
      id: doc.id,
      ...doc.data()
    }
  }

  async getById(id) {
    const doc = await attendeesCollection.doc(id).get()

    if (!doc.exists) {
      return null
    }

    return {
      id: doc.id,
      ...doc.data()
    }
  }
}

export default new AttendeeModel()
