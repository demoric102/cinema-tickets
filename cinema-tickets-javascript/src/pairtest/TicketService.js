import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import Ticket from './lib/Ticket.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

const TICKETS = {
  INFANT: new Ticket("INFANT", 0),
  CHILD: new Ticket("CHILD", 10),
  ADULT: new Ticket("ADULT", 20)
};

const MAX_TICKETS = 20;


export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  constructor() {
    this.tickets = [];
    this.total = 0;
  }
  // Method to validate and add tickets to the cart
  addTicket(ticketTypeRequest) {
    try {
        if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
            return new Error("Invalid request. Please provide a valid TicketTypeRequest object.");
        }

        const { type, noOfTickets } = ticketTypeRequest;
        if (type === "INFANT" || type === "CHILD" && !this.tickets.find(ticket => ticket.type === "ADULT")) {
            return new Error("Cannot add Infant or Child ticket without purchasing an Adult ticket first.");
        }

        if (this.tickets.length + noOfTickets > MAX_TICKETS) {
            return new Error(`Cannot purchase more than ${MAX_TICKETS} tickets at a time.`);
        }

        const ticket = TICKETS[type];
        if (!ticket) {
            return new Error("Invalid ticket type. Please select a valid ticket type.");
        }

        if (type === "INFANT") {
            // check number of infants <= number of adults since infants sit on adults lap therefore cannot sit unattended
            let noOfAdults = this.tickets.filter(ticket => ticket.type === "ADULT").length;
            if (noOfTickets > noOfAdults) {
                return new Error("Number of Infant tickets should be less than or equal to number of Adult tickets.");
            }
        }

        this.tickets.push(...Array(noOfTickets).fill(ticket));
        this.total += ticket.price * noOfTickets;
        return true;
    } catch (err) {
        console.log(err.message);
        return false;
    }
  }

  //purchase tickets
  purchaseTickets(accountId, total) {
    try {
        if (total <= 0) {
            return new InvalidPurchaseException("The total amount is incorrect.");
        }
        if (accountId <= 0) {
            return new InvalidPurchaseException("Invalid account id. Purchase cannot be confirmed.");
        }
        const paymentService = new TicketPaymentService();
        paymentService.makePayment(accountId, total);
    } catch(error) {
        if(error instanceof InvalidPurchaseException) {
            console.log(error.message);
        } else {
            throw error;
        }
    }
    return true;
  }

  //reserve seat after payment
  reserveSeat(accountId, tickets) {
    try {
      if (!Array.isArray(tickets) || !tickets.length) {
        return new Error("No tickets provided for reservation.");
      }
      // Infant tickets don't have seats, so filter them out before reserving seats since they sit on adults lap
      const totalSeatsToAllocate = tickets.filter(ticket => ticket.type !== "INFANT").length;
      const reservationService = new SeatReservationService();
      reservationService.reserveSeat(accountId, totalSeatsToAllocate);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
