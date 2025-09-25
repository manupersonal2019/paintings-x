// 📱 INTEGRACIÓN CON WHATSAPP BUSINESS
// Este archivo te permite enviar pedidos directamente a WhatsApp

class WhatsAppIntegration {
    constructor(phoneNumber) {
        this.phoneNumber = phoneNumber.replace(/[^\d]/g, ''); // Solo números
        this.baseUrl = 'https://wa.me/';
    }

    // Enviar pedido completo por WhatsApp
    sendOrder(orderData) {
        const message = this.formatOrderMessage(orderData);
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp en una nueva ventana
        window.open(whatsappUrl, '_blank');
    }

    // Formatear mensaje del pedido
    formatOrderMessage(orderData) {
        const orderNumber = `ORD-${Date.now()}`;
        
        let message = `🎨 *NUEVO PEDIDO DE LÁMINA DE ALUMINIO* 🎨\n\n`;
        message += `📋 *Número de Pedido:* ${orderNumber}\n\n`;
        
        // Datos del cliente
        message += `👤 *DATOS DEL CLIENTE*\n`;
        message += `• Nombre: ${orderData.cliente.nombre} ${orderData.cliente.apellido}\n`;
        message += `• Teléfono: ${orderData.cliente.telefono}\n`;
        message += `• Email: ${orderData.cliente.correo}\n\n`;
        
        // Productos
        message += `🛒 *PRODUCTOS SOLICITADOS*\n`;
        orderData.productos.forEach(item => {
            message += `• Lámina ${item.size} - Cantidad: ${item.quantity} - $${this.formatPrice(item.total)}\n`;
        });
        message += `\n💰 *Total: $${this.formatPrice(orderData.total)} COP*\n\n`;
        
        // Dirección
        message += `📍 *DIRECCIÓN DE ENTREGA*\n`;
        message += `• ${orderData.direccion.direccion}\n`;
        message += `• ${orderData.direccion.municipio}, ${orderData.direccion.departamento}\n`;
        if (orderData.direccion.referencia) {
            message += `• Referencia: ${orderData.direccion.referencia}\n`;
        }
        message += `\n`;
        
        // Método de pago
        message += `💳 *MÉTODO DE PAGO*\n`;
        message += `• ${orderData.metodoPago === 'transferencia' ? '🏦 Transferencia Bancaria' : '💳 Tarjeta de Crédito'}\n\n`;
        
        message += `📸 *Imagen adjunta en el formulario web*\n\n`;
        message += `✅ El cliente completó el pedido en: ${window.location.href}`;
        
        return message;
    }

    // Formatear precio
    formatPrice(price) {
        return new Intl.NumberFormat('es-CO').format(price);
    }

    // Enviar mensaje de consulta rápida
    sendQuickConsultation(message = "Hola, me interesa conocer más sobre las láminas de aluminio personalizadas.") {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Enviar cotización personalizada
    sendCustomQuote(details) {
        let message = `🎨 *SOLICITUD DE COTIZACIÓN PERSONALIZADA*\n\n`;
        
        if (details.size) {
            message += `📏 Tamaño deseado: ${details.size}\n`;
        }
        if (details.quantity) {
            message += `🔢 Cantidad: ${details.quantity}\n`;
        }
        if (details.description) {
            message += `📝 Descripción: ${details.description}\n`;
        }
        if (details.budget) {
            message += `💰 Presupuesto estimado: $${details.budget}\n`;
        }
        
        message += `\n📱 Enviado desde: ${window.location.href}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Configuración para WhatsApp Business
const WHATSAPP_CONFIG = {
    // Tu número de WhatsApp Business (con código de país, sin +)
    businessPhone: "573001234567", // Cambia por tu número real
    
    // Mensajes predefinidos
    messages: {
        consultation: "Hola, me interesa conocer más sobre las láminas de aluminio personalizadas. ¿Podrían darme más información?",
        pricing: "Hola, me gustaría conocer los precios de las láminas de aluminio en diferentes tamaños.",
        process: "Hola, ¿cómo es el proceso para hacer un pedido de lámina personalizada?",
        shipping: "Hola, ¿hacen envíos a todo el país? Me gustaría conocer los costos de envío.",
        urgent: "Hola, necesito una lámina de aluminio con urgencia. ¿Cuál es el tiempo mínimo de entrega?"
    },
    
    // Horarios de atención (opcional)
    businessHours: {
        monday: "9:00-18:00",
        tuesday: "9:00-18:00", 
        wednesday: "9:00-18:00",
        thursday: "9:00-18:00",
        friday: "9:00-18:00",
        saturday: "9:00-14:00",
        sunday: "Cerrado"
    }
};

// Inicializar WhatsApp Integration
const whatsApp = new WhatsAppIntegration(WHATSAPP_CONFIG.businessPhone);

// Funciones auxiliares para uso en el sitio web
function sendOrderToWhatsApp(orderData) {
    whatsApp.sendOrder(orderData);
}

function openWhatsAppConsultation(messageType = 'consultation') {
    const message = WHATSAPP_CONFIG.messages[messageType] || WHATSAPP_CONFIG.messages.consultation;
    whatsApp.sendQuickConsultation(message);
}

function openCustomQuote() {
    // Mostrar formulario rápido para cotización
    const quoteModal = createQuoteModal();
    document.body.appendChild(quoteModal);
    quoteModal.style.display = 'block';
}

function createQuoteModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Solicitar Cotización Personalizada</h3>
                <span class="close" onclick="closeQuoteModal()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="quote-form">
                    <div class="form-group">
                        <label>Tamaño deseado:</label>
                        <input type="text" id="quote-size" placeholder="Ej: 50x70 cm">
                    </div>
                    <div class="form-group">
                        <label>Cantidad:</label>
                        <input type="number" id="quote-quantity" min="1" value="1">
                    </div>
                    <div class="form-group">
                        <label>Descripción del proyecto:</label>
                        <textarea id="quote-description" placeholder="Describe tu proyecto, tipo de imagen, acabado deseado, etc."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Presupuesto estimado:</label>
                        <input type="number" id="quote-budget" placeholder="Opcional">
                    </div>
                    <button type="submit" class="submit-btn">
                        <i class="fab fa-whatsapp"></i> Enviar por WhatsApp
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // Event listener para el formulario
    modal.querySelector('#quote-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const details = {
            size: document.getElementById('quote-size').value,
            quantity: document.getElementById('quote-quantity').value,
            description: document.getElementById('quote-description').value,
            budget: document.getElementById('quote-budget').value
        };
        
        whatsApp.sendCustomQuote(details);
        closeQuoteModal();
    });
    
    return modal;
}

function closeQuoteModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Agregar botones de WhatsApp al sitio
function addWhatsAppButtons() {
    // Botón flotante de WhatsApp
    const floatingBtn = document.createElement('div');
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #25D366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.3s ease;
    `;
    floatingBtn.innerHTML = '<i class="fab fa-whatsapp" style="color: white; font-size: 30px;"></i>';
    floatingBtn.onclick = () => openWhatsAppConsultation();
    
    // Efecto hover
    floatingBtn.addEventListener('mouseenter', () => {
        floatingBtn.style.transform = 'scale(1.1)';
    });
    floatingBtn.addEventListener('mouseleave', () => {
        floatingBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(floatingBtn);
    
    // Agregar botones en la sección de contacto
    addContactWhatsAppButtons();
}

function addContactWhatsAppButtons() {
    const contactSection = document.querySelector('.contact-info');
    if (!contactSection) return;
    
    const whatsappItem = document.createElement('div');
    whatsappItem.className = 'contact-item';
    whatsappItem.innerHTML = `
        <i class="fab fa-whatsapp" style="color: #25D366;"></i>
        <div>
            <h4>WhatsApp</h4>
            <button onclick="openWhatsAppConsultation()" style="background: #25D366; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
                Chatear Ahora
            </button>
        </div>
    `;
    
    contactSection.appendChild(whatsappItem);
}

// Auto-inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Agregar Font Awesome para iconos de WhatsApp si no está presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Agregar botones de WhatsApp después de un pequeño delay
    setTimeout(addWhatsAppButtons, 1000);
});

// Función para verificar horarios de atención
function isBusinessOpen() {
    const now = new Date();
    const day = now.toLocaleLowerCase().substring(0, 3); // lun, mar, mié, etc.
    const time = now.getHours() * 100 + now.getMinutes(); // HHMM format
    
    const todayHours = WHATSAPP_CONFIG.businessHours[day];
    if (!todayHours || todayHours === 'Cerrado') return false;
    
    const [openTime, closeTime] = todayHours.split('-');
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const openTimeNum = openHour * 100 + openMin;
    const closeTimeNum = closeHour * 100 + closeMin;
    
    return time >= openTimeNum && time <= closeTimeNum;
}

// Mostrar estado de disponibilidad
function showBusinessStatus() {
    const isOpen = isBusinessOpen();
    const statusElement = document.createElement('div');
    statusElement.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: ${isOpen ? '#25D366' : '#666'};
        color: white;
        padding: 8px 12px;
        border-radius: 15px;
        font-size: 12px;
        z-index: 999;
    `;
    statusElement.textContent = isOpen ? '🟢 En línea' : '🔴 Fuera de horario';
    document.body.appendChild(statusElement);
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => statusElement.remove(), 3000);
}

// Exportar funciones para uso global
window.WhatsAppIntegration = {
    sendOrderToWhatsApp,
    openWhatsAppConsultation,
    openCustomQuote,
    isBusinessOpen,
    showBusinessStatus
};
