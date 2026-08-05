/**
 * Estado abierto/cerrado de cada local.
 *
 * Todo se calcula en hora de Buenos Aires, no en la del visitante: alguien
 * mirando desde España tiene que ver si el local está abierto allá, no acá.
 * Intl con timeZone resuelve además el horario de verano sin tabla propia.
 */

const TZ = 'America/Argentina/Buenos_Aires';

const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const NOMBRE_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Devuelve { dia: 0-6, minutos: minutos desde medianoche } en Buenos Aires. */
const ahoraEnBuenosAires = (fecha) => {
    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone: TZ,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(fecha);

    const buscar = (tipo) => partes.find((p) => p.type === tipo)?.value;

    return {
        dia: DIAS[buscar('weekday')],
        minutos: Number(buscar('hour')) * 60 + Number(buscar('minute')),
    };
};

const aMinutos = (hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    return h * 60 + m;
};

const formatear = (minutos) =>
    `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

/**
 * Estado de un local ahora mismo.
 *
 * Devuelve null si el local no tiene horarios cargados: preferimos no mostrar
 * el cartel antes que afirmar que está cerrado sin saberlo.
 *
 *   { abierto: true,  detalle: 'Cierra 19:00' }
 *   { abierto: false, detalle: 'Abre mañana 08:30' }
 */
export const estadoLocal = (local, fecha = new Date()) => {
    const tramos = local?.horarios ?? [];
    if (!tramos.length || !tramos.every((t) => t.desde && t.hasta && Array.isArray(t.dias))) {
        return null;
    }

    const { dia, minutos } = ahoraEnBuenosAires(fecha);

    // ¿Algún tramo de hoy nos contiene?
    for (const t of tramos) {
        if (!t.dias.includes(dia)) continue;
        const desde = aMinutos(t.desde);
        const hasta = aMinutos(t.hasta);
        if (minutos >= desde && minutos < hasta) {
            return { abierto: true, detalle: `Cierra ${formatear(hasta)}` };
        }
    }

    // Cerrado: buscamos la próxima apertura mirando hasta 7 días adelante.
    for (let salto = 0; salto < 8; salto += 1) {
        const d = (dia + salto) % 7;
        const candidatos = tramos
            .filter((t) => t.dias.includes(d))
            .map((t) => aMinutos(t.desde))
            // Hoy solo cuentan las aperturas que todavía no pasaron.
            .filter((m) => salto > 0 || m > minutos)
            .sort((a, b) => a - b);

        if (candidatos.length === 0) continue;

        const cuando =
            salto === 0 ? 'hoy' : salto === 1 ? 'mañana' : `el ${NOMBRE_DIA[d]}`;
        return { abierto: false, detalle: `Abre ${cuando} ${formatear(candidatos[0])}` };
    }

    return { abierto: false, detalle: 'Consultá horarios' };
};