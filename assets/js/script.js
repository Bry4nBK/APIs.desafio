async function convert() {
    const amount = document.getElementById('cantidad').value;
    const fromCurrency = 'CLP';
    const toCurrency = document.getElementById('toCurrency').value;

    if(toCurrency == "")
    {
        alert("Debe seleccionar una divisa");
    }
    else
    {
        if(amount > 0)
        {
            try {
                var inputElement = document.getElementById('cantidad');
                inputElement.value = '';
                const response = await fetch(`https://mindicador.cl/api/${toCurrency}`);
                const data = await response.json();
                const historicalData = data.serie.slice(0, 10);

                const dates = historicalData.map(entry => new Date(entry.fecha));
                const exchangeRates = historicalData.map(entry => entry.valor);

                const ctx = document.getElementById('graficoHistorico').getContext('2d');
                const existingChart = Chart.getChart(ctx);
                if (existingChart) {                
                    existingChart.destroy();
                }
                const graficoHistorico = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Historial últimos 10 días',
                            data: exchangeRates,
                            borderColor: 'red',
                            borderWidth: 2,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day',
                                    tooltipFormat: 'yyyy-MM-dd'
                                },
                                title: {
                                    display: true,
                                    text: 'Fechas'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Tasa de Cambio'
                                }
                            }
                        }
                    }
                });
                const conversionRate = historicalData[0].valor;
                const result = (amount / conversionRate).toFixed(2);
                document.getElementById('result').textContent = `${amount} ${fromCurrency} equivale a ${result} ${toCurrency}`;
            } catch (error) {
                console.error('Error al convertir la moneda:', error);
                document.getElementById('result').textContent = 'Error al convertir la moneda. Por favor, intentalo de nuevo.';
            }
        }
        else{
            document.getElementById('result').textContent = 'Error al convertir la moneda. El valor no debe ser negativo.';
        }
    }
}

