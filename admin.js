// 🔧 SISTEMA DE ADMINISTRACIÓN - LÁMINAS DE ALUMINIO
// Este archivo maneja toda la funcionalidad del panel de administrador

// Configuración y variables globales
const ADMIN_CONFIG = {
    defaultPassword: 'admin123',
    storageKeys: {
        products: 'laminas_productos',
        orders: 'laminas_pedidos',
        settings: 'laminas_configuracion',
        password: 'laminas_admin_password'
    }
};

// Variables globales
let products = [];
let orders = [];
let settings = {};
let isLoggedIn = false;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadDataFromStorage();
    setupEventListeners();
});

// ═══════════════════════════════════════════════════════════
// 🔐 SISTEMA DE AUTENTICACIÓN
// ═══════════════════════════════════════════════════════════

function initializeAdmin() {
    // Verificar si ya está logueado
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (isAuthenticated === 'true') {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    isLoggedIn = true;
    updateDashboard();
    loadProducts();
    loadOrders();
}

function login(password) {
    const savedPassword = localStorage.getItem(ADMIN_CONFIG.storageKeys.password) || ADMIN_CONFIG.defaultPassword;
    
    if (password === savedPassword) {
        sessionStorage.setItem('admin_authenticated', 'true');
        showAdminPanel();
        showNotification('¡Bienvenido al panel de administrador!', 'success');
        return true;
    } else {
        showNotification('Contraseña incorrecta', 'error');
        return false;
    }
}

function logout() {
    sessionStorage.removeItem('admin_authenticated');
    isLoggedIn = false;
    showLoginScreen();
    showNotification('Sesión cerrada correctamente', 'success');
}

function resetPassword() {
    const confirmReset = confirm(
        '¿Estás seguro de que quieres resetear la contraseña?\n\n' +
        'Esto restaurará la contraseña por defecto: admin123\n\n' +
        'Presiona OK para continuar.'
    );
    
    if (confirmReset) {
        // Eliminar la contraseña personalizada
        localStorage.removeItem(ADMIN_CONFIG.storageKeys.password);
        
        // Mostrar mensaje de éxito
        showNotification('Contraseña reseteada a: admin123', 'success');
        
        // Limpiar el campo de contraseña
        document.getElementById('admin-password').value = '';
        
        // Enfocar el campo para que el usuario pueda escribir
        document.getElementById('admin-password').focus();
        
        console.log('🔑 Contraseña reseteada a: admin123');
    }
}

// ═══════════════════════════════════════════════════════════
// 📊 GESTIÓN DE DATOS Y ALMACENAMIENTO
// ═══════════════════════════════════════════════════════════

function loadDataFromStorage() {
    console.log('🚀 loadDataFromStorage() iniciando...');
    
    // Cargar productos
    const savedProducts = localStorage.getItem(ADMIN_CONFIG.storageKeys.products);
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        console.log('📦 Productos cargados desde localStorage:', products.length);
    } else {
        console.log('📦 No hay productos guardados, creando productos por defecto...');
        // Productos por defecto para El Salvador
        products = [
            {
                id: 1,
                name: 'Lámina Lista Pequeña',
                size: '20x30',
                price: 25.00,
                description: 'Lista para envío inmediato. Diseño estándar de alta calidad.',
                image: null,
                active: true,
                type: 'ready',
                created: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Lámina Lista Grande',
                size: '36x56',
                price: 45.00,
                description: 'Lista para envío inmediato. Diseño estándar de alta calidad.',
                image: null,
                active: true,
                type: 'ready',
                created: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Lámina Personalizada Pequeña',
                size: '20x30',
                price: 30.00,
                description: 'Sube tu imagen favorita y la convertiremos en una obra de arte.',
                image: null,
                active: true,
                type: 'custom',
                created: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Lámina Personalizada Grande',
                size: '40x60',
                price: 55.00,
                description: 'Sube tu imagen favorita y la convertiremos en una obra de arte de gran formato.',
                image: null,
                active: true,
                type: 'custom',
                created: new Date().toISOString()
            }
        ];
        saveProducts();
        console.log('✅ Productos por defecto creados y guardados:', products.length);
    }
    
    console.log('📊 Llamando updateDashboard() después de cargar productos...');

    // Cargar pedidos
    const savedOrders = localStorage.getItem(ADMIN_CONFIG.storageKeys.orders);
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }

    // Cargar configuración
    const savedSettings = localStorage.getItem(ADMIN_CONFIG.storageKeys.settings);
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    } else {
        settings = {
            storeName: 'Arte en Aluminio',
            whatsappNumber: '50372297295',
            email: 'pedidos@artealuminio.sv',
            phone: '+503 7229-7295',
            description: 'Convierte tus fotografías en obras de arte duraderas con nuestras láminas de aluminio de alta calidad',
            bankInfo: {
                banco: 'Banco Atlántida',
                titular: 'Manuel Hernández',
                tipoCuenta: 'Cuenta de Ahorro',
                numeroCuenta: '2301010116949'
            }
        };
        saveSettings();
    }
    
    // Cargar galería y redes sociales al cambiar de sección
    setTimeout(() => {
        if (document.getElementById('gallery-grid')) {
            loadGallery();
        }
        if (document.getElementById('facebook-url')) {
            loadSocialMedia();
        }
    }, 100);
    
    // Actualizar dashboard después de cargar todos los datos
    console.log('📊 Llamando updateDashboard() al final de loadDataFromStorage()...');
    updateDashboard();
}

function saveProducts() {
    console.log('💾 saveProducts() ejecutándose...');
    localStorage.setItem(ADMIN_CONFIG.storageKeys.products, JSON.stringify(products));
    console.log('📦 Productos guardados en localStorage admin. Total:', products.length);
    updateMainSite();
}

function saveOrders() {
    localStorage.setItem(ADMIN_CONFIG.storageKeys.orders, JSON.stringify(orders));
}

function saveSettings() {
    localStorage.setItem(ADMIN_CONFIG.storageKeys.settings, JSON.stringify(settings));
    updateMainSite();
}

// ═══════════════════════════════════════════════════════════
// 🛍️ GESTIÓN DE PRODUCTOS
// ═══════════════════════════════════════════════════════════

function addProduct(productData) {
    const newProduct = {
        id: Date.now(),
        name: productData.name,
        size: productData.size,
        price: parseFloat(productData.price),
        description: productData.description || '',
        image: productData.image || null,
        type: productData.type || 'custom', // 'ready' o 'custom'
        active: true,
        created: new Date().toISOString()
    };

    products.push(newProduct);
    saveProducts();
    loadProducts();
    updateDashboard();
    
    showNotification(`Producto "${newProduct.name}" agregado exitosamente`, 'success');
}

function editProduct(productId, productData) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            ...productData,
            price: parseFloat(productData.price),
            modified: new Date().toISOString()
        };
        
        saveProducts();
        loadProducts();
        showNotification('Producto actualizado exitosamente', 'success');
        
        // Resetear el formulario después de la actualización
        setTimeout(function() {
            resetProductForm();
        }, 500); // Pequeño delay para que la notificación se vea
    }
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        loadProducts();
        updateDashboard();
        showNotification('Producto eliminado exitosamente', 'success');
    }
}

function toggleProductStatus(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.active = !product.active;
        saveProducts();
        loadProducts();
        showNotification(`Producto ${product.active ? 'activado' : 'desactivado'}`, 'success');
    }
}

function loadProducts() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No hay productos registrados</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsList.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-admin-card';
    
    const statusClass = product.active ? 'text-success' : 'text-muted';
    const statusIcon = product.active ? 'fa-eye' : 'fa-eye-slash';
    const statusText = product.active ? 'Activo' : 'Inactivo';

    card.innerHTML = `
        <div class="product-image-preview ${product.image ? 'has-image' : ''}" 
             style="${product.image ? `background-image: url(${product.image});` : ''}"
             onclick="changeProductImage(${product.id})">
            ${!product.image ? `
                <div style="text-align: center; color: #666;">
                    <i class="fas fa-camera" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.9rem;">Agregar imagen</p>
                </div>
            ` : ''}
        </div>
        
        <div style="margin-bottom: 1rem;">
            <h4 style="margin: 0; color: #333;">${product.name}</h4>
            <p style="margin: 0.5rem 0; color: #666;">${product.size} cm</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #28a745;">$${product.price.toFixed(2)} USD</p>
            <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #666;">${product.description}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="${statusClass}" style="font-weight: 600;">
                <i class="fas ${statusIcon}"></i> ${statusText}
            </span>
            <small style="color: #999;">ID: ${product.id}</small>
        </div>
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button onclick="editProductModal(${product.id})" 
                    style="flex: 1; background: #667eea; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button onclick="toggleProductStatus(${product.id})" 
                    style="flex: 1; background: ${product.active ? '#ffc107' : '#28a745'}; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-${product.active ? 'eye-slash' : 'eye'}"></i> ${product.active ? 'Ocultar' : 'Mostrar'}
            </button>
            <button onclick="deleteProduct(${product.id})" 
                    style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return card;
}

// ═══════════════════════════════════════════════════════════
// 📋 GESTIÓN DE PEDIDOS
// ═══════════════════════════════════════════════════════════

function addOrder(orderData) {
    const newOrder = {
        id: Date.now(),
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        products: orderData.products,
        total: orderData.total,
        status: 'pending',
        created: new Date().toISOString(),
        notes: orderData.notes || ''
    };

    orders.unshift(newOrder); // Agregar al inicio
    saveOrders();
    loadOrders();
    updateDashboard();
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        order.modified = new Date().toISOString();
        saveOrders();
        loadOrders();
        showNotification('Estado del pedido actualizado', 'success');
    }
}

function deleteOrder(orderId) {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
        orders = orders.filter(o => o.id !== orderId);
        saveOrders();
        loadOrders();
        updateDashboard();
        showNotification('Pedido eliminado', 'success');
    }
}

function loadOrders() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #666; padding: 2rem;">
                    <i class="fas fa-clipboard-list" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i><br>
                    No hay pedidos registrados
                </td>
            </tr>
        `;
        return;
    }

    orders.forEach(order => {
        const row = createOrderRow(order);
        ordersList.appendChild(row);
    });
}

function createOrderRow(order) {
    const row = document.createElement('tr');
    
    const statusClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
    const statusText = order.status === 'completed' ? 'Completado' : 'Pendiente';
    
    const productsText = order.products.map(p => `${p.size} (${p.quantity}x)`).join(', ');
    const orderDate = new Date(order.created).toLocaleDateString('es-SV');

    row.innerHTML = `
        <td>#${order.id}</td>
        <td>${order.customerName}</td>
        <td>${productsText}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${orderDate}</td>
        <td>
            <button onclick="updateOrderStatus(${order.id}, '${order.status === 'pending' ? 'completed' : 'pending'}')"
                    style="background: ${order.status === 'pending' ? '#28a745' : '#ffc107'}; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 3px; cursor: pointer; margin-right: 0.5rem;">
                ${order.status === 'pending' ? 'Completar' : 'Reabrir'}
            </button>
            <button onclick="deleteOrder(${order.id})"
                    style="background: #dc3545; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 3px; cursor: pointer;">
                Eliminar
            </button>
        </td>
    `;

    return row;
}

function simulateOrder() {
    const sampleOrder = {
        customerName: 'Cliente de Prueba',
        customerPhone: '+503 1234-5678',
        products: [
            { size: '20x30', quantity: 1, price: 20 },
            { size: '36x56', quantity: 1, price: 35 }
        ],
        total: 55,
        notes: 'Pedido de prueba generado desde el panel de administrador'
    };

    addOrder(sampleOrder);
    showNotification('Pedido de prueba creado exitosamente', 'success');
}

// ═══════════════════════════════════════════════════════════
// ⚙️ CONFIGURACIÓN Y AJUSTES
// ═══════════════════════════════════════════════════════════

function updateSettings(newSettings) {
    console.log('🔄 updateSettings() ejecutándose con:', newSettings);
    settings = { ...settings, ...newSettings };
    console.log('📝 Settings actualizados:', settings);
    saveSettings();
    showNotification('Configuración guardada exitosamente', 'success');
}

function changePassword(newPassword) {
    if (newPassword.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    localStorage.setItem(ADMIN_CONFIG.storageKeys.password, newPassword);
    showNotification('Contraseña cambiada exitosamente', 'success');
    return true;
}

// ═══════════════════════════════════════════════════════════
// 📊 DASHBOARD Y ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════

function updateDashboard() {
    console.log('📊 updateDashboard() ejecutándose...');
    console.log('📊 products array:', products);
    console.log('📊 products.length:', products.length);
    console.log('📊 productos activos:', products.filter(p => p.active).length);
    
    // Actualizar estadísticas
    const totalProductsElement = document.getElementById('total-products');
    const totalOrdersElement = document.getElementById('total-orders');
    const totalRevenueElement = document.getElementById('total-revenue');

    if (totalProductsElement) {
        const activeProducts = products.filter(p => p.active).length;
        console.log('📊 Actualizando contador productos a:', activeProducts);
        totalProductsElement.textContent = activeProducts;
    }

    if (totalOrdersElement) {
        totalOrdersElement.textContent = orders.length;
    }

    if (totalRevenueElement) {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        totalRevenueElement.textContent = totalRevenue.toFixed(2);
    }
}

// ═══════════════════════════════════════════════════════════
// 🔄 SINCRONIZACIÓN CON SITIO PRINCIPAL
// ═══════════════════════════════════════════════════════════

function updateMainSite() {
    console.log('🔄 updateMainSite() ejecutándose...');
    console.log('📦 Total de productos antes del filtro:', products.length);
    
    // Asegurar que todos los productos tengan active: true por defecto
    var activeProducts = products.filter(function(p) {
        // Si no tiene la propiedad active, asumimos que está activo
        return p.active !== false;
    });
    
    console.log('🎯 Productos activos:', activeProducts.length);
    
    var mainSiteData = {
        products: activeProducts,
        settings: settings,
        lastUpdate: new Date().toISOString()
    };
    
    console.log('💾 Guardando en localStorage:', mainSiteData);
    localStorage.setItem('laminas_main_site_data', JSON.stringify(mainSiteData));
    
    // TAMBIÉN guardar en las claves que usa la tienda para compatibilidad
    localStorage.setItem('paintingsxProducts', JSON.stringify(activeProducts));
    
    console.log('✅ Datos guardados en localStorage con clave: laminas_main_site_data');
    console.log('✅ Datos guardados TAMBIÉN en: paintingsxProducts para compatibilidad');
}

// ═══════════════════════════════════════════════════════════
// 🎛️ INTERFAZ DE USUARIO Y EVENTOS
// ═══════════════════════════════════════════════════════════

function setupProductFormListener() {
    // Product form
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('product-name').value,
                size: document.getElementById('product-size').value,
                price: document.getElementById('product-price').value,
                description: document.getElementById('product-description').value,
                type: document.getElementById('product-type').value,
                image: document.getElementById('image-preview').style.backgroundImage ? 
                       document.getElementById('image-preview').style.backgroundImage.slice(5, -2) : null
            };

            addProduct(formData);
            productForm.reset();
            document.getElementById('image-preview').style.backgroundImage = '';
            document.getElementById('image-preview').classList.remove('has-image');
            document.getElementById('image-preview').innerHTML = `
                <div style="text-align: center; color: #666;">
                    <i class="fas fa-camera" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p>Haz clic para subir imagen</p>
                </div>
            `;
        });
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            login(password);
        });
    }

    // Setup product form listener
    setupProductFormListener();

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newSettings = {
                storeName: document.getElementById('store-name').value,
                whatsappNumber: document.getElementById('whatsapp-number').value,
                email: document.getElementById('store-email').value,
                phone: document.getElementById('store-phone').value,
                description: document.getElementById('store-description').value,
                bankInfo: {
                    banco: document.getElementById('bank-name').value,
                    titular: document.getElementById('account-holder').value,
                    tipoCuenta: document.getElementById('account-type').value,
                    numeroCuenta: document.getElementById('account-number').value
                }
            };

            updateSettings(newSettings);
        });
    }

    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            if (changePassword(newPassword)) {
                passwordForm.reset();
            }
        });
    }

    // Image upload
    const productImage = document.getElementById('product-image');
    if (productImage) {
        productImage.addEventListener('change', function(e) {
            handleImageUpload(e, 'image-preview');
        });
    }

    // Image preview click
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
        imagePreview.addEventListener('click', function() {
            document.getElementById('product-image').click();
        });
        imagePreview.style.cursor = 'pointer';
    }

    // Gallery form
    const galleryForm = document.getElementById('gallery-form');
    if (galleryForm) {
        galleryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            uploadGalleryMedia();
        });
    }

    // Media file input change
    const mediaFile = document.getElementById('media-file');
    if (mediaFile) {
        mediaFile.addEventListener('change', function(e) {
            handleMediaPreview(e);
        });
    }
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');

    // Cargar datos específicos de la sección
    if (sectionName === 'dashboard') {
        updateDashboard();
    } else if (sectionName === 'products') {
        loadProducts();
    } else if (sectionName === 'orders') {
        loadOrders();
    } else if (sectionName === 'settings') {
        loadSettingsForm();
    } else if (sectionName === 'gallery') {
        loadGallery();
        loadSocialMedia();
    }
}

function handleImageUpload(event, previewElementId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewElementId);
    
    if (file) {
        // Validar tamaño (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('La imagen es demasiado grande. Máximo 2MB.', 'error');
            return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            showNotification('Por favor selecciona una imagen válida.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.classList.add('has-image');
            preview.innerHTML = '';
        };
        reader.readAsDataURL(file);
    }
}

function showNotification(message, type = 'success') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon;
    if (type === 'success') icon = 'check-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';
    else icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Auto remover después de 4 segundos
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

function loadSettingsForm() {
    // Cargar datos de configuración en el formulario
    if (settings.storeName) document.getElementById('store-name').value = settings.storeName;
    if (settings.whatsappNumber) document.getElementById('whatsapp-number').value = settings.whatsappNumber;
    if (settings.email) document.getElementById('store-email').value = settings.email;
    if (settings.phone) document.getElementById('store-phone').value = settings.phone;
    if (settings.description) document.getElementById('store-description').value = settings.description;
    
    // Cargar datos bancarios si existen
    if (settings.bankInfo) {
        if (settings.bankInfo.banco) document.getElementById('bank-name').value = settings.bankInfo.banco;
        if (settings.bankInfo.titular) document.getElementById('account-holder').value = settings.bankInfo.titular;
        if (settings.bankInfo.tipoCuenta) document.getElementById('account-type').value = settings.bankInfo.tipoCuenta;
        if (settings.bankInfo.numeroCuenta) document.getElementById('account-number').value = settings.bankInfo.numeroCuenta;
    }
}

// ═══════════════════════════════════════════════════════════
// 🔧 FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════

function editProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Llenar el formulario con los datos del producto
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-size').value = product.size;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-type').value = product.type || 'custom';

    // Mostrar imagen actual si existe
    const imagePreview = document.getElementById('image-preview');
    if (product.image) {
        imagePreview.style.backgroundImage = `url(${product.image})`;
        imagePreview.innerHTML = '<i class="fas fa-image"></i>';
    }

    // Cambiar el botón del formulario
    const submitBtn = document.querySelector('#product-form button[type="submit"]');
    const form = document.getElementById('product-form');
    
    // Remover event listeners previos
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Obtener referencias al nuevo form después del reemplazo
    const finalForm = document.getElementById('product-form');
    const finalSubmitBtn = finalForm.querySelector('button[type="submit"]');
    finalSubmitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
    
    // Re-establecer los event listeners de imagen para el modo edición
    const productImage = document.getElementById('product-image');
    if (productImage) {
        productImage.addEventListener('change', function(e) {
            handleImageUpload(e, 'image-preview');
        });
    }

    const newImagePreview = document.getElementById('image-preview');
    if (newImagePreview) {
        newImagePreview.addEventListener('click', function() {
            document.getElementById('product-image').click();
        });
        newImagePreview.style.cursor = 'pointer';
    }
    
    // Agregar nuevo event listener al form actualizado
    finalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar la imagen actual del preview
        const currentImagePreview = document.getElementById('image-preview');
        let imageUrl = null;
        if (currentImagePreview.style.backgroundImage) {
            imageUrl = currentImagePreview.style.backgroundImage.slice(5, -2); // Remover url("...") 
        }
        
        const formData = {
            name: document.getElementById('product-name').value,
            size: document.getElementById('product-size').value,
            price: document.getElementById('product-price').value,
            description: document.getElementById('product-description').value,
            type: document.getElementById('product-type').value,
            image: imageUrl // INCLUIR LA IMAGEN
        };

        editProduct(productId, formData);
        
        // Resetear completamente el formulario
        resetProductForm();
    });

    // Scroll al formulario
    finalForm.scrollIntoView({ behavior: 'smooth' });
}

function resetProductForm() {
    const form = document.getElementById('product-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const imagePreview = document.getElementById('image-preview');
    
    // Resetear formulario
    form.reset();
    
    // Resetear imagen con el mismo formato que en setupProductFormListener
    imagePreview.style.backgroundImage = '';
    imagePreview.classList.remove('has-image');
    imagePreview.innerHTML = `
        <div style="text-align: center; color: #666;">
            <i class="fas fa-camera" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <p>Haz clic para subir imagen</p>
        </div>
    `;
    
    // Resetear botón
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar Producto';
    
    // Remover event listeners y poner el original
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Re-establecer todos los event listeners
    setupProductFormListener();
    
    // Re-establecer los event listeners de imagen que están en initEventListeners
    const productImage = document.getElementById('product-image');
    if (productImage) {
        productImage.addEventListener('change', function(e) {
            handleImageUpload(e, 'image-preview');
        });
    }

    const newImagePreview = document.getElementById('image-preview');
    if (newImagePreview) {
        newImagePreview.addEventListener('click', function() {
            document.getElementById('product-image').click();
        });
        newImagePreview.style.cursor = 'pointer';
    }
}

function changeProductImage(productId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const product = products.find(p => p.id === productId);
                if (product) {
                    product.image = e.target.result;
                    saveProducts();
                    loadProducts();
                    showNotification('Imagen del producto actualizada', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Gallery Management Functions
function uploadGalleryMedia() {
    const fileInput = document.getElementById('media-file');
    const titleInput = document.getElementById('media-title');
    const descriptionInput = document.getElementById('media-description');
    const typeInput = document.getElementById('media-type');
    
    const file = fileInput.files[0];
    const title = titleInput ? titleInput.value.trim() : '';
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    const selectedType = typeInput ? typeInput.value : '';
    
    // Validaciones
    if (!file) {
        showNotification('Por favor selecciona un archivo', 'error');
        return;
    }
    
    if (!title) {
        showNotification('Por favor ingresa un título', 'error');
        return;
    }
    
    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Tipo de archivo no permitido. Use imágenes (JPG, PNG, GIF) o videos (MP4, WEBM, MOV)', 'error');
        console.log('Tipo de archivo detectado:', file.type);
        return;
    }
    
    // Verificar tamaño con advertencia para videos grandes
    const maxSize = 3 * 1024 * 1024; // 3MB
    const fileSize = file.size / (1024 * 1024); // MB
    
    if (file.size > maxSize) {
        if (file.type.startsWith('video/')) {
            // Para videos, mostrar advertencia pero permitir intentar
            showNotification(`⚠️ Video grande (${fileSize.toFixed(1)}MB). Intentando subir... Si falla, comprime el video a menos de 3MB.`, 'warning');
        } else {
            // Para imágenes, rechazar directamente
            showNotification(`El archivo es muy grande. Máximo 3MB permitido (tu archivo: ${fileSize.toFixed(1)}MB)`, 'error');
            return;
        }
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Si es una imagen, intentar comprimirla si es muy grande
        if (file.type.startsWith('image/') && file.size > 1024 * 1024) { // 1MB
            compressImage(e.target.result, file.name, title, description, file.type, file.size);
        } else {
            // Para videos o imágenes pequeñas, procesar normalmente
            saveGalleryItem(e.target.result, file, title, description);
        }
    };
    
    reader.readAsDataURL(file);
}

function compressImage(dataUrl, fileName, title, description, fileType, originalSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        const maxWidth = 1200;
        const maxHeight = 1200;
        
        if (width > height) {
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con compresión
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% calidad
        
        console.log(`🗜️ Imagen comprimida: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(compressedDataUrl.length * 0.75 / 1024 / 1024).toFixed(1)}MB`);
        
        // Crear objeto de archivo comprimido
        const compressedFile = {
            name: fileName,
            type: 'image/jpeg',
            size: compressedDataUrl.length * 0.75 // Estimación del tamaño
        };
        
        saveGalleryItem(compressedDataUrl, compressedFile, title, description);
    };
    
    img.src = dataUrl;
}

function saveGalleryItem(dataUrl, file, title, description) {
    const galleryItem = {
        id: Date.now(),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: dataUrl,
        name: file.name,
        title: title,
        description: description,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString()
    };
    
    // Obtener galería actual
    let gallery = JSON.parse(localStorage.getItem('paintingsxGallery') || '[]');
    gallery.push(galleryItem);
    
    // Guardar galería con manejo de errores
    try {
        localStorage.setItem('paintingsxGallery', JSON.stringify(gallery));
        console.log('✅ Archivo guardado exitosamente en localStorage');
        
        // Recargar vista
        loadGallery();
        
        // Limpiar formulario completo
        const galleryForm = document.getElementById('gallery-form');
        if (galleryForm) {
            galleryForm.reset();
        }
        
        // Limpiar vista previa
        const mediaPreview = document.getElementById('media-preview');
        if (mediaPreview) {
            mediaPreview.innerHTML = `
                <div style="text-align: center; color: #666; padding: 2rem;">
                    <i class="fas fa-upload" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p>Selecciona una imagen o video</p>
                </div>
            `;
        }
        
        showNotification('Archivo subido exitosamente', 'success');
        
    } catch (error) {
        console.error('❌ Error al guardar en localStorage:', error);
        
        if (error.name === 'QuotaExceededError') {
            showNotification('El archivo sigue siendo muy grande. Intenta con un archivo más pequeño (máximo 2MB).', 'error');
        } else {
            showNotification('Error al guardar el archivo. Intenta de nuevo.', 'error');
        }
        
        // Remover el último elemento agregado si falló
        gallery.pop();
    }
}

function handleMediaPreview(event) {
    const file = event.target.files[0];
    const mediaPreview = document.getElementById('media-preview');
    
    if (!file || !mediaPreview) return;
    
    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
        mediaPreview.innerHTML = `
            <div style="text-align: center; color: #e74c3c; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p>Tipo de archivo no compatible</p>
                <small>Use: JPG, PNG, GIF, MP4, WEBM, MOV</small>
            </div>
        `;
        return;
    }
    
    // Verificar tamaño
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
        mediaPreview.innerHTML = `
            <div style="text-align: center; color: #e74c3c; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p>Archivo muy grande</p>
                <small>Máximo ${Math.round(maxSize / (1024 * 1024))}MB permitido (Actual: ${(file.size / (1024 * 1024)).toFixed(1)}MB)</small>
            </div>
        `;
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        if (file.type.startsWith('image/')) {
            mediaPreview.innerHTML = `
                <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" alt="Vista previa">
                <p style="text-align: center; margin-top: 0.5rem; color: #28a745;">✅ Imagen lista para subir</p>
            `;
        } else if (file.type.startsWith('video/')) {
            mediaPreview.innerHTML = `
                <video src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" controls muted>
                    Tu navegador no soporta el elemento video.
                </video>
                <p style="text-align: center; margin-top: 0.5rem; color: #28a745;">✅ Video listo para subir</p>
            `;
        }
    };
    
    reader.readAsDataURL(file);
}

function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem('paintingsxGallery') || '[]');
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (!galleryGrid) return;
    
    if (gallery.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; color: #666;">No hay archivos en la galería</p>';
        return;
    }
    
    galleryGrid.innerHTML = gallery.map(item => `
        <div class="gallery-item">
            ${item.type === 'image' ? 
                `<img class="gallery-media" src="${item.url}" alt="${item.title || item.name}" onclick="viewGalleryItem('${item.id}')">` :
                `<video class="gallery-media" src="${item.url}" onclick="viewGalleryItem('${item.id}')" muted>
                    <source src="${item.url}" type="${item.fileType || 'video/mp4'}">
                </video>`
            }
            <div class="gallery-info">
                <div class="gallery-item-overlay">
                    <button onclick="editGalleryItem('${item.id}')" class="btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteGalleryItem('${item.id}')" class="btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4 class="gallery-item-title">${item.title || item.name}</h4>
                ${item.description ? `<p class="gallery-item-description">${item.description}</p>` : ''}
                <small class="gallery-item-date">Subido: ${new Date(item.uploadDate).toLocaleDateString()}</small>
            </div>
        </div>
    `).join('');
}

function editGalleryItem(itemId) {
    const gallery = JSON.parse(localStorage.getItem('paintingsxGallery') || '[]');
    const item = gallery.find(i => i.id == itemId);
    
    if (!item) {
        showNotification('Elemento no encontrado', 'error');
        return;
    }
    
    // Crear modal de edición
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; margin: auto;">
            <div class="modal-header">
                <h3>Editar Elemento de Galería</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="edit-gallery-form">
                    <div class="form-group">
                        <label for="edit-title">Título:</label>
                        <input type="text" id="edit-title" value="${item.title || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-description">Descripción:</label>
                        <textarea id="edit-description" rows="3">${item.description || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Vista previa:</label>
                        <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            ${item.type === 'image' ? 
                                `<img src="${item.url}" alt="${item.title}" style="max-width: 100%; max-height: 200px; border-radius: 4px;">` :
                                `<video src="${item.url}" controls style="max-width: 100%; max-height: 200px; border-radius: 4px;">
                                    <source src="${item.url}" type="${item.fileType}">
                                </video>`
                            }
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" onclick="this.closest('.modal').remove()" class="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-primary">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Agregar event listener al formulario
    modal.querySelector('#edit-gallery-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newTitle = document.getElementById('edit-title').value.trim();
        const newDescription = document.getElementById('edit-description').value.trim();
        
        if (!newTitle) {
            showNotification('El título es requerido', 'error');
            return;
        }
        
        // Actualizar el elemento
        item.title = newTitle;
        item.description = newDescription;
        
        // Guardar en localStorage
        localStorage.setItem('paintingsxGallery', JSON.stringify(gallery));
        
        // Recargar galería
        loadGallery();
        
        // Cerrar modal
        modal.remove();
        
        showNotification('Elemento actualizado exitosamente', 'success');
    });
    
    document.body.appendChild(modal);
}

function deleteGalleryItem(itemId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;
    
    let gallery = JSON.parse(localStorage.getItem('paintingsxGallery') || '[]');
    gallery = gallery.filter(item => item.id != itemId);
    
    localStorage.setItem('paintingsxGallery', JSON.stringify(gallery));
    loadGallery();
    
    showNotification('Archivo eliminado', 'success');
}

function viewGalleryItem(itemId) {
    const gallery = JSON.parse(localStorage.getItem('paintingsxGallery') || '[]');
    const item = gallery.find(i => i.id == itemId);
    
    if (!item) return;
    
    // Crear modal para visualizar
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="gallery-modal-content">
            <span class="gallery-modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${item.type === 'image' ? 
                `<img src="${item.url}" alt="${item.name}" style="max-width: 90%; max-height: 90%;">` :
                `<video src="${item.url}" controls style="max-width: 90%; max-height: 90%;">
                    <source src="${item.url}" type="${item.type}">
                </video>`
            }
            <p style="text-align: center; margin-top: 1rem; color: #fff;">${item.name}</p>
        </div>
    `;
    
    // Agregar estilos del modal si no existen
    if (!document.getElementById('gallery-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'gallery-modal-styles';
        styles.textContent = `
            .gallery-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .gallery-modal-content {
                position: relative;
                text-align: center;
            }
            .gallery-modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                z-index: 10001;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
}

// Social Media Configuration
function saveSocialMedia() {
    const facebook = document.getElementById('facebook-url').value;
    const instagram = document.getElementById('instagram-url').value;
    const tiktok = document.getElementById('tiktok-url').value;
    
    const socialMedia = {
        facebook: facebook,
        instagram: instagram,
        tiktok: tiktok
    };
    
    localStorage.setItem('paintingsxSocialMedia', JSON.stringify(socialMedia));
    showNotification('Configuración de redes sociales guardada', 'success');
}

function loadSocialMedia() {
    const socialMedia = JSON.parse(localStorage.getItem('paintingsxSocialMedia') || '{}');
    
    if (document.getElementById('facebook-url')) {
        document.getElementById('facebook-url').value = socialMedia.facebook || '';
    }
    if (document.getElementById('instagram-url')) {
        document.getElementById('instagram-url').value = socialMedia.instagram || '';
    }
    if (document.getElementById('tiktok-url')) {
        document.getElementById('tiktok-url').value = socialMedia.tiktok || '';
    }
}

// Hacer funciones disponibles globalmente
window.showSection = showSection;
window.logout = logout;
window.resetPassword = resetPassword;
window.addProduct = addProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleProductStatus = toggleProductStatus;
window.editProductModal = editProductModal;
window.changeProductImage = changeProductImage;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;
window.simulateOrder = simulateOrder;
window.uploadGalleryMedia = uploadGalleryMedia;
window.loadGallery = loadGallery;
window.editGalleryItem = editGalleryItem;
window.deleteGalleryItem = deleteGalleryItem;
window.viewGalleryItem = viewGalleryItem;
window.saveSocialMedia = saveSocialMedia;
window.loadSocialMedia = loadSocialMedia;
window.handleMediaPreview = handleMediaPreview;

// Inicialización automática
console.log('🔧 Panel de Administrador inicializado');
console.log('📊 Sistema de gestión de productos activo');
console.log('📋 Sistema de gestión de pedidos activo');
