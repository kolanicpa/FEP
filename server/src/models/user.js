import db from '../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'
import bcrypt from 'bcrypt'

const attendeesCollection = db.collection('attendees')

class UserModel {
  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase()

    const snapshot = await attendeesCollection
      .where('email_lowercase', '==', normalizedEmail)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    }
  }

  async findById(id) {
    const doc = await attendeesCollection.doc(id).get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data()
    return {
      id: doc.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
      created_at: data.created_at
    }
  }

  async create({ email, password, firstName, lastName }) {
    const passwordHash = await bcrypt.hash(password, 10)
    const normalizedEmail = email.toLowerCase()

    const userData = {
      email: normalizedEmail,
      email_lowercase: normalizedEmail,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role: 'user',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }

    const docRef = await attendeesCollection.add(userData)
    const doc = await docRef.get()
    const data = doc.data()

    return {
      id: doc.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
      created_at: data.created_at
    }
  }

  async verifyPassword(user, password) {
    if (!user.password_hash) {
      return false
    }
    return await bcrypt.compare(password, user.password_hash)
  }

  async updatePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10)

    await attendeesCollection.doc(userId).update({
      password_hash: passwordHash,
      updated_at: FieldValue.serverTimestamp()
    })

    return { id: userId }
  }
}

export default new UserModel()
