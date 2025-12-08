export const calculateAmortizationSchedule = (principal, annualRate, months) => {
    if (!principal || !annualRate || !months) return [];
    
    const monthlyRate = annualRate / 12 / 100;
    const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    
    let balance = principal;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
        const interest = balance * monthlyRate;
        const capital = monthlyPayment - interest;
        balance -= capital;

        // Adjust for last month precision
        if (i === months && Math.abs(balance) < 10) { // Tolerance for rounding
             balance = 0;
        }

        schedule.push({
            mes: i,
            pago: monthlyPayment,
            interes: interest,
            capital: capital,
            saldo: balance > 0 ? balance : 0
        });
    }
    return schedule;
};
