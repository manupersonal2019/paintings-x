// Variables globales
let cart = [];
let cartTotal = 0;

// Elementos DOM
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');
const imageInput = document.getElementById('imagen');
const imagePreview = document.getElementById('image-preview');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
});

// Event Listeners
function initializeEventListeners() {
    // Botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const size = this.dataset.size;
            const price = parseInt(this.dataset.price);
            addToCart(size, price);
        });
    });

    // Modal del carrito
    cartBtn.addEventListener('click', openCartModal);
    checkoutBtn.addEventListener('click', openCheckoutModal);

    // Cerrar modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target === cartModal || event.target === checkoutModal) {
            closeModals();
        }
    });

    // Preview de imagen
    imageInput.addEventListener('change', handleImagePreview);

    // Formulario de checkout
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Funciones del carrito
function addToCart(size, price) {
    const existingItem = cart.find(item => item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            size: size,
            price: price,
            quantity: 1,
            total: price
        });
    }
    
    updateCartDisplay();
    showNotification(`Lámina ${size} agregada al carrito`);
}

function removeFromCart(size) {
    cart = cart.filter(item => item.size !== size);
    updateCartDisplay();
    showNotification(`Lámina ${size} removida del carrito`);
}

function updateCartDisplay() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar total
    cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
    cartTotalElement.textContent = formatPrice(cartTotal);
    
    // Actualizar lista de items
    updateCartItems();
    
    // Habilitar/deshabilitar botón de checkout
    checkoutBtn.disabled = cart.length === 0;
}

function updateCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Tu carrito está vacío</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>Lámina ${item.size}</h4>
                <p>Cantidad: ${item.quantity}</p>
            </div>
            <div>
                <span class="cart-item-price">$${formatPrice(item.total)}</span>
                <button class="remove-item" onclick="removeFromCart('${item.size}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Funciones de modal
function openCartModal() {
    updateCartItems();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
    updateOrderSummary();
}

function closeModals() {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Preview de imagen
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        // Validar tamaño (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('La imagen es demasiado grande. Máximo 10MB.', 'error');
            event.target.value = '';
            return;
        }
        
        // Validar tipo
        if (!file.type.startsWith('image/')) {
            showNotification('Por favor selecciona una imagen válida.', 'error');
            event.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `
                <div style="text-align: center;">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 10px;">
                    <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">Imagen seleccionada: ${file.name}</p>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
    }
}

// Resumen del pedido
function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const finalTotal = document.getElementById('final-total');
    
    orderSummary.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>Lámina ${item.size} (${item.quantity}x)</span>
            <span>$${formatPrice(item.total)}</span>
        `;
        orderSummary.appendChild(orderItem);
    });
    
    finalTotal.textContent = formatPrice(cartTotal);
}

// Manejar envío del formulario
async function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Mostrar loading
    submitBtn.innerHTML = '<span class="loading"></span> Procesando...';
    submitBtn.disabled = true;
    
    try {
        // Validar formulario
        if (!validateForm()) {
            throw new Error('Por favor completa todos los campos obligatorios.');
        }
        
        // Recopilar datos del formulario
        const formData = new FormData(checkoutForm);
        const orderData = {
            cliente: {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                telefono: formData.get('telefono'),
                correo: formData.get('correo')
            },
            direccion: {
                direccion: formData.get('direccion'),
                departamento: formData.get('departamento'),
                municipio: formData.get('municipio'),
                referencia: formData.get('referencia')
            },
            productos: cart,
            total: cartTotal,
            metodoPago: formData.get('metodo_pago'),
            fecha: new Date().toISOString(),
            imagen: formData.get('imagen')
        };
        
        // Simular envío del pedido
        await processOrder(orderData);
        
        // Mostrar éxito
        showSuccessMessage(orderData);
        
        // Limpiar carrito y cerrar modal
        cart = [];
        updateCartDisplay();
        closeModals();
        checkoutForm.reset();
        imagePreview.innerHTML = '';
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Validar formulario
function validateForm() {
    const requiredFields = [
        'nombre', 'apellido', 'telefono', 'correo',
        'direccion', 'departamento', 'municipio', 'imagen'
    ];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.focus();
            return false;
        }
    }
    
    // Validar email
    const email = document.getElementById('correo').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('correo').focus();
        showNotification('Por favor ingresa un correo electrónico válido.', 'error');
        return false;
    }
    
    // Validar teléfono
    const telefono = document.getElementById('telefono').value;
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(telefono)) {
        document.getElementById('telefono').focus();
        showNotification('Por favor ingresa un número de teléfono válido.', 'error');
        return false;
    }
    
    return true;
}

// Procesar pedido
async function processOrder(orderData) {
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Aquí puedes integrar con tu sistema de backend
    console.log('Datos del pedido:', orderData);
    
    // Simular diferentes tipos de pago
    if (orderData.metodoPago === 'tarjeta') {
        // Aquí integrarías con Wompi o tu procesador de pagos
        await processCardPayment(orderData);
    } else {
        // Para transferencia, solo enviamos los datos
        await sendBankTransferInfo(orderData);
    }
}

// Procesar pago con tarjeta (ejemplo con Wompi)
async function processCardPayment(orderData) {
    // Ejemplo de integración con Wompi
    // En producción, deberías manejar esto desde tu backend
    
    const wompiUrl = 'https://checkout.wompi.co/p/';
    const reference = `ORDER_${Date.now()}`;
    
    // Parámetros para Wompi
    const wompiParams = {
        'public-key': 'TU_PUBLIC_KEY_DE_WOMPI', // Reemplaza con tu public key
        'currency': 'COP',
        'amount-in-cents': orderData.total * 100,
        'reference': reference,
        'redirect-url': window.location.href
    };
    
    // En un entorno real, redirigirías a Wompi o abrirías su widget
    console.log('Redirigiendo a Wompi con parámetros:', wompiParams);
}

// Enviar información de transferencia bancaria
async function sendBankTransferInfo(orderData) {
    // Aquí enviarías un email con los datos bancarios
    console.log('Enviando información bancaria a:', orderData.cliente.correo);
    
    // Simular envío de email con datos bancarios
    const bankInfo = {
        banco: "Banco de Bogotá",
        tipoCuenta: "Ahorros",
        numeroCuenta: "123-456-789",
        titular: "Tu Nombre",
        cedula: "12.345.678"
    };
    
    console.log('Datos bancarios enviados:', bankInfo);
}

// Mostrar mensaje de éxito
function showSuccessMessage(orderData) {
    const message = orderData.metodoPago === 'tarjeta' 
        ? 'Pedido confirmado. Serás redirigido al procesador de pagos.'
        : 'Pedido confirmado. Recibirás los datos bancarios por correo electrónico.';
    
    showNotification(message, 'success');
    
    // Enviar email de confirmación (simulado)
    sendConfirmationEmail(orderData);
}

// Enviar email de confirmación
function sendConfirmationEmail(orderData) {
    console.log('Enviando email de confirmación a:', orderData.cliente.correo);
    console.log('Detalles del pedido:', {
        numero: `ORD-${Date.now()}`,
        cliente: `${orderData.cliente.nombre} ${orderData.cliente.apellido}`,
        productos: orderData.productos,
        total: orderData.total,
        metodoPago: orderData.metodoPago
    });
}

// Funciones de utilidad
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO').format(price);
}

function showNotification(message, type = 'success') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error-message' : 'success-message'}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 3000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-width: 350px;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Función para scroll suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Animaciones CSS adicionales
const additionalCSS = `
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
`;

// Agregar CSS adicional
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Funciones para integración con servicios externos
class PaymentIntegration {
    static async initializeWompi() {
        // Cargar script de Wompi
        if (!window.WidgetCheckout) {
            const script = document.createElement('script');
            script.src = 'https://checkout.wompi.co/widget.js';
            script.async = true;
            document.head.appendChild(script);
            
            return new Promise((resolve) => {
                script.onload = resolve;
            });
        }
    }
    
    static async processWompiPayment(orderData) {
        await this.initializeWompi();
        
        const checkout = new WidgetCheckout({
            currency: 'COP',
            amountInCents: orderData.total * 100,
            reference: `ORDER_${Date.now()}`,
            publicKey: 'TU_PUBLIC_KEY_AQUI', // Reemplaza con tu clave
            redirectUrl: window.location.href,
            customerData: {
                email: orderData.cliente.correo,
                fullName: `${orderData.cliente.nombre} ${orderData.cliente.apellido}`,
                phoneNumber: orderData.cliente.telefono
            }
        });
        
        checkout.open((result) => {
            console.log('Resultado del pago:', result);
            if (result.transaction?.status === 'APPROVED') {
                showNotification('¡Pago procesado exitosamente!', 'success');
            } else {
                showNotification('Error en el procesamiento del pago.', 'error');
            }
        });
    }
}

// Funciones para manejo de archivos
class FileHandler {
    static async uploadImage(file, orderData) {
        // Simular subida de imagen
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (file.size > 10 * 1024 * 1024) {
                    reject(new Error('Archivo demasiado grande'));
                } else {
                    resolve({
                        url: URL.createObjectURL(file),
                        filename: `order_${Date.now()}_${file.name}`
                    });
                }
            }, 1000);
        });
    }
}

// Sistema de emails (simulado)
class EmailService {
    static async sendOrderConfirmation(orderData) {
        console.log('📧 Enviando confirmación de pedido...');
        
        const emailContent = {
            to: orderData.cliente.correo,
            subject: 'Confirmación de Pedido - Arte en Aluminio',
            html: this.generateOrderEmailTemplate(orderData)
        };
        
        // En producción, aquí usarías un servicio real como EmailJS, SendGrid, etc.
        console.log('Email enviado:', emailContent);
        return emailContent;
    }
    
    static generateOrderEmailTemplate(orderData) {
        const orderNumber = `ORD-${Date.now()}`;
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; text-align: center;">
                    <h1>¡Pedido Confirmado!</h1>
                    <p>Número de pedido: ${orderNumber}</p>
                </div>
                
                <div style="padding: 2rem;">
                    <h2>Detalles del pedido</h2>
                    <p><strong>Cliente:</strong> ${orderData.cliente.nombre} ${orderData.cliente.apellido}</p>
                    <p><strong>Email:</strong> ${orderData.cliente.correo}</p>
                    <p><strong>Teléfono:</strong> ${orderData.cliente.telefono}</p>
                    
                    <h3>Productos:</h3>
                    <ul>
                        ${orderData.productos.map(item => 
                            `<li>Lámina ${item.size} - Cantidad: ${item.quantity} - $${formatPrice(item.total)}</li>`
                        ).join('')}
                    </ul>
                    
                    <h3>Total: $${formatPrice(orderData.total)} COP</h3>
                    
                    <h3>Dirección de entrega:</h3>
                    <p>${orderData.direccion.direccion}<br>
                    ${orderData.direccion.municipio}, ${orderData.direccion.departamento}</p>
                    
                    ${orderData.metodoPago === 'transferencia' ? `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-top: 2rem;">
                            <h3>Datos para transferencia:</h3>
                            <p><strong>Banco:</strong> Banco de Bogotá</p>
                            <p><strong>Tipo de cuenta:</strong> Ahorros</p>
                            <p><strong>Número:</strong> 123-456-789</p>
                            <p><strong>Titular:</strong> Tu Nombre</p>
                            <p><strong>Cédula:</strong> 12.345.678</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Inicializar servicios
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Tienda de láminas de aluminio inicializada');
    console.log('📱 Sistema de carrito activo');
    console.log('💳 Métodos de pago configurados');
});
