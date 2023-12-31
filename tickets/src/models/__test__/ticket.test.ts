import { Ticket } from "../ticket";

it('implements optimistic concurrency control', (done) => {
  
    async function runTest(){
        const ticket = Ticket.build({
            title: 'concert',
            price: 5,
            userId: '123'
          });
          ticket.save();
        
          const firstInstance = await Ticket.findById(ticket.id);
          const secondInstance = await Ticket.findById(ticket.id);
        
          firstInstance!.set({ price: 10 });
          secondInstance!.set({ price: 15 });
          await firstInstance?.save();
          try {
            await secondInstance?.save();
          } catch (err) {
            done(); 
            return;
          }
          throw new Error('Should not reach here');
    }
    runTest();
 
});
