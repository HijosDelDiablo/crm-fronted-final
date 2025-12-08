import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMisPagos } from '../../api/pagos.api';
import StatusBadge from '../../components/shared/StatusBadge';
import DashboardLayout from '../../components/layout/DashboardLayaut';
import { Search, Calendar, CreditCard, Filter } from 'lucide-react';
import './MisPagos.css';

const MisPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const data = await getMisPagos(navigate);
                setPagos(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Error al cargar los pagos');
                setPagos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, [navigate]);

    // Get unique payment methods for filter
    const uniquePaymentMethods = [...new Set(pagos.map(p => p.metodoPago).filter(Boolean))];

    const getCompraInfo = (pago) => {
        if (!pago.compra) return 'N/A';
        if (pago.compra.cotizacion?.coche) {
            const coche = pago.compra.cotizacion.coche;
            if (typeof coche === 'object' && coche.marca && coche.modelo) {
                return `${coche.marca} ${coche.modelo}`;
            }
            if (typeof coche === 'object' && coche.nombre) {
                return coche.nombre;
            }
            if (typeof coche === 'string') {
                return `ID: ${coche}`;
            }
        }
        return `Compra #${pago.compra._id?.slice(-6)}`;
    };

    const filteredPagos = pagos.filter(pago => {
        const matchSearch = getCompraInfo(pago).toLowerCase().includes(searchTerm.toLowerCase());

        const pagoDate = new Date(pago.fecha);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Adjust end date to include the full day
        if (end) end.setHours(23, 59, 59, 999);

        const matchDate = (!start || pagoDate >= start) && (!end || pagoDate <= end);
        const matchMethod = !paymentMethod || pago.metodoPago === paymentMethod;

        return matchSearch && matchDate && matchMethod;
    });

    const sortedPagos = [...filteredPagos].sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    if (loading) {
        return (
            <DashboardLayout>
                <Container className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="pagos-container">
                <div className="pagos-header">
                    <h2 className="pagos-title">Historial de Pagos</h2>
                    <div className="text-muted">
                        Total: {filteredPagos.length} transacciones
                    </div>
                </div>

                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                <div className="pagos-filters">
                    <div className="filter-group">
                        <label className="filter-label">Buscar Compra</label>
                        <div className="position-relative">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                            <input
                                type="text"
                                className="filter-input ps-5"
                                placeholder="Ej: Mazda 3..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Desde</label>
                        <div className="position-relative">
                            <input
                                type="date"
                                className="filter-input"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Hasta</label>
                        <div className="position-relative">
                            <input
                                type="date"
                                className="filter-input"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Método de Pago</label>
                        <div className="position-relative">
                            <CreditCard className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                            <select
                                className="filter-input filter-select ps-5"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {uniquePaymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pagos-table-container">
                    {sortedPagos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h4>No se encontraron pagos</h4>
                            <p>Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <table className="pagos-table">
                            <thead>
                                <tr>
                                    <th>Compra / Vehículo</th>
                                    <th>Monto</th>
                                    <th>Método</th>
                                    <th
                                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                    >
                                        Fecha {sortOrder === 'desc' ? '↓' : '↑'}
                                    </th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPagos.map((pago) => (
                                    <tr key={pago._id}>
                                        <td data-label="Compra">
                                            <span className="fw-medium">{getCompraInfo(pago)}</span>
                                        </td>
                                        <td data-label="Monto">
                                            <span className="cell-monto">
                                                ${pago.monto?.toLocaleString('es-ES')}
                                            </span>
                                        </td>
                                        <td data-label="Método">
                                            <span className="cell-metodo">
                                                {pago.metodoPago}
                                            </span>
                                        </td>
                                        <td data-label="Fecha">
                                            <span className="cell-fecha">
                                                {new Date(pago.fecha).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td data-label="Estado">
                                            <StatusBadge status={pago.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MisPagos;
