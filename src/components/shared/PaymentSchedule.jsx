import React from 'react';
import { Table } from 'react-bootstrap';

const PaymentSchedule = ({ schedule }) => {
    if (!schedule || schedule.length === 0) {
        return <div className="text-center p-3">No hay calendario de pagos disponible.</div>;
    }

    return (
        <div className="payment-schedule-container">
            <h4 className="mb-3">Calendario de Pagos</h4>
            <Table striped bordered hover responsive className="table-dark">
                <thead>
                    <tr>
                        <th>Mes</th>
                        <th>Pago</th>
                        <th>Interés</th>
                        <th>Capital</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((item, index) => (
                        <tr key={index}>
                            <td>{item.mes || index + 1}</td>
                            <td>{typeof item.pago === 'number' ? `$${item.pago.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : item.pago}</td>
                            <td>{typeof item.interes === 'number' ? `$${item.interes.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : item.interes}</td>
                            <td>{typeof item.capital === 'number' ? `$${item.capital.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : item.capital}</td>
                            <td>{typeof item.saldo === 'number' ? `$${item.saldo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : item.saldo}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default PaymentSchedule;
