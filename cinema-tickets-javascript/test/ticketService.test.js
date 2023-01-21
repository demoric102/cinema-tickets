import assert from 'assert';
import { expect } from 'chai';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketService from '../src/pairtest/TicketService.js';
import Ticket from '../src/pairtest//lib/Ticket.js';

const TICKETS = {
    INFANT: new Ticket("INFANT", 0),
    CHILD: new Ticket("CHILD", 10),
    ADULT: new Ticket("ADULT", 20)
};

describe('TicketService', () => {
    let ticketService;
    beforeEach(() => {
        ticketService = new TicketService();
    });
    describe('#addTicket()', () => {
        it('should add a valid ticket', () => {
            const validTicket = new TicketTypeRequest("ADULT", 5);
            ticketService.addTicket(validTicket);
            assert.equal(ticketService.total, 100);
        });
        it("should return an error object when an invalid TicketTypeRequest object is passed", () => {
            const invalidTicketTypeRequest = { type: "ADULT", noOfTickets: 2 };
            const result = ticketService.addTicket(invalidTicketTypeRequest);
            assert(result instanceof Error);
            expect(result.message).to.equal('Invalid request. Please provide a valid TicketTypeRequest object.');
        });
    
        it('should not add an infant or child ticket without an adult', () => {
            const invalidTicket = new TicketTypeRequest("INFANT", 2);
            const result = ticketService.addTicket(invalidTicket);
            assert(result instanceof Error);
            expect(result.message).to.equal('Cannot add Infant or Child ticket without purchasing an Adult ticket first.');
        });
        it('should not add more than 20 tickets', () => {
            const invalidTicket = new TicketTypeRequest("ADULT", 21);
            const result = ticketService.addTicket(invalidTicket);
            assert(result instanceof Error);
            expect(result.message).to.equal('Cannot purchase more than 20 tickets at a time.');
        });
    });
    describe('#purchaseTickets()', () => {
        it('should purchase tickets for valid account id', () => {
            const validAccountId = 1;
            const validTicket = new TicketTypeRequest("ADULT", 2);
            ticketService.addTicket(validTicket);
            assert.equal(ticketService.purchaseTickets(validAccountId, ticketService.total), true);
        });
        it('should throw invalid purchase exception for invalid account id', () => {
            const invalidAccountId = 0;
            const validTicket = new TicketTypeRequest("ADULT", 2);
            ticketService.addTicket(validTicket);
            const result = ticketService.purchaseTickets(invalidAccountId, ticketService.total);
            assert(result instanceof InvalidPurchaseException);
            expect(result.message).to.equal('Invalid account id. Purchase cannot be confirmed.');
        });
    });
    describe('#reserveSeat()', () => {
        it('should reserve only adult seats after payment', () => {
            const validAccountId = 1;
            const tickets = [];
            tickets.push(...Array(5).fill(TICKETS["INFANT"]));
            tickets.push(...Array(7).fill(TICKETS["ADULT"]));
            assert.equal(ticketService.reserveSeat(validAccountId, tickets), true);
        });
    });
});