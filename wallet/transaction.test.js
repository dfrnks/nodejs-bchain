const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;

        recipient = 'r3c1p13nt';

        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });

    it ('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it ('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it ('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;

        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    it ('invalidates a corrupt transaction 2', () => {
        transaction.input.address = '04e4d7792fb54f278fabdf21a49617c2f9edb4c2b8a050f63be7314dcee9ea98b421e4dc8aee0d87e65e4cea261b479599306236b5d25a18eba32da09928210615';

        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    // it ('invalidates a corrupt transaction 3', () => {
    //     transaction.input.amount = 300;
    //
    //     expect(Transaction.verifyTransaction(transaction)).toBe(false);
    // });

    describe('transacting with an amount that exceeds tha balance', () => {
        beforeEach(() => {
            amount = 5000;

            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('does not create the transaction', () => {
            expect(transaction).toEqual(false);
        });
    });

    describe('and updating a transaction', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr355';

            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it (`subtracts the next amount from the sender's output`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it ('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount);
        })
    })

});
