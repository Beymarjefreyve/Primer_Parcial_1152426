// Verificar si ya está autenticado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada');
    
    const user = localStorage.getItem('user');
    console.log('Usuario en localStorage:', user);
    
    if (user) {
        console.log('Usuario encontrado, redirigiendo...');
        window.location.href = 'notas.html';
    }

    document.getElementById('formulario').addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    console.log('Formulario enviado');
    
    const codigo = document.getElementById('codigo').value;
    const password = document.getElementById('exampleInputPassword1').value;
    console.log('Código:', codigo, 'Password:', password);

    try {
        console.log('Haciendo petición a la API...');
        const response = await fetch('https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigo: codigo,
                clave: password
            })
        });

        console.log('Respuesta recibida, status:', response.status);
        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data.login === true) {
            console.log('Login exitoso, guardando en localStorage...');
            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));
            console.log('Usuario guardado:', data);
            
            // Redirigir a notas
            console.log('Redirigiendo a notas.html...');
            window.location.href = 'notas.html';
        } else {
            console.log('Login fallido');
            throw new Error('Credenciales inválidas');
        }
    } catch (error) {
        console.log('Error:', error);
        // Crear mensaje de error si no existe
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'alert alert-danger mt-3';
            document.getElementById('formulario').appendChild(errorDiv);
        }
        
        errorDiv.textContent = 'Credenciales no válidas';
        errorDiv.classList.remove('d-none');
        
        // Limpiar campos
        document.getElementById('codigo').value = '';
        document.getElementById('exampleInputPassword1').value = '';
    }
}

