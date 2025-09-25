// 🔧 ARCHIVO DE CONFIGURACIÓN FÁCIL
// Cambia estos valores para personalizar tu tienda

const CONFIG = {
    // ═══════════════════════════════════════════════════════════
    // 🏪 INFORMACIÓN DE TU NEGOCIO
    // ═══════════════════════════════════════════════════════════
    business: {
        name: "Arte en Aluminio",
        tagline: "Convierte tus fotografías en obras de arte duraderas",
        phone: "+57 300 123 4567",
        email: "pedidos@artealuminio.com",
        workHours: "Lun - Vie: 9:00 AM - 6:00 PM"
    },

    // ═══════════════════════════════════════════════════════════
    // 💰 PRODUCTOS Y PRECIOS
    // ═══════════════════════════════════════════════════════════
    products: [
        {
            size: "20x30",
            name: "Tamaño Pequeño",
            dimensions: "20 x 30 cm",
            price: 25000,
            description: "Perfecto para espacios pequeños"
        },
        {
            size: "30x40",
            name: "Tamaño Mediano", 
            dimensions: "30 x 40 cm",
            price: 45000,
            description: "El tamaño más popular"
        },
        {
            size: "40x60",
            name: "Tamaño Grande",
            dimensions: "40 x 60 cm", 
            price: 75000,
            description: "Ideal para salas y oficinas"
        },
        {
            size: "60x80",
            name: "Tamaño Extra Grande",
            dimensions: "60 x 80 cm",
            price: 120000,
            description: "Impacto visual máximo"
        }
    ],

    // ═══════════════════════════════════════════════════════════
    // 🏦 INFORMACIÓN BANCARIA (Para transferencias)
    // ═══════════════════════════════════════════════════════════
    bankInfo: {
        banco: "Banco de Bogotá",
        tipoCuenta: "Ahorros",
        numeroCuenta: "123-456-789",
        titular: "Tu Nombre Completo",
        cedula: "12.345.678",
        // Opcional: Nequi, Daviplata, etc.
        alternativePayments: {
            nequi: "300 123 4567",
            daviplata: "300 123 4567"
        }
    },

    // ═══════════════════════════════════════════════════════════
    // 💳 CONFIGURACIÓN DE WOMPI (Para pagos con tarjeta)
    // ═══════════════════════════════════════════════════════════
    wompi: {
        publicKey: "TU_PUBLIC_KEY_AQUI", // Obtén esto de wompi.co
        currency: "COP",
        testMode: true // Cambia a false cuando vayas a producción
    },

    // ═══════════════════════════════════════════════════════════
    // 📧 CONFIGURACIÓN DE EMAILS
    // ═══════════════════════════════════════════════════════════
    email: {
        // EmailJS (gratuito hasta 200 emails/mes)
        serviceId: "TU_SERVICE_ID",
        templateId: "TU_TEMPLATE_ID", 
        publicKey: "TU_PUBLIC_KEY",
        
        // O usa tu propio servidor SMTP
        smtpConfig: {
            host: "smtp.gmail.com",
            port: 587,
            user: "tu-email@gmail.com",
            password: "tu-password-de-aplicacion"
        }
    },

    // ═══════════════════════════════════════════════════════════
    // 🎨 PERSONALIZACIÓN VISUAL
    // ═══════════════════════════════════════════════════════════
    theme: {
        primaryColor: "#667eea",
        secondaryColor: "#764ba2", 
        accentColor: "#ffd700",
        successColor: "#28a745",
        errorColor: "#dc3545",
        fontFamily: "Roboto"
    },

    // ═══════════════════════════════════════════════════════════
    // ⚙️ CONFIGURACIONES TÉCNICAS
    // ═══════════════════════════════════════════════════════════
    settings: {
        maxImageSize: 10 * 1024 * 1024, // 10MB
        acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"],
        enableGoogleAnalytics: false,
        googleAnalyticsId: "GA_TRACKING_ID",
        enableFacebookPixel: false,
        facebookPixelId: "FACEBOOK_PIXEL_ID"
    },

    // ═══════════════════════════════════════════════════════════
    // 📍 CONFIGURACIÓN DE ENTREGA
    // ═══════════════════════════════════════════════════════════
    delivery: {
        // Costos de envío por departamento (en COP)
        shippingCosts: {
            "Bogotá D.C.": 8000,
            "Cundinamarca": 12000,
            "Antioquia": 15000,
            "Valle del Cauca": 15000,
            "Atlántico": 18000,
            "default": 20000 // Para otros departamentos
        },
        freeShippingThreshold: 100000, // Envío gratis desde este monto
        estimatedDeliveryDays: {
            "Bogotá D.C.": "1-2 días hábiles",
            "Cundinamarca": "2-3 días hábiles", 
            "default": "3-5 días hábiles"
        }
    },

    // ═══════════════════════════════════════════════════════════
    // 🔗 REDES SOCIALES
    // ═══════════════════════════════════════════════════════════
    socialMedia: {
        facebook: "https://facebook.com/tu-pagina",
        instagram: "https://instagram.com/tu-cuenta",
        whatsapp: "https://wa.me/573001234567",
        tiktok: "https://tiktok.com/@tu-cuenta"
    },

    // ═══════════════════════════════════════════════════════════
    // 📱 MENSAJES PERSONALIZADOS
    // ═══════════════════════════════════════════════════════════
    messages: {
        welcome: "¡Bienvenido a nuestra tienda de láminas personalizadas!",
        addedToCart: "agregada al carrito",
        removedFromCart: "removida del carrito", 
        emptyCart: "Tu carrito está vacío",
        orderSuccess: "¡Pedido confirmado! Te contactaremos pronto.",
        orderError: "Error al procesar el pedido. Inténtalo de nuevo.",
        invalidEmail: "Por favor ingresa un correo electrónico válido.",
        invalidPhone: "Por favor ingresa un número de teléfono válido.",
        imageTooLarge: "La imagen es demasiado grande. Máximo 10MB.",
        invalidImageType: "Por favor selecciona una imagen válida (JPG, PNG, WEBP)."
    }
};

// ═══════════════════════════════════════════════════════════
// 🚀 FUNCIONES DE INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════

// Aplicar configuración al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    applyConfiguration();
});

function applyConfiguration() {
    // Actualizar información del negocio
    updateBusinessInfo();
    
    // Actualizar productos
    updateProducts();
    
    // Aplicar tema visual
    applyTheme();
    
    // Configurar analytics si está habilitado
    if (CONFIG.settings.enableGoogleAnalytics) {
        initializeGoogleAnalytics();
    }
    
    if (CONFIG.settings.enableFacebookPixel) {
        initializeFacebookPixel();
    }
}

function updateBusinessInfo() {
    // Actualizar título
    document.title = CONFIG.business.name;
    
    // Actualizar nombre en el header
    const logoElement = document.querySelector('.logo h1');
    if (logoElement) {
        logoElement.innerHTML = `<i class="fas fa-image"></i> ${CONFIG.business.name}`;
    }
    
    // Actualizar tagline en hero
    const heroTagline = document.querySelector('.hero-content p');
    if (heroTagline) {
        heroTagline.textContent = CONFIG.business.tagline;
    }
    
    // Actualizar información de contacto
    updateContactInfo();
}

function updateContactInfo() {
    const phoneElement = document.querySelector('.contact-info .contact-item:nth-child(1) p');
    const emailElement = document.querySelector('.contact-info .contact-item:nth-child(2) p');
    const hoursElement = document.querySelector('.contact-info .contact-item:nth-child(3) p');
    
    if (phoneElement) phoneElement.textContent = CONFIG.business.phone;
    if (emailElement) emailElement.textContent = CONFIG.business.email;
    if (hoursElement) hoursElement.textContent = CONFIG.business.workHours;
}

function updateProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    CONFIG.products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <i class="fas fa-image"></i>
            <span class="size-label">${product.dimensions}</span>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.dimensions}</p>
            <p class="price">$${formatPrice(product.price)} COP</p>
            <button class="add-to-cart" data-size="${product.size}" data-price="${product.price}">
                Agregar al Carrito
            </button>
        </div>
    `;
    
    // Agregar event listener
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        const size = this.dataset.size;
        const price = parseInt(this.dataset.price);
        addToCart(size, price);
    });
    
    return card;
}

function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', CONFIG.theme.primaryColor);
    root.style.setProperty('--secondary-color', CONFIG.theme.secondaryColor);
    root.style.setProperty('--accent-color', CONFIG.theme.accentColor);
    root.style.setProperty('--success-color', CONFIG.theme.successColor);
    root.style.setProperty('--error-color', CONFIG.theme.errorColor);
    
    // Actualizar fuente si es diferente
    if (CONFIG.theme.fontFamily !== 'Roboto') {
        updateFontFamily();
    }
}

function updateFontFamily() {
    // Crear link para la nueva fuente
    const fontLink = document.createElement('link');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${CONFIG.theme.fontFamily.replace(' ', '+')}:wght@300;400;500;700&display=swap`;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    // Aplicar la fuente
    document.body.style.fontFamily = `'${CONFIG.theme.fontFamily}', sans-serif`;
}

function initializeGoogleAnalytics() {
    // Cargar Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.settings.googleAnalyticsId}`;
    document.head.appendChild(script1);
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${CONFIG.settings.googleAnalyticsId}');
    `;
    document.head.appendChild(script2);
}

function initializeFacebookPixel() {
    // Cargar Facebook Pixel
    const script = document.createElement('script');
    script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${CONFIG.settings.facebookPixelId}');
        fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
}

// Hacer CONFIG disponible globalmente
window.CONFIG = CONFIG;
