import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import Counter from './Counter';

const CartModal = ({ isOpen, onClose, cartItems, removeFromCart, updateQuantity, onCheckout }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    if (onCheckout) onCheckout();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center pt-[108px] p-4 overflow-hidden">
      <div className="bg-gradient-to-b from-navy-dark to-[#1E2A3A] rounded-xl max-w-2xl w-full max-h-[calc(100vh-120px)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Shopping Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-800 p-4 rounded-lg border-2 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded bg-gray-900 p-2" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id || item.id, Math.max(1, item.quantity - 1))}
                          className="bg-navy-dark text-white w-8 h-8 rounded hover:bg-navy-light font-bold transition"
                        >
                          -
                        </button>
                        <span className="text-white w-8 text-center font-semibold"><Counter value={item.quantity} fontSize={14} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /></span>
                        <button
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                          className="bg-navy-dark text-white w-8 h-8 rounded hover:bg-navy-light font-bold transition"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white font-bold">฿<Counter value={item.price * item.quantity} fontSize={14} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /></span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id || item.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl text-white font-semibold">Total:</span>
              <span className="text-2xl text-white font-bold">฿<Counter value={total} fontSize={24} padding={0} gap={0} borderRadius={0} horizontalPadding={0} gradientHeight={0} textColor="inherit" fontWeight="inherit" /></span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white py-3 rounded-lg font-semibold transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;