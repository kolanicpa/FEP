// Test script to verify creating a performance works
const testData = {
  name: 'Romeo and Juliet',
  status: 'Aktivna',
  startDate: '2025-01-15',
  satnica: '20:00',
  category: 'Tragedija',
  totalTickets: 150
}

async function test() {
  try {
    console.log('Testing POST /api/v1/performances...\n')
    console.log('Sending data:', JSON.stringify(testData, null, 2))

    const response = await fetch('http://localhost:3001/api/v1/performances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(JSON.stringify(error, null, 2))
    }

    const result = await response.json()
    console.log('\n✅ Success! Created performance:')
    console.log(JSON.stringify(result, null, 2))

    // Now fetch all performances
    console.log('\n\nFetching all performances...')
    const allResponse = await fetch('http://localhost:3001/api/v1/performances')
    const allData = await allResponse.json()
    console.log(`\nTotal performances in Firebase: ${allData.performances.length}`)
    allData.performances.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.start_date}) - ${p.total_tickets} tickets`)
    })

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

test()
