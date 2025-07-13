# LightWay Sub Info

A lightweight and fast subscription information panel built with React, shadcn/ui, and Tailwind CSS.

## Features

- 🚀 **Ultra Lightweight**: Optimized for maximum performance
- 🎨 **Dual Theme Builds**: Separate builds for light and dark modes
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌐 **Persian Language**: Optimized for Persian users
- ⚡ **Fast Loading**: Lazy loading and code splitting
- 🎯 **Single File Output**: Easy deployment

## Build Commands

### Light Mode Build
```bash
npm run build:light
```
Output: `build-light/` directory

### Dark Mode Build
```bash
npm run build:dark
```
Output: `build-dark/` directory

### Development
```bash
npm run dev
```

## Performance Optimizations

- ✅ Removed react-i18next (Persian only)
- ✅ Removed theme switching (separate builds)
- ✅ Removed js-cookie dependency
- ✅ Lazy loading for components
- ✅ Single file builds with vite-plugin-singlefile
- ✅ Terser minification
- ✅ Optimized CSS with Tailwind

## Bundle Sizes

- **Light Mode**: 344.26 kB (109.40 kB gzipped)
- **Dark Mode**: 344.28 kB (109.41 kB gzipped)

## Environment Variables

```env
VITE_SUPPORT_URL=https://t.me/YourSupport
VITE_JSON_APPS_URL=https://your-apps-json-url.com/os.json
VITE_OFF_SECTIONS={"appsBox":true,"logoBox":true,"timeBox":true,"usageBox":true,"userBox":true,"supportBox":true,"configs":true}
```

## Deployment

1. Choose your preferred theme (light or dark)
2. Run the corresponding build command
3. Deploy the generated `build-light/` or `build-dark/` directory
4. The build includes an `index.php` file for PHP hosting

## Installation Steps

### For Marzban

#### Light Theme
1. **Download the light theme template**
   ```sh
   sudo wget -N -P /var/lib/marzban/templates/subscription/ https://github.com/MatinDehghanian/LightWaySub/releases/latest/download/index.html
   ```

2. **Run the following commands in your server terminal**
   ```sh
   echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzban/templates/"' | sudo tee -a /opt/marzban/.env
   echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/marzban/.env
   ```
   Or add the following values to the `.env` file in `/opt/marzban` directory by removing the `#` at the beginning:
   ```
   CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzban/templates/"
   SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
   ```

3. **Restart Marzban**
   ```sh
   marzban restart
   ```

#### Dark Theme
1. **Download the dark theme template**
   ```sh
   sudo wget -N -P /var/lib/marzban/templates/subscription/ https://github.com/MatinDehghanian/LightWaySub/releases/download/v0.2.5.XX-dark/index.html
   ```
   *Replace XX with the latest build number from releases*

2. **Run the following commands in your server terminal**
   ```sh
   echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzban/templates/"' | sudo tee -a /opt/marzban/.env
   echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/marzban/.env
   ```
   Or add the following values to the `.env` file in `/opt/marzban` directory by removing the `#` at the beginning:
   ```
   CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzban/templates/"
   SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
   ```

3. **Restart Marzban**
   ```sh
   marzban restart
   ```

### For Marzneshin

#### Light Theme
1. **Download the light theme template**
   ```sh
   sudo wget -N -P /var/lib/marzneshin/templates/subscription/ https://github.com/MatinDehghanian/LightWaySub/releases/latest/download/index.html
   ```

2. **Run the following commands in your server terminal**
   ```sh
   echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzneshin/templates/"' | sudo tee -a /etc/opt/marzneshin/.env
   echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /etc/opt/marzneshin/.env
   ```
   Or add the following values to the `.env` file in `/etc/opt/marzneshin` directory by removing the `#` at the beginning:
   ```
   CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzneshin/templates/"
   SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
   ```

3. **Restart Marzneshin**
   ```sh
   marzneshin restart
   ```

#### Dark Theme
1. **Download the dark theme template**
   ```sh
   sudo wget -N -P /var/lib/marzneshin/templates/subscription/ https://github.com/MatinDehghanian/LightWaySub/releases/download/v0.2.5.XX-dark/index.html
   ```
   *Replace XX with the latest build number from releases*

2. **Run the following commands in your server terminal**
   ```sh
   echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzneshin/templates/"' | sudo tee -a /etc/opt/marzneshin/.env
   echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /etc/opt/marzneshin/.env
   ```
   Or add the following values to the `.env` file in `/etc/opt/marzneshin` directory by removing the `#` at the beginning:
   ```
   CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzneshin/templates/"
   SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
   ```

3. **Restart Marzneshin**
   ```sh
   marzneshin restart
   ```

---

## Template Updates
To update the template, simply repeat step 1 of your chosen theme installation.

## Powered by

- [React](https://reactjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**Powered by [MatinDehghanian](https://github.com/MatinDehghanian)**
