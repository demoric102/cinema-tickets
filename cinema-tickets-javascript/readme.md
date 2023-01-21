
# TicketService Implementation
The TicketService class is responsible for managing the purchase and reservation of tickets for a cinema. It allows users to add tickets to their cart, purchase them, and reserve seats for the purchased tickets. The class also includes various validation checks to ensure that the tickets being added and purchased are valid.

### Properties
`tickets` An array of Ticket objects representing the tickets in the user's cart.<br/>
`total` The total cost of the tickets in the user's cart.

### Methods
`addTicket(ticketTypeRequest: TicketTypeRequest)`
Adds a ticket of the specified type and quantity to the user's cart.

`ticketTypeRequest` is a TicketTypeRequest object containing the type of ticket and the quantity to be added.<br/>
Returns: The total cost of the tickets in the cart after the new ticket is added.<br/>
Throws: InvalidTicketTypeException if the ticket type is invalid.

`purchaseTickets(accountId: number, total: number)`
Purchases the tickets in the user's cart and reserves seats for them.

`accountId` The ID of the account making the purchase.<br/>
`total` The total cost of the tickets in the cart.<br/>
Returns: true if the purchase is successful, false otherwise.<br/>
Throws: InvalidAccountIdException if the account ID is invalid.<br/>
Throws: InvalidPurchaseException if the total amount is incorrect.

`reserveSeat(accountId: number, tickets: Array<Ticket>)`
Reserves seats for the purchased tickets.

`accountId` The ID of the account making the purchase.<br/>
`tickets` An array of Ticket objects representing the tickets for which seats are being reserved.<br/>
Returns: true if the seat reservation is successful, false otherwise.<br/>
Throws: InvalidSeatReservationException if the seat reservation fails.

# Instructions on how to use
This imlementation includes assertion library `chai` and framework `mocha`. There are test cases for objectives, business rules, constraints and assumptions. Run the following command to setup and execute tests respectively.

```
git pull <this-repo>
cd in cinema-tickets-javascript
npm install
npx mocha
```
