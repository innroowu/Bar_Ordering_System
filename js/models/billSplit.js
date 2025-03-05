class BillSplit {
    constructor(totalAmount) {
        this.totalAmount = totalAmount;
        this.participants = [];
    }

    // Set the number of people to split the bill
    setParticipants(count) {
        this.participants = new Array(count).fill(0);
        return this.participants;
    }

    // Set payment amount for each person
    setParticipantPayment(index, amount) {
        if (index >= 0 && index < this.participants.length) {
            this.participants[index] = amount;
        }
    }

    // Verify that the ledger is correct
    validateSplit() {
        const totalPaid = this.participants.reduce((a, b) => a + b, 0);
        return Math.abs(totalPaid - this.totalAmount) < 0.01;
    }

    // Get account summary
    getSplitSummary() {
        return this.participants.map((amount, index) => ({
            participantNumber: index + 1,
            amount: amount
        }));
    }
}
