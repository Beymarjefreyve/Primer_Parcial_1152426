// Función global para cerrar sesión
function cerrarSesion() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de notas cargada');
    
    const user = localStorage.getItem('user');
    console.log('Usuario en localStorage:', user);
    
    if (!user) {
        console.log('No hay usuario, redirigiendo al login');
        window.location.href = 'index.html';
        return;
    }

    // Cargar datos del usuario
    const userData = JSON.parse(user);
    console.log('Datos del usuario:', userData);
    
    // Actualizar información del usuario en la página
    const paragraphs = document.querySelectorAll('.header-card p');
    console.log('Párrafos encontrados:', paragraphs.length);
    
    if (paragraphs.length >= 3) {
        paragraphs[0].innerHTML = `<strong>Código:</strong> ${userData.codigo}`;
        paragraphs[1].innerHTML = `<strong>Nombre:</strong> ${userData.nombre}`;
        paragraphs[2].innerHTML = `<strong>Promedio:</strong> Cargando...`;
        console.log('Información del usuario actualizada');
    }

    // Cargar notas
    console.log('Cargando notas para código:', userData.codigo);
    cargarNotas(userData.codigo);

    // Configurar logout
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = cerrarSesion;
        console.log('Botón cerrar sesión configurado');
    } else {
        console.log('NO se encontró el botón cerrar sesión');
    }
});

async function cargarNotas(codigo) {
    try {
        console.log('Haciendo petición a la API...');
        const url = `https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${codigo}/notas`;
        console.log('URL:', url);
        
        const response = await fetch(url);
        console.log('Respuesta recibida, status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const notas = await response.json();
        console.log('Notas recibidas:', notas);
        
        mostrarNotas(notas);
        calcularPromedioPonderado(notas);
        
    } catch (error) {
        console.error('Error cargando notas:', error);
        const tbody = document.getElementById('tablaNotas');
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar las notas: ' + error.message + '</td></tr>';
    }
}

function mostrarNotas(notas) {
    console.log('Mostrando notas:', notas);
    const tbody = document.getElementById('tablaNotas');
    
    if (!notas || notas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay notas disponibles</td></tr>';
        console.log('No hay notas para mostrar');
        return;
    }

    tbody.innerHTML = '';
    notas.forEach((asignatura, index) => {
        console.log(`Asignatura ${index + 1}:`, asignatura);
        const definitiva = calcularDefinitiva(asignatura);
        
        const row = `
            <tr>
                <td>${asignatura.nombre || 'Sin nombre'}</td>
                <td>${asignatura.creditos || 0}</td>
                <td>${asignatura.p1 || 0}</td>
                <td>${asignatura.p2 || 0}</td>
                <td>${asignatura.p3 || 0}</td>
                <td>${asignatura.ef || 0}</td>
                <td>${definitiva.toFixed(1)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    console.log('Tabla actualizada con', notas.length, 'asignaturas');
}

function calcularDefinitiva(asignatura) {
    const p1 = parseFloat(asignatura.p1) || 0;
    const p2 = parseFloat(asignatura.p2) || 0;
    const p3 = parseFloat(asignatura.p3) || 0;
    const ef = parseFloat(asignatura.ef) || 0;
    
    const promedioParciales = (p1 + p2 + p3) / 3;
    return (promedioParciales * 0.7) + (ef * 0.3);
}

function calcularPromedioPonderado(notas) {
    if (!notas || notas.length === 0) {
        console.log('No hay notas para calcular promedio');
        return;
    }

    let sumaPonderada = 0;
    let totalCreditos = 0;

    notas.forEach(asignatura => {
        const definitiva = calcularDefinitiva(asignatura);
        const creditos = parseInt(asignatura.creditos) || 0;
        sumaPonderada += definitiva * creditos;
        totalCreditos += creditos;
    });

    if (totalCreditos > 0) {
        const promedio = sumaPonderada / totalCreditos;
        const paragraphs = document.querySelectorAll('.header-card p');
        if (paragraphs.length >= 3) {
            paragraphs[2].innerHTML = `<strong>Promedio:</strong> ${promedio.toFixed(2)}`;
            console.log('Promedio calculado:', promedio.toFixed(2));
        }
    }
}