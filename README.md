# 🎨 Tienda de Láminas de Aluminio

Una tienda en línea moderna y completamente funcional para vender láminas de aluminio personalizadas.

## 🌟 Características

- ✅ **Diseño Responsivo**: Funciona perfectamente en móviles, tablets y escritorio
- 🛒 **Carrito de Compras**: Sistema completo de carrito con agregar/quitar productos
- 📱 **Interfaz Moderna**: Diseño atractivo con animaciones y efectos visuales
- 💳 **Múltiples Métodos de Pago**: Transferencia bancaria y tarjeta de crédito
- 📧 **Sistema de Pedidos**: Formulario completo con todos los datos necesarios
- 🖼️ **Subida de Imágenes**: Los clientes pueden subir sus fotos
- 📍 **Datos de Ubicación**: Formulario completo con departamento, municipio, etc.

## 🚀 Cómo usar este proyecto

### Opción 1: Hospedaje Gratuito (Recomendado para empezar)

1. **Netlify** (Más fácil):
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta del proyecto al área de despliegue
   - Tu sitio estará en línea en segundos
   - Es GRATIS hasta 100GB de ancho de banda al mes

2. **Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el proyecto
   - Despliegue automático

3. **GitHub Pages** (Si tienes GitHub):
   - Sube los archivos a un repositorio
   - Ve a Settings > Pages
   - Selecciona la rama main
   - Tu sitio estará en `usuario.github.io/nombre-repo`

### Opción 2: Hospedaje de Pago (Para uso comercial)

1. **Hostinger** (~$2-4 USD/mes):
   - Muy económico y confiable
   - Incluye dominio gratis
   - Panel de control fácil de usar

2. **SiteGround** (~$6 USD/mes):
   - Excelente soporte
   - Muy rápido
   - Ideal para negocios

3. **GoDaddy** (~$5 USD/mes):
   - Conocido mundialmente
   - Soporte en español
   - Muchas herramientas incluidas

## ⚙️ Configuración Inicial

### 1. Personalizar la información de tu negocio

Edita el archivo `index.html` y cambia:
- El nombre de tu negocio (línea 9)
- Los precios de las láminas (líneas 54, 66, 78, 90)
- Tu información de contacto (líneas 302-316)

### 2. Configurar métodos de pago

#### Para Transferencias Bancarias:
Edita el archivo `script.js` en la función `sendBankTransferInfo()` (línea 400):
```javascript
const bankInfo = {
    banco: "Tu Banco",
    tipoCuenta: "Ahorros/Corriente",
    numeroCuenta: "TU-NUMERO-DE-CUENTA",
    titular: "Tu Nombre Completo",
    cedula: "Tu Número de Cédula"
};
```

#### Para Pagos con Tarjeta (Wompi):
1. Regístrate en [wompi.co](https://wompi.co)
2. Obtén tu **Public Key**
3. Edita el archivo `script.js` línea 372:
```javascript
'public-key': 'TU_PUBLIC_KEY_DE_WOMPI',
```

### 3. Configurar recepción de pedidos

Actualmente los pedidos se muestran en la consola del navegador. Para recibir pedidos reales:

#### Opción A: EmailJS (Gratuito)
1. Regístrate en [emailjs.com](https://emailjs.com)
2. Configura un servicio de email
3. Modifica la función `sendConfirmationEmail()` para usar EmailJS

#### Opción B: Formspree (Gratuito)
1. Regístrate en [formspree.io](https://formspree.io)
2. Crea un formulario
3. Añade el endpoint a tu formulario

#### Opción C: WhatsApp Business API
1. Modifica el script para enviar pedidos a WhatsApp
2. Los clientes recibirán confirmación por WhatsApp

## 🎨 Personalización

### Cambiar Colores
Edita el archivo `styles.css`:
- **Color principal**: Busca `#667eea` y `#764ba2` (líneas 47, 179, etc.)
- **Color de éxito**: Busca `#28a745` (línea 109)
- **Color dorado**: Busca `#ffd700` (línea 52)

### Agregar Más Tamaños
En `index.html`, duplica un bloque de producto y cambia:
- El tamaño en `data-size`
- El precio en `data-price`
- El texto descriptivo

### Cambiar Fuentes
En `index.html` línea 8, cambia la fuente de Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=TU_FUENTE:wght@300;400;500;700&display=swap" rel="stylesheet">
```

## 📱 Funcionalidades Incluidas

### ✅ Lo que YA funciona:
- Carrito de compras completo
- Formulario de pedidos
- Validación de datos
- Preview de imágenes
- Diseño responsivo
- Notificaciones visuales
- Cálculo de totales
- Datos de entrega completos

### 🔧 Lo que necesitas configurar:
- Información bancaria real
- Claves de Wompi (para tarjetas)
- Sistema de recepción de pedidos
- Tu información de contacto

## 🆘 Soporte y Ayuda

### Problemas Comunes:

1. **"No recibo los pedidos"**
   - Los pedidos aparecen en la consola del navegador (F12)
   - Configura EmailJS o Formspree para recibirlos

2. **"Los pagos con tarjeta no funcionan"**
   - Necesitas registrarte en Wompi y obtener tu clave
   - Para pruebas, usa el modo sandbox

3. **"El sitio no se ve bien en móvil"**
   - El diseño es responsivo, verifica que no hayas modificado el CSS

4. **"Quiero cambiar los precios"**
   - Edita el HTML (data-price) y el texto visible

### Contacto:
Si necesitas ayuda adicional:
- 📧 Comenta en el código donde tienes dudas
- 🐛 Usa la consola del navegador (F12) para ver errores
- 💬 Busca tutoriales de hosting en YouTube

## 📈 Próximos Pasos

Una vez que tengas el sitio funcionando:

1. **Obtén un dominio personalizado** (ej: artealuminio.com)
2. **Configura Google Analytics** para ver visitantes
3. **Añade SEO** (meta descripciones, títulos)
4. **Integra redes sociales**
5. **Añade más productos o servicios**
6. **Configura backup automático**

## 🎯 Promoción de tu Tienda

- **Redes Sociales**: Comparte en Facebook, Instagram, WhatsApp
- **Google My Business**: Registra tu negocio local
- **WhatsApp Business**: Añade el link de tu tienda a tu estado
- **Tarjetas de Presentación**: Incluye el link de tu tienda
- **Boca a boca**: La mejor publicidad es un buen servicio

¡Tu tienda está lista para vender! 🚀
