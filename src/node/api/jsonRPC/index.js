const http = require('http')
const fs = require('fs')

const Response = require('./templates/response')
const Error = require('./templates/error')

module.exports = class jsonRPC {
  constructor (ledger, networking, port) {
    this.ledger = ledger
    this.networking = networking

    this.methods = new Map()
    this.updateMethods()

    this.listenRequests(port)
  }

  updateMethods () {
    const methodFiles = fs.readdirSync('./src/node/api/jsonRPC/methods').filter(file => file.endsWith('.js'))

    for (const file of methodFiles) {
      const method = require(`./methods/${file}`)
      this.methods.set(file.replace('.js', ''), method)
    }
  }

  listenRequests (port) {
    http.createServer((request, response) => {
      if (request.method === "POST") {
        let receivedData = Buffer.alloc(0)

        request.on("data", function (chunk) {
          receivedData = Buffer.concat([ receivedData, chunk ])
        })

        request.on("end", async () => {
          response.writeHead(200, { "Content-Type": "application/json" })

          try {
            const call = JSON.parse(receivedData)
            if (!this.methods.has(call.method)) return response.end(JSON.stringify(new Error("Unknown method").toJSON()))

            const returnedData = await (this.methods.get(call.method)).execute(call.args, {
              ledger: this.ledger,
              networking: this.networking
            })
          
            response.end(JSON.stringify(new Response(returnedData).toJSON()))
          } catch (err) {
            // TODO: Move writeHead to better places for better performance & error handling
            response.end(JSON.stringify(new Error(err.message).toJSON())) 
          }
        })
      } else {
        response.end(JSON.stringify(new Error("Only POST requests are allowed").toJSON())) 
      }
    }).listen(port)
  }
}