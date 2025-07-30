
var ingresosTotales = 0;
var egresosTotales = 0;
var miGrafica = null;

document.getElementById('ingresos').onclick = function() {
    var ingreso = parseFloat(document.getElementById('inputIngresos').value);

    if (isNaN(ingreso) || ingreso <= 0) {
        alert("Por favor, introduce un ingreso válido.");
        return;
    }

    ingresosTotales = ingreso;
    document.getElementById('ingresoMostrado').textContent = 'Tu ingreso total es: $' + ingresosTotales.toFixed(2);
    document.getElementById('inputIngresos').value = '';

    mostrarMensajeGuardado('mensajeGuardadoIngresos');
};

document.getElementById('eliminarIngreso').onclick = function() {
    ingresosTotales = 0;
    document.getElementById('ingresoMostrado').textContent = '';
    document.getElementById('inputIngresos').value = '';
};

var fechaInicio = '';
var fechaFin = '';

document.getElementById('fechaInicio').addEventListener('change', function() {
    fechaInicio = this.value;
    console.log("Fecha de inicio seleccionada:", fechaInicio);
});

document.getElementById('fechaFin').addEventListener('change', function() {
    fechaFin = this.value;
    console.log("Fecha de fin seleccionada:", fechaFin);
});

document.getElementById('egresos').onclick = function() {
    var zonaEgresos = document.getElementById('camposDinamicosEgresos');

    var bloque = document.createElement('div');
    bloque.className = 'bloque-egreso';

    var labelDesc = document.createElement('label');
    labelDesc.textContent = 'Descripción del egreso:';
    bloque.appendChild(labelDesc);

    bloque.appendChild(document.createElement('br'));

    var descripcionInput = document.createElement('input');
    descripcionInput.type = 'text';
    descripcionInput.className = 'descripcionEgreso';
    descripcionInput.placeholder = 'Descripción (ej. Renta)';
    bloque.appendChild(descripcionInput);

    bloque.appendChild(document.createElement('br'));

    var labelMonto = document.createElement('label');
    labelMonto.textContent = 'Monto del egreso:';
    bloque.appendChild(labelMonto);

    bloque.appendChild(document.createElement('br'));

    var montoInput = document.createElement('input');
    montoInput.type = 'number';
    montoInput.className = 'montoEgreso';
    montoInput.placeholder = 'Monto';
    bloque.appendChild(montoInput);

    bloque.appendChild(document.createElement('hr'));

    zonaEgresos.appendChild(bloque);
};

document.getElementById('eliminarEgreso').onclick = function() {
    var zonaEgresos = document.getElementById('camposDinamicosEgresos');
    var bloques = zonaEgresos.getElementsByClassName('bloque-egreso');

    if (bloques.length) {
        zonaEgresos.removeChild(bloques[bloques.length - 1]);
    }
};

document.getElementById('sumar').onclick = function() {
    if (!fechaInicio || !fechaFin) {
        alert("Selecciona un rango de fechas antes de registrar los egresos.");
        return;
    }

    var descripciones = document.getElementsByClassName('descripcionEgreso');
    var montos = document.getElementsByClassName('montoEgreso');
    egresosTotales = 0;

    var egresos = [];

    for (var i = 0; i < montos.length; i++) {
        var descripcion = descripciones[i].value || 'Egreso ' + (i + 1);
        var monto = parseFloat(montos[i].value);

        if (isNaN(monto) || monto <= 0) continue;

        egresosTotales += monto;
        egresos.push({
            descripcion: descripcion,
            monto: monto
        });
    }

    var saldo = ingresosTotales - egresosTotales;

    document.getElementById('resultadoTotal').textContent =
        'Ingresos Totales: $' + ingresosTotales.toFixed(2) + ' | ' +
        'Egresos Totales: $' + egresosTotales.toFixed(2) + ' | ' +
        'Saldo: $' + saldo.toFixed(2);

    var egresosData = {
        tipo: "egresos",
        total: egresosTotales,
        detalle: egresos,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    };

    var clave = "balance_" + fechaInicio + "_" + fechaFin + "_egresos";

    localStorage.setItem(clave, JSON.stringify(egresosData));

    mostrarMensajeGuardado('mensajeGuardadoEgresos');

    console.log("Egresos guardados en localStorage:", egresosData);
};

function mostrarMensajeGuardado(idMensaje) {
    const mensaje = document.getElementById(idMensaje);
    if (!mensaje) return;
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 2000);
}

document.getElementById('verTodo').onclick = function() {
    var historialDiv = document.getElementById('historialEgresos');
    historialDiv.innerHTML = '';

    var encontrado = false;

    for (var i = 0; i < localStorage.length; i++) {
        var clave = localStorage.key(i);
        if (clave.indexOf('balance_') === 0 && clave.lastIndexOf('_egresos') === clave.length - 8) {
            var datos = JSON.parse(localStorage.getItem(clave));
            if (datos && datos.detalle && datos.detalle.length > 0) {
                encontrado = true;
                var periodo = clave.replace('balance_', '').replace('_egresos', '').replace(/_/g, ' a ');
                var lista = '<ul>';
                for (var j = 0; j < datos.detalle.length; j++) {
                    var desc = datos.detalle[j].descripcion;
                    var monto = datos.detalle[j].monto.toFixed(2);
                    lista += '<li>' + desc + ' - $' + monto + '</li>';
                }
                lista += '</ul>';
                historialDiv.innerHTML += '<h4>Periodo: ' + periodo + '</h4>' + lista;
            }
        }
    }
    if (!encontrado) {
        historialDiv.innerHTML = '<p>No hay egresos registrados aún.</p>';
    }
};

document.getElementById('graficar').onclick = function() {
    var descripciones = document.getElementsByClassName('descripcionEgreso');
    var montos = document.getElementsByClassName('montoEgreso');

    if (montos.length === 0) {
        alert("No hay egresos registrados para graficar.");
        return;
    }

    var labels = [];
    var data = [];

    for (var i = 0; i < descripciones.length; i++) {
        var descripcion = descripciones[i].value || 'Egreso ' + (i + 1);
        var monto = parseFloat(montos[i].value);

        if (isNaN(monto) || monto <= 0) continue;

        labels.push(descripcion);
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
                            return context.label + ' - $' + context.parsed.toFixed(2);
                        }
                    }
                }
            }
        }
    });
};

