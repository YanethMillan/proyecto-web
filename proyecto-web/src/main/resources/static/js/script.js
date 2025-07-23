var ingresosTotales = 0;
var egresosTotales = 0;
var miGrafica = null;

document.getElementById('ingresos').onclick = function() {
    var ingreso = parseFloat(document.getElementById('inputIngresos').value);

    ingresosTotales = ingreso;
    document.getElementById('ingresoMostrado').textContent = 'Tu ingreso total es: $' + ingresosTotales.toFixed(2);
    document.getElementById('inputIngresos').value = '';
};

document.getElementById('eliminarIngreso').onclick = function() {
    ingresosTotales = 0;
    document.getElementById('ingresoMostrado').textContent = '';
    document.getElementById('inputIngresos').value = '';
};

document.getElementById('egresos').onclick = function() {
    var container = document.getElementById('egresosContainer');

    container.appendChild(document.createElement('br'));

    var descripcionInput = document.createElement('input');
    descripcionInput.type = 'text';
    descripcionInput.className = 'descripcionEgreso';
    descripcionInput.placeholder = 'Descripción (ej. Renta)';
    container.appendChild(descripcionInput);

    var montoInput = document.createElement('input');
    montoInput.type = 'number';
    montoInput.className = 'montoEgreso';
    montoInput.placeholder = 'Monto';
    container.appendChild(montoInput);
};

document.getElementById('eliminarEgreso').onclick = function() {
    var container = document.getElementById('egresosContainer');
    var descripciones = container.getElementsByClassName('descripcionEgreso');
    var montos = container.getElementsByClassName('montoEgreso');
    var brs = container.getElementsByTagName('br');

    container.removeChild(descripciones[descripciones.length - 1]);
    container.removeChild(montos[montos.length - 1]);
    container.removeChild(brs[brs.length - 1]);
};

document.getElementById('sumar').onclick = function() {
    var montos = document.getElementsByClassName('montoEgreso');
    egresosTotales = 0;

    for (var i = 0; i < montos.length; i++) {
        egresosTotales += parseFloat(montos[i].value);
    }

    var saldo = ingresosTotales - egresosTotales;

    document.getElementById('resultadoTotal').textContent =
        'Ingresos Totales: $' + ingresosTotales.toFixed(2) + ' | ' +
        'Egresos Totales: $' + egresosTotales.toFixed(2) + ' | ' +
        'Saldo: $' + saldo.toFixed(2);
};

document.getElementById('graficar').onclick = function() {
    var descripciones = document.getElementsByClassName('descripcionEgreso');
    var montos = document.getElementsByClassName('montoEgreso');

    var labels = [];
    var data = [];

    for (var i = 0; i < descripciones.length; i++) {
        var descripcion = descripciones[i].value || 'Egreso ' + (i + 1);
        var monto = parseFloat(montos[i].value);

        labels.push(descripcion + ': $' + monto);
        data.push(monto);
    }

    if (miGrafica !== null) {
        miGrafica.destroy();
    }

    var ctx = document.getElementById('graficaPastel').getContext('2d');
    miGrafica = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800',
                    '#9C27B0', '#00BCD4', '#E91E63', '#CDDC39', '#3F51B5'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var label = context.label || '';
                            var value = context.parsed || 0;
                            return label + ' - $' + value;
                        }
                    }
                }
            }
        }
    });
};

