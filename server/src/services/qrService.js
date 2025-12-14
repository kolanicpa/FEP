import QRCode from 'qrcode'

class QRService {
  async generateQRCode(data) {
    const qrData = {
      ticketId: data.ticketId,
      performanceId: data.performanceId,
      performanceName: data.performanceName,
      startDate: data.startDate,
      satnica: data.satnica,
      category: data.category,
      attendeeEmail: data.attendeeEmail
    }

    const jsonString = JSON.stringify(qrData)

    const qrCodeImage = await QRCode.toDataURL(jsonString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' }
    })

    return {
      data: jsonString,
      image: qrCodeImage
    }
  }
}

export default new QRService()
