const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('notify_session')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        defaultQueryTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
        patchMessageBeforeSending: (msg) => {
            return msg
        }
    })
    
    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, qr, isNewLogin } = update
        
        if (qr) {
            console.log('')
            console.log('PAIRING CODE:', await sock.requestPairingCode('2349033047066'))
            console.log('')
            console.log('1. Open WhatsApp')
            console.log('2. Tap ⋮ or Settings')
            console.log('3. Linked Devices')
            console.log('4. Link a Device')
            console.log('5. Enter the code above')
            console.log('')
        }
        
        if (connection === 'open') {
            console.log('CONNECTED!')
        }
    })
    
    sock.ev.on('messaging-history.set', ({ messages }) => {
        console.log('WhatsApp acknowledged the connection!')
    })
}

start()
