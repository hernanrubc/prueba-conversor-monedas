async function obtenerDatos(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('Error de red');
        return await respuesta.json();
    } catch (error) {
        document.getElementById('resultado').innerText = `Error: ${error.message}`;
        throw error;
    }
}

async function obtenerTipoCambio() {
    const datos = await obtenerDatos('https://mindicador.cl/api');
    return datos;
}

async function convertirMoneda() {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;
    const tiposCambio = await obtenerTipoCambio();

    if (tiposCambio && monto) {
        const tipoCambio = tiposCambio[moneda].valor;
        const montoConvertido = (monto / tipoCambio).toFixed(2);

        let simboloMoneda = '';
        if (moneda === 'euro') {
            simboloMoneda = '€';
        } else if (moneda === 'dolar') {
            simboloMoneda = 'US$';
        }

        document.getElementById('resultado').innerText = `Resultado: ${simboloMoneda} ${montoConvertido}`;
        renderizarGrafico(moneda);
    } else {
        document.getElementById('resultado').innerText = 'Por favor, ingrese un monto válido.';
    }
}

async function renderizarGrafico(moneda) {
    const datos = await obtenerDatos(`https://mindicador.cl/api/${moneda}`);
    const etiquetas = datos.serie.slice(0, 10).map(item => item.fecha.split('T')[0]).reverse();
    const valores = datos.serie.slice(0, 10).map(item => item.valor).reverse();

    const contexto = document.getElementById('miGrafico').getContext('2d');
    new Chart(contexto, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: `Historial de los últimos 10 días (${moneda.toUpperCase()})`,
                data: valores,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

document.getElementById('convertir').addEventListener('click', convertirMoneda);
