// Configuración de Wompi para El Salvador
// Documentación: https://docs.wompi.sv/

class WompiPayment {
    constructor() {
        // Configuración para El Salvador
        this.publicKey = 'pub_prod_your_key_here'; // Reemplazar con tu clave pública real
        this.apiUrl = 'https://api.wompi.sv'; // URL para El Salvador
        this.currency = 'USD';
        this.country = 'SV'; // El Salvador
    }

    // Inicializar Wompi
    init() {
        // Cargar el SDK de Wompi
        if (!window.Wompi) {
            const script = document.createElement('script');
            script.src = 'https://sdk.wompi.sv/wompi.js';
            script.onload = () => {
                console.log('Wompi SDK cargado');
                this.wompi = new window.Wompi(this.publicKey);
            };
            script.onerror = () => {
                console.error('Error al cargar Wompi SDK');
            };
            document.head.appendChild(script);
        }
    }

    // Procesar pago
    async processPayment(orderData) {
        try {
            const paymentData = {
                amount_in_cents: Math.round(orderData.total * 100),
                currency: this.currency,
                reference: orderData.reference,
                customer_email: orderData.customerEmail || 'cliente@email.com',
                redirect_url: orderData.redirectUrl || window.location.href,
                payment_methods: {
                    installments: [1, 3, 6, 12] // Cuotas disponibles
                }
            };

            // Si Wompi está disponible, usar el SDK
            if (window.Wompi) {
                const transaction = await this.wompi.createTransaction(paymentData);
                
                if (transaction.data && transaction.data.payment_link_url) {
                    // Redirigir al formulario de pago de Wompi
                    window.open(transaction.data.payment_link_url, '_blank');
                    return {
                        success: true,
                        transaction_id: transaction.data.id,
                        payment_url: transaction.data.payment_link_url
                    };
                }
            }
            
            // Fallback: enviar por WhatsApp para coordinación manual
            return this.fallbackToWhatsApp(orderData);
            
        } catch (error) {
            console.error('Error en el procesamiento de pago:', error);
            return this.fallbackToWhatsApp(orderData);
        }
    }

    // Método de respaldo - enviar por WhatsApp
    fallbackToWhatsApp(orderData) {
        const message = this.generateCardPaymentMessage(orderData);
        const whatsappNumber = "50372297295";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        return {
            success: true,
            method: 'whatsapp',
            message: 'Pedido enviado por WhatsApp para coordinación de pago'
        };
    }

    generateCardPaymentMessage(orderData) {
        let message = `💳 *PEDIDO CON PAGO DE TARJETA* 💳\n\n`;
        message += `📋 *Número de Pedido:* ${orderData.reference}\n\n`;
        
        message += `🛒 *PRODUCTOS SOLICITADOS*\n`;
        if (orderData.items) {
            orderData.items.forEach(item => {
                message += `• ${item.name} - Cantidad: ${item.quantity} - $${item.total.toFixed(2)}\n`;
            });
        }
        message += `\n💰 *Total: $${orderData.total.toFixed(2)} USD*\n\n`;
        
        message += `🚚 *ENVÍO GRATIS* en toda El Salvador\n\n`;
        
        message += `💳 *MÉTODO DE PAGO:* Tarjeta de Crédito/Débito\n`;
        message += `🔒 *Procesamiento:* Wompi (Seguro)\n`;
        message += `🏦 *Aceptamos:* Visa, MasterCard, American Express\n`;
        message += `📱 *Cuotas:* 1, 3, 6 o 12 meses\n\n`;
        
        message += `📱 Pedido realizado desde: ${window.location.href}\n\n`;
        message += `Te contactaré para procesar el pago con tarjeta de forma segura a través de Wompi.`;
        
        return message;
    }

    // Verificar estado de una transacción
    async checkTransactionStatus(transactionId) {
        try {
            const response = await fetch(`${this.apiUrl}/transactions/${transactionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.publicKey}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.data;
            }
            
        } catch (error) {
            console.error('Error al verificar transacción:', error);
        }
        
        return null;
    }
}

// Instancia global
const wompiPayment = new WompiPayment();

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    wompiPayment.init();
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WompiPayment;
}
