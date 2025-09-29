// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Cargar datos del usuario
    const userData = JSON.parse(user);
    document.getElementById('userCode').textContent = userData.codigo;
    document.getElementById('userName').textContent = userData.nombre;

    // Cargar notas
    cargarNotas(userData.codigo);

    // Configurar logout
    document.getElementById('.btn-logout').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});

async function cargarNotas(codigo) {
    try {
        const response = await fetch(`https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${codigo}/notas`);
        const notas = await response.json();
        
        mostrarNotas(notas);
        calcularPromedioPonderado(notas);
    } catch (error) {
        console.error('Error cargando notas:', error);
    }
}

function mostrarNotas(notas) {
    const tbody = document.getElementById('tablaNotas');
    tbody.innerHTML = '';

    notas.forEach(asignatura => {
        const definitiva = calcularDefinitiva(asignatura);
        
        const row = `
            <tr>
                <td>${asignatura.nombre}</td>
                <td>${asignatura.creditos}</td>
                <td>${asignatura.p1}</td>
                <td>${asignatura.p2}</td>
                <td>${asignatura.p3}</td>
                <td>${asignatura.ef}</td>
                <td>${definitiva.toFixed(1)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function calcularDefinitiva(asignatura) {
    const promedioParciales = (asignatura.p1 + asignatura.p2 + asignatura.p3) / 3;
    return (promedioParciales * 0.7) + (asignatura.ef * 0.3);
}

function calcularPromedioPonderado(notas) {
    let sumaPonderada = 0;
    let totalCreditos = 0;

    notas.forEach(asignatura => {
        const definitiva = calcularDefinitiva(asignatura);
        sumaPonderada += definitiva * asignatura.creditos;
        totalCreditos += parseInt(asignatura.creditos);
    });

    const promedio = sumaPonderada / totalCreditos;
    document.getElementById('promedioPonderado').textContent = promedio.toFixed(2);
}

document.getElementById('btn-logout').addEventListener('click', function() {
    // Borrar el usuario del localStorage
    localStorage.removeItem('user');
    // Redirigir al login
    window.location.href = 'index.html';
});