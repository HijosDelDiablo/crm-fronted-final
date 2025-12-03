import React from 'react';
import { Table } from 'react-bootstrap';
import StatusBadge from './StatusBadge';

const PaymentTable = ({ payments }) => {
    console.log('🔍 PaymentTable - Props recibidas:', { payments });
    console.log('🔍 PaymentTable - payments es array:', Array.isArray(payments));
    console.log('🔍 PaymentTable - longitud de payments:', payments?.length);

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Método de Pago</th>
                    <th>Registrado por</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {payments && payments.length > 0 ? (
                    payments.map((payment, index) => {
                        console.log('🔍 PaymentTable - Procesando pago:', index, payment);
                        return (
                            <tr key={payment._id || index}>
                                <td>{new Date(payment.fecha).toLocaleDateString('es-ES')}</td>
                                <td>${payment.monto?.toLocaleString('es-ES')}</td>
                                <td>{payment.metodoPago}</td>
                                <td>{payment.registradoPor?.nombre || 'Sistema'}</td>
                                <td><StatusBadge status={payment.status} /></td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">
                            No hay pagos registrados
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default PaymentTable;