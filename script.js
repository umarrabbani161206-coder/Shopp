// Data produk
const products = {
    "Laptop Gaming": { 
        price: 12500000, 
        icon: "fas fa-laptop",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop"
    },
    "Smartphone": { 
        price: 4500000, 
        icon: "fas fa-mobile-alt",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"
    },
    "Headphone": { 
        price: 850000, 
        icon: "fas fa-headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
    },
    "Smartwatch": { 
        price: 1200000, 
        icon: "fas fa-clock",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
    },
    "Tablet": { 
        price: 3200000, 
        icon: "fas fa-tablet-alt",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop"
    },
    "Kamera": { 
        price: 5800000, 
        icon: "fas fa-camera",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop"
    }
};

// Fungsi untuk halaman form pemesanan (index.html)
if (document.getElementById('orderForm')) {
    console.log('Form pemesanan loaded');
    
    // Set tanggal pengiriman minimal besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = minDate;
    document.getElementById('deliveryDate').value = minDate;

    // Pilih produk
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelectedProducts();
        });
    });

    // Update produk yang dipilih ke hidden input
    function updateSelectedProducts() {
        const selectedProducts = [];
        const selectedImages = [];
        
        document.querySelectorAll('.product-card.selected').forEach(card => {
            const productName = card.getAttribute('data-product');
            const productPrice = card.getAttribute('data-price');
            const productImage = card.querySelector('img').src; // Ambil URL gambar langsung
            
            selectedProducts.push(`${productName}:${productPrice}`);
            selectedImages.push(`${productName}:${productImage}`);
        });
        
        document.getElementById('selectedProducts').value = selectedProducts.join(',');
        document.getElementById('selectedProductImages').value = selectedImages.join(',');
        
        console.log('Selected Products:', selectedProducts);
        console.log('Selected Images:', selectedImages);
    }

    // Validasi sebelum submit
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        const selectedCount = document.querySelectorAll('.product-card.selected').length;
        if (selectedCount === 0) {
            e.preventDefault();
            alert('Pilih minimal satu produk!');
            return false;
        }
        
        // Debug: lihat data yang akan dikirim
        console.log('Form data akan dikirim:');
        console.log('Name:', document.getElementById('name').value);
        console.log('Email:', document.getElementById('email').value);
        console.log('Products:', document.getElementById('selectedProducts').value);
        
        return true;
    });
}

// Fungsi untuk halaman hasil pemesanan (praktikumm.html)
if (document.getElementById('resultName')) {
    console.log('Halaman hasil pemesanan loaded');
    
    // Ambil parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:', Array.from(urlParams.entries()));
    
    // Isi data dari parameter URL
    const name = urlParams.get('name') || 'Tidak ada data';
    const email = urlParams.get('email') || 'Tidak ada data';
    const phone = urlParams.get('phone') || 'Tidak ada data';
    const gender = urlParams.get('gender') || 'Tidak ada data';
    const address = urlParams.get('address') || 'Tidak ada data';
    const payment = urlParams.get('payment') || 'Tidak ada data';
    const deliveryDate = urlParams.get('deliveryDate');
    
    document.getElementById('resultName').textContent = name;
    document.getElementById('resultEmail').textContent = email;
    document.getElementById('resultPhone').textContent = phone;
    document.getElementById('resultGender').textContent = gender;
    document.getElementById('resultAddress').textContent = address;
    document.getElementById('resultPayment').textContent = payment;
    
    // Tanggal pesanan
    const currentDate = new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('resultDate').textContent = currentDate;

    // Tambahkan informasi tanggal pengiriman jika ada
    if (deliveryDate) {
        const formattedDate = new Date(deliveryDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const deliveryItem = document.createElement('div');
        deliveryItem.className = 'detail-item';
        deliveryItem.innerHTML = `
            <span class="detail-label">Tanggal Kirim:</span>
            <span class="detail-value">${formattedDate}</span>
        `;
        document.querySelector('.detail-card:nth-child(2)').appendChild(deliveryItem);
    }
    
    // Proses produk yang dipilih
    const productsParam = urlParams.get('products');
    const imagesParam = urlParams.get('productImages');
    let subtotal = 0;
    const productsList = document.getElementById('productsList');
    
    console.log('Products Param:', productsParam);
    console.log('Images Param:', imagesParam);
    
    if (productsParam) {
        const selectedProducts = productsParam.split(',');
        
        selectedProducts.forEach((productStr, index) => {
            if (productStr && productStr !== '') {
                const [productName, productPrice] = productStr.split(':');
                const price = parseInt(productPrice);
                subtotal += price;
                
                // Dapatkan URL gambar
                let imageUrl = products[productName]?.image;
                if (imagesParam) {
                    const imageArray = imagesParam.split(',');
                    if (imageArray[index]) {
                        const [_, imgUrl] = imageArray[index].split(':');
                        imageUrl = imgUrl || imageUrl;
                    }
                }
                
                const productItem = document.createElement('div');
                productItem.className = 'product-summary-item';
                productItem.innerHTML = `
                    <div class="product-summary-image">
                        <img src="${imageUrl}" alt="${productName}" onerror="this.src='https://via.placeholder.com/60x60/4361ee/ffffff?text=?'">
                    </div>
                    <div class="product-summary-details">
                        <div class="product-summary-name">${productName}</div>
                        <div class="product-summary-price">Rp ${price.toLocaleString('id-ID')}</div>
                    </div>
                `;
                productsList.appendChild(productItem);
            }
        });
        
        // Jika tidak ada produk yang dipilih, tampilkan pesan
        if (productsList.children.length === 0) {
            productsList.innerHTML = '<div class="no-products">Tidak ada produk yang dipilih</div>';
        }
    } else {
        productsList.innerHTML = '<div class="no-products">Tidak ada produk yang dipilih</div>';
    }
    
    // Hitung total
    const shippingCost = 25000;
    const selectedProductsCount = productsParam ? productsParam.split(',').filter(p => p !== '').length : 0;
    const discount = selectedProductsCount > 1 ? 100000 : 50000;
    const total = subtotal + shippingCost - discount;
    
    // Tampilkan harga
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('discountValue').textContent = `- Rp ${discount.toLocaleString('id-ID')}`;
    document.getElementById('totalPrice').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    console.log('Subtotal:', subtotal);
    console.log('Total:', total);
}

// Fungsi untuk mencetak pesanan
function printOrder() {
    window.print();
}

// Fungsi untuk pesan baru
function newOrder() {
    window.location.href = 'index.html';
}

// Tambahkan style untuk no-products
const style = document.createElement('style');
style.textContent = `
    .no-products {
        text-align: center;
        color: var(--gray);
        font-style: italic;
        padding: 20px;
    }
`;
document.head.appendChild(style);