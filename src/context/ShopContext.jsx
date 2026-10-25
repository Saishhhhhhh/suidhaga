import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('suidhaga_cached_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('suidhaga_cached_products');
    } catch {
      return true;
    }
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('suidhaga_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('suidhaga_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Discount code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: 'SUIDHAGA10', percent: 10 }

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('suidhaga_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('suidhaga_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch products from backend with retry
  const fetchProducts = async (retryCount = 0) => {
    try {
      let url = '/api/products?limit=50';
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
        try {
          localStorage.setItem('suidhaga_cached_products', JSON.stringify(data.products));
        } catch (e) {}
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } else if (retryCount < 2) {
        setTimeout(() => fetchProducts(retryCount + 1), 1500);
      }
    } catch (err) {
      console.warn('Notice fetching products:', err.message);
      if (retryCount < 2) {
        setTimeout(() => fetchProducts(retryCount + 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);


  // Show toast notification
  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Add to cart
  const addToCart = (product, size = 'M', quantity = 1) => {
    setCart((prev) => {
      const itemKey = `${product._id}_${size}`;
      const existing = prev.find((item) => item.cartId === itemKey);

      if (existing) {
        return prev.map((item) =>
          item.cartId === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            cartId: itemKey,
            productId: product._id,
            title: product.title,
            image: product.images?.[0] || '/assets/maroon_anarkali.jpg',
            price: product.price,
            originalPrice: product.originalPrice,
            size,
            quantity,
            fabric: product.fabric,
          },
        ];
      }
    });

    showNotification(`Added "${product.title.slice(0, 24)}..." to bag!`);
    setCartOpen(true);
  };

  const updateCartQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    showNotification('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showNotification('Removed from your wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Saved to your wishlist! ❤️');
        return [...prev, productId];
      }
    });
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DIWALI15') {
      setAppliedCoupon({ code: clean, percent: 15 });
      showNotification('🪔 Diwali Special Coupon Applied! 15% discount added.');
      return true;
    } else if (clean === 'SUIDHAGA10') {
      setAppliedCoupon({ code: clean, percent: 10 });
      showNotification('Coupon applied! 10% Festive discount added.');
      return true;
    } else if (clean === 'KOMAL20') {
      setAppliedCoupon({ code: clean, percent: 20 });
      showNotification('VIP Coupon applied! 20% Founder discount added.');
      return true;
    } else {
      showNotification('Invalid coupon. Try DIWALI15 or SUIDHAGA10', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Coupon removed');
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.percent) / 100) : 0;
  const shippingFee = cartSubtotal >= 1999 || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartOpen,
        setCartOpen,
        wishlist,
        toggleWishlist,
        quickViewProduct,
        setQuickViewProduct,
        checkoutOpen,
        setCheckoutOpen,
        orderTrackerOpen,
        setOrderTrackerOpen,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        cartCount,
        couponCode,
        setCouponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        notification,
        showNotification,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
