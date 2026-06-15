/**
 * PROYECTO: SIMULADOR DE LIQUIDACIÓN DE OBLIGACIONES
 * DESARROLLADOR: Nathalie Sabina
 * ASIGNATURA: Desarrollo Frontend / Base de Datos
 */

// Uso del método ready de jQuery para asegurar la carga completa de la UI
$(document).ready(function () {
    
    // 1. Tipos de datos: Inicialización de un arreglo global (Array de Objetos)
    let listadoRubros = [];

    // 2. Captura del evento de envío del formulario usando selectores de jQuery
    $('#formulario-pension').on('submit', function (evento) {
        evento.preventDefault(); // Detiene el comportamiento de recarga nativo

        // Extracción de valores de los inputs (Uso de selectores y variables locales)
        let periodoIngresado = $('#mes-periodo').val().trim();
        let pensionBase = parseFloat($('#monto-fijado').val());
        let porcentajeMora = parseFloat($('#porcentaje-recarga').val());

        // Sentencia de control (Validación lógica preventiva)
        if (isNaN(pensionBase) || pensionBase <= 0) {
            alert("Por favor, ingrese un monto de pensión válido superior a cero.");
            return; 
        }

        if (isNaN(porcentajeMora) || porcentajeMora < 0) {
            porcentajeMora = 0; // Corrección automática de datos por seguridad
        }

        // 3. Cálculos aritméticos estructurados
        let valorRecargo = pensionBase * (porcentajeMora / 100);
        let subtotalCalculado = pensionBase + valorRecargo;

        // 4. Estructuración de un objeto literal de JavaScript
        let nuevoRubro = {
            id: Date.now(), // Identificador único temporal numérico
            periodo: periodoIngresado,
            base: pensionBase,
            mora: valorRecargo,
            subtotal: subtotalCalculado
        };

        // Inyección del nuevo elemento al estado de nuestra matriz
        listadoRubros.push(nuevoRubro);

        // Llamadas a las funciones de actualización de la UI
        renderizarTabla();
        calcularConsolidado();
        limpiarCamposFormulario();
    });

    // 5. Función para renderizar dinámicamente las filas en la tabla mediante jQuery
    function renderizarTabla() {
        let $cuerpoTabla = $('#cuerpo-tabla');
        $cuerpoTabla.empty(); // Limpia los elementos preexistentes para evitar duplicación

        // Sentencia de control condicional para verificar si la matriz contiene registros
        if (listadoRubros.length === 0) {
            $cuerpoTabla.append(`
                <tr id="fila-vacia">
                    <td colspan="4" class="texto-alerta">No se han registrado rubros en la simulación actual.</td>
                </tr>
            `);
            return;
        }

        // Ciclo/Bucle: Uso de un iterador estructurado forEach para procesar la matriz
        listadoRubros.forEach(function (rubro) {
            let filaHtml = `
                <tr>
                    <td>${rubro.periodo}</td>
                    <td>$${rubro.base.toFixed(2)}</td>
                    <td>$${rubro.mora.toFixed(2)}</td>
                    <td style="font-weight: bold; color: #1e3a8a;">$${rubro.subtotal.toFixed(2)}</td>
                </tr>
            `;
            $cuerpoTabla.append(filaHtml); // Manipulación interactiva del DOM
        });
    }

    // 6. Función analítica para computar sumatorias (Funciones de simulación agregada)
    function calcularConsolidado() {
        let acumuladorCapital = 0;
        let acumuladorMora = 0;
        let acumuladorTotal = 0;

        // Iteración acumulativa de valores numéricos
        listadoRubros.forEach(function (item) {
            acumuladorCapital += item.base;
            acumuladorMora += item.mora;
            acumuladorTotal += item.subtotal;
        });

        // Actualización dinámica de elementos de texto en la pantalla
        $('#total-capital').text(`$${acumuladorCapital.toFixed(2)}`);
        $('#total-mora').text(`$${acumuladorMora.toFixed(2)}`);
        $('#total-consolidado').text(`$${acumuladorTotal.toFixed(2)}`);

        // 7. Sentencias de control anidadas para lógica de Alerta de Control Legal
        let $cajaAlerta = $('#alerta-legal');
        
        if (acumuladorTotal > 800) {
            $cajaAlerta.text("⚠️ ATENCIÓN LEGAL: El monto acumulado supera los límites preventivos. Sujeto a medidas cautelares de apremio parcial conforme al COGEP.")
                       .removeClass('alerta-oculta')
                       .addClass('alerta-activa');
        } else if (acumuladorTotal > 0 && acumuladorTotal <= 800) {
            $cajaAlerta.text("ℹ ESTADO REGULAR: Liquidación acumulada dentro del rango ordinario de mediación.")
                       .removeClass('alerta-oculta')
                       .addClass('alerta-activa');
        } else {
            $cajaAlerta.removeClass('alerta-activa').addClass('alerta-oculta');
        }
    }

    // 8. Función utilitaria para limpiar inputs
    function limpiarCamposFormulario() {
        $('#mes-periodo').val('');
        $('#monto-fijado').val('');
        $('#porcentaje-recarga').val('0');
        $('#mes-periodo').focus(); // Posiciona el cursor automáticamente para usabilidad
    }

    // 9. Captura de evento secundario: Botón para reiniciar toda la simulación
    $('#btn-limpiar').on('click', function () {
        listadoRubros = []; // Vacía por completo la matriz de datos
        renderizarTabla();
        calcularConsolidado();
    });
});