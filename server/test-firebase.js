import { db } from './src/config/firebase.js'

async function testFirebase() {
  try {
    console.log('Testing Firebase connection...\n')

    console.log('1. Testing Firestore write...')
    const testDoc = await db.collection('test').add({
      message: 'Hello Firebase!',
      timestamp: new Date()
    })
    console.log('   ✓ Write successful. Doc ID:', testDoc.id)

    console.log('\n2. Testing Firestore read...')
    const doc = await testDoc.get()
    console.log('   ✓ Read successful. Data:', doc.data())

    console.log('\n3. Testing Firestore delete...')
    await testDoc.delete()
    console.log('   ✓ Delete successful')

    console.log('\n4. Testing collections...')
    const collections = ['performances', 'attendees', 'tickets']
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).limit(1).get()
      console.log(`   ✓ ${collectionName}: ${snapshot.size} documents`)
    }

    console.log('\n✅ Firebase is connected and working properly!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Firebase connection failed:', error)
    process.exit(1)
  }
}

testFirebase()
