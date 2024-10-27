class Session {
  constructor(id) {
    this.id = id;
    this.clients = new Set();
  }
  join(client) {
    if (this.clients.has(client)) {
      console.log("Client already in session, ignoring join request");
      return;
    }
    this.clients.add(client);
    client.session = this;
  }
  leave(client) {
    if (client.session !== this) {
      throw new Error("Client not in session");
    }
    this.clients.delete(client);
    client.session = null;
  }
}

module.exports = Session;
