const moongose = require("mongoose");

const ticketSchema = new moongose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },

  purchase_datatime: {
    type: Date,
    default: Date.now,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  pruchaser: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const TicketModel = moongose.model("Ticket", ticketSchema);

module.exports = TicketModel;
