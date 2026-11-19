export interface PixEmvOptions {
  pixKey: string
  merchantName: string
  merchantCity: string
  amount?: number
  txid?: string
  description?: string
}

function normalizeAscii(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
}

function tlv(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0')
  return `${id}${len}${value}`
}

/**
 * Normaliza chave Pix para padrão BACEN:
 * - CNPJ (14 dígitos) e CPF (11 dígitos) sem pontuação
 * - Demais formatos mantidos limpos
 */
export function normalizePixKeyForEmv(rawKey: string): string {
  const digits = rawKey.replace(/\D/g, '')
  if (digits.length === 14 || digits.length === 11) {
    return digits
  }
  return rawKey.trim()
}

/**
 * CRC-16/CCITT-FALSE (polinômio 0x1021, inicialização 0xFFFF) exigido pelo padrão BR Code.
 */
export function computeCrc16Ccitt(payloadWithCrcPrefix: string): string {
  let crc = 0xffff
  for (let i = 0; i < payloadWithCrcPrefix.length; i++) {
    crc ^= payloadWithCrcPrefix.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Gera Payload EMV (Pix Estático / Copia e Cola - Padrão BACEN BR Code).
 */
export function generatePixEmvPayload(options: PixEmvOptions): string {
  const key = normalizePixKeyForEmv(options.pixKey)
  const merchantName = normalizeAscii(options.merchantName).slice(0, 25) || 'RECEBEDOR'
  const merchantCity = normalizeAscii(options.merchantCity).slice(0, 15) || 'BRASIL'
  const txidClean = normalizeAscii(options.txid ?? '***').replace(/[^A-Za-z0-9*]/g, '').slice(0, 25) || '***'

  let mai = tlv('00', 'br.gov.bcb.pix') + tlv('01', key)
  if (options.description) {
    const descClean = normalizeAscii(options.description).slice(0, 30)
    if (descClean) {
      mai += tlv('02', descClean)
    }
  }

  const amountTag =
    typeof options.amount === 'number' && options.amount > 0
      ? tlv('54', options.amount.toFixed(2))
      : ''

  const body =
    tlv('00', '01') +
    tlv('26', mai) +
    tlv('52', '0000') +
    tlv('53', '986') +
    amountTag +
    tlv('58', 'BR') +
    tlv('59', merchantName) +
    tlv('60', merchantCity) +
    tlv('62', tlv('05', txidClean)) +
    '6304'

  return body + computeCrc16Ccitt(body)
}

export function buildWhatsAppLink(phoneDigits: string, message: string): string {
  const cleanPhone = phoneDigits.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
